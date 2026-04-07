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
        return (
          <WordReveal
            key={i}
            word={word}
            progress={progress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

function WordReveal({
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

/* ── Beam wipe effect ─────────────────────────────────────────── */
function BeamWipe({ progress }: { progress: MotionValue<number> }) {
  /* beam position: sweeps left → right */
  const beamLeft = useTransform(progress, [0, 1], ["-8%", "108%"]);
  /* dim overlay grows behind the beam */
  const dimWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  /* thin strikethrough line follows the beam */
  const lineWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(progress, [0, 0.05], [0, 1]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none">
      {/* Glowing beam */}
      <motion.div
        style={{ left: beamLeft }}
        className="absolute top-0 bottom-0 z-10 w-12 -translate-x-1/2 md:w-20"
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-[#00D4AA]/40 to-transparent blur-md" />
      </motion.div>

      {/* Dim overlay behind the beam */}
      <motion.div
        style={{ width: dimWidth }}
        className="absolute inset-y-0 left-0 z-[5] bg-[#0A0A0F]/75"
      />

      {/* Clean strikethrough line */}
      <motion.div
        style={{ width: lineWidth }}
        className="absolute left-0 top-[52%] z-10 h-[2px] bg-gradient-to-r from-[#00D4AA]/60 via-[#00D4AA]/40 to-[#00D4AA]/60 md:h-[3px]"
      />
    </motion.div>
  );
}

/* ── Scroll-driven flip comparison ────────────────────────────── */
function ScrollFlipComparison({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const [showVigil, setShowVigil] = useState(false);

  const wipeProgress = useTransform(progress, [0.32, 0.47], [0, 1]);
  const compOpacity = useTransform(progress, [0.20, 0.28], [0, 1]);
  const compScale = useTransform(progress, [0.20, 0.28], [0.92, 1]);

  useMotionValueEvent(progress, "change", (v) => {
    setShowVigil(v > 0.50);
  });

  return (
    <div className="text-center">
      {/* Intro text — word by word */}
      <TextReveal
        text="Patients are checked every"
        progress={progress}
        range={[0.10, 0.20]}
        className="text-lg text-zinc-500 md:text-xl"
      />

      {/* Big number with beam wipe + flip */}
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
              <BeamWipe progress={wipeProgress} />
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
            <p className="text-xl font-bold uppercase tracking-[0.15em] text-zinc-500 md:text-3xl">
              With General Wards
            </p>
            <p className="mt-2 text-sm text-zinc-600 md:text-base">
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
            <p className="text-xl font-bold uppercase tracking-[0.15em] text-[#00D4AA] md:text-3xl">
              With VIGIL
            </p>
            <p className="mt-2 text-sm text-[#00D4AA]/50 md:text-base">
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

  const ctaOpacity = useTransform(scrollYProgress, [0.78, 0.86], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.78, 0.86], [20, 0]);

  return (
    <div ref={sectionRef} className="relative bg-[#0A0A0F]">
      <div className="sticky top-0 relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
          {/* ── Scroll-driven flip ── */}
          <ScrollFlipComparison progress={scrollYProgress} />

          {/* ── Device specs — slide from left ── */}
          <div className="mt-16 space-y-5">
            <SlideFromLeft progress={scrollYProgress} range={[0.56, 0.64]}>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">
                Built with
              </p>
            </SlideFromLeft>

            <SlideFromLeft progress={scrollYProgress} range={[0.58, 0.66]}>
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

            <SlideFromLeft progress={scrollYProgress} range={[0.62, 0.70]}>
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

            <SlideFromLeft progress={scrollYProgress} range={[0.66, 0.74]}>
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

      <div className="h-[250vh]" aria-hidden="true" />
    </div>
  );
}
