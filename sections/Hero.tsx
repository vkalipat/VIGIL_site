"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const IMAGE_PATH = "/images/hero-frames/frame-";

function frameUrl(index: number): string {
  const num = String(index).padStart(4, "0");
  return `${IMAGE_PATH}${num}.jpg`;
}

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const gsapCtxRef = useRef<gsap.Context | null>(null);

  // Synchronous cleanup: revert GSAP pin BEFORE React removes DOM nodes
  useLayoutEffect(() => {
    return () => {
      gsapCtxRef.current?.revert();
      gsapCtxRef.current = null;
    };
  }, []);

  // Preload frames 1-96
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const firstImg = imagesRef.current[0];
    canvas.width = firstImg.naturalWidth;
    canvas.height = firstImg.naturalHeight;

    function drawFrame(index: number) {
      const img = imagesRef.current[index];
      if (img && ctx) {
        ctx.drawImage(img, 0, 0, canvas!.width, canvas!.height);
      }
    }

    drawFrame(0);

    const gsapCtx = gsapCtxRef.current = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=450%",
        pin: true,
        scrub: 0,
        onUpdate: (self) => {
          const p = self.progress;

          // First 90% of scroll: rotate through frames
          // Last 10%: headband fades out fast
          if (p <= 0.9) {
            const frameProgress = p / 0.9;
            const frameIndex = Math.min(
              FRAME_COUNT - 1,
              Math.floor(frameProgress * FRAME_COUNT)
            );
            if (frameIndex !== currentFrameRef.current) {
              currentFrameRef.current = frameIndex;
              drawFrame(frameIndex);
            }
            if (canvas) {
              canvas.style.opacity = "1";
              canvas.style.transform = "scale(1) translateY(0)";
            }
          } else {
            // Clean crossfade to black
            const fadeProgress = (p - 0.9) / 0.1;
            if (canvas) {
              canvas.style.opacity = String(1 - fadeProgress);
              canvas.style.transform = "scale(1) translateY(0)";
            }
          }
        },
      });
    }, wrapperRef);

    return () => gsapCtx.revert();
  }, [loaded]);

  return (
    <div ref={wrapperRef} className="h-screen relative overflow-hidden bg-[#0A0A0F]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transition-none"
      />

      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
              Loading
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
