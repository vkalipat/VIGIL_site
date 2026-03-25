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
  color: string;
}

export function ParticleText({
  text = "VIGIL",
  onFadeRef,
}: {
  text?: string;
  onFadeRef?: React.MutableRefObject<HTMLCanvasElement | null>;
}) {
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
    if (w === 0 || h === 0) return;

    canvas.width = w;
    canvas.height = h;
    dimRef.current = { w, h };

    // Expose canvas ref for external fade control
    if (onFadeRef) onFadeRef.current = canvas;

    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const offCtx = off.getContext("2d")!;

    const fontSize = Math.min(w / 3.2, 220);
    offCtx.fillStyle = "#fff";
    offCtx.font = `900 ${fontSize}px "Arial Black", "Impact", sans-serif`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText(text, w / 2, h / 2 - h * 0.08);

    const data = offCtx.getImageData(0, 0, w, h).data;
    const gap = 3;
    const particles: Particle[] = [];

    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        if (data[(y * w + x) * 4 + 3] > 128) {
          // ~25% of particles are teal, rest white
          const isTeal = Math.random() < 0.25;
          const opacity = 0.5 + Math.random() * 0.5;
          particles.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 0.8,
            color: isTeal
              ? `rgba(0,212,170,${opacity})`
              : `rgba(250,250,250,${opacity})`,
          });
        }
      }
    }
    particlesRef.current = particles;
  }, [text, onFadeRef]);

  useEffect(() => {
    requestAnimationFrame(() => init());
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
      if (w === 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

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

        p.vx += (p.originX - p.x) * 0.045;
        p.vy += (p.originY - p.y) * 0.045;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
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
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-20 pointer-events-auto cursor-crosshair"
    />
  );
}
