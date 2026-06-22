# Shawn Niu — Personal Portfolio Website Design Spec

**Date:** 2026-06-21
**Status:** Approved
**Type:** New Project (from scratch)

## 1. Project Overview

A single-page personal portfolio website for Shawn Niu. Dark, futuristic, high-end visual style that blends AI product landing pages with digital art portfolios and creative studio websites. Built with pure HTML/CSS/JS, zero frameworks, zero dependencies.

**Core objective:** Open the page and immediately feel "this is premium, sophisticated, and visually stunning."

## 2. Visual Design System

### 2.1 Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| Primary Background | `#0a0a0f` | Page background |
| Secondary Background | `#111118` | Card interiors, section backgrounds |
| Glass Background | `rgba(255,255,255,0.03)` | Glassmorphism cards |
| Accent Purple | `#6c5ce7` | Primary interactive, title gradient |
| Accent Cyan | `#00d2ff` | Glow effects, borders, particles |
| Accent Rose | `#ff6b9d` | Emphasis, hover states, highlights |
| Text Primary | `#ffffff` | Headlines |
| Text Secondary | `rgba(255,255,255,0.7)` | Body text |
| Text Muted | `rgba(255,255,255,0.4)` | Meta info |

### 2.2 Typography

- **Display/Headlines:** System font stack optimized for modern rendering, extra-bold weight, large letter-spacing
- **Body:** System font stack, regular weight, comfortable line-height (1.7)
- **Gradient text effect:** Applied to hero title and section headers via `background-clip: text` with animated gradient backgrounds
- **Monospace accents:** Used for code-like tags and stats

### 2.3 CSS Variable Architecture

Three-tier variable system:
1. **Root-level** colors, gradients, shadows
2. **Component-level** card/button/section specific variables  
3. **Animation-level** durations, easings, keyframe definitions

### 2.4 Visual Effects Catalog

| Effect | Technique |
|--------|-----------|
| Gradient text | `linear-gradient` + `-webkit-background-clip: text` + animated `background-position` |
| Glassmorphism | `rgba(255,255,255,0.03)` + `backdrop-filter: blur(20px)` + translucent border |
| Glowing border | `::before` pseudo-element with `conic-gradient` + `@keyframes spin` |
| 3D card tilt | CSS `perspective(1000px)` + JS `mousemove` tracking → `rotateX/Y` |
| Floating glow orbs | Multiple `radial-gradient` circles + `@keyframes float` with different durations |
| Particle canvas | `<canvas>` with 2D context: dots + connecting lines, mouse repulsion |
| Scroll reveal | `IntersectionObserver` → toggle `.visible` class → CSS transitions |
| Number count-up | `requestAnimationFrame` + easing function from 0 to target |

## 3. Page Sections

### 3.1 Navigation Bar

- **Position:** Fixed top, z-index 100
- **Effect:** Glassmorphism with progressive blur on scroll
- **States:**
  - Default: `backdrop-filter: blur(10px)`, semi-transparent background
  - Scrolled: `backdrop-filter: blur(20px)`, darker background, subtle border-bottom
- **Links:** Home / About / Skills / Projects / Timeline / Contact
- **Interactions:**
  - Hover: gradient underline slides in from left
  - Active: glow indicator on current section
  - Click: smooth scroll to section (`behavior: smooth`)
- **Mobile:** Hamburger menu with slide-in overlay

### 3.2 Hero Section (`#home`)

- **Layout:** Full viewport height, centered content
- **Background layers (bottom to top):**
  1. Solid `#0a0a0f`
  2. Canvas particle system (dots + lines, slow drift, mouse repulsion)
  3. Three radial-gradient light orbs slowly floating (purple, cyan, rose)
- **Content sequence (entrance animation):**
  1. Greeting "Hello, I'm" fades in (0.3s delay)
  2. "SHAWN NIU" animates from blurred to sharp (0.6s delay)
  3. Subtitle types out character by character (1.0s delay)
  4. Description fades up (1.5s delay)
  5. Buttons slide up (1.8s delay)
- **Hero title:** Extra-large (clamp 3rem→8rem), gradient text with animated background-position, subtle text-shadow glow
- **Subtitle:** Typewriter effect: "A Creative Developer & Digital Designer"
- **Buttons:** [View Projects] (primary, gradient fill) + [Contact Me] (outlined, glow border)

### 3.3 About Section (`#about`)

- **Layout:** Two-column grid on desktop, single column on mobile
  - Left: Large glass card with avatar placeholder, name, identity tags, bio text
  - Right: 4 stats cards in 2×2 grid
- **Avatar placeholder:** Circular, gradient border, pulsing glow, silhouette icon
- **Identity tags:** [Creative Developer] [UI/UX Designer] [Digital Artist] — pill-shaped, glass style, staggered entrance
- **Bio text:** 3-4 sentences about passion, approach, philosophy
- **Stats cards:** Each shows icon + number + label
  - Projects Completed: 47
  - Skills Mastered: 18
  - Learning Hours: 2,400+
  - Years Experience: 5+
  - Numbers animate from 0 on scroll-into-view
- **Hover interactions:** Card lifts 8px, border glow intensifies, subtle scale

### 3.4 Skills Section (`#skills`)

- **Layout:** Floating skill tag cloud + category groupings
- **Categories:**
  - Frontend: React, Vue, TypeScript, CSS/Sass, Three.js, GSAP
  - Backend: Node.js, Python, PostgreSQL, GraphQL, REST APIs
  - Design: Figma, UI/UX, Motion Design, Brand Identity, 3D Modeling
- **Tag appearance:** Glass pill with icon, subtle border, staggered entrance animation (each tag pops in sequentially)
- **Tag hover:** Scale up 1.1×, glow intensifies, slight float upward
- **Background:** Subtle rotating gradient ring or floating geometry accents

### 3.5 Projects Section (`#projects`) — Page Highlight

- **Layout:** Irregular 2-column grid (some cards span wider)
- **6 project cards (3 dev + 3 design):**

  | # | Name | Type | Tags |
  |---|------|------|------|
  | 1 | Neural Dashboard | Dev | React, D3.js, WebSocket |
  | 2 | Prism Design System | Design | Figma, Design Tokens, Storybook |
  | 3 | CloudFlow Platform | Dev | Node.js, AWS, PostgreSQL |
  | 4 | Aether Brand Identity | Design | Brand Strategy, Visual Design, Motion |
  | 5 | DataViz Explorer | Dev | Three.js, WebGL, TypeScript |
  | 6 | Lumina Mobile App | Design | UI/UX, Prototyping, User Research |

- **Card structure:** Image area (top 60%) + content area (bottom 40%)
- **Card hover (6 simultaneous effects):**
  1. 3D tilt: `perspective(1000px) rotateX/Y` follows mouse position
  2. Lift: `translateY(-12px)`
  3. Image: `scale(1.05)` subtle zoom
  4. Border: conic-gradient glow flows around edges
  5. Shadow: box-shadow intensifies with colored glow
  6. Button: slides in from bottom
- **Card state transition:** All effects transition over 0.4s cubic-bezier
- **Image placeholder:** Dark gradient background with abstract geometric pattern + project icon
- **Modal/Panel:**
  - Opens on card click
  - Right-side sliding panel on desktop, full-screen modal on mobile
  - Background overlay with `backdrop-filter: blur(8px)`
  - Content: project title, full description, tech stack pills, key highlights list, close button
  - Entrance: slide-in from right / fade in
  - Exit: slide-out / fade out, then `display: none`

### 3.6 Timeline Section (`#timeline`)

- **Layout:** Vertical line down center, nodes alternating left/right
- **5 milestones:**
  1. 2018 — Started the Journey (self-taught programming)
  2. 2019 — First Design Project (brand identity for startup)
  3. 2020 — Career Breakthrough (joined digital agency)
  4. 2022 — Major Platform Launch (led full-stack project)
  5. 2024-Present — Independent Creator (freelance & personal projects)
- **Animation:** Timeline line draws from top as user scrolls, nodes light up sequentially, content slides in from left/right
- **Line effect:** SVG or pseudo-element with `stroke-dasharray` animation
- **Node:** Circular dot with pulsing ring when active

### 3.7 Contact Section (`#contact`)

- **Hero closer:** Large title "LET'S CREATE SOMETHING COOL"
- **Layout:** Two-column — form (left) + info/links (right)
- **Form fields:** Name, Email, Message — each with floating labels, glass input background, glow on focus
- **Submit button:** Gradient fill, hover arrow slides right, glow intensifies
- **Info:** Email (copy-on-click), social links (GitHub, LinkedIn, Twitter, Dribbble), location
- **Background:** Intensified glow orbs compared to other sections

### 3.8 Footer

- Minimalist: copyright line + back-to-top arrow
- Back-to-top: smooth scroll, rotates on hover

## 4. JavaScript Interaction Specification

### 4.1 Page Load Animation
- Sequence controller managing entrance delays
- Hero content animates in order (greeting → title → subtitle → description → buttons)
- Page considered "loaded" after entrance sequence completes (~2s)

### 4.2 Scroll-Based Features

**IntersectionObserver** for all reveal animations:
- Threshold: 0.15 (element must be 15% visible)
- Elements get `.reveal` class by default (opacity: 0, translateY: 40px)
- Observer adds `.visible` class → CSS transitions to opacity: 1, translateY: 0
- Stagger children with increasing transition-delay

**Navbar state:**
- `scrollY > 50` → add `.scrolled` class
- Active nav link based on visible section

**Timeline draw:**
- Observe timeline section → calculate scroll progress → animate stroke-dashoffset

### 4.3 Mouse Interactions

**Custom cursor:**
- Small dot (8px) following cursor with slight lag (lerp)
- Outer ring (24px) following with more lag
- On interactive elements: scale up, change color
- Hidden on mobile/touch devices

**Mouse-follow glow:**
- Large radial-gradient spot that follows cursor subtly
- Only visible near edges of sections
- Opacity: 0.1-0.15, blend mode

**Particle repulsion:**
- Mouse position sent to canvas
- Nearby particles pushed away gently

### 4.4 Card 3D Tilt
- Track mouse position relative to card center
- Map to `rotateX` (-10deg to 10deg) and `rotateY` (-10deg to 10deg)
- Reset to neutral on mouse leave with transition
- Apply via CSS custom properties for performance

### 4.5 Project Modal
- Open: set `display: flex` → `requestAnimationFrame` → add `.active` class → CSS transition handles slide
- Close: remove `.active` → wait for transitionend → set `display: none`
- ESC key closes
- Click on overlay closes
- Prevent body scroll when open

### 4.6 Number Count-Up
- Triggered by IntersectionObserver on stats section
- `requestAnimationFrame` loop
- Duration: 2000ms, easeOutExpo easing
- Format final number with commas or "+"

### 4.7 Smooth Scroll Navigation
- Nav link clicks → `element.scrollIntoView({ behavior: 'smooth' })`
- Update URL hash without jump

### 4.8 Form Validation
- Client-side validation with visual feedback
- Required fields, email format check
- Shake animation on error
- Success glow on valid submission
- Demo mode: show success toast without actual submission

## 5. Responsive Strategy

| Breakpoint | Layout Changes |
|------------|---------------|
| > 1200px | Full layout, large typography, grid columns, all effects |
| 1024-1200px | Slightly reduced hero title size, 2-col grids maintained |
| 768-1024px | Single column for about, projects; smaller particles; reduced card tilt |
| < 768px | Full single column, hamburger nav, simplified animations, no custom cursor, reduced particle count |

## 6. Performance Considerations

- Canvas particle count: 80-100 on desktop, 40 on tablet, 25 on mobile
- Use `will-change` sparingly (only on actively animating elements)
- Debounce scroll handlers (16ms / requestAnimationFrame)
- `passive: true` on scroll listeners
- CSS `prefers-reduced-motion` media query to disable animations
- Images: CSS gradient placeholders (no external assets needed)
- No external fonts — system font stack only

## 7. Browser Compatibility

- Target: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- `backdrop-filter`: supported in all modern browsers
- `IntersectionObserver`: polyfill not needed for target browsers
- Canvas: universally supported
- CSS custom properties: universally supported

## 8. File Manifest

| File | Purpose | Approx. Lines |
|------|---------|---------------|
| `index.html` | Semantic HTML structure with ARIA labels | ~300 |
| `style.css` | Complete visual system, animations, responsive | ~800 |
| `script.js` | All interactive logic | ~500 |
| **Total** | | **~1600** |

All three files are self-contained. No external dependencies, CDN links, or build tools required.
