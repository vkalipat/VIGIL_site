"""Fix lighting for dark product photography — the band should be dark charcoal."""
import bpy
import math
import os

scene = bpy.context.scene

# ---------------------------------------------------------------------------
# DRASTICALLY REDUCE ALL LIGHTS
# ---------------------------------------------------------------------------
key = bpy.data.objects.get("KeyLight")
if key:
    key.data.energy = 2.0
    key.data.size = 0.5
    key.location = (0.15, -0.28, 0.22)

fill = bpy.data.objects.get("FillLight")
if fill:
    fill.data.energy = 0.8
    fill.data.size = 0.8
    fill.location = (-0.20, -0.18, 0.06)

rim = bpy.data.objects.get("RimLight")
if rim:
    rim.data.energy = 3.0
    rim.data.size = 0.1
    rim.location = (0.0, 0.08, 0.15)
    rim.data.color = (0.6, 0.75, 0.7)

accent = bpy.data.objects.get("AccentLight")
if accent:
    accent.data.energy = 0.3

# ---------------------------------------------------------------------------
# DARKEN FABRIC MATERIAL (ensure it reads dark)
# ---------------------------------------------------------------------------
mat_fabric = bpy.data.materials.get("FabricBand")
if mat_fabric:
    for node in mat_fabric.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            node.inputs["Base Color"].default_value = (0.06, 0.06, 0.07, 1.0)
            node.inputs["Roughness"].default_value = 0.9
            node.inputs["Specular IOR Level"].default_value = 0.15

# ---------------------------------------------------------------------------
# DARKEN SENSOR MODULE
# ---------------------------------------------------------------------------
mat_sensor = bpy.data.materials.get("SensorBlack")
if mat_sensor:
    for node in mat_sensor.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            node.inputs["Base Color"].default_value = (0.01, 0.01, 0.015, 1.0)
            node.inputs["Roughness"].default_value = 0.08
            node.inputs["Specular IOR Level"].default_value = 0.5

# ---------------------------------------------------------------------------
# LED — boost emission
# ---------------------------------------------------------------------------
mat_led = bpy.data.materials.get("LEDGreen")
if mat_led:
    for node in mat_led.node_tree.nodes:
        if node.type == "EMISSION":
            node.inputs["Strength"].default_value = 25.0

# ---------------------------------------------------------------------------
# CAMERA — wider shot to see full band
# ---------------------------------------------------------------------------
cam = bpy.data.objects.get("Camera")
if cam:
    cam.location = (0.0, -0.32, 0.10)
    cam.data.lens = 50

# ---------------------------------------------------------------------------
# WORLD — very dark
# ---------------------------------------------------------------------------
bg = scene.world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.005, 0.005, 0.008, 1.0)
bg.inputs[1].default_value = 1.0  # strength

# ---------------------------------------------------------------------------
# RENDER
# ---------------------------------------------------------------------------
scene.cycles.samples = 128
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.film_transparent = False

output_dir = os.path.dirname(os.path.abspath(__file__))
scene.render.filepath = os.path.join(output_dir, "preview3.png")
bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output_dir, "headband.blend"))
print("✅ Dark render done")
