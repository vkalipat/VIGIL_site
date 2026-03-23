'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Headphones, Zap, Cpu, Bell } from 'lucide-react'

/* ────────────────────────────────────────────
   Signal Pipeline Stages
   ──────────────────────────────────────────── */

const stages = [
  {
    id: 'acquire',
    icon: Headphones,
    label: 'ACQUIRE',
    title: 'Position',
    spec: '4 ch · 200 Hz',
    description:
      'Slides onto the forehead. No adhesive, no gel, no wires. Elastic silicone maintains consistent sensor contact.',
  },
  {
    id: 'amplify',
    icon: Zap,
    label: 'AMPLIFY',
    title: 'Detect',
    spec: '58.6 dB SNR',
    description:
      'Four sensors sample simultaneously — pulse at 200 Hz, temperature at 1 Hz, acoustics at 16 kHz.',
  },
  {
    id: 'process',
    icon: Cpu,
    label: 'PROCESS',
    title: 'Process',
    spec: '<50 ms latency',
    description:
      'On-board signal fusion rejects motion artifacts and weights channels by SNR. Under 50ms latency.',
  },
  {
    id: 'transmit',
    icon: Bell,
    label: 'TRANSMIT',
    title: 'Alert',
    spec: 'BLE 5.0 · 5 s',
    description:
      'Composite vital signs transmit every 5 seconds via BLE 5.0 to bedside dashboard, nurse station, and EHR.',
  },
]

/* ────────────────────────────────────────────
   Mini waveform SVG renderers
   ──────────────────────────────────────────── */

function generateWavePath(
  points: number,
  width: number,
  height: number,
  noiseLevel: number,
  seed: number
): string {
  const step = width / (points - 1)
  let d = `M 0 ${height / 2}`
  for (let i = 1; i < points; i++) {
    const x = i * step
    const base = Math.sin((i + seed) * 0.5) * (height * 0.3)
    const noise = (Math.sin((i + seed) * 3.7) * noiseLevel * height * 0.2)
    const y = height / 2 + base + noise
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

function RawSignalWave({ animate: shouldAnimate }: { animate: boolean }) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!shouldAnimate) return
    let frame: number
    let t = 0
    const tick = () => {
      t += 1
      setOffset(t)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [shouldAnimate])

  const path = generateWavePath(60, 160, 48, 1.2, offset * 0.08)

  return (
    <svg viewBox="0 0 160 48" className="w-full h-12" preserveAspectRatio="none">
      <path
        d={path}
        fill="none"
        stroke="#00D4AA"
        strokeWidth="1.5"
        opacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function CleanSignalWave({ animate: shouldAnimate }: { animate: boolean }) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!shouldAnimate) return
    let frame: number
    let t = 0
    const tick = () => {
      t += 1
      setOffset(t)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [shouldAnimate])

  const path = generateWavePath(60, 160, 48, 0.15, offset * 0.08)

  return (
    <svg viewBox="0 0 160 48" className="w-full h-12" preserveAspectRatio="none">
      <path
        d={path}
        fill="none"
        stroke="#00D4AA"
        strokeWidth="1.5"
        opacity="0.7"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function PeakDetectionWave({ animate: shouldAnimate }: { animate: boolean }) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!shouldAnimate) return
    let frame: number
    let t = 0
    const tick = () => {
      t += 1
      setOffset(t)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [shouldAnimate])

  const points = 60
  const width = 160
  const height = 48
  const step = width / (points - 1)

  // Clean wave
  let pathD = `M 0 ${height / 2}`
  const peaks: { x: number; y: number }[] = []

  for (let i = 1; i < points; i++) {
    const x = i * step
    const base = Math.sin((i + offset * 0.08) * 0.5) * (height * 0.3)
    const y = height / 2 + base
    pathD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`

    // Mark peaks (local maxima at sine wave peaks)
    if (i > 1 && i < points - 1) {
      const prevY = height / 2 + Math.sin((i - 1 + offset * 0.08) * 0.5) * (height * 0.3)
      const nextY = height / 2 + Math.sin((i + 1 + offset * 0.08) * 0.5) * (height * 0.3)
      if (y < prevY && y < nextY && y < height * 0.35) {
        peaks.push({ x, y })
      }
    }
  }

  return (
    <svg viewBox="0 0 160 48" className="w-full h-12" preserveAspectRatio="none">
      <path
        d={pathD}
        fill="none"
        stroke="#00D4AA"
        strokeWidth="1.5"
        opacity="0.7"
        vectorEffect="non-scaling-stroke"
      />
      {peaks.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#00D4AA" opacity="0.9" />
          <line
            x1={p.x}
            y1={p.y - 5}
            x2={p.x}
            y2={2}
            stroke="#00D4AA"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.4"
          />
        </g>
      ))}
    </svg>
  )
}

function TransmitPulse({ animate: shouldAnimate }: { animate: boolean }) {
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    if (!shouldAnimate) return
    let frame: number
    let t = 0
    const tick = () => {
      t += 0.02
      setPulse(t)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [shouldAnimate])

  const ringCount = 3
  return (
    <svg viewBox="0 0 160 48" className="w-full h-12" preserveAspectRatio="none">
      {Array.from({ length: ringCount }).map((_, i) => {
        const phase = ((pulse * 0.8 + i * 0.33) % 1)
        const r = 4 + phase * 20
        const op = Math.max(0, 0.6 - phase * 0.7)
        return (
          <circle
            key={i}
            cx="80"
            cy="24"
            r={r}
            fill="none"
            stroke="#00D4AA"
            strokeWidth="1"
            opacity={op}
          />
        )
      })}
      <circle cx="80" cy="24" r="3" fill="#00D4AA" opacity="0.9" />
    </svg>
  )
}

const waveComponents = [RawSignalWave, CleanSignalWave, PeakDetectionWave, TransmitPulse]

/* ────────────────────────────────────────────
   Pipeline connector arrow (desktop)
   ──────────────────────────────────────────── */

function PipelineArrow({ active, delay }: { active: boolean; delay: number }) {
  return (
    <div className="hidden md:flex items-center justify-center w-12 shrink-0 relative">
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={active ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        className="origin-left"
      >
        <svg width="48" height="24" viewBox="0 0 48 24" className="text-zinc-700">
          <line x1="0" y1="12" x2="36" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
          <polygon points="36,7 48,12 36,17" fill="#00D4AA" opacity="0.5" />
        </svg>
      </motion.div>
      {/* Animated pulse traveling along the arrow */}
      {active && (
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00D4AA]"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: [0, 40, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            delay: delay + 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  )
}

/* ────────────────────────────────────────────
   Pipeline connector arrow (mobile, vertical)
   ──────────────────────────────────────────── */

function PipelineArrowVertical({ active, delay }: { active: boolean; delay: number }) {
  return (
    <div className="flex md:hidden items-center justify-center h-10 relative">
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={active ? { opacity: 1, scaleY: 1 } : {}}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        className="origin-top"
      >
        <svg width="24" height="40" viewBox="0 0 24 40" className="text-zinc-700">
          <line x1="12" y1="0" x2="12" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
          <polygon points="7,28 12,40 17,28" fill="#00D4AA" opacity="0.5" />
        </svg>
      </motion.div>
      {active && (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00D4AA]"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, 32, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            delay: delay + 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  )
}

/* ────────────────────────────────────────────
   Stage Node
   ──────────────────────────────────────────── */

function StageNode({
  stage,
  index,
  active,
}: {
  stage: (typeof stages)[number]
  index: number
  active: boolean
}) {
  const Icon = stage.icon
  const WaveComponent = waveComponents[index]
  const delay = index * 0.15

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 min-w-0"
    >
      <div className="border border-white/[0.08] rounded-lg overflow-hidden bg-[#111118]">
        {/* Stage header bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-[#00D4AA]/10">
            <Icon className="w-3.5 h-3.5 text-[#00D4AA]" />
          </div>
          <span className="font-mono text-[11px] tracking-[0.15em] text-zinc-400 uppercase">
            {stage.label}
          </span>
          <span className="ml-auto font-mono text-[10px] text-[#00D4AA]/60 tracking-wider">
            {stage.spec}
          </span>
        </div>

        {/* Mini waveform visualization */}
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <WaveComponent animate={active} />
        </div>

        {/* Description */}
        <div className="px-4 py-3">
          <p className="text-[13px] leading-relaxed text-zinc-400">
            {stage.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Pipeline label bar (specs ticker)
   ──────────────────────────────────────────── */

const pipelineSpecs = [
  { label: 'Sample Rate', value: '200 Hz' },
  { label: 'Channels', value: '4' },
  { label: 'ADC', value: '12-bit' },
  { label: 'Latency', value: '<50 ms' },
  { label: 'SNR', value: '58.6 dB' },
  { label: 'TX Interval', value: '5 s' },
  { label: 'Protocol', value: 'BLE 5.0' },
  { label: 'Range', value: '27 m' },
]

/* ────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────── */

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-6"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase">
            Signal Pipeline
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            From ward bed to nurse station in 5 seconds
          </h2>
        </motion.div>

        {/* Pipeline specs bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-14 md:mb-16"
        >
          {pipelineSpecs.map((spec) => (
            <div key={spec.label} className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
                {spec.label}
              </span>
              <span className="font-mono text-[11px] text-[#00D4AA]/70">
                {spec.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Desktop: horizontal pipeline */}
        <div className="hidden md:flex items-stretch gap-0">
          {stages.map((stage, index) => (
            <div key={stage.id} className="contents">
              <StageNode stage={stage} index={index} active={isInView} />
              {index < stages.length - 1 && (
                <PipelineArrow active={isInView} delay={index * 0.15 + 0.3} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical pipeline */}
        <div className="flex md:hidden flex-col">
          {stages.map((stage, index) => (
            <div key={stage.id}>
              <StageNode stage={stage} index={index} active={isInView} />
              {index < stages.length - 1 && (
                <PipelineArrowVertical active={isInView} delay={index * 0.15 + 0.3} />
              )}
            </div>
          ))}
        </div>

        {/* Pipeline processing indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex justify-center"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.08] bg-[#111118]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-40 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D4AA]" />
            </span>
            <span className="font-mono text-[11px] tracking-wider text-zinc-400">
              4-stage on-device processing · end-to-end &lt;50 ms
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
