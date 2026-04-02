# Common Fixes

## R3F / Three.js

| Bug | Fix |
|-----|-----|
| Hydration mismatch / `document is not defined` | Wrap with `dynamic(() => import('./Scene'), { ssr: false })` |
| Canvas renders 0x0 | Parent needs explicit `height` — e.g. `h-[400px] w-full` |
| "Cannot find module three" | `npm i three @types/three` in `site/` |

## GSAP

| Bug | Fix |
|-----|-----|
| ScrollTrigger not firing | Call `gsap.registerPlugin(ScrollTrigger)` before any trigger code |
| Pin jumps on resize | Add `invalidateOnRefresh: true` to ScrollTrigger config |
| Cleanup errors on unmount | Wrap in `gsap.context()`, return `() => ctx.revert()` in useEffect |

## Recharts

| Bug | Fix |
|-----|-----|
| Chart renders blank / 0 height | Wrap in `<ResponsiveContainer width="100%" height={150}>` |
| SSR crash | `dynamic(() => import('./Chart'), { ssr: false })` |
| Axes showing when unwanted | Add `<XAxis hide /> <YAxis hide />` |

## Wrong Package Used

| Mistake | Correct |
|---------|---------|
| CSS `@keyframes` for entrance | `framer-motion` `initial` + `whileInView` |
| `react-icons` or inline `<svg>` | `lucide-react` |
| `style={{}}` on any element | Tailwind `className` |
| `React.lazy` for R3F/Recharts | `next/dynamic` with `{ ssr: false }` |

## Bundle Size

| Issue | Fix |
|-------|-----|
| Three.js in main bundle | Dynamic import with `ssr: false` |
| All of recharts imported | Import only used components: `import { LineChart, Line } from 'recharts'` |
| Fonts loaded from CDN | Use `next/font/local` or `next/font/google` — auto self-hosted |
