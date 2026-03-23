'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { label: '00–04', rate: 14 },
  { label: '04–08', rate: 16 },
  { label: '08–12', rate: 19 },
  { label: '12–16', rate: 18 },
  { label: '16–20', rate: 15 },
]

export default function RespiratoryChart() {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="respGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#6366F1" stopOpacity={0.15} />
          </linearGradient>
        </defs>
        <XAxis hide />
        <YAxis hide />
        <Bar
          dataKey="rate"
          fill="url(#respGradient)"
          radius={[4, 4, 0, 0]}
          isAnimationActive={true}
          animationDuration={1200}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
