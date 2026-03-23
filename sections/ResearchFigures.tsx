"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

interface FigureSectionProps {
  label: string;
  title: string;
  description: string;
  figureSrc: string;
  figureAlt: string;
  caption: string;
  reverse?: boolean;
}

function FigureSection({
  label,
  title,
  description,
  figureSrc,
  figureAlt,
  caption,
  reverse = false,
}: FigureSectionProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } gap-8 md:gap-12 items-center py-16 md:py-24 border-b border-white/[0.06] last:border-b-0`}
    >
      {/* Text */}
      <motion.div variants={fadeUp} className="md:w-2/5 shrink-0">
        <p className="font-mono text-xs tracking-[0.2em] text-[#00D4AA] uppercase mb-3">
          {label}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA] mb-4">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-zinc-400">{description}</p>
      </motion.div>

      {/* Figure */}
      <motion.div
        variants={fadeUp}
        className="md:w-3/5 rounded-2xl overflow-hidden bg-white border border-white/[0.08]"
      >
        <Image
          src={figureSrc}
          alt={figureAlt}
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <p className="text-xs text-zinc-500 px-4 py-3 bg-[#111118] border-t border-white/[0.08]">
          {caption}
        </p>
      </motion.div>
    </motion.div>
  );
}

function FullWidthFigure({
  label,
  title,
  description,
  figureSrc,
  figureAlt,
  caption,
}: FigureSectionProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="py-16 md:py-24 border-b border-white/[0.06] last:border-b-0"
    >
      <motion.div variants={fadeUp} className="text-center mb-10">
        <p className="font-mono text-xs tracking-[0.2em] text-[#00D4AA] uppercase mb-3">
          {label}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA] mb-4">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-zinc-400 max-w-2xl mx-auto">
          {description}
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-2xl overflow-hidden bg-white border border-white/[0.08]"
      >
        <Image
          src={figureSrc}
          alt={figureAlt}
          width={1800}
          height={900}
          className="w-full h-auto"
        />
        <p className="text-xs text-zinc-500 px-4 py-3 bg-[#111118] border-t border-white/[0.08]">
          {caption}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function ResearchFigures() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase mb-4">
            Research
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            Published Research & Validation
          </h2>
          <p className="text-lg leading-relaxed text-zinc-400 mt-4 max-w-2xl mx-auto">
            All figures from our preprint paper — computational validation using
            signal chain analysis, Monte Carlo simulation, and circuit-level modeling.
          </p>
        </motion.div>

        {/* Figure 1: Device Concept */}
        <FigureSection
          label="Figure 1"
          title="Sensor Placement"
          description="Bilateral PVDF piezoelectric strips over temporal arteries, TMP117 digital temperature sensor on the forehead center, and a rear module housing the MEMS accelerometer, MEMS microphone, BLE 5.0 radio, and Li-Po battery."
          figureSrc="/images/figures/fig-000.jpg"
          figureAlt="NYX headband device concept with labeled sensor positions"
          caption="Fig. 1 — NYX headband device concept showing sensor placement across forehead and temporal regions."
        />

        {/* Figure 2: System Architecture */}
        <FigureSection
          label="Figure 2"
          title="System Architecture"
          description="Four-layer pipeline from sensing to clinical output. Signals flow through bandpass filtering, motion artifact rejection, feature extraction, and SNR-weighted fusion before BLE 5.0 transmission every 5 seconds."
          figureSrc="/images/figures/fig-002.jpg"
          figureAlt="End-to-end system architecture diagram"
          caption="Fig. 2 — End-to-end system architecture from sensor layer through processing to clinical output."
          reverse
        />

        {/* Figure 3: Sensor Waveforms */}
        <FigureSection
          label="Figure 3"
          title="Sensor Waveforms"
          description="Representative outputs from all four modalities: PVDF pulse waveform showing clear systolic peaks, continuous temperature trending with fever threshold, BCG cardiac micro-vibrations, and respiratory acoustic envelope."
          figureSrc="/images/figures/fig-004.jpg"
          figureAlt="Four sensor waveform panels"
          caption="Fig. 3 — Representative sensor waveforms: (A) PVDF pulse, (B) temperature trend, (C) BCG cardiac signal, (D) respiratory acoustics."
        />

        {/* Figure 4: Radar Chart Comparison */}
        <FigureSection
          label="Figure 4"
          title="Form Factor Comparison"
          description="Radar chart comparing the headband against wrist-band and chest-patch form factors across clinical usability dimensions. The headband excels in multi-modal capability, motion resilience, ease of cleaning, and vital sign coverage."
          figureSrc="/images/figures/fig-006.jpg"
          figureAlt="Radar chart comparing NYX vs wrist band vs chest patch"
          caption="Fig. 4 — Comparative analysis of wearable form factors for general ward monitoring."
          reverse
        />

        {/* Figure 5: Computational Validation */}
        <FullWidthFigure
          label="Figure 5"
          title="Computational Validation"
          description="PVDF bandpass filter response, heart rate signal chain error budget, and Monte Carlo simulations (n=10,000) projecting ±2.0 bpm HR accuracy and ±0.15°C temperature accuracy at 95th percentile."
          figureSrc="/images/figures/fig-010.jpg"
          figureAlt="Four-panel computational validation results"
          caption="Fig. 5 — (A) Bandpass filter response, (B) HR error budget, (C) Monte Carlo HR error distribution, (D) Monte Carlo temperature error distribution."
        />

        {/* Figure 6: PCB Design */}
        <FigureSection
          label="Figure 6"
          title="PCB Hardware Design"
          description="Complete PCB layout in KiCad for the 2-layer flex board (185mm × 35mm), rear copper layer routing, board specifications (22 components, 85 pins), and JLCPCB BOM verification with all 16 unique parts matched and confirmed."
          figureSrc="/images/figures/fig-008.jpg"
          figureAlt="PCB layout, specifications, and BOM verification"
          caption="Fig. 6 — NYX v1.0 hardware design: (A) PCB layout, (B) rear copper, (C) board specs, (D) BOM verification."
        />

        {/* Figure 7: Signal Chain Simulation */}
        <FigureSection
          label="Figure 7"
          title="PVDF Signal Chain Simulation"
          description="Time-domain simulation through the complete analog signal chain: raw PVDF output with thermal noise → 100× TIA amplification → 4th-order Butterworth bandpass + 60 Hz notch → 12-bit ADC quantization with automated peak detection."
          figureSrc="/images/figures/fig-012.jpg"
          figureAlt="Four-panel PVDF signal processing pipeline"
          caption="Fig. 7 — Signal chain simulation: (A) Raw PVDF output, (B) after amplification, (C) after filtering, (D) ADC-ready with peak detection."
          reverse
        />

        {/* Figure 8: Signal Detectability */}
        <FigureSection
          label="Figure 8"
          title="Signal Detectability Chain"
          description="End-to-end traceability from temporal artery pulse pressure (1.2 mmHg) through mechanical force, PVDF voltage, TIA amplification, bandpass filtering, to 12-bit ADC counts. Confirms 58.6 dB SNR — signal is detectable."
          figureSrc="/images/figures/fig-014.jpg"
          figureAlt="PVDF signal detectability chain flowchart"
          caption="Fig. 8 — PVDF signal detectability chain from temporal artery to digital conversion. End-to-end SNR: 58.6 dB."
        />

        {/* Figure 9: Power Budget */}
        <FigureSection
          label="Figure 9"
          title="Power Budget & Battery Life"
          description="Duty-cycle-weighted power analysis showing 1.00 mA total system draw. A 400 mAh headband-integrated LiPo provides 402 hours (16.7 days) of continuous operation — far exceeding the 24-hour clinical shift requirement."
          figureSrc="/images/figures/fig-016.jpg"
          figureAlt="System power budget and projected battery life charts"
          caption="Fig. 9 — (A) Duty-cycle-weighted current draw by component, (B) projected battery life by capacity."
          reverse
        />

        {/* Figure 10: Cost Analysis */}
        <FullWidthFigure
          label="Figure 10"
          title="Cost Analysis"
          description="Per-unit BOM cost from $69.55 (single prototype) to $12.98 (10,000 units). At $46/unit, NYX achieves a 99× cost reduction versus standard bedside monitors — enabling deployment across resource-limited settings."
          figureSrc="/images/figures/fig-018.jpg"
          figureAlt="Cost at volume and comparison with hospital monitoring systems"
          caption="Fig. 10 — (A) NYX per-unit BOM cost at increasing production volumes, (B) cost comparison vs existing hospital monitoring systems."
        />

        {/* Figure 11: Clinical Impact */}
        <FullWidthFigure
          label="Figure 11"
          title="Clinical Impact: VIGIL vs Manual Monitoring"
          description="Head-to-head comparison across four dimensions: monitoring frequency (every 5 sec vs 4-8 hrs), detection latency (<30 sec vs hours), coverage gap (<2% vs 87-97% unmonitored), and data density (17,280 vs 3-6 data points per 24 hrs)."
          figureSrc="/images/figures/fig-020.jpg"
          figureAlt="Bar chart comparing VIGIL continuous vs manual monitoring"
          caption="Fig. 11 — Clinical impact comparison between standard manual monitoring and NYX continuous monitoring across four key metrics."
        />
      </div>
    </section>
  );
}
