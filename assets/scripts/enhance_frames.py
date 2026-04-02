"""
Enhance hero frame clarity using Real-ESRGAN on Modal (A100 GPU).

Usage:
  1. pip install modal
  2. modal setup          # one-time auth
  3. python scripts/enhance_frames.py

Upscales each frame 2x with Real-ESRGAN, then downscales back to the
original resolution (2560x1440). This dramatically sharpens detail —
especially fabric textures — without changing dimensions or bloating files.
"""

import modal
import os
from pathlib import Path

FRAMES_DIR = Path(__file__).resolve().parent.parent / "site" / "public" / "images" / "hero-frames"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "site" / "public" / "images" / "hero-frames-enhanced"
ORIGINAL_W, ORIGINAL_H = 2560, 1440
JPEG_QUALITY = 92
BATCH_SIZE = 20  # frames per GPU invocation

app = modal.App("headband-enhance-frames")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("libgl1", "libglib2.0-0", "wget")
    .pip_install(
        "torch==2.4.1",
        "torchvision==0.19.1",
    )
    .pip_install(
        "realesrgan",
        "basicsr>=1.4.2",
        "gfpgan",
        "opencv-python-headless",
        "numpy",
        "Pillow",
    )
    .run_commands(
        # Patch basicsr's broken import (functional_tensor removed in newer torchvision)
        "sed -i 's/from torchvision.transforms.functional_tensor import rgb_to_grayscale/from torchvision.transforms.functional import rgb_to_grayscale/' "
        "/usr/local/lib/python3.11/site-packages/basicsr/data/degradations.py",
        # Download the Real-ESRGAN x2 model weights
        "mkdir -p /weights",
        "wget -q https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth -O /weights/RealESRGAN_x2plus.pth",
    )
)


@app.function(
    image=image,
    gpu="A100-40GB",
    timeout=600,
)
def enhance_batch(frame_data_list: list[tuple[str, bytes]]) -> list[tuple[str, bytes]]:
    """Enhance a batch of frames using Real-ESRGAN x2, then downscale to original size."""
    import cv2
    import numpy as np
    from realesrgan import RealESRGANer
    from basicsr.archs.rrdbnet_arch import RRDBNet

    # Set up Real-ESRGAN with x2 model
    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2)
    upsampler = RealESRGANer(
        scale=2,
        model_path="/weights/RealESRGAN_x2plus.pth",
        model=model,
        tile=512,       # tile size to avoid OOM on large images
        tile_pad=10,
        pre_pad=0,
        half=True,      # fp16 for speed on A100
    )

    results = []
    for filename, img_bytes in frame_data_list:
        # Decode
        arr = np.frombuffer(img_bytes, dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

        # Upscale 2x with Real-ESRGAN
        enhanced, _ = upsampler.enhance(img, outscale=2)

        # Downscale back to original resolution (the sharpening trick)
        enhanced = cv2.resize(enhanced, (ORIGINAL_W, ORIGINAL_H), interpolation=cv2.INTER_LANCZOS4)

        # Encode as JPEG
        _, buf = cv2.imencode(".jpg", enhanced, [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY])
        results.append((filename, buf.tobytes()))

    return results


@app.local_entrypoint()
def main():
    # Collect all frames
    frames = sorted(FRAMES_DIR.glob("frame-*.jpg"))
    print(f"Found {len(frames)} frames to enhance")

    if not frames:
        print("No frames found!")
        return

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Build batches
    batches = []
    for i in range(0, len(frames), BATCH_SIZE):
        batch = []
        for f in frames[i : i + BATCH_SIZE]:
            batch.append((f.name, f.read_bytes()))
        batches.append(batch)

    print(f"Processing {len(batches)} batches of up to {BATCH_SIZE} frames on A100...")

    # Fan out batches in parallel across GPUs
    for i, result_batch in enumerate(enhance_batch.map(batches)):
        for filename, img_bytes in result_batch:
            out_path = OUTPUT_DIR / filename
            out_path.write_bytes(img_bytes)
        done = min((i + 1) * BATCH_SIZE, len(frames))
        print(f"  [{done}/{len(frames)}] frames done")

    print(f"\nAll done! Enhanced frames saved to:\n  {OUTPUT_DIR}")
    print(f"\nTo replace originals:\n  rm -rf {FRAMES_DIR} && mv {OUTPUT_DIR} {FRAMES_DIR}")
