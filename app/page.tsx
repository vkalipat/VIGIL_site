import Hero from "@/sections/Hero";
import HeroReveal from "@/sections/HeroReveal";
import Roadmap from "@/sections/Roadmap";
import ParticleBranding from "@/sections/ParticleBranding";

export default function Home() {
  return (
    <>
      <ParticleBranding />
      <Hero />
      <HeroReveal />
      <Roadmap />
    </>
  );
}
