"""
VIGIL Headband v3 — proper proportions from reference images.
The band is a wide, thin, gently curved strip with a flush sensor pod.
"""
import bpy
import bmesh
import math
import os
from mathutils import Vector

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "GPU"
scene.cycles.samples = 128

# World
scene.world = bpy.data.worlds.new("World")
bg = scene.world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.003, 0.003, 0.005, 1.0)

# ---------------------------------------------------------------------------
# 1. HEADBAND — wide thin strip bent gently
# ---------------------------------------------------------------------------
# Reference: band is ~185mm wide, ~35mm tall, ~6mm thick
# Gentle arc, ~130° around a ~100mm radius head
BAND_W = 0.185    # width (becomes arc length after bending)
BAND_H = 0.035    # height of the strip face
BAND_T = 0.006    # thickness (very thin!)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
band = bpy.context.active_object
band.name = "Headband"
band.scale = (BAND_W / 2, BAND_T / 2, BAND_H / 2)
bpy.ops.object.transform_apply(scale=True)

# Subdivide along length for smooth bending
bpy.ops.object.mode_set(mode="EDIT")
bm = bmesh.from_edit_mesh(band.data)
# Select edges along X axis (length) for subdivision
x_edges = [e for e in bm.edges
           if abs(e.verts[0].co.x - e.verts[1].co.x) > 0.001]
bmesh.ops.subdivide_edges(bm, edges=x_edges, cuts=48)
bmesh.update_edit_mesh(band.data)
bpy.ops.object.mode_set(mode="OBJECT")

# Rounded edges
bevel = band.modifiers.new("Bevel", "BEVEL")
bevel.width = 0.0015
bevel.segments = 3
bevel.limit_method = "ANGLE"
bevel.angle_limit = math.radians(50)

# Smooth subdivision
sub = band.modifiers.new("Subsurf", "SUBSURF")
sub.levels = 1
sub.render_levels = 2

# Bend into gentle arc
bend = band.modifiers.new("Bend", "SIMPLE_DEFORM")
bend.deform_method = "BEND"
bend.deform_axis = "Z"  # bend around Z so it curves in X-Y plane
bend.angle = math.radians(140)

# Apply all
bpy.context.view_layer.objects.active = band
band.select_set(True)
for mod in list(band.modifiers):
    bpy.ops.object.modifier_apply(modifier=mod.name)

# Rotate so the open side faces back (+Y) and front faces camera (-Y)
band.rotation_euler = (0, 0, math.radians(90))
bpy.ops.object.transform_apply(rotation=True)

bpy.ops.object.shade_smooth()

# Measure band extents
verts_world = [band.matrix_world @ v.co for v in band.data.vertices]
min_y = min(v.y for v in verts_world)
max_y = max(v.y for v in verts_world)
min_z = min(v.z for v in verts_world)
max_z = max(v.z for v in verts_world)
center_z = (min_z + max_z) / 2
band_front_y = min_y

print(f"Band extents: Y=[{min_y:.4f}, {max_y:.4f}] Z=[{min_z:.4f}, {max_z:.4f}]")

# ---------------------------------------------------------------------------
# 2. SENSOR MODULE — centered on front face
# ---------------------------------------------------------------------------
MOD_W = 0.026   # 26mm
MOD_H = 0.022   # 22mm tall
MOD_D = 0.005   # 5mm protrusion

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
sensor = bpy.context.active_object
sensor.name = "SensorModule"
sensor.scale = (MOD_W / 2, MOD_D / 2, MOD_H / 2)
bpy.ops.object.transform_apply(scale=True)

# Rounded corners
bev_s = sensor.modifiers.new("Bevel", "BEVEL")
bev_s.width = 0.0025
bev_s.segments = 5

sub_s = sensor.modifiers.new("Sub", "SUBSURF")
sub_s.levels = 2
sub_s.render_levels = 2

bpy.ops.object.shade_smooth()

# Position flush on front of band
sensor.location = (0, band_front_y - MOD_D / 2 + 0.001, center_z)

# ---------------------------------------------------------------------------
# 3. LED — small dot on sensor face
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_uv_sphere_add(
    radius=0.0015,
    location=(0, sensor.location.y - MOD_D / 2 - 0.0003, center_z - 0.003),
    segments=16, ring_count=8,
)
led = bpy.context.active_object
led.name = "LED"
bpy.ops.object.shade_smooth()

# ---------------------------------------------------------------------------
# 4. MATERIALS
# ---------------------------------------------------------------------------

# --- Ultra-dark matte fabric ---
mat_f = bpy.data.materials.new("Fabric")
mat_f.use_nodes = True
nt = mat_f.node_tree
nt.nodes.clear()

out = nt.nodes.new("ShaderNodeOutputMaterial")
bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
bsdf.inputs["Base Color"].default_value = (0.015, 0.015, 0.018, 1.0)
bsdf.inputs["Roughness"].default_value = 0.95
bsdf.inputs["Metallic"].default_value = 0.0
bsdf.inputs["Specular IOR Level"].default_value = 0.04
nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

# Fine fabric bump
noise = nt.nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value = 500.0
noise.inputs["Detail"].default_value = 12.0

wave = nt.nodes.new("ShaderNodeTexWave")
wave.wave_type = "BANDS"
wave.bands_direction = "Z"
wave.inputs["Scale"].default_value = 250.0
wave.inputs["Distortion"].default_value = 0.3

add = nt.nodes.new("ShaderNodeMixRGB")
add.blend_type = "ADD"
add.inputs["Fac"].default_value = 0.5
nt.links.new(noise.outputs["Fac"], add.inputs["Color1"])
nt.links.new(wave.outputs["Fac"], add.inputs["Color2"])

bump = nt.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.08
bump.inputs["Distance"].default_value = 0.0005
nt.links.new(add.outputs["Color"], bump.inputs["Height"])
nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

band.data.materials.append(mat_f)

# --- Glossy black sensor ---
mat_s = bpy.data.materials.new("SensorBlack")
mat_s.use_nodes = True
nt_s = mat_s.node_tree
nt_s.nodes.clear()
out_s = nt_s.nodes.new("ShaderNodeOutputMaterial")
bsdf_s = nt_s.nodes.new("ShaderNodeBsdfPrincipled")
bsdf_s.inputs["Base Color"].default_value = (0.005, 0.005, 0.008, 1.0)
bsdf_s.inputs["Roughness"].default_value = 0.04
bsdf_s.inputs["Specular IOR Level"].default_value = 0.9
bsdf_s.inputs["Coat Weight"].default_value = 0.5
bsdf_s.inputs["Coat Roughness"].default_value = 0.03
nt_s.links.new(bsdf_s.outputs["BSDF"], out_s.inputs["Surface"])
sensor.data.materials.append(mat_s)

# --- Teal LED ---
mat_l = bpy.data.materials.new("LED")
mat_l.use_nodes = True
nt_l = mat_l.node_tree
nt_l.nodes.clear()
out_l = nt_l.nodes.new("ShaderNodeOutputMaterial")
emit = nt_l.nodes.new("ShaderNodeEmission")
emit.inputs["Color"].default_value = (0.0, 0.83, 0.67, 1.0)
emit.inputs["Strength"].default_value = 12.0
nt_l.links.new(emit.outputs["Emission"], out_l.inputs["Surface"])
led.data.materials.append(mat_l)

# ---------------------------------------------------------------------------
# 5. CAMERA
# ---------------------------------------------------------------------------
cam_d = bpy.data.cameras.new("Cam")
cam_d.lens = 70
cam_d.dof.use_dof = True
cam_d.dof.aperture_fstop = 3.2

cam = bpy.data.objects.new("Cam", cam_d)
scene.collection.objects.link(cam)
scene.camera = cam
cam.location = (0, band_front_y - 0.20, center_z + 0.035)

tgt = bpy.data.objects.new("CamTarget", None)
tgt.location = (0, (min_y + max_y) / 2, center_z)
scene.collection.objects.link(tgt)
trk = cam.constraints.new("TRACK_TO")
trk.target = tgt
trk.track_axis = "TRACK_NEGATIVE_Z"
trk.up_axis = "UP_Y"
cam_d.dof.focus_object = tgt

# ---------------------------------------------------------------------------
# 6. LIGHTING — dark product photography, no teal spill
# ---------------------------------------------------------------------------
# Key: subtle top-right
kl = bpy.data.lights.new("Key", "AREA")
kl.energy = 1.5
kl.size = 0.4
kl.color = (1.0, 0.98, 0.95)
ko = bpy.data.objects.new("Key", kl)
ko.location = (0.10, band_front_y - 0.12, center_z + 0.18)
scene.collection.objects.link(ko)
ko.rotation_euler = (math.radians(55), math.radians(8), 0)

# Fill: very subtle
fl = bpy.data.lights.new("Fill", "AREA")
fl.energy = 0.3
fl.size = 0.5
fl.color = (0.90, 0.93, 1.0)
fo = bpy.data.objects.new("Fill", fl)
fo.location = (-0.12, band_front_y - 0.08, center_z + 0.03)
scene.collection.objects.link(fo)
fo.rotation_euler = (math.radians(70), math.radians(-12), 0)

# Rim: subtle edge definition, neutral white
rl = bpy.data.lights.new("Rim", "AREA")
rl.energy = 2.0
rl.size = 0.12
rl.color = (0.90, 0.92, 0.90)
ro = bpy.data.objects.new("Rim", rl)
ro.location = (0, max_y + 0.08, center_z + 0.10)
scene.collection.objects.link(ro)
ro.rotation_euler = (math.radians(-35), 0, 0)

# Teal accent: VERY subtle, just a hint near LED
al = bpy.data.lights.new("TealAccent", "POINT")
al.energy = 0.08
al.color = (0.0, 0.83, 0.67)
ao = bpy.data.objects.new("TealAccent", al)
ao.location = (0, led.location.y - 0.015, led.location.z)
scene.collection.objects.link(ao)

# ---------------------------------------------------------------------------
# 7. RENDER SETTINGS
# ---------------------------------------------------------------------------
scene.render.film_transparent = False
scene.cycles.use_denoising = True
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.image_settings.file_format = "PNG"

scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"

# ---------------------------------------------------------------------------
# 8. SAVE + RENDER
# ---------------------------------------------------------------------------
output_dir = os.path.dirname(os.path.abspath(__file__))
scene.render.filepath = os.path.join(output_dir, "preview_v3.png")
bpy.ops.render.render(write_still=True)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output_dir, "headband.blend"))
print(f"✅ v3 done — {os.path.join(output_dir, 'headband.blend')}")
