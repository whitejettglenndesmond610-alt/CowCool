# AGENTS.md — Michael Smith Portfolio

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # TypeScript check + production build → dist/
npm run preview  # Preview production build locally
```

There are **no test, lint, or type-check commands** other than `tsc` in the build step.

## Deploy flow

Push to `origin` (`https://github.com/whitejettglenndesmond610-alt/nn.git`). Vercel auto-deploys from the repo. The project is linked to Vercel project `nn`.

To modify after deployment: make changes, `npm run build` to verify locally, then push — Vercel redeploys automatically.

## Architecture

- **React 18 + TypeScript + Vite 6**, single-page app, no router (uses anchor `#` scroll navigation).
- **GSAP + ScrollTrigger** for entrance animations and parallax scrolling. GSAP is imported locally per component (not globally).
- **Framer Motion** for scroll-triggered reveal animations (`useInView`, `whileInView`).
- **hls.js** for HLS video streaming in Hero and Contact sections.
- **Forced dark theme**, no light mode. Colors defined as HSL custom properties in `src/assets/index.css`.

## Component layout

| Directory | Purpose |
|-----------|---------|
| `src/sections/` | Page sections (Hero, Works, Journal, Explorations, Stats, Contact) |
| `src/components/` | Shared UI (LoadingScreen, Navbar) |
| `src/lib/utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `src/assets/index.css` | Tailwind directives + design system + keyframes |

## Key conventions

- Language: English.
- Path alias `@/` → `./src/` (configured in `vite.config.ts` and `tsconfig.json`).
- Tailwind config is TypeScript (`tailwind.config.ts`).
- Custom `accent-gradient`: `linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)`.
- Project data is hardcoded in each section component (no external data store).
- Smooth scrolling via `element.scrollIntoView({ behavior: 'smooth' })`.
