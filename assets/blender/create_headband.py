"""
VIGIL Headband — Blender 5.0 model generator.
Creates a curved medical-sensor headband with:
  • Fabric band body (185mm × 35mm PCB footprint)
  • Center sensor module with rounded corners
  • Green LED indicator
  • Studio lighting + camera
  • Saves to headband.blend
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
scene.world = bpy.data.worlds.new("World")
scene.world.use_nodes = True
bg_node = scene.world.node_tree.nodes["Background"]
bg_node.inputs[0].default_value = (0.039, 0.039, 0.059, 1.0)  # #0A0A0F

# ---------------------------------------------------------------------------
# 1. HEADBAND BODY — curved band via curve + profile bevel
# ---------------------------------------------------------------------------
# Head circumference ~56cm → radius ~89mm.  Band wraps the front ~180°.
HEAD_RADIUS = 0.089  # meters
BAND_WIDTH = 0.185   # 185mm
BAND_HEIGHT = 0.035  # 35mm
BAND_THICKNESS = 0.008  # 8mm thickness

# Create a path curve for the band centerline (arc around a head)
curve_data = bpy.data.curves.new("BandPath", type="CURVE")
curve_data.dimensions = "3D"
spline = curve_data.splines.new("BEZIER")

# Arc: ~160° in front of head (slightly less than 180° to taper ends)
ARC_DEG = 160
num_points = 9
spline.bezier_points.add(num_points - 1)

for i, pt in enumerate(spline.bezier_points):
    angle = math.radians(-ARC_DEG / 2 + ARC_DEG * i / (num_points - 1))
    x = HEAD_RADIUS * math.sin(angle)
    y = -HEAD_RADIUS * math.cos(angle)
    z = 0.0
    pt.co = (x, y, z)

    # Smooth tangent handles
    tangent_len = HEAD_RADIUS * 0.25
    dx = math.cos(angle) * tangent_len
    dy = math.sin(angle) * tangent_len
    pt.handle_left = (x - dx, y - dy, z)
    pt.handle_right = (x + dx, y + dy, z)
    pt.handle_left_type = "AUTO"
    pt.handle_right_type = "AUTO"

band_curve_obj = bpy.data.objects.new("BandPath", curve_data)
scene.collection.objects.link(band_curve_obj)

# Bevel profile — rounded rectangle cross section
profile_curve = bpy.data.curves.new("BandProfile", type="CURVE")
profile_curve.dimensions = "2D"
profile_spline = profile_curve.splines.new("NURBS")

# Create rounded-rect cross-section (height × thickness)
h = BAND_HEIGHT / 2
t = BAND_THICKNESS / 2
r = 0.003  # corner radius
profile_pts = [
    (-h + r, -t), (-h, -t + r), (-h, t - r), (-h + r, t),
    (h - r, t), (h, t - r), (h, -t + r), (h - r, -t), (-h + r, -t),
]
profile_spline.points.add(len(profile_pts) - 1)
for i, (pz, py) in enumerate(profile_pts):
    profile_spline.points[i].co = (pz, py, 0.0, 1.0)
profile_spline.use_cyclic_u = True
profile_spline.order_u = 3

profile_obj = bpy.data.objects.new("BandProfile", profile_curve)
scene.collection.objects.link(profile_obj)

curve_data.bevel_mode = "OBJECT"
curve_data.bevel_object = profile_obj

# Convert curve to mesh for better control
bpy.context.view_layer.objects.active = band_curve_obj
band_curve_obj.select_set(True)
bpy.ops.object.convert(target="MESH")
band_mesh = bpy.context.active_object
band_mesh.name = "Headband"

# Smooth shading
bpy.ops.object.shade_smooth()

# Add subdivision surface for smoothness
subsurf = band_mesh.modifiers.new("Subdivision", "SUBSURF")
subsurf.levels = 2
subsurf.render_levels = 3

# Hide profile helper
profile_obj.hide_viewport = True
profile_obj.hide_render = True

# ---------------------------------------------------------------------------
# 2. SENSOR MODULE — rounded box at center-front of band
# ---------------------------------------------------------------------------
MODULE_SIZE = 0.025  # 25mm square
MODULE_DEPTH = 0.006  # 6mm thick

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -HEAD_RADIUS - BAND_THICKNESS / 2 - MODULE_DEPTH / 2, 0))
sensor = bpy.context.active_object
sensor.name = "SensorModule"
sensor.scale = (MODULE_SIZE / 2, MODULE_DEPTH / 2, MODULE_SIZE / 2)
bpy.ops.object.transform_apply(scale=True)

# Round the edges
bevel = sensor.modifiers.new("Bevel", "BEVEL")
bevel.width = 0.002
bevel.segments = 4
bevel.limit_method = "ANGLE"

subsurf2 = sensor.modifiers.new("Subdivision", "SUBSURF")
subsurf2.levels = 2
subsurf2.render_levels = 2

bpy.ops.object.shade_smooth()

# ---------------------------------------------------------------------------
# 3. LED INDICATOR — small emissive sphere
# ---------------------------------------------------------------------------
LED_RADIUS = 0.0015
bpy.ops.mesh.primitive_uv_sphere_add(
    radius=LED_RADIUS,
    location=(0, -HEAD_RADIUS - BAND_THICKNESS / 2 - MODULE_DEPTH - 0.0001, -0.003),
    segments=16, ring_count=8,
)
led = bpy.context.active_object
led.name = "LED"
bpy.ops.object.shade_smooth()

# ---------------------------------------------------------------------------
# 4. MATERIALS
# ---------------------------------------------------------------------------

# --- Fabric Material ---
mat_fabric = bpy.data.materials.new("FabricBand")
mat_fabric.use_nodes = True
nodes = mat_fabric.node_tree.nodes
links = mat_fabric.node_tree.links
nodes.clear()

output = nodes.new("ShaderNodeOutputMaterial")
principled = nodes.new("ShaderNodeBsdfPrincipled")
principled.inputs["Base Color"].default_value = (0.12, 0.12, 0.13, 1.0)  # dark charcoal
principled.inputs["Roughness"].default_value = 0.85
principled.inputs["Metallic"].default_value = 0.0
principled.inputs["Specular IOR Level"].default_value = 0.3
links.new(principled.outputs["BSDF"], output.inputs["Surface"])

# Subtle bump for fabric texture
tex_noise = nodes.new("ShaderNodeTexNoise")
tex_noise.inputs["Scale"].default_value = 800.0
tex_noise.inputs["Detail"].default_value = 12.0
tex_noise.inputs["Roughness"].default_value = 0.7

bump = nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.15
bump.inputs["Distance"].default_value = 0.001
links.new(tex_noise.outputs["Fac"], bump.inputs["Height"])
links.new(bump.outputs["Normal"], principled.inputs["Normal"])

# Add horizontal line texture for the woven look
tex_wave = nodes.new("ShaderNodeTexWave")
tex_wave.wave_type = "BANDS"
tex_wave.inputs["Scale"].default_value = 200.0
tex_wave.inputs["Distortion"].default_value = 1.5
tex_wave.inputs["Detail"].default_value = 4.0

bump2 = nodes.new("ShaderNodeBump")
bump2.inputs["Strength"].default_value = 0.08
bump2.inputs["Distance"].default_value = 0.001
links.new(tex_wave.outputs["Fac"], bump2.inputs["Height"])
links.new(bump.outputs["Normal"], bump2.inputs["Normal"])
links.new(bump2.outputs["Normal"], principled.inputs["Normal"])

band_mesh.data.materials.append(mat_fabric)

# --- Sensor Module Material ---
mat_sensor = bpy.data.materials.new("SensorBlack")
mat_sensor.use_nodes = True
nodes_s = mat_sensor.node_tree.nodes
links_s = mat_sensor.node_tree.links
nodes_s.clear()

output_s = nodes_s.new("ShaderNodeOutputMaterial")
principled_s = nodes_s.new("ShaderNodeBsdfPrincipled")
principled_s.inputs["Base Color"].default_value = (0.02, 0.02, 0.025, 1.0)
principled_s.inputs["Roughness"].default_value = 0.15
principled_s.inputs["Metallic"].default_value = 0.0
principled_s.inputs["Specular IOR Level"].default_value = 0.8
principled_s.inputs["Coat Weight"].default_value = 0.3
principled_s.inputs["Coat Roughness"].default_value = 0.1
links_s.new(principled_s.outputs["BSDF"], output_s.inputs["Surface"])

sensor.data.materials.append(mat_sensor)

# --- LED Material ---
mat_led = bpy.data.materials.new("LEDGreen")
mat_led.use_nodes = True
nodes_l = mat_led.node_tree.nodes
links_l = mat_led.node_tree.links
nodes_l.clear()

output_l = nodes_l.new("ShaderNodeOutputMaterial")
emission = nodes_l.new("ShaderNodeEmission")
emission.inputs["Color"].default_value = (0.0, 0.83, 0.67, 1.0)  # #00D4AA teal
emission.inputs["Strength"].default_value = 15.0
links_l.new(emission.outputs["Emission"], output_l.inputs["Surface"])

led.data.materials.append(mat_led)

# ---------------------------------------------------------------------------
# 5. CAMERA
# ---------------------------------------------------------------------------
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 85
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 2.8

cam_obj = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# Position: front-slightly-above, looking at band center
cam_obj.location = (0.0, -0.35, 0.06)
cam_obj.rotation_euler = (math.radians(80), 0, 0)

# Track to empty at band center
empty = bpy.data.objects.new("CameraTarget", None)
empty.location = (0, -HEAD_RADIUS, 0)
scene.collection.objects.link(empty)

track = cam_obj.constraints.new("TRACK_TO")
track.target = empty
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"

cam_data.dof.focus_object = empty

# ---------------------------------------------------------------------------
# 6. LIGHTING — 3-point studio setup
# ---------------------------------------------------------------------------

# Key light — area light, slightly above and to the right
key_data = bpy.data.lights.new("KeyLight", "AREA")
key_data.energy = 30
key_data.size = 0.3
key_data.color = (1.0, 0.98, 0.95)
key_obj = bpy.data.objects.new("KeyLight", key_data)
key_obj.location = (0.15, -0.25, 0.2)
key_obj.rotation_euler = (math.radians(50), math.radians(15), 0)
scene.collection.objects.link(key_obj)

# Fill light — softer, opposite side
fill_data = bpy.data.lights.new("FillLight", "AREA")
fill_data.energy = 10
fill_data.size = 0.5
fill_data.color = (0.85, 0.9, 1.0)
fill_obj = bpy.data.objects.new("FillLight", fill_data)
fill_obj.location = (-0.2, -0.2, 0.1)
fill_obj.rotation_euler = (math.radians(60), math.radians(-20), 0)
scene.collection.objects.link(fill_obj)

# Rim/back light — for edge definition
rim_data = bpy.data.lights.new("RimLight", "AREA")
rim_data.energy = 20
rim_data.size = 0.2
rim_data.color = (0.7, 0.85, 0.8)
rim_obj = bpy.data.objects.new("RimLight", rim_data)
rim_obj.location = (0.0, 0.1, 0.15)
rim_obj.rotation_euler = (math.radians(-30), 0, 0)
scene.collection.objects.link(rim_obj)

# Subtle teal accent light (matching brand color)
accent_data = bpy.data.lights.new("AccentLight", "POINT")
accent_data.energy = 2
accent_data.color = (0.0, 0.83, 0.67)  # #00D4AA
accent_obj = bpy.data.objects.new("AccentLight", accent_data)
accent_obj.location = (0.0, -HEAD_RADIUS - 0.05, -0.02)
scene.collection.objects.link(accent_obj)

# ---------------------------------------------------------------------------
# 7. RENDER SETTINGS
# ---------------------------------------------------------------------------
scene.render.film_transparent = True
scene.cycles.use_denoising = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"

# Bloom via Cycles settings (Blender 5.0+ removed scene.node_tree compositor access)
try:
    scene.use_nodes = True
    if hasattr(scene, "node_tree") and scene.node_tree:
        comp_nodes = scene.node_tree.nodes
        comp_links = scene.node_tree.links
        render_layers = comp_nodes.get("Render Layers")
        composite = comp_nodes.get("Composite")
        if render_layers and composite:
            glare = comp_nodes.new("CompositorNodeGlare")
            glare.glare_type = "FOG_GLOW"
            glare.quality = "HIGH"
            glare.threshold = 0.8
            glare.size = 6
            comp_links.new(render_layers.outputs["Image"], glare.inputs["Image"])
            comp_links.new(glare.outputs["Image"], composite.inputs["Image"])
except Exception as e:
    print(f"Compositor setup skipped: {e}")

# ---------------------------------------------------------------------------
# 8. SAVE
# ---------------------------------------------------------------------------
output_dir = os.path.dirname(os.path.abspath(__file__))
blend_path = os.path.join(output_dir, "headband.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)
print(f"\n✅ Saved: {blend_path}")
print(f"   Objects: {len(bpy.data.objects)}")
print(f"   Materials: {len(bpy.data.materials)}")
