# AGENTS.md — Shawn Niu Portfolio

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

There are no test, lint, or type-check scripts.

## Deploy flow

Push to `origin` (`https://github.com/whitejettglenndesmond610-alt/nn.git`). Vercel auto-deploys the linked project `nn`. Run `npm run build` before pushing.

## Architecture

- Vue 3 + JavaScript + Vite 6; no router and no document scrolling.
- `App.vue` owns six full-screen pages (`home`, `about`, `skills`, `projects`, `timeline`, `contact`) and switches dynamic components behind a GSAP mask transition.
- Navigation is click-only on desktop; mobile also supports horizontal swipe. Hashes use `history.pushState`, not anchor scrolling.
- Every section must fit inside `100dvh`; only `ProjectDetail.vue` may scroll vertically.
- Projects and journey use click-driven local state. Do not reintroduce scroll-driven cards, timelines, Lenis, or ScrollTrigger.
- `KnowledgeCore.vue` dynamically imports Three.js and must keep its reduced-motion/WebGL fallback behavior.
- GSAP animations belong in `onMounted`, scoped with `gsap.context()`, and must be reverted in `onUnmounted`.
- `src/data/portfolio.js` is the source of truth for profile, skills, projects, and journey content. Do not invent project claims or links.

## Layout

| Path | Purpose |
|------|---------|
| `src/sections/` | Six full-screen pages |
| `src/components/AppNavigation.vue` | Desktop navigation and mobile overlay menu |
| `src/components/BrandIntro.vue` | First-session knowledge-seed opening animation |
| `src/components/PageTransition.vue` | Direction-aware organic leaf page transition |
| `src/components/TransitionGlyph.vue` | Page-specific SVG glyphs used during transitions |
| `src/components/KnowledgeCore.vue` | Hero wireframe Three.js scene |
| `src/components/CapabilityIcon.vue` | Animated SVG icons for the three capability bands |
| `src/components/ProjectFlow.vue` | Project-specific animated data-flow diagram |
| `src/components/ProjectDetail.vue` | Scrollable project side panel |
| `src/lib/magnetic.js` | Reduced-motion-safe magnetic pointer directive |
| `src/data/portfolio.js` | All portfolio copy and project data |
| `src/assets/index.css` | Daylight AI Studio design system |

## Conventions

- Chinese UI copy with English technical terms and metadata.
- Fixed light theme: warm white, graphite, sky blue, and mint. Do not add a theme toggle.
- Sections use open editorial layouts, not repeated rounded cards. Reserve contained surfaces for the project product window and `ProjectDetail.vue`.
- Fonts: Manrope for UI/display, IBM Plex Mono for metadata.
- Page navigation emits `navigate` to `App.vue`; never use `scrollIntoView` or `window.scrollTo`.
- Project links remain blank and visibly marked as pending until the user provides exact GitHub URLs.
- Do not expose the phone number from `简历.docx`. Resume download stays unavailable until a redacted PDF is supplied.
- All motion must respect `prefers-reduced-motion`; mobile layouts cannot depend on hover.
