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
  { value: "4", label: "Sensors", range: [0.56, 0.62] as [number, number] },
  { value: "<45g", label: "Weight", range: [0.58, 0.64] as [number, number] },
  { value: "$46", label: "Per unit", range: [0.60, 0.66] as [number, number] },
  { value: "5s", label: "Refresh", range: [0.62, 0.68] as [number, number] },
];

/* deterministic pseudo-random: same value every render for a given index */
function hash(i: number, seed = 0) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* ── Word-reveal used in the tagline ──────────────────────────── */
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

/* ── Animated signal bars ─────────────────────────────────────── */
const BAR_COUNT = 48;

function SignalBars({
  type,
  progress,
  range,
}: {
  type: "sparse" | "continuous";
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [20, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="relative flex h-14 items-end gap-[1.5px] overflow-hidden"
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        if (type === "sparse") {
          const active = i % 12 === 0;
          const h = active ? 30 + hash(i) * 50 : 5 + hash(i, 1) * 5;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-[1px]"
              style={{
                height: `${h}%`,
                transformOrigin: "bottom",
                backgroundColor: active
                  ? "rgba(161,161,170,0.6)"
                  : "rgba(255,255,255,0.03)",
                animation: active
                  ? `hero-bar 2.8s ease-in-out ${hash(i, 2) * 2}s infinite alternate`
                  : "none",
              }}
            />
          );
        }
        const h = 20 + hash(i) * 70;
        const o = 0.35 + hash(i, 1) * 0.65;
        return (
          <div
            key={i}
            className="flex-1 rounded-t-[1px]"
            style={{
              height: `${h}%`,
              transformOrigin: "bottom",
              backgroundColor: `rgba(0,212,170,${o})`,
              animation: `hero-bar ${0.5 + hash(i, 2) * 0.7}s ease-in-out ${hash(i, 3) * 0.6}s infinite alternate`,
            }}
          />
        );
      })}

      {type === "continuous" && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#00D4AA]/[0.06] to-transparent" />
      )}
    </motion.div>
  );
}

/* ── Stat card ────────────────────────────────────────────────── */
function StatCard({
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
  const y = useTransform(progress, range, [16, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-center transition-colors duration-500 hover:border-[#00D4AA]/20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00D4AA]/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <p className="text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
        {value}
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </p>
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

  const panelOpacity = useTransform(scrollYProgress, [0.34, 0.42], [0, 1]);
  const panelY = useTransform(scrollYProgress, [0.34, 0.42], [28, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.66, 0.74], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.66, 0.74], [12, 0]);

  return (
    <div ref={sectionRef} className="relative bg-[#0A0A0F]">
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes hero-bar{0%{transform:scaleY(1)}100%{transform:scaleY(.35)}}`,
        }}
      />

      <div className="sticky top-0 relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center md:py-24">
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

          {/* ── Monitoring comparison panel ── */}
          <motion.div
            style={{ opacity: panelOpacity, y: panelY }}
            className="mx-auto mt-10 max-w-4xl"
          >
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
              General ward patients are monitored every 4–8 hours. VIGIL
              monitors every 5 seconds. Four sensors. One headband. Under $50.
            </p>

            {/* Signal comparison */}
            <div className="mt-10 space-y-3">
              {/* General Ward */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 md:p-6">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                    General Ward
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-semibold tracking-tight text-[#FAFAFA] md:text-3xl">
                      4–8h
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                      spot checks
                    </span>
                  </div>
                </div>
                <SignalBars
                  type="sparse"
                  progress={scrollYProgress}
                  range={[0.42, 0.50]}
                />
                <p className="mt-3 text-right font-mono text-[10px] tracking-[0.2em] text-zinc-600">
                  3–6 readings / day
                </p>
              </div>

              {/* VIGIL */}
              <div className="rounded-2xl border border-[#00D4AA]/[0.12] bg-[#00D4AA]/[0.03] p-5 shadow-[0_0_40px_-10px_rgba(0,212,170,0.12)] md:p-6">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#7AE7D4]">
                    VIGIL
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-semibold tracking-tight text-[#00D4AA] md:text-3xl">
                      5s
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00D4AA]/50">
                      continuous
                    </span>
                  </div>
                </div>
                <SignalBars
                  type="continuous"
                  progress={scrollYProgress}
                  range={[0.48, 0.56]}
                />
                <p className="mt-3 text-right font-mono text-[10px] tracking-[0.2em] text-[#00D4AA]/40">
                  17,280 readings / day
                </p>
              </div>
            </div>

            {/* Stat cards */}
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {STATS.map((s) => (
                <StatCard
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
          </motion.div>
        </div>
      </div>

      <div className="h-[150vh]" aria-hidden="true" />
    </div>
  );
}
