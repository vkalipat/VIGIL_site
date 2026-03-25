import dynamic from "next/dynamic";
import Hero from "@/sections/Hero";
import HeroReveal from "@/sections/HeroReveal";
import Roadmap from "@/sections/Roadmap";

const ParticleText = dynamic(
  () => import("@/components/ParticleText").then((m) => m.ParticleText),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <ParticleText />
      <Hero />
      <HeroReveal />
      <Roadmap />
    </>
  );
}
