"use client";

import { useRef } from "react";
import {
  motion,
  MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import { HoverGlowButton } from "@/components/ui/hover-glow-button";
import { GooeyText } from "@/components/ui/gooey-text";

/* ─── Scroll-linked word that lights up ─── */
function RevealWord({
  children,
  progress,
  range,
  className = "text-[#FAFAFA]",
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <span className="relative mx-[0.12em] inline-block">
      <span className="opacity-[0.1]">{children}</span>
      <motion.span
        style={{ opacity }}
        className={`absolute left-0 top-0 ${className}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ─── Animated stat with glow ─── */
function GlowStat({
  value,
  label,
  progress,
  range,
}: {
  value: string;
  label: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const scale = useTransform(progress, range, [0.7, 1]);
  const glowOpacity = useTransform(progress, range, [0, 0.6]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="relative flex flex-col items-center"
    >
      {/* Teal glow behind the number */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute -inset-4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,170,0.15)_0%,transparent_70%)] blur-xl"
      />
      <span className="relative font-mono text-4xl md:text-6xl font-bold text-[#FAFAFA] tracking-tighter">
        {value}
      </span>
      <span className="relative font-mono text-[10px] md:text-xs tracking-[0.25em] text-zinc-500 uppercase mt-2">
        {label}
      </span>
    </motion.div>
  );
}

export default function HeroReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // VIGIL timing
  const vigilOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);
  const vigilScale = useTransform(scrollYProgress, [0.05, 0.12], [0.9, 1]);

  // Tagline words
  const tagline = "Continuous ICU-grade monitoring at ultra-low cost.".split(" ");

  // Problem statement words
  const problem =
    "General ward patients are monitored every 4–8 hours. VIGIL monitors every 5 seconds.".split(" ");

  // Divider line
  const lineWidth = useTransform(scrollYProgress, [0.46, 0.52], ["0%", "60%"]);
  const lineOpacity = useTransform(scrollYProgress, [0.46, 0.52], [0, 1]);

  // CTAs
  const ctaOpacity = useTransform(scrollYProgress, [0.7, 0.76], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.7, 0.76], [20, 0]);

  return (
    <div ref={sectionRef} className="relative bg-[#0A0A0F]">
      <div className="sticky top-0 h-screen flex items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-5xl mx-auto px-6 text-center">

          {/* Gooey MEET → VIGIL morph */}
          <motion.div
            style={{ opacity: vigilOpacity, scale: vigilScale }}
            className="mb-1"
          >
            <div className="h-[90px] md:h-[140px] flex items-center justify-center">
              <GooeyText
                texts={["MEET", "VIGIL"]}
                morphTime={1.2}
                cooldownTime={0.5}
                className="h-[90px] md:h-[140px]"
              />
            </div>
          </motion.div>

          {/* Tagline — scroll-linked word reveal */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight flex flex-wrap justify-center mb-6">
            {tagline.map((word, i) => {
              const start = 0.18 + (i / tagline.length) * 0.15;
              const end = start + 0.04;
              return (
                <RevealWord
                  key={i}
                  progress={scrollYProgress}
                  range={[start, end]}
                  className={word === "monitoring" ? "text-[#00D4AA]" : "text-[#FAFAFA]"}
                >
                  {word}
                </RevealWord>
              );
            })}
          </h2>

          {/* Problem statement — smaller scroll-linked reveal */}
          <p className="text-base md:text-lg leading-relaxed flex flex-wrap justify-center max-w-2xl mx-auto mb-12">
            {problem.map((word, i) => {
              const start = 0.35 + (i / problem.length) * 0.12;
              const end = start + 0.03;
              return (
                <RevealWord
                  key={i}
                  progress={scrollYProgress}
                  range={[start, end]}
                  className="text-zinc-400"
                >
                  {word}
                </RevealWord>
              );
            })}
          </p>

          {/* Divider line */}
          <motion.div
            style={{ width: lineWidth, opacity: lineOpacity }}
            className="mx-auto h-px bg-gradient-to-r from-transparent via-[#00D4AA]/30 to-transparent mb-12"
          />

          {/* Stats — big monospaced numbers with glow */}
          <div className="flex items-center justify-center gap-10 md:gap-16 mb-12">
            <GlowStat value="4" label="Sensors" progress={scrollYProgress} range={[0.50, 0.56]} />
            <div className="w-px h-10 bg-white/[0.08]" />
            <GlowStat value="<45g" label="Weight" progress={scrollYProgress} range={[0.53, 0.59]} />
            <div className="w-px h-10 bg-white/[0.08]" />
            <GlowStat value="$46" label="Per unit" progress={scrollYProgress} range={[0.56, 0.62]} />
            <div className="hidden md:block w-px h-10 bg-white/[0.08]" />
            <GlowStat value="5s" label="Cycles" progress={scrollYProgress} range={[0.59, 0.65]} />
          </div>

          {/* CTAs */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="flex items-center justify-center gap-4"
          >
            <MagneticButton>
              <HoverGlowButton
                href="/team#contact"
                className="bg-[#00D4AA] text-[#0A0A0F] font-semibold px-8 py-3.5 rounded-lg hover:shadow-[0_0_30px_rgba(0,212,170,0.3)] hover:brightness-110 transition-all duration-300"
              >
                Request a Pilot
              </HoverGlowButton>
            </MagneticButton>
            <MagneticButton>
              <a
                href="/workflow"
                className="border border-white/[0.15] text-[#FAFAFA] px-8 py-3.5 rounded-lg hover:bg-white/[0.05] hover:border-white/[0.25] transition-all duration-300"
              >
                Explore Workflow
              </a>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll height */}
      <div className="h-[160vh]" aria-hidden="true" />
    </div>
  );
}
