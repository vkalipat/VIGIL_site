"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import { HoverGlowButton } from "@/components/ui/hover-glow-button";

/* ── Word-by-word text reveal ─────────────────────────────────── */
function TextReveal({
  text,
  progress,
  range,
  className = "",
}: {
  text: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const words = text.split(" ");
  const span = range[1] - range[0];
  return (
    <p className={className}>
      {words.map((word, i) => {
        const start = range[0] + (i / words.length) * span;
        const end = start + span / words.length + 0.02;
        return <RevealWord key={i} word={word} progress={progress} range={[start, end]} />;
      })}
    </p>
  );
}

function RevealWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [12, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.3em] inline-block">
      {word}
    </motion.span>
  );
}

/* ── Slide from left ──────────────────────────────────────────── */
function SlideFromLeft({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const x = useTransform(progress, range, [-400, 0]);
  const opacity = useTransform(progress, range, [0, 1]);
  return <motion.div style={{ x, opacity }}>{children}</motion.div>;
}

/* ── SVG scratch-out effect ───────────────────────────────────── */
function ScratchOut({ progress }: { progress: MotionValue<number> }) {
  const pathLength1 = useTransform(progress, [0, 0.6], [0, 1]);
  const pathLength2 = useTransform(progress, [0.15, 0.75], [0, 1]);
  const pathLength3 = useTransform(progress, [0.3, 0.9], [0, 1]);
  const opacity = useTransform(progress, [0, 0.1], [0, 1]);

  return (
    <motion.svg
      style={{ opacity }}
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      fill="none"
    >
      {/* Main scratch — jagged line */}
      <motion.path
        d="M -10 48 Q 30 25, 70 52 Q 110 75, 150 45 Q 190 20, 230 55 Q 270 78, 310 42 Q 350 18, 410 50"
        stroke="rgba(0,212,170,0.6)"
        strokeWidth="3.5"
        strokeLinecap="round"
        style={{ pathLength: pathLength1 }}
      />
      {/* Second scratch — slightly offset */}
      <motion.path
        d="M -10 55 Q 40 30, 90 58 Q 140 80, 190 48 Q 240 22, 290 56 Q 340 76, 410 45"
        stroke="rgba(0,212,170,0.35)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ pathLength: pathLength2 }}
      />
      {/* Third thin scratch */}
      <motion.path
        d="M -10 42 Q 50 62, 100 40 Q 160 22, 220 50 Q 280 72, 340 38 Q 380 25, 410 52"
        stroke="rgba(0,212,170,0.2)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ pathLength: pathLength3 }}
      />
    </motion.svg>
  );
}

/* ── Scroll-driven flip comparison ────────────────────────────── */
function ScrollFlipComparison({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const [showVigil, setShowVigil] = useState(false);

  /* scratch draws across before the flip */
  const scratchProgress = useTransform(progress, [0.26, 0.34], [0, 1]);
  const compOpacity = useTransform(progress, [0.16, 0.22], [0, 1]);
  const compScale = useTransform(progress, [0.16, 0.22], [0.92, 1]);

  useMotionValueEvent(progress, "change", (v) => {
    setShowVigil(v > 0.36);
  });

  return (
    <div className="text-center">
      {/* Intro text — word by word */}
      <TextReveal
        text="Patients are checked every"
        progress={progress}
        range={[0.08, 0.16]}
        className="text-lg text-zinc-500 md:text-xl"
      />

      {/* Big number with scratch + flip */}
      <motion.div
        style={{ opacity: compOpacity, scale: compScale }}
        className="relative mx-auto mt-6 inline-block"
      >
        <AnimatePresence mode="wait">
          {!showVigil ? (
            <motion.div
              key="ward"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <p className="text-6xl font-bold tracking-tight text-zinc-400 md:text-[9rem] md:leading-none">
                4–8 hours
              </p>
              {/* SVG scratch overlay */}
              <ScratchOut progress={scratchProgress} />
            </motion.div>
          ) : (
            <motion.div
              key="vigil"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-6xl font-bold tracking-tight text-[#00D4AA] md:text-[9rem] md:leading-none">
                5 seconds
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label + detail */}
      <AnimatePresence mode="wait">
        {!showVigil ? (
          <motion.div
            key="ward-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-5"
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 md:text-sm">
              General Ward Standard
            </p>
            <p className="mt-1.5 text-sm text-zinc-600 md:text-base">
              3–6 spot checks per day
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="vigil-info"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-5"
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#7AE7D4] md:text-sm">
              With VIGIL
            </p>
            <p className="mt-1.5 text-sm text-[#00D4AA]/50 md:text-base">
              17,280 continuous readings per day
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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

  const ctaOpacity = useTransform(scrollYProgress, [0.54, 0.62], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.54, 0.62], [20, 0]);

  return (
    <div ref={sectionRef} className="relative bg-[#0A0A0F]">
      <div className="sticky top-0 relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
          {/* ── Scroll-driven flip ── */}
          <ScrollFlipComparison progress={scrollYProgress} />

          {/* ── Device specs — slide from left ── */}
          <div className="mt-16 space-y-5">
            <SlideFromLeft progress={scrollYProgress} range={[0.39, 0.45]}>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">
                Built with
              </p>
            </SlideFromLeft>

            <SlideFromLeft progress={scrollYProgress} range={[0.40, 0.46]}>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-zinc-700 md:w-16" />
                <span className="text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
                  4 sensors
                </span>
                <span className="text-sm text-zinc-500">
                  HR, SpO₂, temperature, respiratory
                </span>
              </div>
            </SlideFromLeft>

            <SlideFromLeft progress={scrollYProgress} range={[0.42, 0.48]}>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-zinc-700 md:w-16" />
                <span className="text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
                  45 grams
                </span>
                <span className="text-sm text-zinc-500">
                  lightweight enough to wear all night
                </span>
              </div>
            </SlideFromLeft>

            <SlideFromLeft progress={scrollYProgress} range={[0.44, 0.50]}>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#00D4AA]/30 md:w-16" />
                <span className="text-xl font-semibold tracking-tight text-[#00D4AA] md:text-2xl">
                  100x cheaper
                </span>
                <span className="text-sm text-[#00D4AA]/50">
                  than traditional ICU monitoring
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
