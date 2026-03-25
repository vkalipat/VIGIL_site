"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function ParticleText({ text = "VIGIL" }: { text?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(0);
  const dimRef = useRef({ w: 0, h: 0 });

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w;
    canvas.height = h;
    dimRef.current = { w, h };

    // Draw text offscreen to sample pixel positions
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const offCtx = off.getContext("2d")!;

    const fontSize = Math.min(w / 3.2, 220);
    offCtx.fillStyle = "#fff";
    offCtx.font = `900 ${fontSize}px "Arial Black", "Impact", sans-serif`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText(text, w / 2, h / 2);

    // Sample pixels into particles
    const data = offCtx.getImageData(0, 0, w, h).data;
    const gap = 3;
    const particles: Particle[] = [];

    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        if (data[(y * w + x) * 4 + 3] > 128) {
          particles.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 0.8,
            opacity: 0.5 + Math.random() * 0.5,
          });
        }
      }
    }
    particlesRef.current = particles;
  }, [text]);

  useEffect(() => {
    init();
    window.addEventListener("resize", init);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    function animate() {
      const { w, h } = dimRef.current;
      ctx.clearRect(0, 0, w, h);
      const { x: mx, y: my } = mouseRef.current;
      const radius = 100;

      for (const p of particlesRef.current) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          const angle = Math.atan2(dy, dx);
          const push = ((radius - dist) / radius) * 10;
          p.vx -= Math.cos(angle) * push;
          p.vy -= Math.sin(angle) * push;
        }

        // Spring back
        p.vx += (p.originX - p.x) * 0.045;
        p.vy += (p.originY - p.y) * 0.045;

        // Damping
        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        ctx.fillStyle = `rgba(250,250,250,${p.opacity})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      animRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", init);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [init]);

  return (
    <section className="relative h-screen bg-[#0A0A0F] flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />
      {/* Subtle scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
          Scroll
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-zinc-500 to-transparent" />
      </div>
    </section>
  );
}
