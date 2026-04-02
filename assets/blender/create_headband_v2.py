"""
VIGIL Headband v2 — rebuilt with better geometry and materials.
Uses a flat mesh + curve modifier for clean band shape,
sensor module flush on front face, proper dark fabric material.
"""
import bpy
import bmesh
import math
import os

# ---------------------------------------------------------------------------
# 0. CLEAN SCENE
# ---------------------------------------------------------------------------
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "GPU"
scene.cycles.samples = 256
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080

# World — near-black
scene.world = bpy.data.worlds.new("World")
world_nodes = scene.world.node_tree
bg = world_nodes.nodes["Background"]
bg.inputs[0].default_value = (0.004, 0.004, 0.006, 1.0)

# ---------------------------------------------------------------------------
# 1. HEADBAND BODY — flat mesh bent with SimpleDeform
# ---------------------------------------------------------------------------
BAND_LENGTH = 0.185   # 185mm
BAND_HEIGHT = 0.038   # slightly taller for visual mass
BAND_DEPTH = 0.010    # 10mm depth/thickness
HEAD_RADIUS = 0.092

# Create a subdivided plane, then extrude for depth
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
band = bpy.context.active_object
band.name = "Headband"
band.scale = (BAND_LENGTH / 2, BAND_HEIGHT / 2, 1)
bpy.ops.object.transform_apply(scale=True)

# Enter edit mode — subdivide for smooth bending, then extrude
bpy.ops.object.mode_set(mode="EDIT")
bm = bmesh.from_edit_mesh(band.data)

# Subdivide along length for smooth bend
bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=32)
bmesh.update_edit_mesh(band.data)

# Extrude the face to give depth
bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.extrude_region_move(
    TRANSFORM_OT_translate={"value": (0, 0, BAND_DEPTH)}
)
bpy.ops.object.mode_set(mode="OBJECT")

# Round edges
bevel = band.modifiers.new("Bevel", "BEVEL")
bevel.width = 0.002
bevel.segments = 3
bevel.limit_method = "ANGLE"
bevel.angle_limit = math.radians(60)

# Subdivision for smoothness
subsurf = band.modifiers.new("Subsurf", "SUBSURF")
subsurf.levels = 2
subsurf.render_levels = 3

# Bend into arc using SimpleDeform
bend = band.modifiers.new("Bend", "SIMPLE_DEFORM")
bend.deform_method = "BEND"
bend.deform_axis = "Y"
bend.angle = math.radians(160)

# Apply all modifiers
bpy.context.view_layer.objects.active = band
band.select_set(True)
for mod in band.modifiers:
    bpy.ops.object.modifier_apply(modifier=mod.name)

# Center and rotate so the band opens toward +Y (camera faces -Y)
band.rotation_euler = (math.radians(90), 0, math.radians(90))
bpy.ops.object.transform_apply(rotation=True)

# Position so center front is near origin
# After bending, the center of the arc faces outward
# Move so front face is at roughly y = -HEAD_RADIUS
band.location = (0, 0, 0)

bpy.ops.object.shade_smooth()

# ---------------------------------------------------------------------------
# 2. SENSOR MODULE — flush on center-front face
# ---------------------------------------------------------------------------
MODULE_W = 0.028  # 28mm wide
MODULE_H = 0.024  # 24mm tall
MODULE_D = 0.005  # 5mm protrusion

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
sensor = bpy.context.active_object
sensor.name = "SensorModule"
sensor.scale = (MODULE_W / 2, MODULE_D / 2, MODULE_H / 2)
bpy.ops.object.transform_apply(scale=True)

# Round corners
bevel_s = sensor.modifiers.new("Bevel", "BEVEL")
bevel_s.width = 0.003
bevel_s.segments = 4

subsurf_s = sensor.modifiers.new("Subsurf", "SUBSURF")
subsurf_s.levels = 2
subsurf_s.render_levels = 2

bpy.ops.object.shade_smooth()

# Position: find the front-most point of the band and place sensor there
# After bending the band, we need to figure out where the front face is.
# Let's measure the bounding box.
from mathutils import Vector
mesh = band.data
verts = [band.matrix_world @ v.co for v in mesh.vertices]
min_y = min(v.y for v in verts)
max_y = max(v.y for v in verts)
min_z = min(v.z for v in verts)
max_z = max(v.z for v in verts)
center_z = (min_z + max_z) / 2

# Front-most vertices (lowest Y, which faces camera)
front_verts = [v for v in verts if v.y < min_y + 0.005]
if front_verts:
    front_y = min(v.y for v in front_verts)
    sensor.location = (0, front_y - MODULE_D / 2, center_z)
else:
    sensor.location = (0, min_y - MODULE_D / 2, center_z)

# ---------------------------------------------------------------------------
# 3. LED — on sensor face
# ---------------------------------------------------------------------------
led_y = sensor.location.y - MODULE_D / 2 - 0.0005
led_z = sensor.location.z - 0.004  # slightly below center

bpy.ops.mesh.primitive_uv_sphere_add(
    radius=0.0018,
    location=(0, led_y, led_z),
    segments=16, ring_count=8,
)
led = bpy.context.active_object
led.name = "LED"
bpy.ops.object.shade_smooth()

# ---------------------------------------------------------------------------
# 4. MATERIALS
# ---------------------------------------------------------------------------

# --- Dark Fabric ---
mat_fabric = bpy.data.materials.new("FabricBand")
mat_fabric.use_nodes = True
nt = mat_fabric.node_tree
nt.nodes.clear()

out = nt.nodes.new("ShaderNodeOutputMaterial")
bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
bsdf.inputs["Base Color"].default_value = (0.025, 0.025, 0.03, 1.0)
bsdf.inputs["Roughness"].default_value = 0.92
bsdf.inputs["Metallic"].default_value = 0.0
bsdf.inputs["Specular IOR Level"].default_value = 0.05
nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

# Fabric weave bump — fine noise
noise = nt.nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value = 600.0
noise.inputs["Detail"].default_value = 14.0
noise.inputs["Roughness"].default_value = 0.8

# Horizontal striations (woven texture visible in reference)
wave = nt.nodes.new("ShaderNodeTexWave")
wave.wave_type = "BANDS"
wave.bands_direction = "Z"
wave.inputs["Scale"].default_value = 300.0
wave.inputs["Distortion"].default_value = 0.5
wave.inputs["Detail"].default_value = 2.0

# Mix both bump patterns
mix_rgb = nt.nodes.new("ShaderNodeMixRGB")
mix_rgb.blend_type = "ADD"
mix_rgb.inputs["Fac"].default_value = 0.5
nt.links.new(noise.outputs["Fac"], mix_rgb.inputs["Color1"])
nt.links.new(wave.outputs["Fac"], mix_rgb.inputs["Color2"])

bump = nt.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.12
bump.inputs["Distance"].default_value = 0.0008
nt.links.new(mix_rgb.outputs["Color"], bump.inputs["Height"])
nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

# Slight color variation via noise
color_noise = nt.nodes.new("ShaderNodeTexNoise")
color_noise.inputs["Scale"].default_value = 30.0
color_noise.inputs["Detail"].default_value = 3.0

color_ramp = nt.nodes.new("ShaderNodeValToRGB")
color_ramp.color_ramp.elements[0].position = 0.4
color_ramp.color_ramp.elements[0].color = (0.02, 0.02, 0.025, 1.0)
color_ramp.color_ramp.elements[1].position = 0.6
color_ramp.color_ramp.elements[1].color = (0.035, 0.035, 0.04, 1.0)
nt.links.new(color_noise.outputs["Fac"], color_ramp.inputs["Fac"])
nt.links.new(color_ramp.outputs["Color"], bsdf.inputs["Base Color"])

band.data.materials.append(mat_fabric)

# --- Sensor Module: glossy black ---
mat_sensor = bpy.data.materials.new("SensorBlack")
mat_sensor.use_nodes = True
nt_s = mat_sensor.node_tree
nt_s.nodes.clear()

out_s = nt_s.nodes.new("ShaderNodeOutputMaterial")
bsdf_s = nt_s.nodes.new("ShaderNodeBsdfPrincipled")
bsdf_s.inputs["Base Color"].default_value = (0.008, 0.008, 0.012, 1.0)
bsdf_s.inputs["Roughness"].default_value = 0.05
bsdf_s.inputs["Specular IOR Level"].default_value = 0.8
bsdf_s.inputs["Coat Weight"].default_value = 0.4
bsdf_s.inputs["Coat Roughness"].default_value = 0.05
nt_s.links.new(bsdf_s.outputs["BSDF"], out_s.inputs["Surface"])

sensor.data.materials.append(mat_sensor)

# --- LED: teal emission ---
mat_led = bpy.data.materials.new("LEDGreen")
mat_led.use_nodes = True
nt_l = mat_led.node_tree
nt_l.nodes.clear()

out_l = nt_l.nodes.new("ShaderNodeOutputMaterial")
emit = nt_l.nodes.new("ShaderNodeEmission")
emit.inputs["Color"].default_value = (0.0, 0.83, 0.67, 1.0)  # #00D4AA
emit.inputs["Strength"].default_value = 20.0
nt_l.links.new(emit.outputs["Emission"], out_l.inputs["Surface"])

led.data.materials.append(mat_led)

# ---------------------------------------------------------------------------
# 5. CAMERA — front view, slightly above
# ---------------------------------------------------------------------------
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 60
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 3.5

cam = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

# Position camera in front, slightly above
cam.location = (0.0, min_y - 0.25, center_z + 0.04)

# Look at band center
target = bpy.data.objects.new("Target", None)
target.location = (0, (min_y + max_y) / 2, center_z)
scene.collection.objects.link(target)

track = cam.constraints.new("TRACK_TO")
track.target = target
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"
cam_data.dof.focus_object = target

# ---------------------------------------------------------------------------
# 6. LIGHTING — dark product photography
# ---------------------------------------------------------------------------

# Key light — subtle top-right
kl = bpy.data.lights.new("Key", "AREA")
kl.energy = 3.0
kl.size = 0.4
kl.color = (1.0, 0.97, 0.93)
ko = bpy.data.objects.new("Key", kl)
ko.location = (0.12, min_y - 0.15, center_z + 0.20)
ko.rotation_euler = (math.radians(55), math.radians(10), 0)
scene.collection.objects.link(ko)

# Fill — very subtle left
fl = bpy.data.lights.new("Fill", "AREA")
fl.energy = 0.8
fl.size = 0.6
fl.color = (0.85, 0.90, 1.0)
fo = bpy.data.objects.new("Fill", fl)
fo.location = (-0.15, min_y - 0.10, center_z + 0.05)
fo.rotation_euler = (math.radians(70), math.radians(-15), 0)
scene.collection.objects.link(fo)

# Rim — edge highlight from behind/above (this creates the subtle edge glow)
rl = bpy.data.lights.new("Rim", "AREA")
rl.energy = 5.0
rl.size = 0.15
rl.color = (0.5, 0.65, 0.6)
ro = bpy.data.objects.new("Rim", rl)
ro.location = (0.0, max_y + 0.10, center_z + 0.12)
ro.rotation_euler = (math.radians(-40), 0, 0)
scene.collection.objects.link(ro)

# Teal accent — very subtle, near LED
al = bpy.data.lights.new("Accent", "POINT")
al.energy = 0.3
al.color = (0.0, 0.83, 0.67)
ao = bpy.data.objects.new("Accent", al)
ao.location = (0, led_y - 0.02, led_z)
scene.collection.objects.link(ao)

# ---------------------------------------------------------------------------
# 7. RENDER SETTINGS
# ---------------------------------------------------------------------------
scene.render.film_transparent = False
scene.cycles.use_denoising = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"

# Color management — slightly contrasty look
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"

# ---------------------------------------------------------------------------
# 8. SAVE + RENDER PREVIEW
# ---------------------------------------------------------------------------
output_dir = os.path.dirname(os.path.abspath(__file__))
blend_path = os.path.join(output_dir, "headband.blend")

# Quick preview first
scene.cycles.samples = 128
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.filepath = os.path.join(output_dir, "preview_v2.png")
bpy.ops.render.render(write_still=True)

bpy.ops.wm.save_as_mainfile(filepath=blend_path)
print(f"\n✅ Saved: {blend_path}")
print(f"   Band front Y: {min_y:.4f}")
print(f"   Sensor loc: {sensor.location}")
print(f"   LED loc: {led.location}")
print(f"   Camera loc: {cam.location}")
