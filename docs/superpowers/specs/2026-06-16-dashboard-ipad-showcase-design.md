# Live Dashboard Showcase (iPad) — Design

**Date:** 2026-06-16
**Status:** Approved
**Topic:** Display the VIGIL dashboard live inside an iPad mockup on the landing page, above the roadmap.

## Goal

Showcase the deployed VIGIL dashboard (https://vigil-dashboard-six.vercel.app) on the
marketing landing page by embedding it live inside a landscape iPad device mockup,
positioned between the `HeroReveal` section and the `Roadmap` section.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Render mode | **Live iframe embed** of the deployed dashboard |
| Orientation | **Landscape** iPad |
| Interactivity | **Display-only** — iframe is purely visual (`pointer-events: none`), scroll/clicks pass through to the page; a CTA button links out to the real app |
| Section copy | **iPad only** — no section heading; one CTA button beneath the device |
| iPad frame source | **Magic MCP** (`21st_magic_component_builder`), adapted to the site aesthetic |

Confirmed precondition: the deployed dashboard returns `HTTP 200` with **no
`X-Frame-Options` and no CSP `frame-ancestors`** restriction, so iframe embedding is allowed.

## Placement

`app/page.tsx` render order becomes:

```
ShaderBackground → Hero → HeroReveal → DashboardShowcase → Roadmap
```

## Components

### `sections/DashboardShowcase.tsx` (new, "use client")
- Full-width section, dark background consistent with site (`#0A0A0F`).
- Renders `IpadFrame` centered, containing the live dashboard.
- **Scaling:** `<iframe>` rendered at a fixed desktop size (~1440×900, 16:10) and fit
  into the iPad screen via `transform: scale(k)` with `transform-origin: top left`,
  wrapped in an `overflow: hidden` container. The screen area uses the same 16:10
  aspect ratio so there is no letterboxing.
- **Display-only:** the iframe wrapper has `pointer-events: none`; page scroll is never trapped.
- **Lazy mount:** the iframe is only mounted once the section nears the viewport
  (`IntersectionObserver`), with `loading="lazy"`. A dark skeleton/shimmer placeholder
  shows until the iframe loads (`onLoad`).
- **CTA:** below the iPad, an "Open full dashboard ↗" button reusing the site's
  button pattern (`MagneticButton` / `HoverGlowButton`, teal `#00D4AA` accent),
  linking to https://vigil-dashboard-six.vercel.app with `target="_blank" rel="noopener noreferrer"`.
- **Motion:** `whileInView` reveal consistent with the site — iPad fades + scales up
  slightly (subtle tilt straightening) using ease `[0.16, 1, 0.3, 1]`,
  `viewport={{ once: true }}`. Not a pinned scroll section.

### `components/IpadFrame.tsx` (new)
- Landscape iPad device mockup generated via Magic MCP: bezel, rounded corners,
  camera dot, subtle drop shadow. Accepts `children` rendered into the screen area.
- Adapted to the site's dark/teal aesthetic if Magic's default output clashes.
- Fallback (only if Magic is unavailable): a hand-built CSS frame in the same file.

### `app/page.tsx` (edit)
- Import and insert `<DashboardShowcase />` between `<HeroReveal />` and `<Roadmap />`.

## Out of scope (YAGNI)

- No section heading/subtext.
- No interactive embed, no multi-view cycling, no static screenshots.
- No changes to the dashboard repo itself.
- No auth handling — relies on the public deployed dashboard.

## Risks

- The showcase depends on the external deploy staying up; if it goes down the iframe
  shows the dashboard's own error state. Acceptable per "live embed" choice.
- The dashboard's desktop layout must look acceptable scaled to ~16:10; scale factor
  may need tuning during implementation.
