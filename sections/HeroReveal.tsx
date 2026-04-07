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

/* ── Scroll-driven flip comparison ────────────────────────────── */
function ScrollFlipComparison({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const [showVigil, setShowVigil] = useState(false);

  /* strikethrough line animates before the flip */
  const strikeScaleX = useTransform(progress, [0.40, 0.45], [0, 1]);
  const compOpacity = useTransform(progress, [0.33, 0.38], [0, 1]);
  const compY = useTransform(progress, [0.33, 0.38], [40, 0]);

  useMotionValueEvent(progress, "change", (v) => {
    setShowVigil(v > 0.47);
  });

  return (
    <motion.div
      style={{ opacity: compOpacity, y: compY }}
      className="mt-12 text-center"
    >
      <p className="text-base text-zinc-500 md:text-lg">
        Patients are checked every
      </p>

      {/* Big number with flip */}
      <div className="relative mx-auto mt-4 inline-block">
        <AnimatePresence mode="wait">
          {!showVigil ? (
            <motion.div
              key="ward"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <p className="text-7xl font-bold tracking-tight text-zinc-400 md:text-[10rem] md:leading-none">
                4–8h
              </p>
              {/* Strikethrough */}
              <motion.div
                style={{ scaleX: strikeScaleX }}
                className="absolute left-[-4%] right-[-4%] top-[55%] h-[3px] origin-left rounded-full bg-[#00D4AA]/70 md:h-1"
              />
            </motion.div>
          ) : (
            <motion.div
              key="vigil"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="text-7xl font-bold tracking-tight text-[#00D4AA] md:text-[10rem] md:leading-none">
                5s
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label + detail */}
      <AnimatePresence mode="wait">
        {!showVigil ? (
          <motion.div
            key="ward-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 md:text-sm">
              General Ward
            </p>
            <p className="mt-1 text-sm text-zinc-600 md:text-base">
              3–6 spot checks per day
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="vigil-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4"
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#7AE7D4] md:text-sm">
              With VIGIL
            </p>
            <p className="mt-1 text-sm text-[#00D4AA]/50 md:text-base">
              17,280 continuous readings per day
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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

  const ctaOpacity = useTransform(scrollYProgress, [0.62, 0.70], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.62, 0.70], [20, 0]);

  return (
    <div ref={sectionRef} className="relative bg-[#0A0A0F]">
      <div className="sticky top-0 relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
          {/* Tagline word reveal */}
          <h2 className="mx-auto flex max-w-5xl flex-wrap justify-center text-center text-3xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-[5.5rem]">
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

          {/* ── Scroll-driven flip ── */}
          <ScrollFlipComparison progress={scrollYProgress} />

          {/* ── Device specs — slide from left ── */}
          <div className="mt-16 space-y-5">
            <SlideFromLeft progress={scrollYProgress} range={[0.50, 0.56]}>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">
                Built with
              </p>
            </SlideFromLeft>

            <SlideFromLeft progress={scrollYProgress} range={[0.51, 0.57]}>
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

            <SlideFromLeft progress={scrollYProgress} range={[0.53, 0.59]}>
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

            <SlideFromLeft progress={scrollYProgress} range={[0.55, 0.61]}>
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
