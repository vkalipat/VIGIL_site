"""Final 1080p render + save with transparent background option."""
import bpy
import os

scene = bpy.context.scene
scene.cycles.samples = 256
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.film_transparent = False

output_dir = os.path.dirname(os.path.abspath(__file__))

# Render dark background version
scene.render.filepath = os.path.join(output_dir, "render_dark.png")
bpy.ops.render.render(write_still=True)

# Render transparent background version (for compositing)
scene.render.film_transparent = True
scene.render.filepath = os.path.join(output_dir, "render_alpha.png")
bpy.ops.render.render(write_still=True)

# Save final blend (with transparent off as default)
scene.render.film_transparent = False
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output_dir, "headband.blend"))
print("✅ Final renders done")
