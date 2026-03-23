"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
}

const team: TeamMember[] = [
  {
    name: "Shaunak Buche",
    role: "Product Strategy",
    bio: "Shaped VIGIL's product vision, translating clinical needs into clear requirements. Focused on accessibility, scalability, and real hospital workflows.",
    photo: "/images/canva/team-shaunak.png",
  },
  {
    name: "Vishwa Rajan",
    role: "Hardware Design",
    bio: "Led physical design and prototyping, prioritizing comfort and wearability. Made the device unobtrusive yet suitable for continuous monitoring.",
    photo: "/images/canva/team-vishwa.png",
  },
  {
    name: "Vedant Kalipatnapu",
    role: "Biomedical Systems",
    bio: "Developed the physiological sensing system with reliable signal capture. Researched sensor feasibility for real clinical environments.",
    photo: "/images/canva/team-vedant-k.png",
  },
  {
    name: "Vedant Mehta",
    role: "Business Development",
    bio: "Led market research and competitive analysis to position VIGIL within hospital systems. Built the path from prototype to adoption.",
    photo: "/images/canva/team-vedant-m.png",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={item}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/80 via-transparent to-[#0A0A0F]/20 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Cursor spotlight on photo */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.7 : 0,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,212,170,0.08), transparent 50%)`,
          }}
        />

        {/* Index number */}
        <span className="absolute top-4 right-4 font-mono text-xs text-white/30 tracking-widest">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Text below photo — clean and simple */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-[#FAFAFA] group-hover:text-[#00D4AA] transition-colors duration-300">
            {member.name}
          </h3>
        </div>
        <p className="font-mono text-[11px] tracking-[0.15em] text-zinc-500 uppercase">
          {member.role}
        </p>
        <p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors duration-500 pt-1">
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}

export default function Team() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase mb-4">
            Co-Founders
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            The Team
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6"
        >
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
