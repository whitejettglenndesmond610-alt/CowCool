# Shawn Niu Portfolio V2 Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance existing portfolio with student-personalized content, 4-layer Hero, CSS mockup project previews, cyan-led color system, demo-mode contact form, and enhanced interactions — all by modifying index.html, style.css, script.js.

**Architecture:** Three existing files modified in-place. CSS variables updated first (foundation for all visual changes). HTML sections rewritten for new content. CSS extended for Hero layers, card previews, and new animations. JS updated for new project data, form demo mode, parallax, and social stagger. Each task modifies specific sections of existing files — never deletes working features.

**Tech Stack:** Pure HTML5, CSS3, Vanilla JS ES2020+. No new dependencies.

## Global Constraints

- Zero external dependencies — no frameworks, no npm packages, no CDN fonts/icons
- Preserve ALL existing JavaScript functionality (particles, cursor, scroll reveal, navbar, timeline, 3D tilt, modal, count-up, typewriter, smooth scroll, mobile menu, prefers-reduced-motion)
- Cyan-led color system: `#00c8e8` primary (60%), `#7c3aed` secondary (30%), `#f472b6` tertiary (10%)
- Dark backgrounds: `#06080d` primary, `#0c0e14` secondary
- Persona: 牛帅 / Shawn Niu, Student Developer & AI Explorer
- 6 new projects with data-project IDs: dance-booking, portfolio-site, ai-builder, booking-app, dataviz-tool, interactive-ui
- Form is demo-only: submit shows "Demo Mode — Not Actually Sent"
- All copy must reflect real student identity — no fake professional claims
- Chinese + English mixed content acceptable for timeline and tags
- Hero 4-layer architecture: BG text → energy rings → ID card → foreground title
- 6 distinct CSS mockup previews for project cards (2 browser window, 1 mobile screen, 3 abstract geometric)
- Responsive breakpoints preserved: 1200px, 1024px, 768px
- `prefers-reduced-motion` support mandatory

---

### Task 1: CSS Color System Overhaul + New Keyframes

**Files:**
- Modify: `style.css` — lines 1-120 (CSS variables and keyframes sections)

**Interfaces:**
- Consumes: none (foundational change)
- Produces: Updated `:root` variables (new accent colors, backgrounds, gradients); new keyframes (`floatCard`, `ringPulse`, `addressShimmer`, `nodePulse`, `barGrow`); unchanged: all existing class definitions

- [ ] **Step 1: Update CSS custom properties**

In `style.css`, replace the `:root` block variables with the new color values:

```css
:root {
  /* Background */
  --bg-primary: #06080d;
  --bg-secondary: #0c0e14;
  --bg-card: rgba(255, 255, 255, 0.025);

  /* Accent Colors — cyan-led hierarchy */
  --accent-cyan: #00c8e8;
  --accent-purple: #7c3aed;
  --accent-rose: #f472b6;
  --accent-cyan-rgb: 0, 200, 232;
  --accent-purple-rgb: 124, 58, 237;
  --accent-rose-rgb: 244, 114, 182;

  /* Gradients — updated with new colors */
  --gradient-hero: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-cyan));
  --gradient-card-border: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-rose));
  --gradient-button: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  --gradient-text: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-rose));

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.4);

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.025);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-bg-hover: rgba(255, 255, 255, 0.05);
  --glass-border-hover: rgba(255, 255, 255, 0.12);
  --glass-blur: blur(20px);

  /* Shadows & Glows — updated for new colors */
  --glow-cyan: 0 0 30px rgba(0, 200, 232, 0.3);
  --glow-purple: 0 0 40px rgba(124, 58, 237, 0.25);
  --glow-rose: 0 0 30px rgba(244, 114, 182, 0.15);
  --shadow-card: 0 4px 30px rgba(0, 0, 0, 0.4);
  --shadow-card-hover: 0 8px 50px rgba(0, 200, 232, 0.15);

  /* Spacing & Sizing */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;
  --section-gap: 120px;
  --content-width: 1200px;

  /* Animation */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 0.2s;
  --duration-normal: 0.4s;
  --duration-slow: 0.8s;

  /* Typography */
  --font-display: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
}
```

- [ ] **Step 2: Add new keyframes for V2 features**

After the existing keyframes in `style.css`, append these new keyframes:

```css
/* Hero ID card float */
@keyframes floatCard {
  0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
  25% { transform: translateY(-8px) rotateX(2deg) rotateY(-3deg); }
  50% { transform: translateY(-2px) rotateX(-1deg) rotateY(2deg); }
  75% { transform: translateY(-10px) rotateX(1deg) rotateY(-1deg); }
}

/* Energy ring pulse */
@keyframes ringPulse {
  0%, 100% { opacity: 0.06; }
  50% { opacity: 0.12; }
}

/* Address bar shimmer for browser mockup hover */
@keyframes addressShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Node pulse for AI builder preview */
@keyframes nodePulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 4px rgba(0, 200, 232, 0.4); }
  50% { transform: scale(1.3); box-shadow: 0 0 12px rgba(0, 200, 232, 0.8); }
}

/* Bar grow for dataviz preview */
@keyframes barGrow {
  from { height: 0; }
}

/* Social icon stagger reveal */
@keyframes socialPopIn {
  from { opacity: 0; transform: translateY(12px) scale(0.8); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

- [ ] **Step 3: Verify color changes in browser**

Open `index.html` in browser. Confirm:
- Background is the new deeper `#06080d`
- Glow orbs use new color values
- Button gradients use cyan/purple mix
- Glass cards have subtle new border color
- No broken CSS — check DevTools for no error

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "feat: update CSS color system — cyan-led hierarchy, new keyframes"
```

---

### Task 2: HTML Hero Enhancement — 4-Layer Architecture

**Files:**
- Modify: `index.html` — lines 58-81 (Hero section)
- Modify: `style.css` — append Hero layer styles

**Interfaces:**
- Consumes: Updated CSS variables from Task 1
- Produces: `.hero-bg-text` layer, `.hero-rings` layer (3 rings), `.hero-id-card` element in HTML; all corresponding CSS classes

- [ ] **Step 1: Add Hero layers to HTML**

Replace the Hero section in `index.html` (lines 58-81) with:

```html
  <!-- ============ HERO SECTION ============ -->
  <section id="home" class="hero">
    <!-- Layer 1: Giant background text -->
    <div class="hero-bg-text" aria-hidden="true">
      <span>SHAWN NIU</span><span>SHAWN NIU</span><span>SHAWN NIU</span>
      <span>SHAWN NIU</span><span>SHAWN NIU</span><span>SHAWN NIU</span>
      <span>SHAWN NIU</span><span>SHAWN NIU</span><span>SHAWN NIU</span>
    </div>

    <!-- Layer 2: Energy rings -->
    <div class="hero-rings" aria-hidden="true">
      <div class="hero-ring hero-ring--1"></div>
      <div class="hero-ring hero-ring--2"></div>
      <div class="hero-ring hero-ring--3"></div>
    </div>

    <!-- Layer 3: Floating ID card -->
    <div class="hero-id-card glass-card reveal" aria-hidden="true">
      <div class="id-card-avatar">
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="38" r="16" stroke="currentColor" stroke-width="2"/>
          <path d="M20 85c0-16.569 13.431-30 30-30s30 13.431 30 30" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <span class="id-card-name">SHAWN NIU</span>
      <span class="id-card-role">Student Developer & AI Explorer</span>
      <div class="id-card-tags">
        <span>Frontend</span><span>AI</span><span>Design</span>
      </div>
    </div>

    <!-- Layer 4: Foreground content -->
    <div class="hero-content">
      <p class="hero-greeting reveal">Hello, I'm</p>
      <h1 class="hero-title reveal">SHAWN NIU</h1>
      <p class="hero-subtitle reveal"><span class="typewriter-text"></span><span class="typewriter-cursor">|</span></p>
      <p class="hero-description reveal">A curious student developer passionate about crafting digital experiences. I explore the intersection of frontend development, AI tools, and creative design — building projects that solve real problems while learning something new every day.</p>
      <div class="hero-buttons reveal">
        <a href="#projects" class="btn btn-primary">
          <span>View Projects</span>
          <svg class="btn-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#contact" class="btn btn-outline">
          <span>Contact Me</span>
        </a>
      </div>
    </div>
    <div class="scroll-indicator" aria-hidden="true">
      <span>Scroll</span>
      <div class="scroll-line"></div>
    </div>
  </section>
```

- [ ] **Step 2: Add Hero layer CSS**

Append to `style.css` after the existing Hero styles:

```css
/* ============================================
   HERO LAYER 1 — Giant Background Text
   ============================================ */

.hero-bg-text {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: center;
  justify-items: center;
  gap: 8px 40px;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 1s var(--ease-out-expo);
}

.hero-loaded .hero-bg-text {
  opacity: 1;
  transition-delay: 0s;
}

.hero-bg-text span {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.03);
  letter-spacing: 0.25em;
  white-space: nowrap;
  user-select: none;
  line-height: 1;
}

/* ============================================
   HERO LAYER 2 — Energy Rings
   ============================================ */

.hero-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  width: 600px;
  height: 600px;
  opacity: 0;
  transition: opacity 0.8s var(--ease-out-expo) 0.2s;
}

.hero-loaded .hero-rings {
  opacity: 1;
}

.hero-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid var(--accent-cyan);
}

.hero-ring--1 {
  width: 380px;
  height: 200px;
  animation: spinSlow 18s linear infinite, ringPulse 3s ease-in-out infinite;
  opacity: 0.08;
}

.hero-ring--2 {
  width: 480px;
  height: 260px;
  border-color: var(--accent-purple);
  animation: spinSlow 22s linear infinite reverse, ringPulse 4s ease-in-out infinite;
  opacity: 0.06;
}

.hero-ring--3 {
  width: 580px;
  height: 320px;
  border-color: var(--accent-cyan);
  animation: spinSlow 26s linear infinite, ringPulse 5s ease-in-out infinite 1s;
  opacity: 0.05;
}

/* ============================================
   HERO LAYER 3 — Floating ID Card
   ============================================ */

.hero-id-card {
  position: absolute;
  top: 20%;
  right: 8%;
  z-index: 2;
  width: 240px;
  padding: 28px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  opacity: 0;
  transform: translateX(60px);
  transition:
    opacity 0.8s var(--ease-out-expo) 0.3s,
    transform 0.8s var(--ease-out-expo) 0.3s;
  animation: floatCard 5s ease-in-out infinite;
  animation-play-state: paused;
}

.hero-loaded .hero-id-card {
  opacity: 1;
  transform: translateX(0);
  animation-play-state: running;
}

.hero-id-card:hover {
  animation-play-state: paused;
  transform: translateY(-6px) rotateX(2deg) rotateY(-4deg) !important;
  border-color: var(--accent-cyan);
  box-shadow: var(--glow-cyan), var(--shadow-card);
}

.id-card-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid rgba(0, 200, 232, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-cyan);
  box-shadow: 0 0 20px rgba(0, 200, 232, 0.15);
}

.id-card-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: var(--gradient-text);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.id-card-role {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.id-card-tags {
  display: flex;
  gap: 6px;
}

.id-card-tags span {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: rgba(0, 200, 232, 0.08);
  border: 1px solid rgba(0, 200, 232, 0.15);
  color: var(--accent-cyan);
}
```

- [ ] **Step 3: Add responsive overrides for Hero layers**

Append to the `@media (max-width: 768px)` section in `style.css`:

```css
  /* Hero layers — mobile */
  .hero-bg-text {
    grid-template-columns: repeat(2, 1fr);
    gap: 4px 20px;
  }
  .hero-bg-text span {
    font-size: clamp(2rem, 5vw, 3.5rem);
  }
  .hero-rings {
    width: 340px;
    height: 340px;
  }
  .hero-ring--1 { width: 260px; height: 140px; }
  .hero-ring--2 { width: 320px; height: 180px; }
  .hero-ring--3 { width: 380px; height: 220px; }
  .hero-id-card {
    position: relative;
    top: auto;
    right: auto;
    width: 220px;
    margin: 0 auto 32px;
  }
```

- [ ] **Step 4: Verify Hero layers**

Open in browser:
- Background text visible (very subtle, 3x3 grid)
- Energy rings visible as rotating ellipses behind title
- ID card floats on desktop, sits below title on mobile
- All 4 layers visible and not overlapping awkwardly
- Entrance animation sequence works with .hero-loaded

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "feat: add Hero 4-layer architecture — BG text, energy rings, floating ID card"
```

---

### Task 3: HTML Content Replacement — About, Skills, Timeline, Contact, Footer

**Files:**
- Modify: `index.html` — About, Skills, Timeline, Contact, Footer sections

**Interfaces:**
- Consumes: Task 1 CSS variables, existing section class structure
- Produces: All sections with personalized student content; new stats values (20, 12, 1000, 2); new skill tags (student-appropriate); new timeline with Chinese-English milestones; new contact links (GitHub, Bilibili, WeChat)

- [ ] **Step 1: Replace About section**

Replace lines 83-142 (About section) in `index.html`:

```html
  <!-- ============ ABOUT SECTION ============ -->
  <section id="about" class="about section">
    <div class="section-header reveal">
      <h2 class="section-title">About Me</h2>
      <p class="section-subtitle">Student Developer · AI Explorer · Lifelong Learner</p>
    </div>
    <div class="about-grid">
      <div class="about-card glass-card reveal">
        <div class="avatar-wrapper">
          <div class="avatar">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="38" r="16" stroke="currentColor" stroke-width="2"/>
              <path d="M20 85c0-16.569 13.431-30 30-30s30 13.431 30 30" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="avatar-ring"></div>
        </div>
        <div class="identity-tags">
          <span class="tag">Student Developer</span>
          <span class="tag">AI Explorer</span>
          <span class="tag">Frontend Learner</span>
        </div>
        <div class="about-text">
          <p>Hey! I'm 牛帅 (Shawn) — a student who fell in love with building things on the web. What started as curiosity about "how websites work" turned into a full-blown passion for frontend development, creative coding, and AI-powered tools.</p>
          <p>I believe the best way to learn is by building. Every project in this portfolio started as a question — "Can I make this?" — and ended as a working product. Along the way, I've picked up HTML/CSS, JavaScript, React, Node.js, and a growing fascination with how AI can supercharge the creative process.</p>
          <p>Right now, I'm diving deeper into full-stack development, exploring AI APIs, and experimenting with interactive web experiences. I'm always looking for the next cool thing to build.</p>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card glass-card reveal" data-count="20">
          <span class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>
          </span>
          <span class="stat-number" data-target="20" data-suffix="+">0</span>
          <span class="stat-label">Projects Built</span>
        </div>
        <div class="stat-card glass-card reveal" data-count="12">
          <span class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>
          </span>
          <span class="stat-number" data-target="12">0</span>
          <span class="stat-label">Skills Learning</span>
        </div>
        <div class="stat-card glass-card reveal" data-count="1000">
          <span class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
          <span class="stat-number" data-target="1000" data-suffix="+">0</span>
          <span class="stat-label">Coding Hours</span>
        </div>
        <div class="stat-card glass-card reveal" data-count="2">
          <span class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </span>
          <span class="stat-number" data-target="2" data-suffix="+">0</span>
          <span class="stat-label">Years Learning</span>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Replace Skills section**

Replace lines 145-196 (Skills section) in `index.html`:

```html
  <!-- ============ SKILLS SECTION ============ -->
  <section id="skills" class="skills section">
    <div class="section-header reveal">
      <h2 class="section-title">Skills & Tools</h2>
      <p class="section-subtitle">What I'm learning and using</p>
    </div>

    <div class="skills-categories">
      <div class="skill-category reveal">
        <h3 class="skill-cat-title">
          <span class="skill-cat-icon">&#10132;</span> Frontend
        </h3>
        <div class="skill-tags">
          <span class="skill-tag">HTML / CSS</span>
          <span class="skill-tag">JavaScript</span>
          <span class="skill-tag">React</span>
          <span class="skill-tag">Vue</span>
          <span class="skill-tag">Tailwind</span>
          <span class="skill-tag">Git</span>
        </div>
      </div>
      <div class="skill-category reveal">
        <h3 class="skill-cat-title">
          <span class="skill-cat-icon">&#10132;</span> Backend
        </h3>
        <div class="skill-tags">
          <span class="skill-tag">Node.js</span>
          <span class="skill-tag">Python</span>
          <span class="skill-tag">SQL</span>
          <span class="skill-tag">REST APIs</span>
          <span class="skill-tag">Linux</span>
        </div>
      </div>
      <div class="skill-category reveal">
        <h3 class="skill-cat-title">
          <span class="skill-cat-icon">&#10132;</span> Tools
        </h3>
        <div class="skill-tags">
          <span class="skill-tag">Figma</span>
          <span class="skill-tag">VS Code</span>
          <span class="skill-tag">Claude AI</span>
          <span class="skill-tag">Chrome DevTools</span>
          <span class="skill-tag">Vite</span>
        </div>
      </div>
    </div>

    <div class="skills-orbital" aria-hidden="true">
      <div class="orbit-ring orbit-ring--1"></div>
      <div class="orbit-ring orbit-ring--2"></div>
      <div class="orbit-ring orbit-ring--3"></div>
    </div>
  </section>
```

- [ ] **Step 3: Replace Timeline section**

Replace lines 366-425 (Timeline section) in `index.html`:

```html
  <!-- ============ TIMELINE SECTION ============ -->
  <section id="timeline" class="timeline section">
    <div class="section-header reveal">
      <h2 class="section-title">My Journey</h2>
      <p class="section-subtitle">The learning path so far</p>
    </div>

    <div class="timeline-wrapper">
      <div class="timeline-line" aria-hidden="true">
        <div class="timeline-line-fill"></div>
      </div>

      <div class="timeline-items">
        <div class="timeline-item reveal reveal--left">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2023</span>
            <h3 class="timeline-title">初识前端 · First Steps</h3>
            <p class="timeline-desc">Started learning HTML, CSS, and JavaScript from online tutorials. Built my first static web pages and fell in love with seeing code come alive in the browser.</p>
          </div>
        </div>

        <div class="timeline-item reveal reveal--right">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2024 上</span>
            <h3 class="timeline-title">第一个完整项目 · First Full Project</h3>
            <p class="timeline-desc">Built a complete full-stack web application — a dance studio class booking system with frontend UI, backend API, and database. Learned how all the pieces fit together.</p>
          </div>
        </div>

        <div class="timeline-item reveal reveal--left">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2024 下</span>
            <h3 class="timeline-title">探索 AI · Discovering AI</h3>
            <p class="timeline-desc">Started experimenting with AI-powered development tools and APIs. Built projects combining frontend interfaces with AI capabilities — transforming how I think about what's possible.</p>
          </div>
        </div>

        <div class="timeline-item reveal reveal--right">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2025 上</span>
            <h3 class="timeline-title">作品集网站 · Portfolio Site</h3>
            <p class="timeline-desc">Designed and built this personal portfolio from scratch — a showcase of everything I've learned, with custom animations, interactive elements, and a design that reflects my style.</p>
          </div>
        </div>

        <div class="timeline-item reveal reveal--left">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2025-Now</span>
            <h3 class="timeline-title">持续探索 · Keep Exploring</h3>
            <p class="timeline-desc">Diving deeper into modern frontend frameworks, full-stack patterns, and AI integration. Building more complex projects and always looking for the next challenge.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 4: Replace Contact section**

Replace the Contact section (from `<!-- ============ CONTACT SECTION ============ -->` to `<!-- ============ FOOTER ============ -->`) in `index.html`:

```html
  <!-- ============ CONTACT SECTION ============ -->
  <section id="contact" class="contact section">
    <div class="contact-glow" aria-hidden="true"></div>
    <div class="section-header reveal">
      <h2 class="section-title section-title--large">Let's Connect</h2>
      <p class="section-subtitle">Have a question or just want to say hi?</p>
    </div>

    <div class="contact-grid">
      <form class="contact-form glass-card reveal" id="contact-form" novalidate>
        <div class="form-group">
          <input type="text" id="name" name="name" required placeholder="Your Name" autocomplete="name">
          <label for="name">Your Name</label>
          <span class="form-error">Please enter your name</span>
        </div>
        <div class="form-group">
          <input type="email" id="email" name="email" required placeholder="Your Email" autocomplete="email">
          <label for="email">Your Email</label>
          <span class="form-error">Please enter a valid email</span>
        </div>
        <div class="form-group">
          <textarea id="message" name="message" required placeholder="Your Message" rows="5"></textarea>
          <label for="message">Your Message</label>
          <span class="form-error">Please enter your message</span>
        </div>
        <button type="submit" class="btn btn-primary btn-submit">
          <span class="btn-submit-text">Send Message</span>
          <svg class="btn-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="form-success">This is a demo form. Reach me via email or social links below!</div>
      </form>

      <div class="contact-info reveal">
        <div class="contact-card glass-card">
          <span class="contact-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </span>
          <span class="contact-label">Email</span>
          <a href="mailto:shawnniu@example.com" class="contact-value" data-copy="shawnniu@example.com">shawnniu@example.com</a>
        </div>

        <div class="contact-socials reveal-stagger">
          <a href="#" class="social-link glass-card" aria-label="GitHub" title="GitHub">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          </a>
          <a href="#" class="social-link glass-card" aria-label="Bilibili" title="Bilibili">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="9 10 14 12 9 14"/></svg>
          </a>
          <a href="#" class="social-link glass-card" aria-label="WeChat" title="WeChat">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M16 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M12 22c5.523 0 10-3.581 10-8s-4.477-8-10-8S2 9.581 2 14c0 2.1 1 4 2.6 5.2L4 22l3-2.5c1.5.5 3.2.7 5 .7z"/></svg>
          </a>
          <a href="#" class="social-link glass-card" aria-label="Email" title="Copy Email" data-copy-trigger="shawnniu@example.com">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M16 8v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><rect x="2" y="10" width="20" height="12" rx="2"/></svg>
          </a>
        </div>

        <p class="contact-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Based in China — Student Developer
        </p>
      </div>
    </div>
  </section>
```

- [ ] **Step 5: Replace Footer**

Replace the footer text:

```html
  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-text">&copy; 2026 Shawn Niu. Built with curiosity &amp; code.</p>
      <button class="back-to-top" aria-label="Scroll to top" onclick="document.querySelector('#home').scrollIntoView({behavior:'smooth'})">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 17V3M10 3L5 8M10 3L15 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </footer>
```

- [ ] **Step 6: Verify all content changes**

Open `index.html` in browser:
- Scroll through all sections — no broken content
- About stats show new numbers (20, 12, 1000, 2)
- Skills show student-appropriate tags
- Timeline has Chinese-English hybrid content, 5 milestones
- Contact has new social links (GitHub, Bilibili, WeChat)
- Footer has new text

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: replace all content — student persona, skills, timeline, contact, footer"
```

---

### Task 4: HTML Projects Replacement — 6 New Cards with CSS Mockup Previews

**Files:**
- Modify: `index.html` — Projects section (lines 198-363)

**Interfaces:**
- Consumes: Task 1 CSS variables, existing `.project-card` / `.card-content` class structure
- Produces: 6 new project cards with unique CSS mockup previews, new data-project IDs, new titles/descriptions/tags

- [ ] **Step 1: Replace the entire projects-grid with 6 new cards**

Replace the HTML between `<div class="projects-grid">` and `</div>` (the closing `</div>` before `</section>`) in the Projects section:

```html
    <div class="projects-grid">

      <!-- Project 1: Dance Booking System (Browser Window Mockup) -->
      <article class="project-card reveal" data-project="dance-booking">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-preview card-preview--browser card-preview--booking">
              <div class="browser-bar">
                <span class="browser-dot"></span>
                <span class="browser-dot"></span>
                <span class="browser-dot"></span>
              </div>
              <div class="browser-address">
                <div class="address-shimmer"></div>
              </div>
              <div class="browser-content">
                <div class="booking-table">
                  <div class="booking-row booking-row--header"></div>
                  <div class="booking-row"></div>
                  <div class="booking-row"></div>
                  <div class="booking-row"></div>
                  <div class="booking-row booking-row--accent"></div>
                </div>
              </div>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Full-Stack</span>
            <h3 class="card-title">舞蹈室课堂预约系统</h3>
            <p class="card-desc">A complete class booking platform for dance studios — schedule management, student registration, and real-time availability tracking.</p>
            <div class="card-tags">
              <span>HTML</span><span>CSS</span><span>JavaScript</span><span>Node.js</span><span>MySQL</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 2: Portfolio Site (Browser Window Mockup) -->
      <article class="project-card reveal" data-project="portfolio-site">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-preview card-preview--browser card-preview--portfolio">
              <div class="browser-bar">
                <span class="browser-dot"></span>
                <span class="browser-dot"></span>
                <span class="browser-dot"></span>
              </div>
              <div class="browser-address">
                <div class="address-shimmer"></div>
              </div>
              <div class="browser-content">
                <div class="mini-hero">
                  <div class="mini-hero-line mini-hero-line--short"></div>
                  <div class="mini-hero-line mini-hero-line--long"></div>
                  <div class="mini-hero-buttons">
                    <span class="mini-btn"></span>
                    <span class="mini-btn mini-btn--outline"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Frontend</span>
            <h3 class="card-title">学生个人作品集网站</h3>
            <p class="card-desc">A custom-built personal portfolio with particle backgrounds, 3D card effects, and smooth scroll animations — all from scratch.</p>
            <div class="card-tags">
              <span>HTML</span><span>CSS</span><span>JavaScript</span><span>Animations</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 3: AI Builder (Abstract Geometric — Nodes) -->
      <article class="project-card reveal" data-project="ai-builder">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-preview card-preview--abstract card-preview--ai">
              <div class="ai-nodes">
                <span class="ai-node ai-node--1"></span>
                <span class="ai-node ai-node--2"></span>
                <span class="ai-node ai-node--3"></span>
                <span class="ai-node ai-node--4"></span>
                <span class="ai-line ai-line--1"></span>
                <span class="ai-line ai-line--2"></span>
                <span class="ai-line ai-line--3"></span>
              </div>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">AI + Web</span>
            <h3 class="card-title">AI 建站交互实验</h3>
            <p class="card-desc">Experimenting with AI APIs to generate website layouts from natural language — exploring the future of AI-assisted development.</p>
            <div class="card-tags">
              <span>AI API</span><span>JavaScript</span><span>Prompt Design</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 4: Booking App Prototype (Mobile Screen) -->
      <article class="project-card reveal" data-project="booking-app">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-preview card-preview--mobile card-preview--app">
              <div class="mobile-frame">
                <div class="mobile-notch"></div>
                <div class="mobile-status">
                  <span>9:41</span>
                  <span class="mobile-signal">●●●●</span>
                </div>
                <div class="mobile-content">
                  <div class="mobile-form-field"></div>
                  <div class="mobile-form-field mobile-form-field--short"></div>
                  <div class="mobile-form-btn"></div>
                </div>
              </div>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">UI Design</span>
            <h3 class="card-title">课堂预约 App 原型</h3>
            <p class="card-desc">A mobile app prototype for class booking — designed in Figma with user flows, wireframes, and interactive mockups.</p>
            <div class="card-tags">
              <span>Figma</span><span>Prototyping</span><span>Mobile UI</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 5: DataViz Tool (Abstract Geometric — Chart) -->
      <article class="project-card reveal" data-project="dataviz-tool">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-preview card-preview--abstract card-preview--dataviz">
              <div class="dataviz-chart">
                <div class="chart-grid"></div>
                <div class="chart-bars">
                  <span class="chart-bar" style="--h: 45%"></span>
                  <span class="chart-bar" style="--h: 75%"></span>
                  <span class="chart-bar chart-bar--active" style="--h: 90%"></span>
                  <span class="chart-bar" style="--h: 60%"></span>
                  <span class="chart-bar" style="--h: 35%"></span>
                </div>
              </div>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Data Viz</span>
            <h3 class="card-title">数据可视化小工具</h3>
            <p class="card-desc">Interactive data dashboard built with Chart.js and Canvas — fetching real-time data and rendering dynamic charts.</p>
            <div class="card-tags">
              <span>Chart.js</span><span>Canvas</span><span>REST API</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 6: Interactive UI (Abstract Geometric — Shapes) -->
      <article class="project-card reveal" data-project="interactive-ui">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-preview card-preview--abstract card-preview--ui">
              <div class="ui-shapes">
                <span class="ui-shape ui-shape--circle"></span>
                <span class="ui-shape ui-shape--triangle"></span>
                <span class="ui-shape ui-shape--square"></span>
                <span class="ui-shape ui-shape--ring"></span>
              </div>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Creative Dev</span>
            <h3 class="card-title">前端动态交互页面</h3>
            <p class="card-desc">A collection of creative frontend experiments — CSS animations, SVG interactions, and dynamic visual effects.</p>
            <div class="card-tags">
              <span>CSS Animations</span><span>SVG</span><span>JavaScript</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>
    </div>
```

- [ ] **Step 2: Verify new project cards in HTML**

Open `index.html` in browser:
- 6 project cards visible with correct titles
- Each has unique data-project attribute matching the new IDs
- No old SVG icon placeholders remain
- New CSS mockup structure in place (browser bars, mobile frames, abstract nodes)
- Tags match student-appropriate tech stack

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace projects — 6 new student projects with CSS mockup structures"
```

---

### Task 5: CSS — Project Card Preview Styles (Browser, Mobile, Abstract)

**Files:**
- Modify: `style.css` — append new card preview styles; update `.card-image` styles

**Interfaces:**
- Consumes: Task 1 CSS variables, Task 4 HTML mockup structure
- Produces: `.card-preview--browser` with `.browser-bar`/`.browser-address`/`.browser-content`, `.card-preview--mobile` with `.mobile-frame`/`.mobile-notch`, `.card-preview--abstract` with node/chart/shape variants; hover shimmer/scale animations for previews

- [ ] **Step 1: Update card-image base + add browser mockup styles**

Append to `style.css`:

```css
/* ============================================
   PROJECT CARD PREVIEWS — V2 CSS Mockups
   ============================================ */

/* Reset card-image for new preview system */
.card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: var(--bg-secondary);
}

/* Remove old placeholder style — kept for reference but overridden below */
.card-image-placeholder { display: none; }

/* ----- Base Card Preview Wrapper ----- */
.card-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

/* ============================================
   BROWSER WINDOW MOCKUP
   ============================================ */

.card-preview--browser {
  display: flex;
  flex-direction: column;
}

.browser-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.browser-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.browser-dot:nth-child(1) { background: #ff5f57; }
.browser-dot:nth-child(2) { background: #febc2e; }
.browser-dot:nth-child(3) { background: #28c840; }

.browser-address {
  margin: 8px 14px;
  height: 18px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  position: relative;
  overflow: hidden;
}

.address-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 25%, rgba(0, 200, 232, 0.08) 50%, transparent 75%);
  background-size: 200% 100%;
  opacity: 0;
  transition: opacity 0.4s;
}

.project-card-inner:hover .address-shimmer {
  opacity: 1;
  animation: addressShimmer 1.5s ease-in-out infinite;
}

.browser-content {
  flex: 1;
  margin: 0 14px 14px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.015);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Booking table mockup */
.booking-table {
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.booking-row {
  height: 14px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.04);
  transition: background 0.4s;
}

.booking-row--header {
  background: rgba(0, 200, 232, 0.12);
  height: 16px;
}

.booking-row--accent {
  background: rgba(124, 58, 237, 0.1);
}

.project-card-inner:hover .booking-row {
  background: rgba(0, 200, 232, 0.06);
}

.project-card-inner:hover .booking-row--header {
  background: rgba(0, 200, 232, 0.18);
}

/* Portfolio mini-hero mockup */
.mini-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
}

.mini-hero-line {
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  transition: background 0.4s, width 0.4s;
}

.mini-hero-line--short {
  width: 50%;
  background: rgba(0, 200, 232, 0.15);
}

.mini-hero-line--long {
  width: 80%;
}

.mini-hero-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.mini-btn {
  width: 54px;
  height: 14px;
  border-radius: 7px;
  background: rgba(0, 200, 232, 0.25);
  transition: background 0.4s;
}

.mini-btn--outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.project-card-inner:hover .mini-hero-line--short {
  background: rgba(0, 200, 232, 0.3);
}

.project-card-inner:hover .mini-btn {
  background: rgba(0, 200, 232, 0.4);
}
```

- [ ] **Step 2: Add mobile screen mockup styles**

```css
/* ============================================
   MOBILE SCREEN MOCKUP
   ============================================ */

.card-preview--mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.mobile-frame {
  width: 140px;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.015);
  transition: border-color 0.4s, box-shadow 0.4s;
  overflow: hidden;
}

.project-card-inner:hover .mobile-frame {
  border-color: rgba(0, 200, 232, 0.3);
  box-shadow: 0 0 16px rgba(0, 200, 232, 0.1);
}

.mobile-notch {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 auto;
}

.mobile-status {
  display: flex;
  justify-content: space-between;
  font-size: 7px;
  color: rgba(255, 255, 255, 0.2);
  padding: 0 4px;
}

.mobile-signal {
  letter-spacing: -1px;
}

.mobile-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  padding: 4px 0;
  transition: transform 0.4s var(--ease-out-expo);
}

.project-card-inner:hover .mobile-content {
  transform: translateY(-4px);
}

.mobile-form-field {
  height: 10px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.4s;
}

.mobile-form-field--short {
  width: 60%;
}

.mobile-form-btn {
  height: 16px;
  border-radius: 8px;
  background: rgba(0, 200, 232, 0.2);
  margin-top: 4px;
  transition: background 0.4s, box-shadow 0.4s;
}

.project-card-inner:hover .mobile-form-btn {
  background: rgba(0, 200, 232, 0.35);
  box-shadow: 0 0 8px rgba(0, 200, 232, 0.15);
}
```

- [ ] **Step 3: Add abstract geometric mockup styles**

```css
/* ============================================
   ABSTRACT GEOMETRIC MOCKUPS
   ============================================ */

.card-preview--abstract {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* AI Nodes */
.ai-nodes {
  position: relative;
  width: 100%;
  height: 100%;
}

.ai-node {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(0, 200, 232, 0.3);
  border: 2px solid rgba(0, 200, 232, 0.5);
}

.ai-node--1 { top: 20%; left: 15%; }
.ai-node--2 { top: 15%; right: 20%; animation: nodePulse 2.5s ease-in-out infinite; }
.ai-node--3 { bottom: 25%; left: 25%; animation: nodePulse 3s ease-in-out infinite 0.8s; }
.ai-node--4 { bottom: 20%; right: 15%; }

.project-card-inner:hover .ai-node--2,
.project-card-inner:hover .ai-node--3 {
  animation-duration: 1.2s;
}

.ai-line {
  position: absolute;
  height: 1px;
  background: rgba(0, 200, 232, 0.15);
  transform-origin: left center;
  transition: background 0.4s;
}

.ai-line--1 {
  top: 27%; left: 20%;
  width: 55%;
  transform: rotate(12deg);
  border-top: 1px dashed rgba(0, 200, 232, 0.2);
}

.ai-line--2 {
  top: 50%; left: 18%;
  width: 60%;
  transform: rotate(-8deg);
  border-top: 1px dashed rgba(124, 58, 237, 0.2);
}

.ai-line--3 {
  bottom: 30%; left: 22%;
  width: 50%;
  transform: rotate(5deg);
  border-top: 1px dashed rgba(0, 200, 232, 0.12);
}

.project-card-inner:hover .ai-line {
  background: rgba(0, 200, 232, 0.25);
}

/* DataViz Chart */
.dataviz-chart {
  width: 80%;
  height: 70%;
  position: relative;
}

.chart-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 25% 25%;
  transition: background-image 0.4s;
}

.project-card-inner:hover .chart-grid {
  background-image:
    linear-gradient(rgba(0, 200, 232, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 232, 0.04) 1px, transparent 1px);
}

.chart-bars {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  padding: 0 8px;
}

.chart-bar {
  width: 12%;
  height: var(--h, 50%);
  background: rgba(0, 200, 232, 0.2);
  border-radius: 3px 3px 0 0;
  transition: background 0.4s, height 0.6s var(--ease-out-expo);
}

.chart-bar--active {
  background: rgba(0, 200, 232, 0.4);
}

.project-card-inner:hover .chart-bar {
  background: rgba(0, 200, 232, 0.3);
}

.project-card-inner:hover .chart-bar--active {
  background: rgba(0, 200, 232, 0.55);
}

/* Interactive UI Shapes */
.ui-shapes {
  position: relative;
  width: 80%;
  height: 70%;
}

.ui-shape {
  position: absolute;
  transition: all 0.5s var(--ease-out-expo);
}

.ui-shape--circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(0, 200, 232, 0.3);
  top: 15%;
  left: 15%;
}

.ui-shape--triangle {
  width: 0;
  height: 0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-bottom: 32px solid rgba(124, 58, 237, 0.2);
  top: 10%;
  right: 20%;
}

.ui-shape--square {
  width: 28px;
  height: 28px;
  background: rgba(244, 114, 182, 0.12);
  border: 2px solid rgba(244, 114, 182, 0.2);
  bottom: 20%;
  left: 25%;
  transform: rotate(15deg);
}

.ui-shape--ring {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(0, 200, 232, 0.2);
  bottom: 25%;
  right: 18%;
}

.project-card-inner:hover .ui-shape--circle {
  transform: scale(1.2) translate(5px, -5px);
  border-color: rgba(0, 200, 232, 0.6);
}

.project-card-inner:hover .ui-shape--triangle {
  transform: rotate(15deg) translate(-5px, -5px);
  border-bottom-color: rgba(124, 58, 237, 0.45);
}

.project-card-inner:hover .ui-shape--square {
  transform: rotate(35deg) scale(1.15);
  background: rgba(244, 114, 182, 0.2);
  border-color: rgba(244, 114, 182, 0.35);
}

.project-card-inner:hover .ui-shape--ring {
  transform: scale(1.2) translate(-5px, 5px);
  border-color: rgba(0, 200, 232, 0.5);
}
```

- [ ] **Step 4: Verify card previews in browser**

Open in browser, hover each project card:
- Dance booking: browser window with table rows, rows change color on hover
- Portfolio: browser window with hero lines and buttons
- AI builder: nodes pulse, dashed lines connect them
- Booking app: mobile frame with form fields, content shifts up on hover
- DataViz: bar chart with grid, bars have hover transition
- Interactive UI: 4 shapes move/rotate/scale on hover

- [ ] **Step 5: Commit**

```bash
git add style.css
git commit -m "feat: add CSS project card previews — browser, mobile, abstract geometric mockups"
```

---

### Task 6: JavaScript — Project Data, Typewriter, Form Demo Mode

**Files:**
- Modify: `script.js` — lines 444-517 (projectData), lines 695-774 (form validation), lines 812-861 (typewriter)

**Interfaces:**
- Consumes: Task 4 new HTML project cards, Task 5 CSS mockup styles
- Produces: New `projectData` object with 6 student projects; updated `initFormValidation` with demo mode logic; updated `initTypewriter` phrases

- [ ] **Step 1: Replace projectData object**

Replace the entire `projectData` object (lines 444-517) in `script.js`:

```javascript
const projectData = {
  'dance-booking': {
    type: 'Full-Stack Project',
    title: '舞蹈室课堂预约系统',
    desc: 'A complete class booking platform built for dance studios. Features include a schedule management dashboard, student registration system, real-time availability tracking, and an admin panel for managing classes and instructors. Built as a hands-on full-stack learning project from frontend UI to database design.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MySQL'],
    highlights: [
      'Complete CRUD system for class and student management',
      'Real-time availability display with conflict detection',
      'Responsive admin dashboard with schedule overview',
      'Form validation, error handling, and user-friendly UI',
    ],
  },
  'portfolio-site': {
    type: 'Frontend Project',
    title: '学生个人作品集网站',
    desc: 'This very website you\'re viewing — a custom-built personal portfolio designed and coded from scratch. Features particle canvas backgrounds, custom cursor effects, 3D card tilting, smooth scroll animations, and a project modal system. Every animation and interaction is hand-crafted with vanilla JavaScript and CSS.',
    tech: ['HTML', 'CSS', 'JavaScript', 'CSS Animations', 'Canvas API'],
    highlights: [
      'Particle system with mouse repulsion and connection lines',
      '3D perspective card tilt following cursor movement',
      'Custom cursor with lerp-smooth follow and hover states',
      'IntersectionObserver-driven scroll reveal animations',
    ],
  },
  'ai-builder': {
    type: 'AI Experiment',
    title: 'AI 建站交互实验',
    desc: 'An experimental project exploring how AI APIs can be used to generate website layouts from natural language descriptions. Users describe a page in plain text, and the system generates structured HTML/CSS output. This project deepened my understanding of prompt design, API integration, and the current capabilities and limitations of AI in web development.',
    tech: ['AI API', 'JavaScript', 'Prompt Engineering', 'HTML/CSS Generation'],
    highlights: [
      'Natural language input → structured HTML/CSS output',
      'Multi-turn conversation for iterative design refinement',
      'Template system combining AI output with predefined patterns',
      'Explored prompt engineering techniques for code generation',
    ],
  },
  'booking-app': {
    type: 'UI/UX Design',
    title: '课堂预约 App 原型',
    desc: 'A mobile app prototype for classroom and course booking, designed in Figma. The project covers the full design process — from user research and persona creation to wireframes, high-fidelity mockups, and interactive prototypes. Focused on creating an intuitive booking flow with minimal friction for students.',
    tech: ['Figma', 'Prototyping', 'Mobile UI Design', 'User Flows'],
    highlights: [
      'Complete user research phase with persona development',
      'Interactive prototype with full booking flow simulation',
      'Dark mode UI design for comfortable nighttime use',
      'Responsive component library for consistent design',
    ],
  },
  'dataviz-tool': {
    type: 'Data Visualization',
    title: '数据可视化小工具',
    desc: 'An interactive data dashboard that fetches real-time data from REST APIs and renders dynamic charts using Chart.js and Canvas. Users can switch between chart types, filter data ranges, and export visualizations. Built to learn data visualization patterns and API integration.',
    tech: ['Chart.js', 'Canvas API', 'JavaScript', 'REST API Integration'],
    highlights: [
      'Multiple chart types: bar, line, pie, and radar charts',
      'Real-time data fetching with loading and error states',
      'Interactive tooltips, zoom, and data point selection',
      'Dark theme dashboard layout optimized for data viewing',
    ],
  },
  'interactive-ui': {
    type: 'Creative Development',
    title: '前端动态交互页面',
    desc: 'A collection of creative frontend experiments exploring CSS animations, SVG interactions, and dynamic visual effects. Each experiment pushes the boundaries of what\'s possible with pure CSS and JavaScript — from morphing SVGs to physics-inspired motion and generative patterns.',
    tech: ['CSS Animations', 'SVG', 'JavaScript', 'Creative Coding'],
    highlights: [
      'CSS-only morphing shapes with keyframe animations',
      'SVG path drawing on scroll with stroke-dasharray',
      'Physics-inspired spring animations with easing curves',
      'Generative geometric patterns with Canvas API',
    ],
  },
};
```

- [ ] **Step 2: Update form validation for demo mode**

Replace the form success block in `initFormValidation` (around the `if (isValid)` block):

Find the block starting with `if (isValid) {` in the form submit handler and replace:

```javascript
    if (isValid) {
      /* Demo mode — show demo notice */
      const submitBtn = form.querySelector('.btn-submit');
      const submitText = submitBtn.querySelector('.btn-submit-text');
      const originalText = submitText.textContent;

      /* Change button to demo mode */
      submitText.textContent = 'Demo Mode — Not Actually Sent';
      submitBtn.style.opacity = '0.7';

      /* Show success message */
      const successEl = form.querySelector('.form-success');
      if (successEl) {
        successEl.classList.add('visible');
      }

      /* Show toast */
      showToast(toast, 'Demo form — reach me via email or social links!');

      /* Reset after delay */
      setTimeout(() => {
        submitText.textContent = originalText;
        submitBtn.style.opacity = '1';
        form.reset();
        form.querySelectorAll('.form-group').forEach((g) => {
          g.classList.remove('success', 'error');
        });
        if (successEl) {
          successEl.classList.remove('visible');
        }
      }, 4000);
    }
```

- [ ] **Step 3: Update typewriter phrases**

Replace the phrases array in `initTypewriter` (around line 816) with:

```javascript
  const phrases = [
    'Building Cool Stuff with Code & AI',
    '前端学习者 · AI 探索者 · 创意制造者',
    'Where Learning Meets Creating',
  ];
```

- [ ] **Step 4: Verify JS changes**

Open `index.html` in browser:
- Click project card → modal shows correct new project data
- Submit form with valid data → button changes to "Demo Mode — Not Actually Sent"
- Toast shows demo notice
- Typewriter cycles through 3 new phrases (one Chinese)

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "feat: update JS — new project data, demo form mode, typewriter phrases"
```

---

### Task 7: JavaScript — Hero Parallax + Social Stagger + Email Copy Update

**Files:**
- Modify: `script.js` — append new functions; update DOMContentLoaded init

**Interfaces:**
- Consumes: Task 2 Hero layers HTML, Task 3 contact social HTML
- Produces: `initHeroParallax()` — background text follows mouse slightly; `initSocialStagger()` — social icons reveal with stagger on scroll; updated `initEmailCopy()` to handle `[data-copy-trigger]` on social link; ring rotation already handled by CSS animations

- [ ] **Step 1: Add hero parallax function**

Append to `script.js` before the initialization section:

```javascript
/* ============================================
   HERO PARALLAX — Background text follows mouse
   ============================================ */

function initHeroParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  /* Skip on touch devices */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * -20;
    const y = (e.clientY / window.innerHeight - 0.5) * -20;
    bgText.style.transform = `translate(${x}px, ${y}px)`;
  });
}
```

- [ ] **Step 2: Add social stagger reveal**

```javascript
/* ============================================
   SOCIAL STAGGER REVEAL — Contact icons pop in sequence
   ============================================ */

function initSocialStagger() {
  const container = document.querySelector('.contact-socials.reveal-stagger');
  if (!container) return;

  const icons = container.querySelectorAll('.social-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          icons.forEach((icon, i) => {
            icon.style.animation = `socialPopIn 0.5s var(--ease-out-back) ${i * 0.12}s both`;
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(container);
}
```

- [ ] **Step 3: Update email copy to handle social link trigger**

Replace the `initEmailCopy` function (around line 791) to also handle the `[data-copy-trigger]` attribute on social icons:

```javascript
function initEmailCopy() {
  /* Email card copy */
  const emailEl = document.querySelector('[data-copy]');
  if (emailEl) {
    emailEl.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailEl.dataset.copy;
      copyEmailToClipboard(email);
    });
  }

  /* Social icon with data-copy-trigger */
  const copyTriggers = document.querySelectorAll('[data-copy-trigger]');
  copyTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const email = trigger.dataset.copyTrigger;
      copyEmailToClipboard(email);
    });
  });
}

function copyEmailToClipboard(email) {
  navigator.clipboard.writeText(email).then(() => {
    const toast = document.getElementById('form-toast');
    showToast(toast, 'Email copied to clipboard!');
  }).catch(() => {
    window.location.href = 'mailto:' + email;
  });
}
```

- [ ] **Step 4: Add new inits to DOMContentLoaded**

Update the initialization block at the bottom of `script.js` to include the new functions:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCustomCursor();
  initScrollReveal();
  initNavbarScroll();
  initTimelineDraw();
  initSmoothScroll();
  init3DTilt();
  initProjectModal();
  initCountUp();
  initFormValidation();
  initEmailCopy();
  initTypewriter();
  initHeroEntrance();
  initHeroParallax();
  initSocialStagger();
});
```

- [ ] **Step 5: Verify new interactions**

Open in browser:
- Move mouse over Hero → background text shifts slightly
- Scroll to Contact → social icons pop in one by one with stagger
- Click email icon in social row → copies email + toast appears

- [ ] **Step 6: Commit**

```bash
git add script.js
git commit -m "feat: add hero parallax, social stagger reveal, updated email copy"
```

---

### Task 8: CSS — Contact Social Stagger + Form Demo Styles + Responsive Polish

**Files:**
- Modify: `style.css` — social stagger animation styles, form demo mode styles, responsive tweaks for new Hero layers

**Interfaces:**
- Consumes: Task 5 CSS, Task 6 form changes, Task 7 JS stagger
- Produces: Contact social animation styles, form button demo state style, responsive polish for all new elements

- [ ] **Step 1: Add contact social stagger CSS**

Append to `style.css`:

```css
/* ============================================
   CONTACT SOCIAL STAGGER
   ============================================ */

.contact-socials.reveal-stagger .social-link {
  opacity: 0;
}

.contact-socials.reveal-stagger .social-link.visible {
  animation: socialPopIn 0.5s var(--ease-out-back) both;
}

/* ============================================
   FORM DEMO MODE STYLES
   ============================================ */

.btn-submit {
  transition: opacity var(--duration-normal);
}

.btn-submit.demo-mode {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.form-success {
  display: none;
  text-align: center;
  color: var(--accent-cyan);
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 16px;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: rgba(0, 200, 232, 0.05);
  border: 1px solid rgba(0, 200, 232, 0.12);
}
```

- [ ] **Step 2: Polish responsive for new Hero layers**

Ensure the mobile media query has these additional overrides (add to existing `@media (max-width: 768px)` block):

```css
  /* Card preview — maintain visibility on mobile */
  .card-image { height: 180px; }
  .card-preview--browser .browser-content { margin: 0 8px 8px; }
  .booking-row { height: 10px; }
  .mobile-frame { width: 120px; }

  /* Social stagger — works on mobile */
  .contact-socials.reveal-stagger .social-link {
    animation: socialPopIn 0.5s var(--ease-out-back) both;
    animation-play-state: paused;
  }
```

- [ ] **Step 3: Full verification pass**

Open in browser and test:
- Resize from 1920px → 1024px → 768px → 480px
- All sections display properly
- Hero layers adapt (ID card goes below title on mobile)
- Project cards stack to 1 column on mobile
- Card previews remain visible and proportional
- Contact social icons stagger on scroll
- Form demo mode works at all sizes
- No horizontal overflow
- Custom cursor hidden on mobile, body cursor auto
- `prefers-reduced-motion` disables all animations
- No console errors

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "feat: add contact social stagger styles, form demo mode CSS, responsive polish"
```

---

## Final Verification Checklist

After all tasks complete:

- [ ] All 6 project cards have unique CSS mockup previews
- [ ] Each mockup has distinct hover animation (shimmer, shift, pulse, grow, rotate)
- [ ] Hero has 4 visible layers: BG text, energy rings, floating ID card, foreground title
- [ ] BG text parallax responds to mouse movement on desktop
- [ ] ID card floats with CSS animation, pauses on hover
- [ ] Color palette is cyan-led (cyan > purple > rose)
- [ ] All content reflects student identity — no fake professional claims
- [ ] Form shows demo mode message, not fake success
- [ ] Social links include GitHub, Bilibili, WeChat
- [ ] Timeline has Chinese-English hybrid content
- [ ] Typewriter cycles through 3 phrases including Chinese
- [ ] Project modal shows correct data for all 6 new projects
- [ ] Stats count up to 20, 12, 1000, 2
- [ ] Skills tags are student-appropriate (no Three.js, GraphQL)
- [ ] Responsive: 1200px, 1024px, 768px breakpoints all work
- [ ] `prefers-reduced-motion` disables animations
- [ ] Mobile hamburger menu works
- [ ] Smooth scroll works for all nav links
- [ ] 3D tilt works on desktop project cards
- [ ] Custom cursor works on desktop, hidden on mobile
- [ ] Particles render with correct count per breakpoint
- [ ] No console errors
