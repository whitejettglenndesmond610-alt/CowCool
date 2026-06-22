# Shawn Niu Portfolio V2 — Enhancement Design Spec

**Date:** 2026-06-22
**Status:** Approved
**Type:** Enhancement of existing portfolio (not rebuild)

## 1. Overview

Enhance the existing 3-file portfolio (index.html, style.css, script.js) with:
- Personalized student identity content
- Upgraded Hero section (4-layer visual architecture)
- CSS mockup project card previews
- Replaced 6 student projects with detailed modal data
- Unified cyan-led color system
- Enhanced dynamic interactions
- Demo-mode contact form + Chinese-friendly social links

**Core principle:** Preserve all existing functionality. Only modify/add, never delete working features.

## 2. Color System Revision

**New hierarchy (cyan-led):**

| Role | Color | Usage % |
|------|-------|---------|
| Primary accent | `#00c8e8` (cyan) | 60% — buttons, borders, glow, cursor, tags, title gradient start |
| Secondary accent | `#7c3aed` (purple) | 30% — card borders, orb glow, particle connections, shadows |
| Tertiary accent | `#f472b6` (rose) | 10% — rare hover states, occasional highlights |
| BG primary | `#06080d` (deep blue-black) | Page background |
| BG secondary | `#0c0e14` | Card interiors |

**CSS variable changes:**
- `--accent-cyan`: `#00d2ff` → `#00c8e8`
- `--accent-purple`: `#6c5ce7` → `#7c3aed`
- `--accent-rose`: `#ff6b9d` → `#f472b6`
- `--bg-primary`: `#0a0a0f` → `#06080d`
- `--bg-secondary`: `#111118` → `#0c0e14`
- Gradients updated to match new colors

## 3. Content Personalization — All Sections

### 3.1 Persona
- Name: 牛帅 / Shawn Niu
- Role: Student Developer & AI Explorer
- Style: Real student growth narrative, not fake professional experience

### 3.2 Hero Section
- Typewriter phrases: "Building Cool Stuff with Code & AI" / "前端学习者 · AI 探索者 · 创意制造者" / "Where Learning Meets Creating"
- Description: "A curious student developer passionate about crafting digital experiences. I explore the intersection of frontend development, AI tools, and creative design — building projects that solve real problems while learning something new every day."

### 3.3 About Section
- Identity tags: "Student Developer" / "AI Explorer" / "Frontend Learner"
- Bio: 3 paragraphs about learning journey — started with HTML/CSS, discovered AI tools, now building full-stack projects as a student, passionate about turning ideas into working products
- Stats: 20+ Projects, 12 Skills, 1000+ Coding Hours, 2+ Years Learning

### 3.4 Skills Section
- Frontend: HTML/CSS, JavaScript, React, Vue, Tailwind, Git
- Backend: Node.js, Python, SQL, REST APIs, Linux
- Tools: Figma, VS Code, Claude AI, Chrome DevTools, Vite
- Remove: Three.js, GSAP, GraphQL, 3D Modeling, etc. (too advanced for student)

### 3.5 Projects Section (6 new projects)

| data-project | Title | Type | Tags |
|---|---|---|---|
| dance-booking | 舞蹈室课堂预约系统 | Full-Stack | HTML, CSS, JS, Node.js, MySQL |
| portfolio-site | 学生个人作品集网站 | Frontend | HTML, CSS, JavaScript, Animations |
| ai-builder | AI 建站交互实验 | AI + Web | AI API, JavaScript, Prompt Design |
| booking-app | 课堂预约 App 原型 | UI Design | Figma, Prototyping, Mobile UI |
| dataviz-tool | 数据可视化小工具 | Data Viz | Chart.js, Canvas, REST API |
| interactive-ui | 前端动态交互页面 | Creative Dev | CSS Animations, SVG, JavaScript |

Each with full modal data: title, type, description (3-4 sentences), tech tags, 4 highlights.

### 3.6 Timeline Section (5 milestones)
1. 2023 — 初识前端 (Started with HTML/CSS/JS basics)
2. 2024 — 第一个完整项目 (Built first full-stack web app)
3. 2024 — 探索 AI 工具 (Discovered AI-powered development)
4. 2025 — 建立作品集网站 (Created personal portfolio site)
5. 2025-Now — 持续学习 (Exploring new tech, building projects)

### 3.7 Contact Section
- Title: "LET'S CONNECT"
- Subtitle: "Have a question or just want to say hi?"
- Form: Demo mode — on submit shows "Demo Mode — Not Actually Sent" with toast explanation
- Social links: Email (copy), GitHub, Bilibili, WeChat placeholder
- Location: "Based in [City], China — Student Developer"

### 3.8 Footer
- Text: "© 2026 Shawn Niu. Built with curiosity & code."

## 4. Hero Enhancement — 4-Layer Architecture

### Layer 1: Giant background text
- Multiple rows of "SHAWN NIU" at 4-5rem, opacity 0.04, letter-spacing 0.3em
- CSS grid or repeated divs covering viewport
- Parallax: slight translate on mousemove (JS)

### Layer 2: Energy rings
- 3 concentric elliptical rings behind title
- Rotating at different speeds/directions
- Colors: cyan stroke, opacity 0.08-0.12
- Centered on title region

### Layer 3: Floating ID card (.hero-id-card)
- Glassmorphism small card
- Content: avatar SVG + "SHAWN NIU" + subtitle + 3 micro tags
- Position: right of title on desktop, below on mobile
- Animation: float up/down 4s ease-in-out infinite
- Hover: stops floating, slight 3D rotation

### Layer 4: Foreground title + buttons (existing structure, enhanced)
- Title gradient updated to cyan→purple→cyan
- Entrance animation sequence with delays

### Hero entrance timing:
```
0.0s: BG text fades in
0.2s: Rings appear + start rotating
0.3s: ID card slides in from right + starts floating
0.5s: "Hello, I'm" fades in
0.7s: "SHAWN NIU" blur→sharp
1.0s: Typewriter starts
1.3s: Description fades up
1.6s: Buttons slide in
```

## 5. Project Card Preview — CSS Mockups

### 5.1 Browser Window Mockup (projects: dance-booking, portfolio-site)
```
┌──────────────────────────┐
│ ● ● ●  ▔▔▔▔▔▔▔▔▔▔▔▔  │ ← title bar + traffic lights
├──────────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← address bar
├──────────────────────────┤
│                          │
│  (CSS-drawn content)     │ ← table rows / card grids
│                          │
└──────────────────────────┘
```
- Dance booking: table with rows (CSS borders)
- Portfolio site: hero section mini with button shapes

### 5.2 Mobile Screen (project: booking-app)
```
┌────────────────────┐
│ ▔▔▔▔▔▔▔▔ │ ← notch
│ 10:30  📶 🔋  │ ← status bar
│ ┌──────────────┐ │
│ │ Form fields   │ │ ← form inputs
│ │ [Submit btn]  │ │
│ └──────────────┘ │
└────────────────────┘
```

### 5.3 Abstract Geometric (projects: ai-builder, dataviz-tool, interactive-ui)
- ai-builder: Connected nodes (circles + dashed lines) + pulse animation
- dataviz-tool: Mini bar chart (4 CSS columns) + grid lines
- interactive-ui: Floating shapes (circle, triangle, square) + hover rotation

### 5.4 Hover dynamic changes
- Browser mockups: address bar gets flowing gradient shimmer
- Mobile screen: content area shifts up slightly
- Geometric: nodes pulse faster, bars grow, shapes rotate

## 6. Dynamic Interaction Enhancements

### 6.1 Hero parallax
- Background text shifts slightly on mousemove (JS: translate by -0.02 * mouseX, -0.02 * mouseY)

### 6.2 ID card float
- CSS keyframe float animation on .hero-id-card
- Pauses on hover

### 6.3 Contact social stagger
- On scroll-into-view, social icons light up one by one with 150ms delay
- JS adds .visible class with increasing transition-delay

### 6.4 Existing features preserved
- Particle canvas (80/40/25)
- Custom cursor (dot + ring + lerp)
- Scroll reveal (IntersectionObserver 0.15)
- Navbar scroll state + active tracking
- Timeline line fill + node activation
- 3D card tilt (±8°)
- Project modal (slide-in panel)
- Number count-up (easeOutExpo 2000ms)
- Form validation
- Typewriter
- Smooth scroll
- Mobile hamburger menu
- prefers-reduced-motion

## 7. Contact Form — Demo Mode

- Submit validates normally (required fields, email format)
- On valid submit: button text changes to "Demo Mode — Not Actually Sent", form-success shows "This is a demo form. Reach me via email or social links below!"
- Toast shows same message
- Form resets after 4 seconds

## 8. File Changes Summary

### index.html changes:
- Title tag updated
- Hero: add background text layer, energy rings, ID card
- About: new text content, new stats numbers, new tags
- Skills: replace skill tags
- Projects: replace all 6 cards with new HTML (new preview CSS mockups, new titles/descs/tags, new data-project values)
- Timeline: 5 new milestones with Chinese-English content
- Contact: new title/subtitle, new social links, form demo note
- Footer: new text

### style.css changes:
- Color variables updated
- New Hero layers CSS (.hero-bg-text, .hero-rings, .hero-id-card)
- New card preview styles (6 distinct mockup styles)
- Contact social stagger styles
- Float/pulse/shift keyframes
- Form demo mode styles

### script.js changes:
- Hero parallax handler (bg text mousemove)
- Hero ID card hover interaction
- Contact social stagger reveal
- New projectData object (6 new projects)
- Typewriter phrases updated
- Form demo mode logic updated
- Ring rotation JS (or pure CSS animation)
