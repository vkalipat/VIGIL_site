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

/* ── Main component ───────────────────────────────────────────── */
export default function HeroReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const gridOpacity = useTransform(scrollYProgress, [0.32, 0.40], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0.32, 0.40], [30, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.58, 0.66], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.58, 0.66], [12, 0]);

  return (
    <div ref={sectionRef} className="relative bg-[#0A0A0F]">
      <div className="sticky top-0 relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-center md:py-24">
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

          {/* ── Bento grid ── */}
          <motion.div
            style={{ opacity: gridOpacity, y: gridY }}
            className="mx-auto mt-10 grid max-w-5xl gap-2.5 md:grid-cols-6 md:grid-rows-2"
          >
            {/* General Ward — spans 2 cols */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:col-span-2 md:row-span-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                  General Ward
                </p>
                <p className="mt-3 text-5xl font-bold tracking-tight text-zinc-400 md:text-6xl">
                  4–8h
                </p>
              </div>
              <div className="mt-6">
                <p className="text-sm text-zinc-500">Intermittent spot checks</p>
                <p className="mt-1 font-mono text-xs text-zinc-600">
                  3–6 readings / day
                </p>
              </div>
            </div>

            {/* VIGIL — spans 2 cols, border beam */}
            <div className="relative overflow-hidden rounded-2xl p-px md:col-span-2 md:row-span-2">
              <div
                className="absolute -inset-[200px] animate-[spin_8s_linear_infinite]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, transparent 78%, rgba(0,212,170,0.25) 88%, rgba(0,212,170,0.5) 94%, transparent 100%)",
                }}
              />
              <div className="relative flex h-full flex-col justify-between rounded-2xl bg-[#0c0c12] p-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#7AE7D4]">
                    VIGIL
                  </p>
                  <p className="mt-3 text-5xl font-bold tracking-tight text-[#00D4AA] md:text-6xl">
                    5s
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-[#00D4AA]/60">
                    Continuous monitoring
                  </p>
                  <p className="mt-1 font-mono text-xs text-[#00D4AA]/30">
                    17,280 readings / day
                  </p>
                </div>
              </div>
            </div>

            {/* Stats — 2 cols, 2 rows of 2 */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <p className="text-2xl font-bold tracking-tight text-[#FAFAFA] md:text-3xl">
                4
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Sensors
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <p className="text-2xl font-bold tracking-tight text-[#FAFAFA] md:text-3xl">
                &lt;45g
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Weight
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <p className="text-2xl font-bold tracking-tight text-[#FAFAFA] md:text-3xl">
                $46
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Per Unit
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <p className="text-2xl font-bold tracking-tight text-[#FAFAFA] md:text-3xl">
                5s
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Refresh
              </p>
            </div>
          </motion.div>

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
