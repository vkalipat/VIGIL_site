"use client";

import dynamic from "next/dynamic";

const ParticleText = dynamic(
  () => import("@/components/ParticleText").then((m) => m.ParticleText),
  { ssr: false, loading: () => <section className="h-screen bg-[#0A0A0F]" /> }
);

export default function ParticleBranding() {
  return <ParticleText />;
}
