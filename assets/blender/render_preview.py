"""Render a quick preview of the headband model."""
import bpy
import os

scene = bpy.context.scene
scene.cycles.samples = 64  # fast preview
scene.render.resolution_x = 960
scene.render.resolution_y = 540
scene.render.resolution_percentage = 100

output_dir = os.path.dirname(os.path.abspath(__file__))
scene.render.filepath = os.path.join(output_dir, "preview.png")
bpy.ops.render.render(write_still=True)
print(f"✅ Preview rendered: {scene.render.filepath}")
