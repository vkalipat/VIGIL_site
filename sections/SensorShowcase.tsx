"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HeartPulse,
  Thermometer,
  Activity,
  AudioLines,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface SensorDot {
  top: string;
  left: string;
}

interface Sensor {
  id: number;
  name: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  dots: SensorDot[];
}

const sensors: Sensor[] = [
  {
    id: 1,
    name: "Temporal Pulse",
    description:
      "Bilateral piezoelectric strips detect temporal artery pulse waveforms with ±2.0 bpm accuracy and 58.6 dB SNR.",
    metric: "±2.0 bpm",
    metricLabel: "accuracy (95th pctl)",
    icon: HeartPulse,
    dots: [
      { top: "48%", left: "6%" },
      { top: "48%", left: "94%" },
    ],
  },
  {
    id: 2,
    name: "Core Temperature",
    description:
      "Medical-grade TMP117 achieves ±0.15°C core temperature estimation through direct forehead contact.",
    metric: "±0.15°C",
    metricLabel: "accuracy (95th pctl)",
    icon: Thermometer,
    dots: [{ top: "12%", left: "50%" }],
  },
  {
    id: 3,
    name: "Motion & BCG",
    description:
      "Ballistocardiography captures cardiac micro-vibrations. Tri-axis fall detection triggers within seconds.",
    metric: "200 Hz",
    metricLabel: "sample rate",
    icon: Activity,
    dots: [{ top: "90%", left: "43%" }],
  },
  {
    id: 4,
    name: "Respiratory Acoustics",
    description:
      "Bone-conducted respiratory acoustics provide continuous breath rate without chest contact.",
    metric: "16 kHz",
    metricLabel: "sample rate",
    icon: AudioLines,
    dots: [{ top: "90%", left: "57%" }],
  },
];

export default function SensorShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const lastIndexRef = useRef(-1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          let nextIndex: number;
          if (p < 0.2) {
            nextIndex = -1;
          } else {
            nextIndex = Math.min(
              Math.floor((p - 0.2) / 0.2),
              sensors.length - 1
            );
          }
          // Only trigger a React re-render when the index changes
          if (nextIndex !== lastIndexRef.current) {
            lastIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
          }
        },
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  const activeSensor = activeIndex >= 0 ? sensors[activeIndex] : null;

  return (
    <div id="sensors" ref={wrapperRef} className="h-screen relative bg-[#0A0A0F]">
      {/* Section title */}
      <div
        className="absolute top-16 md:top-20 left-0 right-0 text-center px-6 z-10 transition-opacity duration-500"
        style={{ opacity: activeIndex === -1 ? 1 : 0.3 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
          Four Modalities. One Anatomical Site.
        </h2>
      </div>

      {/* Desktop: two-column grid — info left, headband right */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] h-full items-center px-12 lg:px-20 gap-8">
        {/* Left column — sensor info */}
        <div className="flex items-center justify-end">
          <div className="w-72 lg:w-80 min-h-[280px]">
            {activeSensor && (
              <div
                key={activeSensor.id}
                className="space-y-4 animate-[fadeIn_0.4s_ease-out]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00D4AA]/15 flex items-center justify-center">
                    <activeSensor.icon className="w-5 h-5 text-[#00D4AA]" />
                  </div>
                  <span className="text-sm font-medium tracking-wide text-[#00D4AA] uppercase">
                    Sensor {activeSensor.id}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[#FAFAFA]">
                  {activeSensor.name}
                </h3>
                <p className="text-base leading-relaxed text-zinc-400">
                  {activeSensor.description}
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-bold text-[#FAFAFA] tracking-tight">
                    {activeSensor.metric}
                  </span>
                  <span className="block text-sm font-medium tracking-wide text-zinc-600 mt-1">
                    {activeSensor.metricLabel}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center column — headband */}
        <div className="relative w-[min(50vh,500px)] h-[min(50vh,500px)]">
          <HeadbandRing activeIndex={activeIndex} />
        </div>

        {/* Right column — progress dots */}
        <div className="flex items-center">
          <ProgressDots activeIndex={activeIndex} />
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden h-full flex flex-col items-center justify-center px-6 pt-24">
        {/* Headband */}
        <div className="relative w-[65vmin] h-[65vmin]">
          <HeadbandRing activeIndex={activeIndex} />
        </div>

        {/* Info below headband */}
        <div className="mt-8 text-center min-h-[160px] px-4">
          {activeSensor && (
            <div
              key={activeSensor.id}
              className="space-y-3 animate-[fadeIn_0.4s_ease-out]"
            >
              <div className="flex items-center justify-center gap-2">
                <activeSensor.icon className="w-4 h-4 text-[#00D4AA]" />
                <h3 className="text-xl font-semibold text-[#FAFAFA]">
                  {activeSensor.name}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400 max-w-xs mx-auto">
                {activeSensor.description}
              </p>
              <span className="text-2xl font-bold text-[#FAFAFA] block">
                {activeSensor.metric}
              </span>
            </div>
          )}
        </div>

        {/* Mobile progress dots */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <ProgressDots activeIndex={activeIndex} />
        </div>
      </div>
    </div>
  );
}

function HeadbandRing({ activeIndex }: { activeIndex: number }) {
  return (
    <>
      <svg viewBox="0 0 300 300" fill="none" className="w-full h-full">
        <ellipse
          cx="150"
          cy="150"
          rx="130"
          ry="130"
          stroke="white"
          strokeOpacity="0.08"
          strokeWidth="20"
          fill="none"
        />
        <ellipse
          cx="150"
          cy="150"
          rx="130"
          ry="130"
          stroke="#00D4AA"
          strokeOpacity={activeIndex >= 0 ? "0.08" : "0.03"}
          strokeWidth="20"
          fill="none"
          className="transition-all duration-700"
        />
        <text
          x="150"
          y="30"
          textAnchor="middle"
          fill="#52525B"
          fontSize="10"
          fontFamily="sans-serif"
          letterSpacing="0.1em"
        >
          FRONT
        </text>
        <text
          x="150"
          y="280"
          textAnchor="middle"
          fill="#52525B"
          fontSize="10"
          fontFamily="sans-serif"
          letterSpacing="0.1em"
        >
          REAR
        </text>
      </svg>

      {/* Sensor dots */}
      {sensors.map((sensor, sensorIdx) =>
        sensor.dots.map((dot, dotIdx) => {
          const isActive = sensorIdx === activeIndex;
          return (
            <div
              key={`${sensor.id}-${dotIdx}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ top: dot.top, left: dot.left }}
            >
              {/* Triple ring pulse for active dot */}
              {isActive && (
                <div className="absolute" style={{ top: -8, left: -8 }}>
                  {[0, 1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute rounded-full border border-[#00D4AA]"
                      style={{
                        width: 16,
                        height: 16,
                        top: 0,
                        left: 0,
                      }}
                      animate={{
                        scale: [1, 2 + ring * 0.5],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: [0.16, 1, 0.3, 1],
                        delay: ring * 0.3,
                      }}
                    />
                  ))}
                </div>
              )}
              <div
                className="absolute rounded-full transition-all duration-500"
                style={{
                  width: isActive ? 40 : 0,
                  height: isActive ? 40 : 0,
                  top: isActive ? -12 : 8,
                  left: isActive ? -12 : 8,
                  background: "rgba(0,212,170,0.15)",
                  filter: isActive ? "blur(8px)" : "blur(0px)",
                }}
              />
              <div
                className="relative rounded-full transition-all duration-500"
                style={{
                  width: isActive ? 16 : 8,
                  height: isActive ? 16 : 8,
                  background: isActive
                    ? "#00D4AA"
                    : "rgba(250,250,250,0.2)",
                  boxShadow: isActive
                    ? "0 0 20px rgba(0,212,170,0.5)"
                    : "none",
                }}
              />
            </div>
          );
        })
      )}
    </>
  );
}

function ProgressDots({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex flex-col gap-4">
      {sensors.map((sensor, idx) => (
        <div key={sensor.id} className="flex items-center gap-3">
          <div
            className="rounded-full transition-all duration-500"
            style={{
              width: idx === activeIndex ? 12 : 6,
              height: idx === activeIndex ? 12 : 6,
              background:
                idx === activeIndex ? "#00D4AA" : "rgba(250,250,250,0.15)",
              boxShadow:
                idx === activeIndex
                  ? "0 0 12px rgba(0,212,170,0.4)"
                  : "none",
            }}
          />
          <span
            className="text-xs font-medium tracking-wide transition-all duration-500 hidden md:block"
            style={{
              color: idx === activeIndex ? "#00D4AA" : "transparent",
            }}
          >
            {sensor.name}
          </span>
        </div>
      ))}
    </div>
  );
}
