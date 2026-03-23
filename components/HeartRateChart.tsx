'use client'

import { useRef, useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import { motion, useInView } from 'framer-motion'

const data = Array.from({ length: 60 }, (_, i) => ({
  t: i,
  bpm:
    70 +
    Math.sin(i * 0.3) * 6 +
    Math.sin(i * 0.13) * 4 +
    Math.cos(i * 0.07) * 2,
}))

const lastPoint = data[data.length - 1]

export default function HeartRateChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (isInView) {
      // Small delay to let recharts render before animating
      const timer = setTimeout(() => setAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  return (
    <div ref={containerRef} className="relative">
      <style>{`
        .hr-line {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          transition: stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hr-line.hr-drawn {
          stroke-dashoffset: 0;
        }
      `}</style>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis hide />
          <YAxis hide domain={[55, 85]} />
          <Line
            type="monotone"
            dataKey="bpm"
            stroke="#00D4AA"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            className={`hr-line${animated ? ' hr-drawn' : ''}`}
          />
        </LineChart>
      </ResponsiveContainer>
      {/* Pulsing dot at end of line */}
      {animated && (
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-[#00D4AA]"
          style={{
            right: '5%',
            top: `${((85 - lastPoint.bpm) / (85 - 55)) * 150}px`,
          }}
          animate={{ scale: [1, 1.8, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-full bg-[#00D4AA]/30 animate-ping" />
        </motion.div>
      )}
    </div>
  )
}
