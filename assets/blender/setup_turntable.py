"""
Run INSIDE Blender: Text Editor > Open > Run Script (Alt+P)
Sets up 120-frame, 180° front-to-back turntable.
"""
import bpy
import math
import os

scene = bpy.context.scene
TOTAL_FRAMES = 120
ROTATION_DEG = 180  # front to back

# ---------------------------------------------------------------------------
# 1. PIVOT EMPTY
# ---------------------------------------------------------------------------
if "TurntablePivot" in bpy.data.objects:
    bpy.data.objects.remove(bpy.data.objects["TurntablePivot"], do_unlink=True)

bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
pivot = bpy.context.active_object
pivot.name = "TurntablePivot"

# ---------------------------------------------------------------------------
# 2. PARENT CAMERA TO PIVOT
# ---------------------------------------------------------------------------
cam = None
for obj in bpy.data.objects:
    if obj.type == "CAMERA":
        cam = obj
        break

if cam is None:
    raise RuntimeError("No camera found!")

for c in list(cam.constraints):
    cam.constraints.remove(c)

cam.parent = pivot
cam.matrix_parent_inverse = pivot.matrix_world.inverted()

# Track to center
track = cam.constraints.new("TRACK_TO")
target = bpy.data.objects.get("CamTarget")
if target is None:
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    target = bpy.context.active_object
    target.name = "CamTarget"
track.target = target
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"

# ---------------------------------------------------------------------------
# 3. ANIMATE — 180° rotation over 120 frames
# ---------------------------------------------------------------------------
scene.frame_start = 1
scene.frame_end = TOTAL_FRAMES

pivot.rotation_euler = (0, 0, 0)
pivot.keyframe_insert(data_path="rotation_euler", frame=1)

pivot.rotation_euler = (0, 0, math.radians(ROTATION_DEG))
pivot.keyframe_insert(data_path="rotation_euler", frame=TOTAL_FRAMES)

# Set linear interpolation if possible (API varies by Blender version)
try:
    for fc in pivot.animation_data.action.fcurves:
        for kf in fc.keyframe_points:
            kf.interpolation = "LINEAR"
except Exception:
    print("Note: Could not set linear interpolation — rotation will have slight ease in/out")

# ---------------------------------------------------------------------------
# 4. RENDER SETTINGS — 4K, transparent, no motion blur
# ---------------------------------------------------------------------------
scene.render.resolution_x = 3840
scene.render.resolution_y = 2160
scene.render.resolution_percentage = 100

scene.render.film_transparent = True
scene.render.use_motion_blur = False

scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"

output_dir = "/Users/vedantk/Documents/headband-vault/blender/turntable_frames/"
os.makedirs(output_dir, exist_ok=True)
scene.render.filepath = os.path.join(output_dir, "frame-")
scene.render.use_file_extension = True

print(f"✅ Ready: {TOTAL_FRAMES} frames, 180° rotation, 4K, transparent PNG")
print(f"   Output: {output_dir}")
print(f"   Render: Ctrl+F12 (Render > Render Animation)")
