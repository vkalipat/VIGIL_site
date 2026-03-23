'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, useInView, useMotionValue, animate, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'

const HeartRateChart = dynamic(
  () => import('../components/HeartRateChart'),
  { ssr: false }
)

const RespiratoryChart = dynamic(
  () => import('../components/RespiratoryChart'),
  { ssr: false }
)

/* ─── Pulse Waveform (HTML Canvas) ─── */
function PulseWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })
  const rafId = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const t = performance.now() / 1000

    ctx.clearRect(0, 0, w, h)

    /* ─── Subtle grid lines at 25%, 50%, 75% ─── */
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    for (const frac of [0.25, 0.5, 0.75]) {
      const gy = h * frac
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(w, gy)
      ctx.stroke()
    }

    const waves = [
      { freq: 1.2, amp: 0.35, speed: 0.8, color: 'rgba(0,212,170,0.6)', bloom: 'rgba(0,212,170,0.12)' },
      { freq: 2.4, amp: 0.2, speed: 1.2, color: 'rgba(0,212,170,0.3)', bloom: 'rgba(0,212,170,0.06)' },
      { freq: 0.6, amp: 0.15, speed: 0.5, color: 'rgba(99,102,241,0.5)', bloom: 'rgba(99,102,241,0.10)' },
      { freq: 3.0, amp: 0.1, speed: 1.6, color: 'rgba(99,102,241,0.25)', bloom: 'rgba(99,102,241,0.05)' },
    ]

    /* FIFO sweep: the wave scrolls right-to-left; a leading edge moves left-to-right */
    const sweepPeriod = 4 // seconds per full sweep
    const sweepPos = (t % sweepPeriod) / sweepPeriod // 0-1, left-to-right

    for (const wave of waves) {
      const buildPath = () => {
        const points: { x: number; y: number }[] = []
        for (let x = 0; x <= w; x++) {
          const normalX = x / w
          const y =
            h / 2 +
            Math.sin(normalX * Math.PI * 2 * wave.freq + t * wave.speed) *
              h *
              wave.amp
          points.push({ x, y })
        }
        return points
      }

      const points = buildPath()

      /* Bloom / glow trail (thicker, more transparent) */
      ctx.beginPath()
      ctx.strokeStyle = wave.bloom
      ctx.lineWidth = 6
      for (let i = 0; i < points.length; i++) {
        const normalX = points[i].x / w
        /* Only draw up to the sweep position for FIFO effect */
        if (normalX > sweepPos) break
        if (i === 0) {
          ctx.moveTo(points[i].x, points[i].y)
        } else {
          ctx.lineTo(points[i].x, points[i].y)
        }
      }
      ctx.stroke()

      /* Main line */
      ctx.beginPath()
      ctx.strokeStyle = wave.color
      ctx.lineWidth = 1.5
      for (let i = 0; i < points.length; i++) {
        const normalX = points[i].x / w
        if (normalX > sweepPos) break
        if (i === 0) {
          ctx.moveTo(points[i].x, points[i].y)
        } else {
          ctx.lineTo(points[i].x, points[i].y)
        }
      }
      ctx.stroke()
    }

    rafId.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    if (isInView) {
      rafId.current = requestAnimationFrame(draw)
    }
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [isInView, draw])

  return (
    <div ref={containerRef} className="w-full h-[150px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

/* ─── Temperature Gauge (SVG + framer-motion) ─── */
function TemperatureGauge() {
  const value = 36.8
  const min = 35
  const max = 40
  const progress = (value - min) / (max - min)

  const radius = 54
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  const gaugeRef = useRef(null)
  const gaugeInView = useInView(gaugeRef, { once: true })
  const motionCount = useMotionValue(min)
  const displayCount = useTransform(motionCount, (v) => v.toFixed(1))
  const [displayValue, setDisplayValue] = useState(min.toFixed(1))

  useEffect(() => {
    const unsubscribe = displayCount.on('change', (v) => setDisplayValue(v))
    return unsubscribe
  }, [displayCount])

  useEffect(() => {
    if (gaugeInView) {
      animate(motionCount, value, { duration: 1.5, ease: [0.16, 1, 0.3, 1] })
    }
  }, [gaugeInView, motionCount, value])

  return (
    <div ref={gaugeRef} className="flex items-center justify-center h-[150px]">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        className="block"
      >
        {/* Background circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress circle */}
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#00D4AA"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: dashOffset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="origin-center -rotate-90"
          style={{ transformOrigin: '70px 70px' }}
        />
        {/* Value text — count up */}
        <text
          x="70"
          y="66"
          textAnchor="middle"
          className="fill-[#FAFAFA] text-2xl font-bold"
          fontSize="24"
          fontWeight="700"
        >
          {displayValue}
        </text>
        <text
          x="70"
          y="86"
          textAnchor="middle"
          className="fill-zinc-400 text-xs"
          fontSize="12"
        >
          °C
        </text>
      </svg>
    </div>
  )
}

/* ─── Card wrapper ─── */
function ChartCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="group relative bg-[#111118] rounded-2xl p-6 border border-white/[0.08] hover:border-white/[0.15] transition-colors duration-500 overflow-hidden h-full"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,170,0.04)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Live data shimmer sweep */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      </motion.div>
      <p className="relative text-sm font-medium tracking-wide text-zinc-500 mb-4 uppercase">
        {title}
      </p>
      <div className="relative">{children}</div>
    </motion.div>
  )
}

/* ─── Main section ─── */
export default function DataPreview() {
  return (
    <section className="py-24 md:py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600 uppercase mb-4">
            Continuous Monitoring
          </p>
          <h2 className="relative text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#FAFAFA]">
            <span className="relative inline-block">
              <span className="font-mono text-[#00D4AA]">17,280</span>
              {/* Hand-drawn circle annotation — md+ only */}
              <span className="hidden md:block absolute inset-0 pointer-events-none">
                <motion.svg
                  viewBox="0 0 150 50"
                  className="absolute -top-3 -left-3 w-[calc(100%+24px)] h-[calc(100%+24px)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M-5,25 C-5,-5 155,-5 155,25 C155,55 -5,55 -5,25"
                    stroke="#00D4AA"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                  />
                </motion.svg>
                {/* Curved arrow + annotation text */}
                <motion.svg
                  viewBox="0 0 200 60"
                  className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-[200px] h-[60px]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <motion.path
                    d="M100,5 C95,5 60,8 55,25 C52,35 58,40 65,38"
                    stroke="#00D4AA"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
                  />
                  {/* Arrowhead */}
                  <motion.path
                    d="M60,32 L65,38 L58,38"
                    stroke="#00D4AA"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 2.0 }}
                  />
                </motion.svg>
                <motion.span
                  className="absolute -bottom-[4.5rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-sm italic text-[#00D4AA]"
                  style={{ rotate: '-3deg' }}
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 2.2 }}
                >
                  ← this changes everything
                </motion.span>
              </span>
            </span>{" "}
            data points per day.{" "}
            <span className="text-zinc-500">Not 3.</span>
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-zinc-400 mt-6 max-w-3xl mx-auto">
            Continuous surveillance replaces intermittent sampling.
            Deterioration detected in seconds, not hours.
          </p>
        </div>

        {/* Bento Grid — asymmetric for visual interest */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Pulse waveform spans 2 cols — the hero chart */}
          <div className="md:col-span-2">
            <ChartCard title="Pulse Waveform">
              <PulseWaveform />
            </ChartCard>
          </div>

          {/* Temperature gauge — single col, tall */}
          <div className="md:row-span-2">
            <ChartCard title="Temperature">
              <div className="md:h-[340px] flex items-center justify-center">
                <TemperatureGauge />
              </div>
            </ChartCard>
          </div>

          {/* Heart rate — single col */}
          <ChartCard title="Heart Rate Trend">
            <HeartRateChart />
          </ChartCard>

          {/* Respiratory — single col */}
          <ChartCard title="Respiratory Rate">
            <RespiratoryChart />
          </ChartCard>
        </div>
      </motion.div>
    </section>
  )
}
