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
import { cn } from "@/lib/utils";

const TAGLINE = "Continuous ICU-grade monitoring at ultra-low cost.".split(" ");
const TRACK_MARKS = Array.from({ length: 12 }, (_, index) => index);
const DEPLOYMENT_STATS = [
  {
    value: "4",
    label: "Sensors",
    range: [0.54, 0.6] as [number, number],
  },
  {
    value: "<45g",
    label: "Weight",
    range: [0.58, 0.64] as [number, number],
  },
  {
    value: "$46",
    label: "Per unit",
    range: [0.62, 0.68] as [number, number],
  },
  {
    value: "5s",
    label: "Refresh",
    range: [0.66, 0.72] as [number, number],
  },
];

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

function CadenceRow({
  label,
  value,
  meta,
  emphasis = false,
  progress,
  range,
}: {
  label: string;
  value: string;
  meta: string;
  emphasis?: boolean;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [16, 0]);
  const trackOpacity = useTransform(progress, range, [0.2, 1]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="grid gap-3 py-4 md:grid-cols-[8rem_minmax(0,1fr)_auto] md:items-center"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500">
        {label}
      </div>

      <div>
        <div
          className={cn(
            "flex flex-wrap items-baseline gap-x-3 gap-y-1",
            emphasis ? "text-[#FAFAFA]" : "text-zinc-200"
          )}
        >
          <span
            className={cn(
              "text-2xl font-semibold tracking-tight md:text-3xl",
              emphasis ? "text-[#00D4AA]" : "text-[#FAFAFA]"
            )}
          >
            {value}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            {meta}
          </span>
        </div>

        <motion.div style={{ opacity: trackOpacity }} className="mt-3">
          <div className="grid grid-cols-12 gap-1.5">
            {TRACK_MARKS.map((index) => {
              const isSparsePulse = index === 1 || index === 6 || index === 10;

              return (
                <div
                  key={index}
                  className={cn(
                    "h-[3px] rounded-full",
                    emphasis
                      ? "bg-gradient-to-r from-[#00D4AA]/20 via-[#00D4AA]/55 to-[#00D4AA]"
                      : isSparsePulse
                        ? "bg-white/35"
                        : "bg-white/[0.06]"
                  )}
                />
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 md:text-right">
        {emphasis ? "17,280/day" : "3-6/day"}
      </div>
    </motion.div>
  );
}

function DeploymentStat({
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
  const y = useTransform(progress, range, [14, 0]);

  return (
    <motion.div style={{ opacity, y }} className="space-y-2">
      <p className="text-2xl font-semibold tracking-tight text-[#FAFAFA] md:text-3xl">
        {value}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </p>
    </motion.div>
  );
}

export default function HeroReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const vigilOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);
  const vigilScale = useTransform(scrollYProgress, [0.05, 0.12], [0.9, 1]);
  const panelOpacity = useTransform(scrollYProgress, [0.34, 0.42], [0, 1]);
  const panelY = useTransform(scrollYProgress, [0.34, 0.42], [36, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.68, 0.74], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.68, 0.74], [16, 0]);

  return (
    <div ref={sectionRef} className="relative bg-[#0A0A0F]">
      <div className="sticky top-0 relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center md:py-24">
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

          <h2 className="mx-auto flex max-w-5xl flex-wrap justify-center text-3xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-[5.5rem]">
            {TAGLINE.map((word, i) => {
              const start = 0.18 + (i / TAGLINE.length) * 0.15;
              const end = start + 0.04;

              return (
                <RevealWord
                  key={i}
                  progress={scrollYProgress}
                  range={[start, end]}
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

          <motion.div
            style={{ opacity: panelOpacity, y: panelY }}
            className="mx-auto mt-8 max-w-4xl text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00D4AA]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-400">
                Monitoring gap
              </span>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
              General ward patients are monitored every 4-8 hours. VIGIL
              monitors every 5 seconds. Four sensors. One headband. Under $50.
            </p>

            <div className="mt-6 border-y border-white/[0.08]">
              <CadenceRow
                label="General ward"
                value="Every 4-8 hours"
                meta="Spot checks"
                progress={scrollYProgress}
                range={[0.44, 0.52]}
              />
              <div className="border-t border-white/[0.08]" />
              <CadenceRow
                label="VIGIL"
                value="Every 5 seconds"
                meta="Continuous monitoring"
                emphasis
                progress={scrollYProgress}
                range={[0.49, 0.57]}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
              {DEPLOYMENT_STATS.map((stat) => (
                <DeploymentStat
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  progress={scrollYProgress}
                  range={stat.range}
                />
              ))}
            </div>

            <motion.div
              style={{ opacity: ctaOpacity, y: ctaY }}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <MagneticButton>
                <HoverGlowButton
                  href="/team#contact"
                  className="rounded-lg bg-[#00D4AA] px-6 py-3 text-sm font-semibold text-[#0A0A0F] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(0,212,170,0.3)] sm:px-8 sm:py-3.5 sm:text-base"
                >
                  Request a Pilot
                </HoverGlowButton>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="/workflow"
                  className="rounded-lg border border-white/[0.15] px-6 py-3 text-sm text-[#FAFAFA] transition-all duration-300 hover:border-white/[0.25] hover:bg-white/[0.05] sm:px-8 sm:py-3.5 sm:text-base"
                >
                  Explore Workflow
                </a>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="h-[160vh]" aria-hidden="true" />
    </div>
  );
}
