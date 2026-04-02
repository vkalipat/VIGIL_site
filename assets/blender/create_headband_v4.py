"""
VIGIL Headband v4 — curve-based with proper thin proportions.
Uses bezier arc + rectangular bevel profile for clean band geometry.
"""
import bpy
import math
import os
from mathutils import Vector

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "GPU"
scene.cycles.samples = 196

# World — near-black
scene.world = bpy.data.worlds.new("World")
bg = scene.world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.003, 0.003, 0.005, 1.0)

# ---------------------------------------------------------------------------
# DIMENSIONS (from specs + reference images)
# ---------------------------------------------------------------------------
HEAD_R = 0.092       # head radius ~92mm
ARC_DEG = 360        # full wrap-around headband
BAND_HEIGHT = 0.035  # 35mm band height (visible face)
BAND_THICK = 0.006   # 6mm thick (slim profile like reference)
CORNER_R = 0.002     # rounded edge radius

# ---------------------------------------------------------------------------
# 1. BAND — bezier arc path + bevel cross-section
# ---------------------------------------------------------------------------
# Arc path
path = bpy.data.curves.new("ArcPath", "CURVE")
path.dimensions = "3D"
path.resolution_u = 64  # smooth arc

sp = path.splines.new("BEZIER")
N = 12  # more points for full circle
sp.bezier_points.add(N - 1)

for i, pt in enumerate(sp.bezier_points):
    frac = i / N  # don't reach 1.0 — cyclic spline closes the gap
    angle = math.radians(ARC_DEG * frac)
    x = HEAD_R * math.sin(angle)
    y = -HEAD_R * math.cos(angle)
    pt.co = (x, y, 0)
    pt.handle_left_type = "AUTO"
    pt.handle_right_type = "AUTO"

sp.use_cyclic_u = True  # close the loop

path_obj = bpy.data.objects.new("ArcPath", path)
scene.collection.objects.link(path_obj)

# Cross-section profile — thin rectangle with rounded corners
# This defines the band's cross-section: height × thickness
prof = bpy.data.curves.new("Profile", "CURVE")
prof.dimensions = "2D"
ps = prof.splines.new("NURBS")

h = BAND_HEIGHT / 2
t = BAND_THICK / 2
r = CORNER_R

# Rounded rectangle profile points (counterclockwise)
# Profile X → radial (thickness), Profile Y → height
# So X uses t (small, 3mm), Y uses h (large, 17.5mm)
pts = [
    (-t + r, -h),
    (-t, -h + r),
    (-t, h - r),
    (-t + r, h),
    (t - r, h),
    (t, h - r),
    (t, -h + r),
    (t - r, -h),
    (-t + r, -h),
]
ps.points.add(len(pts) - 1)
for i, (pz, py) in enumerate(pts):
    ps.points[i].co = (pz, py, 0, 1)
ps.use_cyclic_u = True
ps.order_u = 3

prof_obj = bpy.data.objects.new("Profile", prof)
scene.collection.objects.link(prof_obj)
prof_obj.hide_viewport = True
prof_obj.hide_render = True

# Assign bevel
path.bevel_mode = "OBJECT"
path.bevel_object = prof_obj
path.use_fill_caps = True

# Convert to mesh
bpy.context.view_layer.objects.active = path_obj
path_obj.select_set(True)
bpy.ops.object.convert(target="MESH")
band = bpy.context.active_object
band.name = "Headband"

# Subdivision for smoothness
sub = band.modifiers.new("Sub", "SUBSURF")
sub.levels = 2
sub.render_levels = 2

bpy.ops.object.shade_smooth()

# Measure band
verts = [band.matrix_world @ v.co for v in band.data.vertices]
min_y = min(v.y for v in verts)
max_y = max(v.y for v in verts)
min_x = min(v.x for v in verts)
max_x = max(v.x for v in verts)
min_z = min(v.z for v in verts)
max_z = max(v.z for v in verts)
cz = (min_z + max_z) / 2
print(f"Band: X[{min_x:.3f},{max_x:.3f}] Y[{min_y:.3f},{max_y:.3f}] Z[{min_z:.3f},{max_z:.3f}]")

# ---------------------------------------------------------------------------
# 2. SENSOR MODULE — centered on front face
# ---------------------------------------------------------------------------
MOD_W = 0.026
MOD_H = 0.022
MOD_D = 0.005

bpy.ops.mesh.primitive_cube_add(size=1)
sensor = bpy.context.active_object
sensor.name = "SensorModule"
sensor.scale = (MOD_W / 2, MOD_D / 2, MOD_H / 2)
bpy.ops.object.transform_apply(scale=True)

bev = sensor.modifiers.new("Bevel", "BEVEL")
bev.width = 0.0025
bev.segments = 4
ss = sensor.modifiers.new("Sub", "SUBSURF")
ss.levels = 2
ss.render_levels = 2
bpy.ops.object.shade_smooth()

# Place flush on front-center of band
sensor.location = (0, min_y - MOD_D / 2 + 0.001, cz)

# ---------------------------------------------------------------------------
# 3. LED
# ---------------------------------------------------------------------------
bpy.ops.mesh.primitive_uv_sphere_add(
    radius=0.0015,
    location=(0, min_y - MOD_D - 0.0002, cz - 0.003),
    segments=16, ring_count=8,
)
led = bpy.context.active_object
led.name = "LED"
bpy.ops.object.shade_smooth()

# ---------------------------------------------------------------------------
# 4. MATERIALS
# ---------------------------------------------------------------------------

# Fabric — very dark, matte, with fine texture
mat_f = bpy.data.materials.new("Fabric")
mat_f.use_nodes = True
nt = mat_f.node_tree; nt.nodes.clear()
out = nt.nodes.new("ShaderNodeOutputMaterial")
bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
nt.links.new(bsdf.outputs[0], out.inputs[0])

bsdf.inputs["Base Color"].default_value = (0.015, 0.015, 0.018, 1.0)
bsdf.inputs["Roughness"].default_value = 0.95
bsdf.inputs["Specular IOR Level"].default_value = 0.04

# Fabric bump
noise = nt.nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value = 500
noise.inputs["Detail"].default_value = 12
wave = nt.nodes.new("ShaderNodeTexWave")
wave.wave_type = "BANDS"
wave.bands_direction = "X"
wave.inputs["Scale"].default_value = 200
wave.inputs["Distortion"].default_value = 0.3
mix = nt.nodes.new("ShaderNodeMixRGB")
mix.blend_type = "ADD"; mix.inputs["Fac"].default_value = 0.5
nt.links.new(noise.outputs["Fac"], mix.inputs["Color1"])
nt.links.new(wave.outputs["Fac"], mix.inputs["Color2"])
bump = nt.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.08
bump.inputs["Distance"].default_value = 0.0005
nt.links.new(mix.outputs[0], bump.inputs["Height"])
nt.links.new(bump.outputs[0], bsdf.inputs["Normal"])

band.data.materials.append(mat_f)

# Sensor — glossy piano black
mat_s = bpy.data.materials.new("SensorBlack")
mat_s.use_nodes = True
ns = mat_s.node_tree; ns.nodes.clear()
os_ = ns.nodes.new("ShaderNodeOutputMaterial")
bs = ns.nodes.new("ShaderNodeBsdfPrincipled")
ns.links.new(bs.outputs[0], os_.inputs[0])
bs.inputs["Base Color"].default_value = (0.005, 0.005, 0.008, 1.0)
bs.inputs["Roughness"].default_value = 0.04
bs.inputs["Specular IOR Level"].default_value = 0.9
bs.inputs["Coat Weight"].default_value = 0.5
bs.inputs["Coat Roughness"].default_value = 0.03
sensor.data.materials.append(mat_s)

# LED — teal glow
mat_l = bpy.data.materials.new("LED")
mat_l.use_nodes = True
nl = mat_l.node_tree; nl.nodes.clear()
ol = nl.nodes.new("ShaderNodeOutputMaterial")
em = nl.nodes.new("ShaderNodeEmission")
nl.links.new(em.outputs[0], ol.inputs[0])
em.inputs["Color"].default_value = (0.0, 0.83, 0.67, 1.0)
em.inputs["Strength"].default_value = 12.0
led.data.materials.append(mat_l)

# ---------------------------------------------------------------------------
# 5. CAMERA — front view, slightly above, matching reference frame-001
# ---------------------------------------------------------------------------
cd = bpy.data.cameras.new("Cam")
cd.lens = 70
cd.dof.use_dof = True
cd.dof.aperture_fstop = 3.5
cam = bpy.data.objects.new("Cam", cd)
scene.collection.objects.link(cam)
scene.camera = cam
cam.location = (0, min_y - 0.22, cz + 0.03)

tgt = bpy.data.objects.new("CamTarget", None)
tgt.location = (0, (min_y + max_y) / 2, cz)
scene.collection.objects.link(tgt)
trk = cam.constraints.new("TRACK_TO")
trk.target = tgt
trk.track_axis = "TRACK_NEGATIVE_Z"
trk.up_axis = "UP_Y"
cd.dof.focus_object = tgt

# ---------------------------------------------------------------------------
# 6. LIGHTING — Apple-style dark product photo
# ---------------------------------------------------------------------------
def area_light(name, energy, size, color, loc, rot):
    d = bpy.data.lights.new(name, "AREA")
    d.energy = energy; d.size = size; d.color = color
    o = bpy.data.objects.new(name, d)
    o.location = loc; o.rotation_euler = rot
    scene.collection.objects.link(o)
    return o

# Broad overhead key — very soft
area_light("Key", 1.5, 0.5, (1, 0.98, 0.95),
           (0, min_y - 0.05, cz + 0.25), (math.radians(70), 0, 0))

# Fill from left — barely there
area_light("Fill", 0.3, 0.6, (0.92, 0.95, 1),
           (-0.15, min_y - 0.05, cz), (math.radians(85), math.radians(-15), 0))

# Rim from above-behind — neutral white edge light
area_light("Rim", 2.0, 0.12, (0.92, 0.94, 0.92),
           (0, max_y + 0.06, cz + 0.10), (math.radians(-30), 0, 0))

# Subtle under-glow accent (teal, very faint)
al = bpy.data.lights.new("Accent", "POINT")
al.energy = 0.06; al.color = (0, 0.83, 0.67)
ao = bpy.data.objects.new("Accent", al)
ao.location = (0, min_y - 0.02, cz - 0.02)
scene.collection.objects.link(ao)

# ---------------------------------------------------------------------------
# 7. RENDER
# ---------------------------------------------------------------------------
scene.render.film_transparent = False
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.cycles.use_denoising = True
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"

output_dir = os.path.dirname(os.path.abspath(__file__))
scene.render.filepath = os.path.join(output_dir, "preview_v4.png")
bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output_dir, "headband.blend"))
print(f"✅ v4 done")
