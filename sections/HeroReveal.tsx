"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
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

/* ── Flip comparison ──────────────────────────────────────────── */
const STATES = [
  {
    value: "4–8h",
    label: "General Ward",
    detail: "3–6 spot checks per day",
    accent: false,
  },
  {
    value: "5s",
    label: "With VIGIL",
    detail: "17,280 continuous readings per day",
    accent: true,
  },
];

function FlipComparison() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % 2), 3500);
    return () => clearInterval(id);
  }, []);

  const state = STATES[index];

  return (
    <div className="text-left">
      <p className="text-sm text-zinc-500">Patients are checked every</p>

      {/* Big flipping number */}
      <div className="relative mt-2 h-[72px] overflow-hidden md:h-[96px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={state.value}
            initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`absolute text-6xl font-bold tracking-tight md:text-8xl ${
              state.accent ? "text-[#00D4AA]" : "text-zinc-400"
            }`}
          >
            {state.value}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Flipping labels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="mt-1"
        >
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.28em] ${
              state.accent ? "text-[#7AE7D4]" : "text-zinc-500"
            }`}
          >
            {state.label}
          </p>
          <p
            className={`mt-1 text-sm ${
              state.accent ? "text-[#00D4AA]/50" : "text-zinc-600"
            }`}
          >
            {state.detail}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Active indicator dots */}
      <div className="mt-4 flex gap-1.5">
        {STATES.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index
                ? i === 1
                  ? "w-6 bg-[#00D4AA]"
                  : "w-6 bg-zinc-400"
                : "w-1 bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────── */
export default function HeroReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const ctaOpacity = useTransform(scrollYProgress, [0.58, 0.66], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.58, 0.66], [20, 0]);

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

          {/* ── Flip comparison — slides from left ── */}
          <SlideFromLeft progress={scrollYProgress} range={[0.33, 0.43]}>
            <div className="mt-14 flex items-center gap-8 md:gap-12">
              <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-zinc-600 md:block" />
              <FlipComparison />
            </div>
          </SlideFromLeft>

          {/* ── Device specs — staggered from left ── */}
          <div className="mt-14 space-y-4">
            <SlideFromLeft progress={scrollYProgress} range={[0.46, 0.52]}>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">
                One headband
              </p>
            </SlideFromLeft>

            <SlideFromLeft progress={scrollYProgress} range={[0.47, 0.53]}>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-zinc-700 md:w-16" />
                <span className="text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
                  4
                </span>
                <span className="text-sm text-zinc-500">
                  sensors — HR, SpO₂, temperature, respiratory
                </span>
              </div>
            </SlideFromLeft>

            <SlideFromLeft progress={scrollYProgress} range={[0.49, 0.55]}>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-zinc-700 md:w-16" />
                <span className="text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
                  &lt;45g
                </span>
                <span className="text-sm text-zinc-500">
                  lightweight enough to wear all night
                </span>
              </div>
            </SlideFromLeft>

            <SlideFromLeft progress={scrollYProgress} range={[0.51, 0.57]}>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#00D4AA]/30 md:w-16" />
                <span className="text-xl font-semibold tracking-tight text-[#00D4AA] md:text-2xl">
                  $46
                </span>
                <span className="text-sm text-[#00D4AA]/50">
                  per unit — fraction of ICU equipment
                </span>
              </div>
            </SlideFromLeft>
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
