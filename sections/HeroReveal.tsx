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
    detail: "Four signals in a single lightweight wearable.",
    range: [0.54, 0.6] as [number, number],
  },
  {
    value: "<45g",
    label: "Weight",
    detail: "Comfortable enough for long sessions and fast turnover.",
    range: [0.58, 0.64] as [number, number],
  },
  {
    value: "$46",
    label: "Per unit",
    detail: "Priced for ward-scale rollout, not just premium beds.",
    range: [0.62, 0.68] as [number, number],
  },
  {
    value: "5s",
    label: "Refresh",
    detail: "Continuous readouts instead of long gaps between checks.",
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
  eyebrow,
  value,
  description,
  emphasis = false,
  progress,
  range,
}: {
  eyebrow: string;
  value: string;
  description: string;
  emphasis?: boolean;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const x = useTransform(progress, range, [emphasis ? 20 : -20, 0]);
  const trackOpacity = useTransform(progress, range, [0.15, 1]);

  return (
    <motion.div
      style={{ opacity, x }}
      className={cn(
        "relative overflow-hidden rounded-[28px] border p-5 md:p-6",
        emphasis
          ? "border-[#00D4AA]/20 bg-[radial-gradient(circle_at_top_left,rgba(0,212,170,0.14),transparent_55%),rgba(0,212,170,0.05)]"
          : "border-white/[0.08] bg-white/[0.03]"
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.28em]",
              emphasis ? "text-[#7AE7D4]" : "text-zinc-500"
            )}
          >
            {eyebrow}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#FAFAFA] md:text-4xl">
            {value}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        </div>

        <div
          className={cn(
            "inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]",
            emphasis
              ? "border-[#00D4AA]/30 bg-[#00D4AA]/10 text-[#7AE7D4]"
              : "border-white/[0.08] bg-white/[0.03] text-zinc-400"
          )}
        >
          {emphasis ? "Continuous feed" : "Spot checks"}
        </div>
      </div>

      <motion.div style={{ opacity: trackOpacity }} className="mt-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
          <span>{emphasis ? "Coverage" : "Coverage gaps"}</span>
          <span>{emphasis ? "17,280 refreshes/day" : "3-6 checks/day"}</span>
        </div>

        <div
          className={cn(
            "mt-3 grid grid-cols-12 gap-1.5 rounded-2xl border px-3 py-3",
            emphasis
              ? "border-[#00D4AA]/15 bg-black/25"
              : "border-white/[0.06] bg-black/20"
          )}
        >
          {TRACK_MARKS.map((index) => {
            const isSparsePulse = index === 0 || index === 5 || index === 10;

            return (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full",
                  emphasis
                    ? "bg-gradient-to-r from-[#00D4AA]/25 via-[#00D4AA]/55 to-[#00D4AA]"
                    : isSparsePulse
                      ? "bg-white/25"
                      : "bg-white/[0.05]"
                )}
              />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeploymentStat({
  value,
  label,
  detail,
  progress,
  range,
}: {
  value: string;
  label: string;
  detail: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [18, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
    >
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[#FAFAFA] md:text-[2.5rem]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{detail}</p>
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
  const panelY = useTransform(scrollYProgress, [0.34, 0.42], [48, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.72, 0.78], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.72, 0.78], [20, 0]);

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
            className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-[32px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-4 text-left shadow-[0_32px_120px_rgba(0,0,0,0.45)] sm:p-6 md:p-8"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#00D4AA]/10 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#00D4AA]/8 blur-[120px]" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00D4AA]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-400">
                    Monitoring gap
                  </span>
                </div>

                <h3 className="mt-5 max-w-xl text-2xl font-semibold leading-[1.05] tracking-tight text-[#FAFAFA] md:text-[2rem]">
                  The issue isn&apos;t signal quality. It&apos;s the hours
                  between checks.
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
                  General ward patients are usually checked every 4-8 hours.
                  VIGIL refreshes every 5 seconds, closing the blind spots that
                  intermittent rounds leave behind.
                </p>

                <div className="mt-6 grid gap-4">
                  <CadenceRow
                    eyebrow="Typical ward cadence"
                    value="Every 4-8 hours"
                    description="Manual spot checks create long windows where patient status can drift without a fresh read."
                    progress={scrollYProgress}
                    range={[0.44, 0.52]}
                  />
                  <CadenceRow
                    eyebrow="VIGIL cadence"
                    value="Every 5 seconds"
                    description="Continuous monitoring keeps new data flowing fast enough to surface deterioration before the next round."
                    emphasis
                    progress={scrollYProgress}
                    range={[0.49, 0.57]}
                  />
                </div>
              </div>

              <div className="relative rounded-[28px] border border-white/[0.08] bg-black/20 p-4 sm:p-5">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00D4AA]/40 to-transparent" />
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500">
                  Ward-scale deployment
                </p>
                <h4 className="mt-3 max-w-sm text-lg font-medium tracking-tight text-[#FAFAFA]">
                  ICU-grade coverage without ICU-only hardware economics.
                </h4>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {DEPLOYMENT_STATS.map((stat) => (
                    <DeploymentStat
                      key={stat.label}
                      value={stat.value}
                      label={stat.label}
                      detail={stat.detail}
                      progress={scrollYProgress}
                      range={stat.range}
                    />
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              style={{ opacity: ctaOpacity, y: ctaY }}
              className="relative mt-8 flex flex-col gap-4 border-t border-white/[0.08] pt-6 md:flex-row md:items-center md:justify-between"
            >
              <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                Built to give general floors continuous coverage without the
                cost, weight, or workflow burden of traditional bedside setups.
              </p>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
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
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="h-[170vh]" aria-hidden="true" />
    </div>
  );
}
