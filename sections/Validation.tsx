"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dice5, Cpu, FileText, Users, ChevronDown } from "lucide-react";
import Image from "next/image";

interface ValidationCard {
  id: string;
  icon: typeof Dice5;
  label: string;
  summary: string;
  figures: {
    src: string;
    alt: string;
    caption: string;
  }[];
  details: string;
}

const cards: ValidationCard[] = [
  {
    id: "monte-carlo",
    icon: Dice5,
    label: "Monte Carlo Simulation",
    summary: "n=10,000 trials projecting ±2.0 bpm HR and ±0.15°C temp accuracy",
    details:
      "Monte Carlo simulation using independent random variables sampled from manufacturer datasheet specifications. Heart rate error budget decomposed into ADC quantization, analog noise, filter alias, peak detection, and motion residual. The 95th percentile error bound of ±2.0 bpm falls well within the AAMI acceptable limit of ±5 bpm. Temperature accuracy of ±0.15°C is within the clinically meaningful threshold of ±0.5°C.",
    figures: [
      {
        src: "/images/figures/fig-010.jpg",
        alt: "Monte Carlo validation results — bandpass filter, error budget, HR and temp distributions",
        caption:
          "Fig. 5 — (A) PVDF bandpass filter response, (B) HR signal chain error budget, (C) Monte Carlo HR error (n=10,000), (D) Monte Carlo temp error (n=10,000).",
      },
    ],
  },
  {
    id: "circuit-sim",
    icon: Cpu,
    label: "Circuit Simulation",
    summary: "58.6 dB end-to-end SNR through PVDF analog front-end",
    details:
      "Time-domain simulation of the complete PVDF analog signal chain using actual NYX v1.0 component values. Raw piezoelectric output (0.4 mV peak) is dominated by thermal noise, but after AD8606 TIA amplification (gain = 100×), 4th-order Butterworth bandpass filtering, and 60 Hz notch rejection, the cardiac waveform is clearly isolated with systolic peaks and dicrotic notch features preserved. Automated peak detection correctly identified all cardiac cycles.",
    figures: [
      {
        src: "/images/figures/fig-012.jpg",
        alt: "PVDF signal chain simulation — raw to ADC-ready",
        caption:
          "Fig. 7 — (A) Raw PVDF output with noise, (B) after 100× TIA amplification, (C) after bandpass + notch filtering, (D) 12-bit ADC with peak detection.",
      },
    ],
  },
  {
    id: "hardware",
    icon: FileText,
    label: "Hardware & BOM",
    summary: "2-layer flex PCB, 22 components, all parts JLCPCB-verified",
    details:
      "Complete PCB layout designed in KiCad for a 2-layer flex substrate (185mm × 35mm, 0.11mm thick). All 16 unique parts sourced and verified through JLCPCB's component matching system with 89% routing completion on initial autorouter pass. Power budget analysis confirms 1.00 mA total draw with 400 mAh LiPo providing 16.7 days of continuous operation.",
    figures: [
      {
        src: "/images/figures/pcb-layout.png",
        alt: "PCB layout, BOM verification, and board specifications",
        caption:
          "Fig. 6 — (A) Complete PCB layout in KiCad, (B) rear copper layer, (C) board specs: 22 components, 85 pins, (D) JLCPCB BOM verification.",
      },
      {
        src: "/images/figures/fig-016.jpg",
        alt: "System power budget and battery life projections",
        caption:
          "Fig. 9 — (A) Duty-cycle-weighted current draw by component, (B) projected battery life: 402 hours with 400 mAh LiPo.",
      },
    ],
  },
  {
    id: "clinical",
    icon: Users,
    label: "Clinical Impact",
    summary: "17,280 data points/day vs 3-6 manual checks",
    details:
      "Head-to-head comparison across four dimensions: monitoring frequency (every 5 seconds vs 4-8 hours), detection latency (<30 seconds vs hours), coverage gap (<2% vs 87-97% unmonitored), and data density (17,280 vs 3-6 data points per 24 hours). At $46/unit, VIGIL achieves a 99× cost reduction versus standard bedside monitors.",
    figures: [
      {
        src: "/images/figures/cost-analysis.png",
        alt: "Cost analysis at volume vs hospital monitoring systems",
        caption:
          "Fig. 10 — (A) Per-unit BOM cost at volume, (B) cost comparison vs existing hospital monitoring systems (log scale).",
      },
    ],
  },
];

function ExpandableCard({ card }: { card: ValidationCard }) {
  const [open, setOpen] = useState(false);
  const Icon = card.icon;

  return (
    <motion.div
      layout
      className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden hover:border-white/[0.15] transition-colors duration-300"
    >
      {/* Header — always visible, clickable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 md:p-8 flex items-start gap-4 cursor-pointer"
      >
        <div
          className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ${
            open ? "bg-[#00D4AA]/20" : "bg-white/[0.06]"
          }`}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Icon
              className={`h-5 w-5 transition-colors duration-300 ${
                open ? "text-[#00D4AA]" : "text-zinc-400"
              }`}
            />
          </motion.div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[#FAFAFA]">
            {card.label}
          </h3>
          <p className="text-sm text-zinc-400 mt-1">{card.summary}</p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-zinc-500" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6">
              {/* Description */}
              <p className="text-sm leading-relaxed text-zinc-400 border-t border-white/[0.06] pt-6">
                {card.details}
              </p>

              {/* Figures */}
              {card.figures.map((fig, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden bg-white border border-white/[0.08]"
                >
                  <Image
                    src={fig.src}
                    alt={fig.alt}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                  />
                  <p className="text-xs text-zinc-500 px-4 py-3 bg-[#111118] border-t border-white/[0.08]">
                    {fig.caption}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Validation() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Headline + Body */}
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase">
            Validation
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            Computational Validation
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-zinc-400">
            Monte Carlo simulation (n=10,000) projects &plusmn;2.0 bpm heart
            rate accuracy and &plusmn;0.15&deg;C temperature accuracy at 95th
            percentile. Circuit simulation confirms 58.6 dB end-to-end SNR.
          </p>
        </motion.div>

        {/* Expandable cards */}
        <motion.div
          className="space-y-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cards.map((card) => (
            <motion.div key={card.id} variants={fadeItem}>
              <ExpandableCard card={card} />
            </motion.div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.p
          className="mt-12 text-center text-sm font-medium tracking-wide text-zinc-600"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          Clinical validation with hospitalized patients planned as next
          development phase.
        </motion.p>
      </div>
    </section>
  );
}
