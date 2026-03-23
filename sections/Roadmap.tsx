"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const phases = [
  {
    phase: "01",
    title: "Clinical Validation",
    timeline: "Q4 2025 – Q3 2026",
    description:
      "Clinical pilot deployments at Emory University and Augusta University hospitals to validate accuracy, workflow integration, and early-deterioration detection on general wards.",
    status: "active",
  },
  {
    phase: "02",
    title: "Institutional Adoption",
    timeline: "Q4 2026 – Q1 2027",
    description:
      "Successful pilots convert into paid deployments across U.S. community hospitals and NGO-supported LMIC hospitals using tiered pricing, starter kits, and centralized dashboards.",
    status: "upcoming",
  },
  {
    phase: "03",
    title: "Scaled Distribution",
    timeline: "Q2 – Q4 2027",
    description:
      "Expansion through bulk procurement contracts with hospital systems, NGOs, and Ministries of Health, leveraging PATH, UNICEF, and MSF networks for multi-ward and multi-country rollouts.",
    status: "upcoming",
  },
  {
    phase: "04",
    title: "Platform Expansion",
    timeline: "2028 and beyond",
    description:
      "Following FDA Class II / 510(k) clearance, VIGIL scales nationally and globally through recurring software subscriptions, AI analytics, and system-wide deployments.",
    status: "upcoming",
  },
];

export default function Roadmap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // The connecting line grows as you scroll
  const lineScaleY = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32 px-6 bg-[#0A0A0F]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase mb-4">
            Roadmap
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            From pilot to platform
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connecting line — desktop */}
          <div className="hidden md:block absolute left-[calc(50%-1px)] top-0 bottom-0 w-[2px] bg-white/[0.06]">
            <motion.div
              style={{ scaleY: lineScaleY, transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-[#00D4AA] to-[#00D4AA]/20"
            />
          </div>

          {/* Mobile connecting line */}
          <div className="md:hidden absolute left-6 top-0 bottom-0 w-[2px] bg-white/[0.06]">
            <motion.div
              style={{ scaleY: lineScaleY, transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-[#00D4AA] to-[#00D4AA]/20"
            />
          </div>

          {phases.map((phase, i) => {
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                className={`relative flex items-start mb-16 last:mb-0 ${
                  isLeft
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                } flex-row`}
              >
                {/* Dot on the line */}
                <div
                  className={`absolute md:left-1/2 md:-translate-x-1/2 left-6 -translate-x-1/2 top-2 z-10 w-4 h-4 rounded-full border-2 ${
                    phase.status === "active"
                      ? "border-[#00D4AA] bg-[#00D4AA] shadow-[0_0_12px_rgba(0,212,170,0.5)]"
                      : "border-white/[0.2] bg-[#0A0A0F]"
                  }`}
                />

                {/* Content card */}
                <div
                  className={`ml-12 md:ml-0 md:w-[calc(50%-40px)] ${
                    isLeft ? "md:pr-0 md:mr-auto" : "md:pl-0 md:ml-auto"
                  }`}
                >
                  <div className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-8 hover:border-white/[0.15] transition-colors duration-500">
                    {/* Phase number + status */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-xs tracking-[0.2em] text-[#00D4AA]">
                        PHASE {phase.phase}
                      </span>
                      {phase.status === "active" && (
                        <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-[#00D4AA] uppercase bg-[#00D4AA]/10 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl md:text-2xl font-semibold text-[#FAFAFA] mb-1">
                      {phase.title}
                    </h3>

                    <p className="font-mono text-xs tracking-wide text-zinc-500 mb-4">
                      {phase.timeline}
                    </p>

                    <p className="text-sm leading-relaxed text-zinc-400">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
