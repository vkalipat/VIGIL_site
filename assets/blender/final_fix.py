"""Final polish — match the dark moody reference images."""
import bpy
import math
import os

scene = bpy.context.scene

# ---------------------------------------------------------------------------
# FABRIC — even darker, very low reflectance
# ---------------------------------------------------------------------------
mat_fabric = bpy.data.materials.get("FabricBand")
if mat_fabric:
    for node in mat_fabric.node_tree.nodes:
        if node.type == "BSDF_PRINCIPLED":
            node.inputs["Base Color"].default_value = (0.03, 0.03, 0.035, 1.0)
            node.inputs["Roughness"].default_value = 0.95
            node.inputs["Specular IOR Level"].default_value = 0.08

# ---------------------------------------------------------------------------
# SENSOR MODULE — make it larger and more visible
# ---------------------------------------------------------------------------
sensor = bpy.data.objects.get("SensorModule")
if sensor:
    sensor.scale = (1.4, 1.0, 1.4)
    bpy.context.view_layer.objects.active = sensor
    sensor.select_set(True)
    bpy.ops.object.transform_apply(scale=True)

# ---------------------------------------------------------------------------
# LIGHTS — keep key light subtle, boost rim for edge definition
# ---------------------------------------------------------------------------
key = bpy.data.objects.get("KeyLight")
if key:
    key.data.energy = 1.5

fill = bpy.data.objects.get("FillLight")
if fill:
    fill.data.energy = 0.4

rim = bpy.data.objects.get("RimLight")
if rim:
    rim.data.energy = 4.0
    rim.data.color = (0.55, 0.7, 0.65)

# ---------------------------------------------------------------------------
# CAMERA — front-on, slightly above (match frame-001 perspective)
# ---------------------------------------------------------------------------
cam = bpy.data.objects.get("Camera")
if cam:
    cam.location = (0.0, -0.30, 0.06)
    cam.data.lens = 55

# ---------------------------------------------------------------------------
# RENDER
# ---------------------------------------------------------------------------
scene.cycles.samples = 256
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080

output_dir = os.path.dirname(os.path.abspath(__file__))
scene.render.filepath = os.path.join(output_dir, "preview_final.png")
bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output_dir, "headband.blend"))
print("✅ Final render done")
