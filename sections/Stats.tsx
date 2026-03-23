"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

interface StatDef {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  unit?: string;
  formatCommas?: boolean;
}

const stats: StatDef[] = [
  { target: 4, label: "Sensors", unit: "ch" },
  { target: 45, prefix: "<", suffix: "g", label: "Weight" },
  { target: 46, prefix: "$", label: "Cost", unit: "/unit" },
  { target: 2.0, prefix: "±", suffix: " bpm", decimals: 1, label: "Accuracy" },
  { target: 17280, formatCommas: true, label: "Data rate", unit: "pts/day" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function AnimatedReadout({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatCommas = false,
}: Omit<StatDef, "label" | "unit">) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [scrambling, setScrambling] = useState(true);
  const [scrambleDisplay, setScrambleDisplay] = useState("");
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => {
    const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v);
    if (formatCommas) {
      return Number(n).toLocaleString("en-US");
    }
    return String(n);
  });

  const getDigitCount = useCallback(() => {
    const finalStr =
      decimals > 0 ? target.toFixed(decimals) : String(Math.round(target));
    if (formatCommas) {
      return Number(finalStr).toLocaleString("en-US").length;
    }
    return finalStr.length;
  }, [target, decimals, formatCommas]);

  useEffect(() => {
    if (!isInView) return;

    const digitCount = getDigitCount();
    let frame: number;
    const startTime = performance.now();
    const scrambleDuration = 400;

    function tick() {
      const elapsed = performance.now() - startTime;
      if (elapsed >= scrambleDuration) {
        setScrambling(false);
        animate(count, target, {
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1] as const,
        });
        return;
      }
      let result = "";
      for (let i = 0; i < digitCount; i++) {
        result += String(Math.floor(Math.random() * 10));
      }
      if (formatCommas && result.length > 3) {
        result = Number(result).toLocaleString("en-US");
      }
      setScrambleDisplay(result);
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, count, target, getDigitCount, formatCommas]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      {prefix && (
        <span className="text-[#00D4AA] mr-0.5">{prefix}</span>
      )}
      {scrambling ? (
        <span className="text-zinc-600">{scrambleDisplay || "\u00A0"}</span>
      ) : (
        <motion.span>{display}</motion.span>
      )}
      {suffix && (
        <span className="text-sm text-zinc-500 ml-0.5 tracking-wide">
          {suffix}
        </span>
      )}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-24 md:py-32 px-6">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto"
      >
        {/* Top rule */}
        <div className="border-t border-white/[0.08]" />

        <div className="grid grid-cols-2 md:grid-cols-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariant}
              className={`py-6 md:py-8 ${
                index < stats.length - 1
                  ? "md:border-r md:border-white/[0.06]"
                  : ""
              } ${
                index % 2 === 0 && index < 4
                  ? "border-r border-white/[0.06] md:border-r"
                  : ""
              } ${
                index < 3 ? "border-b border-white/[0.06] md:border-b-0" : ""
              } ${
                index === 3 ? "border-b border-white/[0.06] md:border-b-0" : ""
              } last:col-span-2 md:last:col-span-1`}
            >
              <div className="px-4 md:px-5">
                {/* Teal indicator dot */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]/60" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-600 uppercase">
                    {stat.label}
                  </span>
                </div>

                {/* Readout value */}
                <div className="font-mono text-2xl md:text-3xl font-medium tracking-tight text-[#FAFAFA] tabular-nums leading-none">
                  <AnimatedReadout
                    target={stat.target}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    formatCommas={stat.formatCommas}
                  />
                </div>

                {/* Unit label */}
                {stat.unit && (
                  <p className="font-mono text-[10px] tracking-[0.15em] text-zinc-600 mt-2">
                    {stat.unit}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom rule */}
        <div className="border-b border-white/[0.08]" />
      </motion.div>
    </section>
  );
}
