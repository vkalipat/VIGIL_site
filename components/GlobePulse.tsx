"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export interface MarkerData {
  id: string;
  location: [number, number];
  delay: number;
}

interface GlobePulseProps {
  markers: MarkerData[];
  visibleCount: number;
  className?: string;
}

export function GlobePulse({
  markers,
  visibleCount,
  className = "",
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const visibleCountRef = useRef(visibleCount);
  visibleCountRef.current = visibleCount;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  // Create globe once
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = canvas.offsetWidth;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.5,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0, 0.83, 0.67],
      glowColor: [0.02, 0.02, 0.04],
      markers: markers.map((m, i) => ({
        location: m.location,
        size: i < visibleCountRef.current ? 0.03 : 0,
        id: m.id,
      })),
      opacity: 0.85,
    });

    globeRef.current = globe;
    let animationId: number;

    function animate() {
      if (!isPausedRef.current) phiRef.current += 0.003;
      globe.update({
        phi:
          phiRef.current + phiOffsetRef.current + dragOffset.current.phi,
        theta:
          0.2 + thetaOffsetRef.current + dragOffset.current.theta,
      });
      animationId = requestAnimationFrame(animate);
    }
    animate();
    setTimeout(() => canvas && (canvas.style.opacity = "1"));

    return () => {
      cancelAnimationFrame(animationId);
      globe.destroy();
      globeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker sizes when visible count changes
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.update({
      markers: markers.map((m, i) => ({
        location: m.location,
        size: i < visibleCount ? 0.03 : 0,
        id: m.id,
      })),
    });
  }, [visibleCount, markers]);

  const shown = markers.slice(0, visibleCount);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes vigil-pulse {
          0% { transform: scale(0.3); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1s ease",
          contain: "layout paint size",
          touchAction: "none",
        }}
      />
      {shown.map((m) => (
        <div
          key={m.id}
          style={
            {
              position: "absolute",
              positionAnchor: `--cobe-${m.id}`,
              bottom: "anchor(center)",
              left: "anchor(center)",
              translate: "-50% 50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              opacity: `var(--cobe-visible-${m.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
              transition: "opacity 0.4s, filter 0.4s",
            } as React.CSSProperties
          }
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid #00D4AA",
              borderRadius: "50%",
              opacity: 0,
              animation: `vigil-pulse 2s ease-out infinite ${m.delay}s`,
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid #00D4AA",
              borderRadius: "50%",
              opacity: 0,
              animation: `vigil-pulse 2s ease-out infinite ${m.delay + 0.5}s`,
            }}
          />
          <span
            style={{
              width: 8,
              height: 8,
              background: "#00D4AA",
              borderRadius: "50%",
              boxShadow: "0 0 0 2px #0A0A0F, 0 0 0 4px #00D4AA",
            }}
          />
        </div>
      ))}
    </div>
  );
}
