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
  return (
    <motion.div
      style={{ x, opacity, willChange: "transform, opacity" }}
      className="transform-gpu"
    >
      {children}
    </motion.div>
  );
}

/* ── Enhanced beam wipe ───────────────────────────────────────── */
function BeamWipe({ progress }: { progress: MotionValue<number> }) {
  const beamLeft = useTransform(progress, [0, 1], ["-10%", "110%"]);
  const dimWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const lineWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(progress, [0, 0.05], [0, 1]);
  /* text fades as the wipe progresses */
  const textDim = useTransform(progress, [0.2, 0.9], [1, 0.25]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none">
      {/* Outer glow halo */}
      <motion.div
        style={{ left: beamLeft }}
        className="absolute top-[-20%] bottom-[-20%] z-10 w-24 -translate-x-1/2 md:w-40"
      >
        <div className="h-full w-full rounded-full bg-[#00D4AA]/10 blur-2xl" />
      </motion.div>

      {/* Core beam */}
      <motion.div
        style={{ left: beamLeft }}
        className="absolute top-[-10%] bottom-[-10%] z-10 w-10 -translate-x-1/2 md:w-16"
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-[#00D4AA]/50 to-transparent blur-md" />
      </motion.div>

      {/* Sharp beam center line */}
      <motion.div
        style={{ left: beamLeft }}
        className="absolute top-0 bottom-0 z-10 w-[2px] -translate-x-1/2 bg-[#00D4AA]/80 md:w-[3px]"
      />

      {/* Dim overlay */}
      <motion.div
        style={{ width: dimWidth }}
        className="absolute inset-y-0 left-0 z-[5] bg-[#0A0A0F]/70 backdrop-blur-[1px]"
      />

      {/* Strikethrough line */}
      <motion.div
        style={{ width: lineWidth }}
        className="absolute left-0 top-[52%] z-10 h-[2px] md:h-[3px]"
      >
        <div className="h-full w-full bg-gradient-to-r from-[#00D4AA]/50 via-[#00D4AA]/30 to-[#00D4AA]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D4AA]/30 via-[#00D4AA]/15 to-[#00D4AA]/30 blur-sm" />
      </motion.div>

      {/* Text dimming layer */}
      <motion.div
        style={{ opacity: useTransform(progress, [0, 0.3, 1], [0, 0, 0.5]) }}
        className="absolute inset-0 z-[4] bg-[#0A0A0F]/40"
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
              exit={{ opacity: 0, scale: 1.06, filter: "blur(16px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <p className="font-display text-6xl font-bold tracking-tight text-zinc-400 md:text-[9rem] md:leading-none">
                4–8 hours
              </p>
              <BeamWipe progress={wipeProgress} />
            </motion.div>
          ) : (
            <motion.div
              key="vigil"
              initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <p
                className="font-display text-6xl font-bold tracking-tight text-[#00D4AA] md:text-[9rem] md:leading-none"
                style={{
                  textShadow:
                    "0 0 30px rgba(0,212,170,0.4), 0 0 60px rgba(0,212,170,0.15), 0 0 120px rgba(0,212,170,0.05)",
                }}
              >
                5 seconds
              </p>
              {/* Radial glow burst behind the text on entry */}
              <motion.div
                initial={{ opacity: 0.6, scale: 0.5 }}
                animate={{ opacity: 0, scale: 2.5 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
              >
                <div className="h-32 w-64 rounded-full bg-[#00D4AA]/15 blur-3xl md:h-48 md:w-96" />
              </motion.div>
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
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-5"
          >
            <p className="font-display text-xl font-bold uppercase tracking-[0.15em] text-zinc-500 md:text-3xl">
              With General Wards
            </p>
            <p className="mt-2 text-sm text-zinc-600 md:text-base">
              3–6 spot checks per day
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="vigil-info"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5"
          >
            <p
              className="font-display text-xl font-bold uppercase tracking-[0.15em] text-[#00D4AA] md:text-3xl"
              style={{
                textShadow: "0 0 20px rgba(0,212,170,0.25)",
              }}
            >
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

          {/* ── Device specs — staggered viewport entry ── */}
          <motion.div
            className="mt-16 space-y-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.p
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600"
              variants={{
                hidden: { opacity: 0, x: -60 },
                show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
            >
              Built with
            </motion.p>

            <motion.div
              className="flex items-center gap-3"
              variants={{
                hidden: { opacity: 0, x: -60 },
                show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
            >
              <div className="h-px w-8 bg-zinc-700 md:w-16" />
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
              <span className="font-display text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
                4 sensors
              </span>
              <span className="text-sm text-zinc-500">
                HR, SpO₂, temperature, respiratory
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-3"
              variants={{
                hidden: { opacity: 0, x: -60 },
                show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
            >
              <div className="h-px w-8 bg-zinc-700 md:w-16" />
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
              <span className="font-display text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl">
                45 grams
              </span>
              <span className="text-sm text-zinc-500">
                lightweight enough to wear all night
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-3"
              variants={{
                hidden: { opacity: 0, x: -60 },
                show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
            >
              <div className="h-px w-8 bg-[#00D4AA]/30 md:w-16" />
              <div
                className="h-1.5 w-1.5 rounded-full bg-[#00D4AA]"
                style={{ boxShadow: "0 0 6px rgba(0,212,170,0.5)" }}
              />
              <span
                className="font-display text-xl font-semibold tracking-tight text-[#00D4AA] md:text-2xl"
                style={{ textShadow: "0 0 12px rgba(0,212,170,0.2)" }}
              >
                100x cheaper
              </span>
              <span className="text-sm text-[#00D4AA]/50">
                than traditional ICU monitoring
              </span>
            </motion.div>
          </motion.div>

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
