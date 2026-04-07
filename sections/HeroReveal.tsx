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

/* ── Slide-in primitives ──────────────────────────────────────── */
function SlideFromLeft({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const x = useTransform(progress, range, [-500, 0]);
  const opacity = useTransform(progress, range, [0, 1]);
  const rotate = useTransform(progress, range, [-1.5, 0]);
  return (
    <motion.div style={{ x, opacity, rotate }}>{children}</motion.div>
  );
}

function SlideFromRight({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const x = useTransform(progress, range, [500, 0]);
  const opacity = useTransform(progress, range, [0, 1]);
  const rotate = useTransform(progress, range, [1.5, 0]);
  return (
    <motion.div style={{ x, opacity, rotate }}>{children}</motion.div>
  );
}

/* ── Main component ───────────────────────────────────────────── */
export default function HeroReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* scan line between comparisons */
  const lineScale = useTransform(scrollYProgress, [0.38, 0.46], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.38, 0.43, 0.54, 0.58], [0, 0.6, 0.6, 0]);

  const ctaOpacity = useTransform(scrollYProgress, [0.62, 0.70], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.62, 0.70], [20, 0]);

  return (
    <div ref={sectionRef} className="relative bg-[#0A0A0F]">
      <div className="sticky top-0 relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
          {/* Tagline word reveal */}
          <h2 className="mx-auto flex max-w-5xl flex-wrap justify-center text-3xl font-bold leading-[1.05] tracking-tight text-center md:text-5xl lg:text-[5.5rem]">
            {TAGLINE.map((word, i) => {
              const start = 0.15 + (i / TAGLINE.length) * 0.15;
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

          {/* ── General Ward — slides from left ── */}
          <SlideFromLeft progress={scrollYProgress} range={[0.33, 0.43]}>
            <div className="mt-16 flex items-center gap-6 md:gap-10">
              <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-zinc-600 md:block" />
              <div className="shrink-0 text-left md:text-right">
                <p className="text-5xl font-bold tracking-tight text-zinc-400 md:text-7xl">
                  4–8h
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                  General Ward · 3–6 spot checks / day
                </p>
              </div>
            </div>
          </SlideFromLeft>

          {/* Scan line */}
          <motion.div
            style={{ scaleX: lineScale, opacity: lineOpacity }}
            className="mx-auto mt-5 h-px max-w-2xl origin-left bg-gradient-to-r from-zinc-600 via-[#00D4AA]/60 to-zinc-600"
          />

          {/* ── VIGIL — slides from right ── */}
          <SlideFromRight progress={scrollYProgress} range={[0.39, 0.49]}>
            <div className="mt-5 flex items-center gap-6 md:gap-10">
              <div className="shrink-0 text-left">
                <p className="text-5xl font-bold tracking-tight text-[#00D4AA] md:text-7xl">
                  5s
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#7AE7D4]">
                  VIGIL · 17,280 readings / day
                </p>
              </div>
              <div className="hidden h-px flex-1 bg-gradient-to-r from-[#00D4AA]/40 via-[#00D4AA]/15 to-transparent md:block" />
            </div>
          </SlideFromRight>

          {/* ── Stats — alternating sides ── */}
          <div className="mt-14 space-y-5">
            <SlideFromLeft progress={scrollYProgress} range={[0.48, 0.54]}>
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-zinc-700 md:w-20" />
                <span className="text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
                  4
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Sensors
                </span>
              </div>
            </SlideFromLeft>

            <SlideFromRight progress={scrollYProgress} range={[0.50, 0.56]}>
              <div className="flex items-center justify-end gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Weight
                </span>
                <span className="text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
                  &lt;45g
                </span>
                <div className="h-px w-10 bg-zinc-700 md:w-20" />
              </div>
            </SlideFromRight>

            <SlideFromLeft progress={scrollYProgress} range={[0.52, 0.58]}>
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-zinc-700 md:w-20" />
                <span className="text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
                  $46
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Per Unit
                </span>
              </div>
            </SlideFromLeft>

            <SlideFromRight progress={scrollYProgress} range={[0.54, 0.60]}>
              <div className="flex items-center justify-end gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Refresh
                </span>
                <span className="text-xl font-semibold tracking-tight text-[#00D4AA] md:text-2xl">
                  5s
                </span>
                <div className="h-px w-10 bg-[#00D4AA]/30 md:w-20" />
              </div>
            </SlideFromRight>
          </div>

          {/* CTA */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
