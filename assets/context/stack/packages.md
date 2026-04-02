# Packages

## Rules

| Package | Import | Use for | NEVER use instead |
|---------|--------|---------|-------------------|
| `framer-motion` | `import { motion, useScroll, useTransform, useInView, animate, useMotionValue } from 'framer-motion'` | All entrance animations, hover/tap, parallax, count-up, scroll-linked values | CSS `@keyframes`, CSS `transition`, vanilla JS, `react-spring`, `react-transition-group` |
| `gsap` | `import gsap from 'gsap'` | Pinned scroll sections only (sensor showcase) | — |
| `gsap/ScrollTrigger` | `import { ScrollTrigger } from 'gsap/ScrollTrigger'` | Pin + scrub for sensor showcase only. Call `gsap.registerPlugin(ScrollTrigger)` once per file. | — |
| `tailwindcss` | className strings only | All styling — layout, colors, spacing, typography, responsive | `style={{}}`, CSS modules, `styled-components`, `@emotion`, Sass |
| `lucide-react` | `import { Brain, Heart, Thermometer, Move3d, Sun, Headphones, Zap, Bluetooth, BarChart3 } from 'lucide-react'` | Every icon | `heroicons`, `react-icons`, inline `<svg>`, image icons |
| `recharts` | `import { LineChart, BarChart, Line, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'` | Heart rate trend + sleep stages charts | `chart.js`, `react-chartjs-2`, `victory`, raw `<canvas>` |
| `@react-three/fiber` | `import { Canvas } from '@react-three/fiber'` | 3D scene container | raw `three.js` renderer setup |
| `@react-three/drei` | `import { OrbitControls, Environment, Float } from '@react-three/drei'` | 3D helpers, controls, environments | manual three.js equivalents |
| `three` | `import * as THREE from 'three'` | Geometry, materials, math when drei doesn't cover it | — |
| `next/font/local` | `import localFont from 'next/font/local'` | Cabinet Grotesk headings | Google Fonts CDN, `@font-face` in CSS, system fonts |
| `next/font/google` | `import { Plus_Jakarta_Sans } from 'next/font/google'` | Body text | Google Fonts CDN, `@font-face` in CSS, system fonts |
| `next/dynamic` | `import dynamic from 'next/dynamic'` | Lazy-load R3F and Recharts: `dynamic(() => import(...), { ssr: false })` | `React.lazy` for SSR-unsafe components |

## Component Rules

```
R3F component  → 'use client' + dynamic(() => import('./Foo'), { ssr: false })
Recharts chart → 'use client' + dynamic(() => import('./Foo'), { ssr: false })
Everything else → Server Component by default
```
