"""Fix v2: reduce teal rim, neutral lighting, camera straight-on."""
import bpy
import math
import os

scene = bpy.context.scene

# ---------------------------------------------------------------------------
# LIGHTING — mostly neutral white, subtle teal only from LED
# ---------------------------------------------------------------------------
for obj in bpy.data.objects:
    if obj.type == "LIGHT":
        light = obj.data
        if obj.name == "Key":
            light.energy = 2.0
            light.color = (1.0, 0.98, 0.95)
        elif obj.name == "Fill":
            light.energy = 0.5
            light.color = (0.92, 0.95, 1.0)
        elif obj.name == "Rim":
            light.energy = 2.5
            light.color = (0.85, 0.88, 0.86)  # nearly neutral with tiny cool tint
            obj.location = (0, obj.location.y, obj.location.z + 0.05)
        elif obj.name == "Accent":
            light.energy = 0.15  # very subtle teal accent

# ---------------------------------------------------------------------------
# CAMERA — lower, more front-on (match reference frame-001)
# ---------------------------------------------------------------------------
cam = bpy.data.objects.get("Camera")
if cam:
    # Move camera closer and lower for more front-on view
    cam.location = (0.0, -0.22, 0.025)
    cam.data.lens = 65

target = bpy.data.objects.get("Target")
if target:
    target.location = (0, 0, 0)

# ---------------------------------------------------------------------------
# RENDER
# ---------------------------------------------------------------------------
scene.cycles.samples = 128
scene.render.resolution_x = 1280
scene.render.resolution_y = 720

output_dir = os.path.dirname(os.path.abspath(__file__))
scene.render.filepath = os.path.join(output_dir, "preview_v2b.png")
bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output_dir, "headband.blend"))
print("✅ v2b done")
