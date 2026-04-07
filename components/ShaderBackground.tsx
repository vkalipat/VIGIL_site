"use client";

import { NeuroNoise } from "@paper-design/shaders-react";

export default function ShaderBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
      <NeuroNoise
        colorFront="#00D4AA"
        colorMid="#003d2e"
        colorBack="#0A0A0F"
        brightness={0.05}
        contrast={0.3}
        speed={0.15}
        scale={1.5}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
