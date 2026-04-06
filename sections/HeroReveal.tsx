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

const TAGLINE = "Continuous ICU-grade monitoring at ultra-low cost.".split(" ");

const STATS = [
  { value: "4", label: "Sensors", range: [0.52, 0.58] as [number, number] },
  { value: "<45g", label: "Weight", range: [0.54, 0.60] as [number, number] },
  { value: "$46", label: "Per unit", range: [0.56, 0.62] as [number, number] },
  { value: "5s", label: "Refresh", range: [0.58, 0.64] as [number, number] },
];

/* ── Word-reveal ──────────────────────────────────────────────── */
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

/* ── Inline stat ──────────────────────────────────────────────── */
function StatItem({
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
  const y = useTransform(progress, range, [10, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="flex items-baseline gap-1.5"
    >
      <span className="text-lg font-semibold tracking-tight text-[#FAFAFA] md:text-xl">
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
    </motion.div>
  );
}

/* ── Main component ───────────────────────────────────────────── */
export default function HeroReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const panelOpacity = useTransform(scrollYProgress, [0.30, 0.38], [0, 1]);
  const panelY = useTransform(scrollYProgress, [0.30, 0.38], [28, 0]);
  const compOpacity = useTransform(scrollYProgress, [0.38, 0.46], [0, 1]);
  const compY = useTransform(scrollYProgress, [0.38, 0.46], [24, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.62, 0.70], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.62, 0.70], [12, 0]);

  return (
    <div ref={sectionRef} className="relative bg-[#0A0A0F]">
      <style
        dangerouslySetInnerHTML={{
          __html: [
            `@keyframes glow-pulse{0%,100%{text-shadow:0 0 20px rgba(0,212,170,0.3)}50%{text-shadow:0 0 40px rgba(0,212,170,0.5),0 0 80px rgba(0,212,170,0.15)}}`,
            `@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`,
          ].join(""),
        }}
      />

      <div className="sticky top-0 relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 text-center md:py-24">
          {/* Tagline word reveal */}
          <h2 className="mx-auto flex max-w-5xl flex-wrap justify-center text-3xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-[5.5rem]">
            {TAGLINE.map((word, i) => {
              const start = 0.18 + (i / TAGLINE.length) * 0.15;
              return (
                <RevealWord
                  key={i}
                  progress={scrollYProgress}
                  range={[start, start + 0.04]}
                  className={
                    word === "monitoring"
                      ? "text-[#00D4AA]"
                      : "text-[#FAFAFA]"
                  }
                >
                  {word}
                </RevealWord>
              );
            })}
          </h2>

          {/* Description */}
          <motion.p
            style={{ opacity: panelOpacity, y: panelY }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base"
          >
            General ward patients are monitored every 4–8 hours. VIGIL
            monitors every 5 seconds. Four sensors. One headband. Under $50.
          </motion.p>

          {/* ── Side-by-side comparison ── */}
          <motion.div
            style={{ opacity: compOpacity, y: compY }}
            className="mx-auto mt-12 grid max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-12"
          >
            {/* General Ward */}
            <div className="text-right">
              <p className="text-5xl font-bold tracking-tight text-zinc-300 md:text-7xl">
                4–8h
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                General Ward
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                3–6 spot checks per day
              </p>
            </div>

            {/* Animated divider */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent md:h-14" />
              <div className="relative h-2.5 w-2.5">
                <div className="absolute inset-0 animate-ping rounded-full bg-[#00D4AA] opacity-30" />
                <div className="relative h-2.5 w-2.5 rounded-full bg-[#00D4AA]" />
              </div>
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-[#00D4AA]/20 to-transparent md:h-14" />
            </div>

            {/* VIGIL */}
            <div className="text-left">
              <p
                className="text-5xl font-bold tracking-tight text-[#00D4AA] md:text-7xl"
                style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
              >
                5s
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#7AE7D4]">
                VIGIL
              </p>
              <p className="mt-1 text-xs text-[#00D4AA]/40">
                17,280 continuous readings
              </p>
            </div>
          </motion.div>

          {/* Shimmer line */}
          <motion.div
            style={{ opacity: compOpacity }}
            className="mx-auto mt-10 h-px max-w-3xl"
            aria-hidden="true"
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(161,161,170,0.15) 20%, rgba(0,212,170,0.35) 50%, rgba(161,161,170,0.15) 80%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 4s ease-in-out infinite",
              }}
            />
          </motion.div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {STATS.map((s) => (
              <StatItem
                key={s.label}
                value={s.value}
                label={s.label}
                progress={scrollYProgress}
                range={s.range}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <MagneticButton>
              <HoverGlowButton
                href="/team#contact"
                className="rounded-full bg-[#00D4AA] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(0,212,170,0.25)]"
              >
                Request a Pilot
              </HoverGlowButton>
            </MagneticButton>
            <MagneticButton>
              <a
                href="/workflow"
                className="px-3 py-2 text-sm text-zinc-300 transition-colors duration-300 hover:text-[#FAFAFA]"
              >
                Explore Workflow
              </a>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <div className="h-[150vh]" aria-hidden="true" />
    </div>
  );
}
