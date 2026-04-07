import Hero from "@/sections/Hero";
import HeroReveal from "@/sections/HeroReveal";
import Roadmap from "@/sections/Roadmap";
import ShaderBackground from "@/components/ShaderBackground";

export default function Home() {
  return (
    <>
      <ShaderBackground />
      <Hero />
      <HeroReveal />
      <Roadmap />
    </>
  );
}
