"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import dynamic from "next/dynamic";
import type { MarkerData } from "@/components/GlobePulse";

const GlobePulse = dynamic(
  () => import("@/components/GlobePulse").then((m) => m.GlobePulse),
  { ssr: false, loading: () => <div className="aspect-square" /> }
);

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Phase Data ──────────────────────────────────────────────────────

const phases = [
  {
    phase: "01",
    title: "Clinical Validation",
    timeline: "Q4 2025 – Q3 2026",
    beds: 10,
    label: "10 beds · 1 ward · 2 hospitals",
    cost: "$460",
    description:
      "Pilot deployments at Emory University and Augusta University hospitals.",
    status: "active" as const,
  },
  {
    phase: "02",
    title: "Institutional Adoption",
    timeline: "Q4 2026 – Q1 2027",
    beds: 40,
    label: "40 beds · full ward",
    cost: "$1,840",
    description:
      "Paid deployments across U.S. community hospitals and LMIC facilities.",
    status: "upcoming" as const,
  },
  {
    phase: "03",
    title: "Scaled Distribution",
    timeline: "Q2 – Q4 2027",
    beds: 120,
    label: "120 beds · 3 wards",
    cost: "$5,520",
    description:
      "Bulk procurement via hospital systems, NGOs, and Ministries of Health.",
    status: "upcoming" as const,
  },
  {
    phase: "04",
    title: "Platform Expansion",
    timeline: "2028+",
    beds: 200,
    label: "200+ beds · system-wide",
    cost: "<$9,200",
    description:
      "Post-510(k) national scale with AI analytics and software subscriptions.",
    status: "upcoming" as const,
  },
];

// ─── Globe Markers (ordered so they add one-by-one) ──────────────────

const GLOBE_MARKERS: MarkerData[] = [
  // Georgia pilot (first 2)
  { id: "emory", location: [33.79, -84.39], delay: 0 },
  { id: "augusta", location: [33.47, -81.97], delay: 0.4 },
  // US expansion (3–8)
  { id: "houston", location: [29.76, -95.37], delay: 0 },
  { id: "chicago", location: [41.88, -87.63], delay: 0.25 },
  { id: "phoenix", location: [33.45, -112.07], delay: 0.5 },
  { id: "nashville", location: [36.16, -86.78], delay: 0.75 },
  { id: "denver", location: [39.74, -104.99], delay: 1.0 },
  { id: "boston", location: [42.36, -71.06], delay: 1.25 },
  // Worldwide (9–16)
  { id: "london", location: [51.51, -0.13], delay: 0 },
  { id: "nairobi", location: [-1.29, 36.82], delay: 0.2 },
  { id: "mumbai", location: [19.08, 72.88], delay: 0.4 },
  { id: "lagos", location: [6.52, 3.38], delay: 0.6 },
  { id: "sao-paulo", location: [-23.55, -46.63], delay: 0.8 },
  { id: "johannesburg", location: [-26.2, 28.05], delay: 1.0 },
  { id: "manila", location: [14.6, 120.98], delay: 1.2 },
  { id: "dhaka", location: [23.81, 90.41], delay: 1.4 },
  // Global (17–24)
  { id: "tokyo", location: [35.68, 139.65], delay: 0 },
  { id: "sydney", location: [-33.87, 151.21], delay: 0.2 },
  { id: "berlin", location: [52.52, 13.41], delay: 0.4 },
  { id: "cairo", location: [30.04, 31.24], delay: 0.6 },
  { id: "mexico-city", location: [19.43, -99.13], delay: 0.8 },
  { id: "singapore", location: [1.35, 103.82], delay: 1.0 },
  { id: "lima", location: [-12.05, -77.04], delay: 1.2 },
  { id: "kampala", location: [0.35, 32.58], delay: 1.4 },
];

// ─── Bed count interpolation helper ──────────────────────────────────

function interpolateBeds(progress: number): number {
  const stops = [
    [0, 10],
    [0.18, 10],
    [0.28, 40],
    [0.43, 40],
    [0.53, 120],
    [0.68, 120],
    [0.78, 200],
    [1.0, 200],
  ] as const;

  if (progress <= stops[0][0]) return stops[0][1];
  if (progress >= stops[stops.length - 1][0])
    return stops[stops.length - 1][1];

  for (let i = 0; i < stops.length - 1; i++) {
    const [x0, y0] = stops[i];
    const [x1, y1] = stops[i + 1];
    if (progress >= x0 && progress <= x1) {
      if (x1 === x0) return y0;
      const t = (progress - x0) / (x1 - x0);
      return Math.round(y0 + t * (y1 - y0));
    }
  }
  return 200;
}

// ─── Main Component ──────────────────────────────────────────────────

export default function Roadmap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [activePhase, setActivePhase] = useState(0);
  const [bedDisplay, setBedDisplay] = useState(10);
  const [markerCount, setMarkerCount] = useState(2);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Phase
    const p = v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.75 ? 2 : 3;
    setActivePhase(p);

    // Bed count
    setBedDisplay(interpolateBeds(v));

    // Marker count — one by one across the full scroll
    const count = Math.max(2, Math.min(24, Math.round(2 + v * 22)));
    setMarkerCount(count);
  });

  const phase = phases[activePhase];

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen bg-[#0A0A0F] overflow-hidden">
        <div className="h-full flex flex-col justify-between px-6 py-10 md:py-14">
          {/* Section label */}
          <div className="max-w-6xl mx-auto w-full shrink-0">
            <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase">
              Roadmap
            </p>
          </div>

          {/* Center content */}
          <div className="max-w-6xl mx-auto w-full flex-1 flex items-center py-6">
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
              {/* Left: counter + phase info */}
              <div>
                <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA] mb-6 md:mb-8">
                  From pilot to platform
                </h2>

                <div className="flex items-baseline mb-1">
                  <span className="text-[clamp(4rem,12vw,9rem)] font-bold tabular-nums tracking-tighter leading-none text-[#FAFAFA]">
                    {bedDisplay}
                  </span>
                  <span className="text-[clamp(1.2rem,3vw,2.5rem)] font-bold text-[#00D4AA]/20 ml-1 leading-none">
                    +
                  </span>
                </div>
                <p className="font-mono text-xs md:text-sm tracking-[0.15em] text-zinc-500 uppercase mb-6 md:mb-8">
                  beds continuously monitored
                </p>

                {/* Phase detail — state-driven crossfade */}
                <div className="relative h-40 md:h-36">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePhase}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease }}
                      className="absolute inset-0"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            phase.status === "active"
                              ? "bg-[#00D4AA] shadow-[0_0_8px_rgba(0,212,170,0.5)]"
                              : "bg-[#00D4AA]/50"
                          }`}
                        />
                        <span className="font-mono text-xs tracking-[0.2em] text-[#00D4AA] uppercase">
                          Phase {phase.phase}
                        </span>
                        <span className="font-mono text-xs text-zinc-600">
                          {phase.timeline}
                        </span>
                        {phase.status === "active" && (
                          <span className="px-2 py-0.5 rounded-full bg-[#00D4AA]/10 font-mono text-[10px] text-[#00D4AA] tracking-wide uppercase">
                            Current
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl md:text-2xl font-semibold text-[#FAFAFA] mb-2">
                        {phase.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-zinc-400 mb-3 max-w-lg">
                        {phase.description}
                      </p>

                      <div className="flex items-center gap-6">
                        <span className="font-mono text-xs text-zinc-500">
                          {phase.label}
                        </span>
                        <span className="font-mono text-sm font-semibold text-[#FAFAFA]">
                          {phase.cost}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right: globe */}
              <div className="hidden lg:block">
                <GlobePulse
                  markers={GLOBE_MARKERS}
                  visibleCount={markerCount}
                  className="max-w-[440px] mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Bottom: progress + footnote */}
          <div className="max-w-6xl mx-auto w-full shrink-0">
            <ProgressTrack scrollYProgress={scrollYProgress} />
            <p className="font-mono text-xs text-zinc-600 text-center mt-4">
              A single bedside monitor costs $5,000–$15,000. VIGIL equips 200
              beds for under $9,200.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Progress Track ──────────────────────────────────────────────────

function ProgressTrack({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const scaleX = useTransform(scrollYProgress, [0, 0.75, 1], [0.005, 1, 1]);

  return (
    <div>
      <div className="flex justify-between mb-2">
        {phases.map((phase, i) => (
          <TrackLabel
            key={i}
            label={phase.phase}
            index={i}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
      <div className="relative h-3 flex items-center">
        <div className="absolute inset-x-0 h-[1px] bg-white/[0.06] rounded-full" />
        <motion.div
          className="absolute inset-x-0 h-[1px] bg-[#00D4AA] origin-left rounded-full"
          style={{ scaleX }}
        />
        <div className="relative w-full flex justify-between">
          {phases.map((_, i) => (
            <TrackDot key={i} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TrackLabel({
  label,
  index,
  scrollYProgress,
}: {
  label: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const isActive = useTransform(scrollYProgress, (v) => v >= index * 0.25);
  const opacity = useTransform(isActive, (v) => (v ? 1 : 0.3));
  const color = useTransform(isActive, (v) =>
    v ? "#00D4AA" : "rgb(82,82,91)"
  );

  return (
    <motion.span
      className="font-mono text-[10px] tracking-[0.15em] uppercase"
      style={{ opacity, color }}
    >
      {label}
    </motion.span>
  );
}

function TrackDot({
  index,
  scrollYProgress,
}: {
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const isActive = useTransform(scrollYProgress, (v) => v >= index * 0.25);
  const bg = useTransform(isActive, (v) =>
    v ? "#00D4AA" : "rgba(255,255,255,0.1)"
  );
  const scale = useTransform(isActive, (v) => (v ? 1 : 0.5));
  const shadow = useTransform(isActive, (v) =>
    v ? "0 0 8px rgba(0,212,170,0.4)" : "none"
  );

  return (
    <motion.div
      className="w-2.5 h-2.5 rounded-full"
      style={{
        backgroundColor: bg,
        scale,
        boxShadow: shadow,
      }}
    />
  );
}
