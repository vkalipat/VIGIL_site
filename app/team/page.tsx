import type { Metadata } from "next";
import Team from "@/sections/Team";
import Contact from "@/sections/Contact";

export const metadata: Metadata = {
  title: "Team & Contact — VIGIL Health",
  description:
    "Meet the team behind VIGIL. Based in Cumming, GA. Request a pilot deployment or get in touch.",
};

export default function TeamPage() {
  return (
    <div className="pt-20">
      <Team />
      <Contact />
    </div>
  );
}
