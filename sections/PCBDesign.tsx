'use client'

import { motion } from 'framer-motion'
import {
  CircuitBoard,
  Layers,
  Ruler,
  Cpu,
  Battery,
  Zap,
  Radio,
  Mic,
  Thermometer,
  HeartPulse,
  Activity,
  AudioLines,
} from 'lucide-react'

/* ─── PCB Overview Specs ─── */
const pcbSpecs = [
  { icon: Layers, label: 'Layers', value: '2-layer flex' },
  { icon: Ruler, label: 'Dimensions', value: '185mm × 35mm' },
  { icon: CircuitBoard, label: 'Thickness', value: '0.11mm' },
  { icon: Cpu, label: 'Components', value: '22 total' },
]

/* ─── Core ICs ─── */
const coreComponents = [
  {
    icon: Cpu,
    name: 'Nordic nRF52840',
    role: 'System on Chip',
    detail: 'ARM Cortex-M4F @ 64MHz, 1MB flash, 256KB RAM, BLE 5.0',
  },
  {
    icon: Battery,
    name: 'TPS62840',
    role: 'Power Management',
    detail: 'Ultra-low-power buck converter, enables 18–24hr battery life',
  },
  {
    icon: Zap,
    name: 'AD8606',
    role: 'Signal Conditioning',
    detail: 'Dual precision op-amp for analog front-end amplification',
  },
  {
    icon: Radio,
    name: 'BQ24072',
    role: 'Charge Management',
    detail: 'USB-C charging IC, 5V/500mA input, ~90 min to full',
  },
]

/* ─── Sensor Array ─── */
const sensorArray = [
  {
    icon: HeartPulse,
    name: 'PVDF Piezoelectric ×2',
    part: 'TE LDT1-028K',
    position: 'Both temples',
    detail: '200 Hz sampling, ±2.0 bpm accuracy, 58.6 dB SNR',
  },
  {
    icon: Thermometer,
    name: 'Digital Temperature',
    part: 'TI TMP117',
    position: 'Center forehead',
    detail: '1 Hz sampling, ±0.15°C accuracy, 16-bit resolution',
  },
  {
    icon: Activity,
    name: 'MEMS Accelerometer',
    part: 'ST LIS3DH',
    position: 'Rear module',
    detail: '200 Hz tri-axis, 4mg/bit resolution, 3.5g fall threshold',
  },
  {
    icon: AudioLines,
    name: 'MEMS Microphone',
    part: 'TDK ICS-43434',
    position: 'Rear module',
    detail: '16 kHz acoustic, 65 dBA SNR, −26 dBFS sensitivity',
  },
]

/* ─── Signal Processing Pipeline ─── */
const pipeline = [
  { step: '01', label: 'Bandpass Filtering', description: 'Isolate target frequency bands per sensor modality' },
  { step: '02', label: 'Motion Artifact Rejection', description: 'Bilateral cross-correlation (r > 0.70) cancels head movement noise' },
  { step: '03', label: 'Feature Extraction', description: 'Peak detection, J-wave identification, Hilbert envelope analysis' },
  { step: '04', label: 'Multi-Sensor Fusion', description: 'SNR-weighted fusion across all channels, <50ms total latency' },
]

/* ─── Animation Variants ─── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/* ─── PCB Board Visualization ─── */
function PCBVisualization() {
  return (
    <div className="relative w-full aspect-[185/35] max-w-3xl mx-auto">
      {/* Board outline */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#00D4AA]/30 bg-[#00D4AA]/[0.03]"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Trace lines */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute top-1/4 left-[5%] right-[5%] h-px bg-[#00D4AA]/10" />
          <div className="absolute top-1/2 left-[8%] right-[8%] h-px bg-[#00D4AA]/15" />
          <div className="absolute top-3/4 left-[5%] right-[5%] h-px bg-[#00D4AA]/10" />
        </div>

        {/* Left sensor zone — PVDF L */}
        <motion.div
          className="absolute left-[8%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00D4AA]/40 shadow-[0_0_12px_rgba(0,212,170,0.3)]"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />

        {/* Right sensor zone — PVDF R */}
        <motion.div
          className="absolute right-[8%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00D4AA]/40 shadow-[0_0_12px_rgba(0,212,170,0.3)]"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />

        {/* Center — TMP117 */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm bg-[#00D4AA]/50 shadow-[0_0_16px_rgba(0,212,170,0.4)]"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        />

        {/* SoC — nRF52840 */}
        <motion.div
          className="absolute left-[38%] top-1/2 -translate-y-1/2 w-5 h-3 rounded-sm bg-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        />

        {/* Power — TPS62840 + BQ24072 */}
        <motion.div
          className="absolute left-[62%] top-[30%] w-3 h-2 rounded-sm bg-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
        />
        <motion.div
          className="absolute left-[62%] top-[60%] w-3 h-2 rounded-sm bg-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
        />

        {/* Rear module — LIS3DH + ICS-43434 */}
        <motion.div
          className="absolute right-[20%] top-[35%] w-2.5 h-2.5 rounded-full bg-[#00D4AA]/30 shadow-[0_0_10px_rgba(0,212,170,0.2)]"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        />
        <motion.div
          className="absolute right-[20%] top-[60%] w-2.5 h-2.5 rounded-full bg-[#00D4AA]/25 shadow-[0_0_10px_rgba(0,212,170,0.15)]"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
        />
      </motion.div>

      {/* Labels */}
      <motion.div
        className="absolute -bottom-10 left-0 right-0 flex justify-between text-xs text-zinc-600 px-[5%]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
      >
        <span>PVDF L</span>
        <span>SoC</span>
        <span>TMP117</span>
        <span>Power</span>
        <span>Rear Module</span>
        <span>PVDF R</span>
      </motion.div>
    </div>
  )
}

/* ─── Main Section ─── */
export default function PCBDesign() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-16 md:mb-20"
        >
          <p className="text-sm font-medium tracking-wide text-zinc-600 uppercase">
            Hardware Design
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            22 components on a 0.11mm flex PCB
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-zinc-400 max-w-3xl mx-auto">
            A 2-layer flexible circuit conforms to the forehead curvature while
            keeping the full system under 45g. Open-source hardware under CERN OHL v2.
          </p>
        </motion.div>

        {/* PCB Overview Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20"
        >
          {pcbSpecs.map((spec) => {
            const Icon = spec.icon
            return (
              <motion.div
                key={spec.label}
                variants={item}
                className="flex flex-col items-center text-center gap-3 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6"
              >
                <Icon className="w-5 h-5 text-[#00D4AA]" />
                <span className="text-lg font-semibold text-[#FAFAFA]">
                  {spec.value}
                </span>
                <span className="text-sm font-medium tracking-wide text-zinc-600">
                  {spec.label}
                </span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* PCB Board Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 md:p-12 mb-16 md:mb-20"
        >
          <p className="text-sm font-medium tracking-wide text-zinc-600 uppercase mb-8 text-center">
            Component Layout
          </p>
          <PCBVisualization />
        </motion.div>

        {/* Core ICs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <p className="text-sm font-medium tracking-wide text-zinc-600 uppercase mb-6">
            Core ICs
          </p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {coreComponents.map((comp) => {
              const Icon = comp.icon
              return (
                <motion.div
                  key={comp.name}
                  variants={item}
                  className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 md:p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00D4AA]/15 shrink-0">
                      <Icon className="w-4 h-4 text-[#00D4AA]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#FAFAFA]">
                        {comp.name}
                      </h3>
                      <p className="text-sm font-medium text-[#00D4AA]">
                        {comp.role}
                      </p>
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {comp.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Sensor Array */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <p className="text-sm font-medium tracking-wide text-zinc-600 uppercase mb-6">
            Sensor Array
          </p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {sensorArray.map((sensor) => {
              const Icon = sensor.icon
              return (
                <motion.div
                  key={sensor.name}
                  variants={item}
                  className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 md:p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00D4AA]/15 shrink-0">
                      <Icon className="w-4 h-4 text-[#00D4AA]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#FAFAFA]">
                        {sensor.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#00D4AA]">{sensor.part}</span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-zinc-400">{sensor.position}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {sensor.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Signal Processing Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm font-medium tracking-wide text-zinc-600 uppercase mb-6">
            On-Device Signal Processing
          </p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-0 bottom-0 left-[19px] w-px bg-white/[0.08]"
              aria-hidden="true"
            />
            <div className="space-y-4">
              {pipeline.map((stage) => (
                <motion.div
                  key={stage.step}
                  variants={item}
                  className="flex items-start gap-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00D4AA]/15 shrink-0">
                    <span className="text-sm font-bold text-[#00D4AA]">
                      {stage.step}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#FAFAFA] mb-1">
                      {stage.label}
                    </h4>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {stage.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Power Budget Summary */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-20 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 md:p-8"
        >
          <p className="text-sm font-medium tracking-wide text-zinc-600 uppercase mb-6">
            Power Budget
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Battery', value: '500mAh LiPo' },
              { label: 'Avg Draw', value: '1.00mA' },
              { label: 'Runtime', value: '18–24 hrs' },
              { label: 'Charge', value: 'USB-C, ~90 min' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-base font-semibold text-[#FAFAFA]">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
