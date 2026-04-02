"""Fix camera, lighting, and render settings for the headband scene."""
import bpy
import math

scene = bpy.context.scene

# ---------------------------------------------------------------------------
# CAMERA — pull back, match reference angle (front, slightly above)
# ---------------------------------------------------------------------------
cam = bpy.data.objects.get("Camera")
if cam:
    cam.location = (0.0, -0.30, 0.08)
    cam.data.lens = 65
    cam.data.dof.aperture_fstop = 4.0

target = bpy.data.objects.get("CameraTarget")
if target:
    target.location = (0.0, -0.089, 0.0)

# ---------------------------------------------------------------------------
# LIGHTING — tone down dramatically for dark product photography
# ---------------------------------------------------------------------------
key = bpy.data.objects.get("KeyLight")
if key:
    key.data.energy = 8
    key.data.size = 0.4
    key.location = (0.12, -0.30, 0.18)

fill = bpy.data.objects.get("FillLight")
if fill:
    fill.data.energy = 3
    fill.data.size = 0.6
    fill.location = (-0.18, -0.22, 0.08)

rim = bpy.data.objects.get("RimLight")
if rim:
    rim.data.energy = 6
    rim.data.size = 0.15
    rim.location = (0.0, 0.05, 0.12)

accent = bpy.data.objects.get("AccentLight")
if accent:
    accent.data.energy = 0.5

# ---------------------------------------------------------------------------
# BACKGROUND — solid dark (not transparent for preview)
# ---------------------------------------------------------------------------
scene.render.film_transparent = False
scene.world.node_tree.nodes["Background"].inputs[0].default_value = (0.01, 0.01, 0.015, 1.0)

# ---------------------------------------------------------------------------
# RENDER PREVIEW
# ---------------------------------------------------------------------------
import os
scene.cycles.samples = 128
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
output_dir = os.path.dirname(os.path.abspath(__file__))

scene.render.filepath = os.path.join(output_dir, "preview2.png")
bpy.ops.render.render(write_still=True)

# Save updated blend
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output_dir, "headband.blend"))
print("✅ Fixed and re-rendered")
