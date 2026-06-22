# Shawn Niu Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete single-page personal portfolio website with dark futuristic design, glassmorphism, particle canvas, 3D card tilt, scroll animations, and interactive project modals — all from pure HTML/CSS/JS.

**Architecture:** Three files — `index.html` (semantic structure, ~300 lines), `style.css` (visual system + responsive, ~800 lines), `script.js` (interactions + animations, ~500 lines). CSS custom properties manage the design system. JavaScript modules are organized as named functions in a single file (no module bundler needed). The particle canvas and custom cursor run as persistent background layers. All interactive features (tilt, modal, count-up, reveal) hook into requestAnimationFrame and IntersectionObserver for performance.

**Tech Stack:** Pure HTML5, CSS3, Vanilla JavaScript (ES2020+). Zero dependencies, zero CDN links, zero build tools.

## Global Constraints

- Zero external dependencies — no frameworks, no npm packages, no CDN fonts/icons
- Dark background `#0a0a0f` primary, `#111118` secondary
- 3 accent colors maximum: purple `#6c5ce7`, cyan `#00d2ff`, rose `#ff6b9d`
- System font stack only (no Google Fonts or web fonts)
- Glassmorphism via `backdrop-filter: blur()` for cards and navbar
- Canvas particle count: 80 desktop / 40 tablet / 25 mobile
- 3D card tilt range: ±10deg rotateX/rotateY
- IntersectionObserver threshold: 0.15 for reveal animations
- Number count-up duration: 2000ms with easeOutExpo
- Responsive breakpoints: 1200px / 1024px / 768px
- `prefers-reduced-motion` support mandatory
- All content in English with placeholder persona "Shawn Niu"
- No empty sections — every section has complete placeholder content
- 6 project cards (3 dev + 3 design) with specific names and tags from spec
- 5 timeline milestones with specific years and descriptions from spec
- Form is demo-only (no backend), shows success toast on validation pass

---

### Task 1: HTML Document Structure — All Sections

**Files:**
- Create: `index.html`

**Interfaces:**
- Produces: DOM structure with sections `#home`, `#about`, `#skills`, `#projects`, `#timeline`, `#contact`; navbar with data-nav links; modal container `#project-modal`; canvas element `#particles`; all elements have semantic classes for CSS/JS targeting

- [ ] **Step 1: Write complete HTML structure**

Write the full `index.html` with semantic markup for all 8 sections (nav, hero, about, skills, projects, timeline, contact, footer). Include the particle canvas, modal overlay, scroll-to-top button, and mobile hamburger button. Every section gets its complete placeholder content — no empty areas.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Shawn Niu — Creative Developer & Digital Designer Portfolio">
  <title>Shawn Niu | Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Custom Cursor -->
  <div class="cursor-dot" aria-hidden="true"></div>
  <div class="cursor-ring" aria-hidden="true"></div>

  <!-- Mouse-follow glow -->
  <div class="mouse-glow" aria-hidden="true"></div>

  <!-- Particle Canvas Background -->
  <canvas id="particles" aria-hidden="true"></canvas>

  <!-- Floating Glow Orbs (background decoration) -->
  <div class="glow-orb glow-orb--1" aria-hidden="true"></div>
  <div class="glow-orb glow-orb--2" aria-hidden="true"></div>
  <div class="glow-orb glow-orb--3" aria-hidden="true"></div>

  <!-- ============ NAVIGATION ============ -->
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-inner">
      <a href="#home" class="nav-logo" aria-label="Shawn Niu Home">SN</a>
      <ul class="nav-links" role="menubar">
        <li role="none"><a href="#home" role="menuitem" class="nav-link active">Home</a></li>
        <li role="none"><a href="#about" role="menuitem" class="nav-link">About</a></li>
        <li role="none"><a href="#skills" role="menuitem" class="nav-link">Skills</a></li>
        <li role="none"><a href="#projects" role="menuitem" class="nav-link">Projects</a></li>
        <li role="none"><a href="#timeline" role="menuitem" class="nav-link">Timeline</a></li>
        <li role="none"><a href="#contact" role="menuitem" class="nav-link">Contact</a></li>
      </ul>
      <button class="nav-cta" onclick="document.querySelector('#contact').scrollIntoView({behavior:'smooth'})">Let's Talk</button>
      <button class="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu Overlay -->
  <div class="mobile-menu" aria-hidden="true">
    <ul class="mobile-nav-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#timeline">Timeline</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>

  <!-- ============ HERO SECTION ============ -->
  <section id="home" class="hero">
    <div class="hero-content">
      <p class="hero-greeting reveal">Hello, I'm</p>
      <h1 class="hero-title reveal">SHAWN NIU</h1>
      <p class="hero-subtitle reveal"><span class="typewriter-text"></span><span class="typewriter-cursor">|</span></p>
      <p class="hero-description reveal">I craft digital experiences at the intersection of code and design — building products that feel alive, look stunning, and work flawlessly.</p>
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

  <!-- ============ ABOUT SECTION ============ -->
  <section id="about" class="about section">
    <div class="section-header reveal">
      <h2 class="section-title">About Me</h2>
      <p class="section-subtitle">The person behind the pixels</p>
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
          <span class="tag">Creative Developer</span>
          <span class="tag">UI/UX Designer</span>
          <span class="tag">Digital Artist</span>
        </div>
        <div class="about-text">
          <p>I'm Shawn — a multidisciplinary creator who thrives at the intersection of development and design. With over 5 years of crafting digital products, I bring a rare blend of technical precision and aesthetic sensibility to every project I touch.</p>
          <p>My philosophy is simple: build things that don't just work, but make people feel something. Whether it's a polished web app, a design system, or a brand identity — I chase that moment when code becomes art.</p>
          <p>When I'm not pushing pixels or writing clean code, you'll find me exploring generative art, contributing to open-source, or obsessing over the latest design tools.</p>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card glass-card reveal" data-count="47">
          <span class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>
          </span>
          <span class="stat-number" data-target="47">0</span>
          <span class="stat-label">Projects Completed</span>
        </div>
        <div class="stat-card glass-card reveal" data-count="18">
          <span class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>
          </span>
          <span class="stat-number" data-target="18">0</span>
          <span class="stat-label">Skills Mastered</span>
        </div>
        <div class="stat-card glass-card reveal" data-count="2400">
          <span class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
          <span class="stat-number" data-target="2400" data-suffix="+">0</span>
          <span class="stat-label">Learning Hours</span>
        </div>
        <div class="stat-card glass-card reveal" data-count="5">
          <span class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </span>
          <span class="stat-number" data-target="5" data-suffix="+">0</span>
          <span class="stat-label">Years Experience</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ SKILLS SECTION ============ -->
  <section id="skills" class="skills section">
    <div class="section-header reveal">
      <h2 class="section-title">Skills & Expertise</h2>
      <p class="section-subtitle">Tools and technologies I wield</p>
    </div>

    <div class="skills-categories">
      <div class="skill-category reveal">
        <h3 class="skill-cat-title">
          <span class="skill-cat-icon">&#x27b6;</span> Frontend
        </h3>
        <div class="skill-tags">
          <span class="skill-tag">React</span>
          <span class="skill-tag">Vue</span>
          <span class="skill-tag">TypeScript</span>
          <span class="skill-tag">CSS / Sass</span>
          <span class="skill-tag">Three.js</span>
          <span class="skill-tag">GSAP</span>
        </div>
      </div>
      <div class="skill-category reveal">
        <h3 class="skill-cat-title">
          <span class="skill-cat-icon">&#x27b6;</span> Backend
        </h3>
        <div class="skill-tags">
          <span class="skill-tag">Node.js</span>
          <span class="skill-tag">Python</span>
          <span class="skill-tag">PostgreSQL</span>
          <span class="skill-tag">GraphQL</span>
          <span class="skill-tag">REST APIs</span>
        </div>
      </div>
      <div class="skill-category reveal">
        <h3 class="skill-cat-title">
          <span class="skill-cat-icon">&#x27b6;</span> Design
        </h3>
        <div class="skill-tags">
          <span class="skill-tag">Figma</span>
          <span class="skill-tag">UI / UX</span>
          <span class="skill-tag">Motion Design</span>
          <span class="skill-tag">Brand Identity</span>
          <span class="skill-tag">3D Modeling</span>
        </div>
      </div>
    </div>

    <div class="skills-orbital" aria-hidden="true">
      <div class="orbit-ring orbit-ring--1"></div>
      <div class="orbit-ring orbit-ring--2"></div>
      <div class="orbit-ring orbit-ring--3"></div>
    </div>
  </section>

  <!-- ============ PROJECTS SECTION ============ -->
  <section id="projects" class="projects section">
    <div class="section-header reveal">
      <h2 class="section-title">Selected Work</h2>
      <p class="section-subtitle">Projects I'm proud of</p>
    </div>

    <div class="projects-grid">

      <!-- Project 1: Neural Dashboard (Dev) -->
      <article class="project-card reveal" data-project="neural-dashboard">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                <polyline points="6 10 10 7 14 10 18 7"/>
              </svg>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Development</span>
            <h3 class="card-title">Neural Dashboard</h3>
            <p class="card-desc">Real-time analytics dashboard with neural network visualizations and live data streaming.</p>
            <div class="card-tags">
              <span>React</span><span>D3.js</span><span>WebSocket</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 2: Prism Design System (Design) -->
      <article class="project-card reveal" data-project="prism-design">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/>
              </svg>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Design</span>
            <h3 class="card-title">Prism Design System</h3>
            <p class="card-desc">A comprehensive design system with token-based theming, 200+ components, and detailed documentation.</p>
            <div class="card-tags">
              <span>Figma</span><span>Design Tokens</span><span>Storybook</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 3: CloudFlow Platform (Dev) -->
      <article class="project-card reveal" data-project="cloudflow">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
              </svg>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Development</span>
            <h3 class="card-title">CloudFlow Platform</h3>
            <p class="card-desc">Serverless workflow automation platform with drag-and-drop pipeline builder and real-time logs.</p>
            <div class="card-tags">
              <span>Node.js</span><span>AWS</span><span>PostgreSQL</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 4: Aether Brand Identity (Design) -->
      <article class="project-card reveal" data-project="aether-brand">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Design</span>
            <h3 class="card-title">Aether Brand Identity</h3>
            <p class="card-desc">Complete brand identity for a luxury tech startup — from logo to motion guidelines and brand strategy.</p>
            <div class="card-tags">
              <span>Brand Strategy</span><span>Visual Design</span><span>Motion</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 5: DataViz Explorer (Dev) -->
      <article class="project-card reveal" data-project="dataviz-explorer">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Development</span>
            <h3 class="card-title">DataViz Explorer</h3>
            <p class="card-desc">3D data visualization tool with WebGL rendering, custom shaders, and interactive exploration modes.</p>
            <div class="card-tags">
              <span>Three.js</span><span>WebGL</span><span>TypeScript</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>

      <!-- Project 6: Lumina Mobile App (Design) -->
      <article class="project-card reveal" data-project="lumina-app">
        <div class="project-card-inner">
          <div class="card-image">
            <div class="card-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <div class="card-image-glow"></div>
          </div>
          <div class="card-content">
            <span class="card-type">Design</span>
            <h3 class="card-title">Lumina Mobile App</h3>
            <p class="card-desc">End-to-end mobile app design — user research, wireframes, high-fidelity prototypes, and usability testing.</p>
            <div class="card-tags">
              <span>UI/UX</span><span>Prototyping</span><span>User Research</span>
            </div>
          </div>
          <button class="card-action">
            <span>View Detail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>
    </div>
  </section>

  <!-- ============ TIMELINE SECTION ============ -->
  <section id="timeline" class="timeline section">
    <div class="section-header reveal">
      <h2 class="section-title">My Journey</h2>
      <p class="section-subtitle">The path that shaped who I am</p>
    </div>

    <div class="timeline-wrapper">
      <div class="timeline-line" aria-hidden="true">
        <div class="timeline-line-fill"></div>
      </div>

      <div class="timeline-items">
        <div class="timeline-item reveal reveal--left">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2018</span>
            <h3 class="timeline-title">Started the Journey</h3>
            <p class="timeline-desc">Began self-taught programming. Spent countless nights learning JavaScript, CSS, and the fundamentals of web development through building real projects.</p>
          </div>
        </div>

        <div class="timeline-item reveal reveal--right">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2019</span>
            <h3 class="timeline-title">First Design Project</h3>
            <p class="timeline-desc">Created a complete brand identity for a tech startup — logo, color system, typography, and UI kit. Discovered my passion for the intersection of design and code.</p>
          </div>
        </div>

        <div class="timeline-item reveal reveal--left">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2020</span>
            <h3 class="timeline-title">Career Breakthrough</h3>
            <p class="timeline-desc">Joined a leading digital agency as a Creative Developer. Worked on high-profile projects for Fortune 500 clients, mastering production-grade development.</p>
          </div>
        </div>

        <div class="timeline-item reveal reveal--right">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2022</span>
            <h3 class="timeline-title">Major Platform Launch</h3>
            <p class="timeline-desc">Led the full-stack development of a SaaS platform serving 100K+ users. Architected the system from scratch, managed a team of 4 developers, and shipped on time.</p>
          </div>
        </div>

        <div class="timeline-item reveal reveal--left">
          <div class="timeline-dot"></div>
          <div class="timeline-content glass-card">
            <span class="timeline-year">2024 — Present</span>
            <h3 class="timeline-title">Independent Creator</h3>
            <p class="timeline-desc">Now working independently — building digital products, crafting brand identities, and helping startups bring their vision to life through design and code.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ CONTACT SECTION ============ -->
  <section id="contact" class="contact section">
    <div class="contact-glow" aria-hidden="true"></div>
    <div class="section-header reveal">
      <h2 class="section-title section-title--large">Let's Create Something Cool</h2>
      <p class="section-subtitle">Got a project in mind? Let's make it happen.</p>
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
          <span>Send Message</span>
          <svg class="btn-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="form-success">Message sent successfully! I'll get back to you soon.</div>
      </form>

      <div class="contact-info reveal">
        <div class="contact-card glass-card">
          <span class="contact-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </span>
          <span class="contact-label">Email</span>
          <a href="mailto:shawn@example.com" class="contact-value" data-copy="shawn@example.com">shawn@example.com</a>
        </div>

        <div class="contact-socials">
          <a href="#" class="social-link glass-card" aria-label="GitHub" title="GitHub">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          </a>
          <a href="#" class="social-link glass-card" aria-label="LinkedIn" title="LinkedIn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="#" class="social-link glass-card" aria-label="Twitter" title="Twitter">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
          </a>
          <a href="#" class="social-link glass-card" aria-label="Dribbble" title="Dribbble">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6 4.37 12.5 0 18.5"/><path d="M12 2c3.2 4.7 3.2 15.3 0 20"/><path d="M2 12h20"/></svg>
          </a>
        </div>

        <p class="contact-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Based in Shanghai, China — Available Worldwide
        </p>
      </div>
    </div>
  </section>

  <!-- ============ FOOTER ============ -->
  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-text">&copy; 2026 Shawn Niu. Crafted with code & creativity.</p>
      <button class="back-to-top" aria-label="Scroll to top" onclick="document.querySelector('#home').scrollIntoView({behavior:'smooth'})">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 17V3M10 3L5 8M10 3L15 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </footer>

  <!-- ============ PROJECT MODAL ============ -->
  <div class="modal-overlay" id="project-modal" aria-hidden="true" role="dialog" aria-label="Project detail">
    <div class="modal-backdrop"></div>
    <div class="modal-panel">
      <button class="modal-close" aria-label="Close project detail">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <div class="modal-body">
        <!-- Dynamically filled by JS -->
      </div>
    </div>
  </div>

  <!-- ============ FORM SUCCESS TOAST ============ -->
  <div class="toast" id="form-toast" aria-hidden="true">
    <span class="toast-icon">&#x2714;</span>
    <span class="toast-message">Message sent! I'll get back to you soon.</span>
  </div>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML in browser**

Open `index.html` in a browser. Confirm:
- All sections are present in the document
- No broken elements or missing closing tags
- Nav links point to correct section IDs
- All project cards have data-project attributes
- All stat cards have data-target attributes
- Canvas element exists
- Modal skeleton exists (empty body, will be filled by JS)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add complete HTML structure for all portfolio sections"
```

---

### Task 2: CSS Design System — Variables, Reset, Base Styles

**Files:**
- Create: `style.css`

**Interfaces:**
- Produces: CSS custom properties on `:root`; reset styles; body background; scrollbar styling; base typography classes; `.glass-card` base class; `.btn` base classes; `.section` spacing; `.reveal` initial states; all `@keyframes` definitions

- [ ] **Step 1: Write CSS design system foundation**

```css
/* ============================================
   CSS DESIGN SYSTEM — Shawn Niu Portfolio
   ============================================ */

/* ----- CSS Custom Properties ----- */
:root {
  /* Background */
  --bg-primary: #0a0a0f;
  --bg-secondary: #111118;
  --bg-card: rgba(255, 255, 255, 0.03);

  /* Accent Colors */
  --accent-purple: #6c5ce7;
  --accent-cyan: #00d2ff;
  --accent-rose: #ff6b9d;
  --accent-purple-rgb: 108, 92, 231;
  --accent-cyan-rgb: 0, 210, 255;
  --accent-rose-rgb: 255, 107, 157;

  /* Gradients */
  --gradient-hero: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan), var(--accent-purple));
  --gradient-card-border: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan), var(--accent-rose));
  --gradient-button: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan));
  --gradient-text: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-rose));

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.4);

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-bg-hover: rgba(255, 255, 255, 0.06);
  --glass-border-hover: rgba(255, 255, 255, 0.15);
  --glass-blur: blur(20px);

  /* Shadows & Glows */
  --glow-purple: 0 0 40px rgba(108, 92, 231, 0.3);
  --glow-cyan: 0 0 30px rgba(0, 210, 255, 0.25);
  --glow-rose: 0 0 30px rgba(255, 107, 157, 0.2);
  --shadow-card: 0 4px 30px rgba(0, 0, 0, 0.3);
  --shadow-card-hover: 0 8px 50px rgba(108, 92, 231, 0.2);

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

/* ----- Reset & Base ----- */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-purple) var(--bg-primary);
}

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.7;
  overflow-x: hidden;
  cursor: none; /* Hidden for custom cursor */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar for Webkit */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--accent-purple);
  border-radius: var(--radius-full);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-cyan);
}

/* Selection */
::selection {
  background: rgba(108, 92, 231, 0.4);
  color: var(--text-primary);
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
}

button {
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

img, svg {
  display: block;
}

input, textarea {
  font: inherit;
  color: inherit;
}

/* ----- Utility Classes ----- */
.section {
  padding: var(--section-gap) 0;
  position: relative;
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  transition:
    transform var(--duration-normal) var(--ease-out-expo),
    box-shadow var(--duration-normal) var(--ease-out-expo),
    border-color var(--duration-normal) var(--ease-out-expo),
    background var(--duration-normal) var(--ease-out-expo);
}

.glass-card:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  box-shadow: var(--shadow-card-hover);
}

/* ----- Reveal Animation Base ----- */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.8s var(--ease-out-expo),
    transform 0.8s var(--ease-out-expo);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.reveal-stagger > *:nth-child(1) { transition-delay: 0s; }
.reveal-stagger > *:nth-child(2) { transition-delay: 0.1s; }
.reveal-stagger > *:nth-child(3) { transition-delay: 0.2s; }
.reveal-stagger > *:nth-child(4) { transition-delay: 0.3s; }
.reveal-stagger > *:nth-child(5) { transition-delay: 0.4s; }
.reveal-stagger > *:nth-child(6) { transition-delay: 0.5s; }

/* ----- Buttons Base ----- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
  transition:
    transform var(--duration-fast) var(--ease-out-expo),
    box-shadow var(--duration-fast) var(--ease-out-expo);
}

.btn:active {
  transform: scale(0.97);
}

.btn-primary {
  background: var(--gradient-button);
  color: var(--text-primary);
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 6px 30px rgba(108, 92, 231, 0.5);
  transform: translateY(-2px);
}

.btn-primary .btn-arrow {
  transition: transform var(--duration-fast) var(--ease-out-expo);
}

.btn-primary:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-outline {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.03);
}

.btn-outline:hover {
  border-color: var(--accent-cyan);
  box-shadow: var(--glow-cyan);
  transform: translateY(-2px);
}

/* ----- Section Headers ----- */
.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: 0.03em;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  font-weight: 400;
}

/* ----- Container ----- */
.section-header,
.about-grid,
.skills-categories,
.projects-grid,
.timeline-wrapper,
.contact-grid,
.footer-inner {
  max-width: var(--content-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* ----- Keyframe Animations (all defined here, used later) ----- */

/* Float for glow orbs */
@keyframes floatOrb1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes floatOrb2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, -20px) scale(1.15); }
  66% { transform: translate(30px, 30px) scale(0.85); }
}

@keyframes floatOrb3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, 30px) scale(1.05); }
  66% { transform: translate(-30px, -30px) scale(0.95); }
}

/* Spin for orbit rings / conic borders */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Shimmer for gradient text */
@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Pulse for avatar ring / timeline dot */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
}

/* Fade in up (for hero entrance sequence) */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in from right (for modal panel) */
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideOutRight {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

/* Shake for form error */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* Blink for typewriter cursor */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Draw line for scroll indicator */
@keyframes drawLine {
  from { height: 0; }
  to { height: 40px; }
}

/* Toast slide in */
@keyframes toastIn {
  from { transform: translate(-50%, 20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

@keyframes toastOut {
  from { transform: translate(-50%, 0); opacity: 1; }
  to { transform: translate(-50%, -20px); opacity: 0; }
}

/* ----- Reduced Motion ----- */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 2: Verify CSS foundation**

Open `index.html` in browser with DevTools. Confirm:
- CSS variables visible in DevTools under `:root`
- Body background is dark (`#0a0a0f`)
- Scrollbar is styled with purple thumb
- No console errors
- Buttons have base styling
- Section header text is gradient-clipped

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add CSS design system — variables, reset, base styles, keyframes"
```

---

### Task 3: CSS — Navigation Bar & Hero Section

**Files:**
- Modify: `style.css` — append after existing content

**Interfaces:**
- Consumes: `:root` variables, `.btn` base, keyframes from Task 2
- Produces: `.navbar` styles (fixed, glass, scroll state), `.hamburger` / `.mobile-menu` (mobile toggle), `.hero` styles (full-height, glow orbs, content animation sequence), `.scroll-indicator`, `.typewriter-cursor`

- [ ] **Step 1: Write navbar styles**

Append to `style.css`:

```css
/* ============================================
   NAVIGATION BAR
   ============================================ */

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 24px;
  height: 70px;
  transition:
    background var(--duration-normal) var(--ease-out-expo),
    backdrop-filter var(--duration-normal) var(--ease-out-expo),
    box-shadow var(--duration-normal) var(--ease-out-expo),
    border-color var(--duration-normal) var(--ease-out-expo);
  background: rgba(10, 10, 15, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.nav-inner {
  max-width: var(--content-width);
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.nav-logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity var(--duration-fast);
  z-index: 1001;
}

.nav-logo:hover {
  opacity: 0.8;
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  position: relative;
  padding: 8px 0;
  transition: color var(--duration-fast);
  letter-spacing: 0.02em;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-hero);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out-expo);
}

.nav-link:hover,
.nav-link.active {
  color: var(--text-primary);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link.active {
  text-shadow: 0 0 20px rgba(108, 92, 231, 0.4);
}

/* Nav CTA Button */
.nav-cta {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 10px 22px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    border-color var(--duration-fast),
    box-shadow var(--duration-fast),
    background var(--duration-fast);
}

.nav-cta:hover {
  border-color: var(--accent-purple);
  box-shadow: var(--glow-purple);
  background: var(--glass-bg-hover);
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  z-index: 1001;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: var(--radius-full);
  transition: transform var(--duration-normal) var(--ease-out-expo),
              opacity var(--duration-fast);
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 6px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -6px);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  z-index: 999;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-normal) var(--ease-out-expo);
}

.mobile-menu.active {
  opacity: 1;
  pointer-events: all;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.mobile-nav-links a {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  transition: color var(--duration-fast);
}

.mobile-nav-links a:hover {
  color: var(--accent-cyan);
}
```

- [ ] **Step 2: Write hero section styles**

```css
/* ============================================
   HERO SECTION
   ============================================ */

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 120px 24px 60px;
}

/* Glow Orbs */
.glow-orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(80px);
  opacity: 0.3;
}

.glow-orb--1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--accent-purple), transparent 70%);
  top: 10%;
  left: -10%;
  animation: floatOrb1 12s ease-in-out infinite;
}

.glow-orb--2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--accent-cyan), transparent 70%);
  top: 50%;
  right: -8%;
  animation: floatOrb2 15s ease-in-out infinite;
}

.glow-orb--3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, var(--accent-rose), transparent 70%);
  bottom: -5%;
  left: 30%;
  animation: floatOrb3 10s ease-in-out infinite;
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
}

.hero-greeting {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 16px;
  animation-delay: 0.3s;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 8vw, 8rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.04em;
  background: var(--gradient-hero);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s ease infinite;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 30px rgba(108, 92, 231, 0.3));
}

.hero-subtitle {
  font-family: var(--font-mono);
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: var(--accent-cyan);
  margin-bottom: 24px;
  min-height: 1.6em;
  font-weight: 500;
}

.typewriter-cursor {
  animation: blink 0.8s step-end infinite;
  font-weight: 300;
}

.hero-description {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 520px;
  margin: 0 auto 40px;
  line-height: 1.7;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
  opacity: 0.6;
}

.scroll-indicator span {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(transparent, var(--accent-cyan), transparent);
  animation: drawLine 2s ease-in-out infinite alternate;
}

/* Hero entrance animation — triggered by JS adding .hero-loaded */
.hero-loaded .hero-greeting {
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.3s both;
}
.hero-loaded .hero-title {
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.6s both;
}
.hero-loaded .hero-subtitle {
  animation: fadeIn 0.5s var(--ease-out-expo) 1.0s both;
}
.hero-loaded .hero-description {
  animation: fadeInUp 0.8s var(--ease-out-expo) 1.3s both;
}
.hero-loaded .hero-buttons {
  animation: fadeInUp 0.8s var(--ease-out-expo) 1.6s both;
}
```

- [ ] **Step 3: Verify navbar and hero visually**

Open `index.html` in browser. Confirm:
- Navbar is fixed at top, glass effect visible
- Hero section fills viewport
- Hero title has gradient text with shimmer animation
- Glow orbs are visible and floating
- Scroll indicator at bottom
- Nav links have hover underline effect

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "feat: add navbar and hero section CSS"
```

---

### Task 4: CSS — About Section & Skills Section

**Files:**
- Modify: `style.css` — append after navbar/hero styles

**Interfaces:**
- Consumes: `.glass-card`, `.reveal`, `.section-header`, keyframes from Task 2
- Produces: `.about-grid`, `.about-card`, `.avatar`, `.identity-tags`, `.stats-grid`, `.stat-card`, `.skills-categories`, `.skill-tag`, `.skills-orbital` styles

- [ ] **Step 1: Write about section styles**

```css
/* ============================================
   ABOUT SECTION
   ============================================ */

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

/* About Card (Left) */
.about-card {
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.about-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: calc(var(--radius-md) + 1px);
  background: var(--gradient-card-border);
  opacity: 0;
  transition: opacity var(--duration-normal);
  z-index: -1;
}

.about-card:hover::before {
  opacity: 0.3;
}

.about-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-card-hover), var(--glow-purple);
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  position: relative;
  z-index: 1;
}

.avatar-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: var(--gradient-card-border) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: spin 6s linear infinite;
}

.identity-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 24px;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--accent-cyan);
  transition:
    background var(--duration-fast),
    border-color var(--duration-fast),
    transform var(--duration-fast),
    box-shadow var(--duration-fast);
}

.tag:hover {
  background: var(--glass-bg-hover);
  border-color: var(--accent-cyan);
  transform: translateY(-2px);
  box-shadow: var(--glow-cyan);
}

.about-text p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.about-text p:last-child {
  margin-bottom: 0;
}

/* Stats Grid (Right) */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-card {
  padding: 28px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.stat-card:hover {
  transform: translateY(-6px);
  border-color: var(--accent-purple);
  box-shadow: var(--glow-purple);
}

.stat-icon {
  color: var(--accent-cyan);
  opacity: 0.8;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}
```

- [ ] **Step 2: Write skills section styles**

```css
/* ============================================
   SKILLS SECTION
   ============================================ */

.skills {
  position: relative;
  overflow: hidden;
}

.skills-categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  position: relative;
  z-index: 1;
}

.skill-category {
  text-align: center;
}

.skill-cat-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.skill-cat-icon {
  color: var(--accent-cyan);
  font-size: 0.8rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

/* Individual Skill Tag */
.skill-tag {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.3s var(--ease-out-back),
    background var(--duration-fast),
    border-color var(--duration-fast),
    box-shadow var(--duration-fast),
    color var(--duration-fast);
  position: relative;
  cursor: default;
}

.skill-tag:hover {
  transform: scale(1.1) translateY(-4px);
  background: var(--glass-bg-hover);
  border-color: var(--accent-purple);
  box-shadow: var(--glow-purple);
  color: var(--text-primary);
  z-index: 2;
}

/* Orbital Decoration */
.skills-orbital {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.06;
}

.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid var(--accent-cyan);
}

.orbit-ring--1 {
  width: 300px;
  height: 300px;
  animation: spinSlow 20s linear infinite;
}

.orbit-ring--2 {
  width: 450px;
  height: 450px;
  border-color: var(--accent-purple);
  animation: spinSlow 25s linear infinite reverse;
}

.orbit-ring--3 {
  width: 600px;
  height: 600px;
  border-color: var(--accent-rose);
  animation: spinSlow 30s linear infinite;
}
```

- [ ] **Step 3: Verify about and skills sections**

Open `index.html` in browser. Scroll to About and Skills. Confirm:
- About card has glass effect, avatar with spinning ring
- Stats cards have gradient numbers
- Skill tags are in 3 columns with category headers
- Hover on tags: scale up with glow
- Orbital rings are visible as subtle decoration

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "feat: add about and skills section CSS"
```

---

### Task 5: CSS — Projects Grid, Modal, Timeline, Contact, Footer & Responsive

**Files:**
- Modify: `style.css` — append remaining section styles + responsive media queries

**Interfaces:**
- Consumes: `.glass-card`, `.reveal`, `.btn`, `.section-header`, keyframes from Task 2
- Produces: `.projects-grid`, `.project-card`, `.card-image`, `.card-content`, `.card-action` (hover 3D + glow); `.modal-overlay`, `.modal-panel`; `.timeline-wrapper`, `.timeline-item`; `.contact-grid`, `.contact-form`, `.form-group`; `.footer`; `@media` queries for all breakpoints

- [ ] **Step 1: Write projects section styles**

```css
/* ============================================
   PROJECTS SECTION
   ============================================ */

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

/* Project Card */
.project-card {
  perspective: 1000px;
}

.project-card-inner {
  position: relative;
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  overflow: hidden;
  transition:
    transform 0.5s var(--ease-out-expo),
    box-shadow 0.5s var(--ease-out-expo),
    border-color 0.5s var(--ease-out-expo);
}

.project-card-inner::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: calc(var(--radius-md) + 2px);
  background: var(--gradient-card-border);
  opacity: 0;
  transition: opacity 0.4s var(--ease-out-expo);
  z-index: -1;
}

.project-card-inner:hover {
  transform: translateY(-12px);
  box-shadow: var(--shadow-card-hover), var(--glow-purple);
  border-color: transparent;
}

.project-card-inner:hover::before {
  opacity: 1;
}

/* Card Image */
.card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--bg-secondary), rgba(108, 92, 231, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: transform 0.6s var(--ease-out-expo);
}

.project-card-inner:hover .card-image-placeholder {
  transform: scale(1.05);
}

.card-image-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(108, 92, 231, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s var(--ease-out-expo);
}

.project-card-inner:hover .card-image-glow {
  opacity: 1;
}

/* Card Content */
.card-content {
  padding: 24px;
}

.card-type {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-cyan);
  display: block;
  margin-bottom: 8px;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.card-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-tags span {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: rgba(108, 92, 231, 0.1);
  color: var(--accent-purple);
  border: 1px solid rgba(108, 92, 231, 0.2);
}

/* Card Action Button */
.card-action {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  background: var(--gradient-button);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.3s var(--ease-out-expo),
    transform 0.3s var(--ease-out-expo),
    box-shadow 0.2s;
  cursor: pointer;
}

.project-card-inner:hover .card-action {
  opacity: 1;
  transform: translateY(0);
}

.card-action:hover {
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.5);
}

.card-action svg {
  transition: transform var(--duration-fast) var(--ease-out-expo);
}

.card-action:hover svg {
  transform: translateX(3px);
}

/* 3D Tilt — applied by JS via CSS custom properties */
.project-card.tilting .project-card-inner {
  transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateY(-12px);
  box-shadow: var(--shadow-card-hover), var(--glow-purple);
  border-color: transparent;
}

.project-card.tilting .project-card-inner::before {
  opacity: 1;
}

.project-card.tilting .card-image-placeholder {
  transform: scale(1.05);
}

.project-card.tilting .card-image-glow {
  opacity: 1;
}

.project-card.tilting .card-action {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Write modal styles**

```css
/* ============================================
   PROJECT MODAL
   ============================================ */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: none;
  align-items: center;
  justify-content: flex-end;
}

.modal-overlay.active {
  display: flex;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s var(--ease-out-expo) both;
}

.modal-panel {
  position: relative;
  width: 100%;
  max-width: 560px;
  height: 100vh;
  background: var(--bg-secondary);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding: 60px 40px 40px;
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.4s var(--ease-out-expo);
}

.modal-overlay.active .modal-panel {
  transform: translateX(0);
}

.modal-overlay.closing .modal-panel {
  transform: translateX(100%);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: color var(--duration-fast), background var(--duration-fast);
}

.modal-close:hover {
  color: var(--text-primary);
  background: var(--glass-bg);
}

/* Modal Content */
.modal-body .modal-project-type {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-cyan);
  display: block;
  margin-bottom: 8px;
}

.modal-body .modal-project-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 20px;
}

.modal-body .modal-project-desc {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 28px;
}

.modal-body .modal-tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.modal-body .modal-tech-stack span {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: rgba(108, 92, 231, 0.1);
  border: 1px solid rgba(108, 92, 231, 0.25);
  color: var(--accent-purple);
}

.modal-body .modal-highlights {
  list-style: none;
}

.modal-body .modal-highlights li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.modal-body .modal-highlights li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-cyan);
  box-shadow: 0 0 8px var(--accent-cyan);
}
```

- [ ] **Step 3: Write timeline styles**

```css
/* ============================================
   TIMELINE SECTION
   ============================================ */

.timeline-wrapper {
  position: relative;
}

/* Central line */
.timeline-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(-50%);
  overflow: hidden;
}

.timeline-line-fill {
  width: 100%;
  height: 0;
  background: var(--gradient-hero);
  transition: height 0.1s linear; /* driven by JS on scroll */
}

/* Timeline Items */
.timeline-items {
  position: relative;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 60px;
  position: relative;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

/* Dot */
.timeline-dot {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid rgba(255, 255, 255, 0.15);
  z-index: 1;
  transition:
    background var(--duration-normal),
    border-color var(--duration-normal),
    box-shadow var(--duration-normal);
}

.timeline-item.active .timeline-dot {
  background: var(--accent-cyan);
  border-color: var(--accent-cyan);
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.5);
}

.timeline-dot::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(0, 210, 255, 0);
  transition: border-color var(--duration-normal), transform var(--duration-normal);
}

.timeline-item.active .timeline-dot::after {
  border-color: rgba(0, 210, 255, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

/* Content cards */
.timeline-content {
  width: calc(50% - 50px);
  padding: 28px;
}

.timeline-item:nth-child(odd) .timeline-content {
  margin-right: auto;
}

.timeline-item:nth-child(even) .timeline-content {
  margin-left: auto;
}

.timeline-content:hover {
  transform: translateY(-4px);
  border-color: var(--accent-purple);
  box-shadow: var(--glow-purple);
}

.timeline-year {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent-cyan);
  display: block;
  margin-bottom: 6px;
}

.timeline-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.timeline-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
```

- [ ] **Step 4: Write contact section styles**

```css
/* ============================================
   CONTACT SECTION
   ============================================ */

.contact {
  position: relative;
  overflow: hidden;
}

.contact-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(108, 92, 231, 0.08), transparent 70%);
  pointer-events: none;
  border-radius: 50%;
}

.section-title--large {
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  position: relative;
  z-index: 1;
}

/* Form */
.contact-form {
  padding: 40px;
}

.form-group {
  position: relative;
  margin-bottom: 28px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition:
    border-color var(--duration-fast),
    box-shadow var(--duration-fast),
    background var(--duration-fast);
  outline: none;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--accent-purple);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
  background: var(--glass-bg-hover);
}

.form-group label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: var(--text-muted);
  pointer-events: none;
  transition:
    transform 0.2s var(--ease-out-expo),
    font-size 0.2s var(--ease-out-expo),
    color 0.2s;
}

.form-group textarea ~ label {
  top: 18px;
  transform: none;
}

.form-group input:focus ~ label,
.form-group input:not(:placeholder-shown) ~ label,
.form-group textarea:focus ~ label,
.form-group textarea:not(:placeholder-shown) ~ label {
  transform: translateY(-30px) scale(0.85);
  color: var(--accent-cyan);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: transparent;
}

.form-error {
  display: none;
  font-size: 0.8rem;
  color: var(--accent-rose);
  margin-top: 6px;
  padding-left: 4px;
}

.form-group.error .form-error {
  display: block;
}

.form-group.error input,
.form-group.error textarea {
  border-color: var(--accent-rose);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.15);
  animation: shake 0.4s var(--ease-out-expo);
}

.form-group.success input,
.form-group.success textarea {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.1);
}

.btn-submit {
  width: 100%;
  justify-content: center;
  margin-top: 8px;
}

.form-success {
  display: none;
  text-align: center;
  color: var(--accent-cyan);
  font-weight: 600;
  margin-top: 16px;
}

.form-success.visible {
  display: block;
}

/* Contact Info (Right) */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.contact-icon {
  color: var(--accent-cyan);
  margin-bottom: 4px;
}

.contact-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.contact-value {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: color var(--duration-fast);
}

.contact-value:hover {
  color: var(--accent-cyan);
}

.contact-socials {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.social-link {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.social-link:hover {
  color: var(--accent-cyan);
  border-color: var(--accent-cyan);
  box-shadow: var(--glow-cyan);
  transform: translateY(-4px);
}

.contact-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-muted);
}
```

- [ ] **Step 5: Write footer styles**

```css
/* ============================================
   FOOTER
   ============================================ */

.footer {
  padding: 32px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.back-to-top {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-secondary);
  transition:
    border-color var(--duration-fast),
    color var(--duration-fast),
    transform var(--duration-fast),
    box-shadow var(--duration-fast);
}

.back-to-top:hover {
  border-color: var(--accent-purple);
  color: var(--text-primary);
  box-shadow: var(--glow-purple);
  transform: translateY(-4px);
}
```

- [ ] **Step 6: Write cursor and particle canvas styles**

```css
/* ============================================
   CUSTOM CURSOR
   ============================================ */

.cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.15s;
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-cyan);
  box-shadow: 0 0 12px var(--accent-cyan);
}

.cursor-ring {
  width: 28px;
  height: 28px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
}

/* Cursor states */
.cursor-dot.hover-interactive {
  transform: translate(-50%, -50%) scale(2);
  background: var(--text-primary);
  mix-blend-mode: difference;
}

.cursor-ring.hover-interactive {
  transform: translate(-50%, -50%) scale(1.8);
  border-color: var(--accent-cyan);
}

/* Hide custom cursor on touch devices */
@media (hover: none) and (pointer: coarse) {
  .cursor-dot,
  .cursor-ring {
    display: none;
  }
  body {
    cursor: auto;
  }
}

/* ============================================
   PARTICLE CANVAS
   ============================================ */

#particles {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* ============================================
   MOUSE GLOW
   ============================================ */

.mouse-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(108, 92, 231, 0.08), transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
}
```

- [ ] **Step 7: Write toast and responsive styles**

```css
/* ============================================
   TOAST
   ============================================ */

.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translate(-50%, 20px);
  z-index: 3000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  border: 1px solid var(--accent-cyan);
  box-shadow: var(--glow-cyan);
  opacity: 0;
  pointer-events: none;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.toast.active {
  animation: toastIn 0.4s var(--ease-out-expo) forwards;
}

.toast.hiding {
  animation: toastOut 0.3s var(--ease-out-expo) forwards;
}

.toast-icon {
  color: var(--accent-cyan);
  font-size: 1.1rem;
}

/* ============================================
   RESPONSIVE — Tablet (768px–1024px)
   ============================================ */

@media (max-width: 1024px) {
  :root {
    --section-gap: 80px;
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .skills-categories {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .projects-grid {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .card-image {
    height: 180px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  /* Remove 3D tilt on tablet for performance */
  .project-card {
    perspective: none;
  }
  .project-card.tilting .project-card-inner {
    transform: translateY(-8px);
  }
}

/* ============================================
   RESPONSIVE — Mobile (< 768px)
   ============================================ */

@media (max-width: 768px) {
  :root {
    --section-gap: 60px;
  }

  /* Navigation */
  .nav-links,
  .nav-cta {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }

  /* Hero */
  .glow-orb--1 { width: 300px; height: 300px; }
  .glow-orb--2 { width: 250px; height: 250px; }
  .glow-orb--3 { width: 200px; height: 200px; }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .hero-buttons .btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .scroll-indicator {
    display: none;
  }

  /* About */
  .about-card {
    padding: 28px 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 20px 16px;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  /* Skills */
  .skill-tags {
    gap: 8px;
  }

  .skill-tag {
    font-size: 0.76rem;
    padding: 6px 14px;
  }

  .skills-orbital {
    display: none;
  }

  /* Projects */
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .card-image {
    height: 200px;
  }

  /* Modal — full screen on mobile */
  .modal-panel {
    max-width: 100%;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    height: 90vh;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    transform: translateY(100%);
    top: auto;
    bottom: 0;
  }

  .modal-overlay {
    align-items: flex-end;
  }

  .modal-overlay.active .modal-panel {
    transform: translateY(0);
  }

  .modal-overlay.closing .modal-panel {
    transform: translateY(100%);
  }

  /* Timeline */
  .timeline-line {
    left: 20px;
  }

  .timeline-dot {
    left: 20px;
  }

  .timeline-content {
    width: calc(100% - 56px);
    margin-left: 56px !important;
    margin-right: 0 !important;
  }

  .timeline-item:nth-child(odd) .timeline-content,
  .timeline-item:nth-child(even) .timeline-content {
    margin-left: 56px;
    margin-right: 0;
  }

  /* Contact */
  .contact-form {
    padding: 28px 20px;
  }

  .contact-grid {
    gap: 24px;
  }

  /* Cursor — hidden on touch */
  .cursor-dot,
  .cursor-ring,
  .mouse-glow {
    display: none !important;
  }

  body {
    cursor: auto;
  }
}
```

- [ ] **Step 8: Verify all remaining sections visually**

Open in browser, resize to mobile/tablet, check:
- Project cards have hover effects (lift, border glow, button slide-in)
- Modal opens full-screen on mobile
- Timeline line and dots align correctly on mobile
- Form shows floating labels on focus
- Hamburger menu toggles
- All sections stack properly at < 768px

- [ ] **Step 9: Commit**

```bash
git add style.css
git commit -m "feat: add projects, modal, timeline, contact, footer CSS + responsive"
```

---

### Task 6: JavaScript — Particle System & Custom Cursor

**Files:**
- Create: `script.js`

**Interfaces:**
- Consumes: `#particles` canvas, `.cursor-dot`, `.cursor-ring`, `.mouse-glow` DOM elements
- Produces: `initParticles()` — canvas 2D particle system with dot-line rendering, mouse repulsion, responsive particle count; `initCustomCursor()` — dual-element cursor with lerp lag, hover-interactive state detection

- [ ] **Step 1: Write particle system**

```javascript
/* ============================================
   PARTICLE SYSTEM — Canvas 2D
   ============================================ */

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000 };
    this.animationId = null;

    this.updateSize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  /* Responsive sizing + particle count */
  updateSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = this.canvas.width + 'px';
    this.canvas.style.height = this.canvas.height + 'px';

    const w = window.innerWidth;
    if (w > 1200)       this.count = 80;
    else if (w > 768)   this.count = 40;
    else                this.count = 25;
  }

  /* Create particles */
  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
  }

  /* Event listeners */
  bindEvents() {
    window.addEventListener('resize', () => {
      this.updateSize();
      this.initParticles();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  /* Animation loop */
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /* Update particle positions */
  updateParticles() {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      /* Wrap around edges */
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;

      /* Mouse repulsion */
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulsionRadius = 120;

      if (dist < repulsionRadius && dist > 0) {
        const force = (repulsionRadius - dist) / repulsionRadius * 0.8;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      /* Damping */
      p.vx *= 0.999;
      p.vy *= 0.999;

      /* Speed limit */
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.2) {
        p.vx = (p.vx / speed) * 1.2;
        p.vy = (p.vy / speed) * 1.2;
      }
    }
  }

  /* Draw connecting lines between nearby particles */
  drawConnections() {
    const ctx = this.ctx;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;

        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(108, 92, 231, ${0.08 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  /* Draw particle dots */
  drawParticles() {
    const ctx = this.ctx;
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 255, ${p.opacity})`;

      /* Glow near mouse */
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        ctx.fillStyle = `rgba(0, 210, 255, ${p.opacity + 0.2})`;
      }

      ctx.fill();
    }
  }
}

/* Initialize on DOM ready */
let particleSystem;

function initParticles() {
  const canvas = document.getElementById('particles');
  if (canvas) {
    particleSystem = new ParticleSystem(canvas);
  }
}
```

- [ ] **Step 2: Write custom cursor**

```javascript
/* ============================================
   CUSTOM CURSOR
   ============================================ */

class CustomCursor {
  constructor(dot, ring, glow) {
    this.dot = dot;
    this.ring = ring;
    this.glow = glow || null;
    this.target = { x: -100, y: -100 };
    this.current = { x: -100, y: -100 };
    this.ringCurrent = { x: -100, y: -100 };
    this.visible = false;
    this.interactive = false;

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
      if (!this.visible) {
        this.current.x = e.clientX;
        this.current.y = e.clientY;
        this.ringCurrent.x = e.clientX;
        this.ringCurrent.y = e.clientY;
        this.visible = true;
        this.dot.style.opacity = '1';
        this.ring.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', () => {
      this.visible = false;
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
    });

    /* Interactive hover detection */
    const interactives = document.querySelectorAll(
      'a, button, .project-card, .skill-tag, .social-link, .glass-card, input, textarea, .nav-link'
    );
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.interactive = true;
        this.dot.classList.add('hover-interactive');
        this.ring.classList.add('hover-interactive');
      });
      el.addEventListener('mouseleave', () => {
        this.interactive = false;
        this.dot.classList.remove('hover-interactive');
        this.ring.classList.remove('hover-interactive');
      });
    });
  }

  animate() {
    /* Lerp dot */
    const lerpDot = 0.3;
    this.current.x += (this.target.x - this.current.x) * lerpDot;
    this.current.y += (this.target.y - this.current.y) * lerpDot;

    /* Lerp ring (slower = more lag) */
    const lerpRing = 0.15;
    this.ringCurrent.x += (this.target.x - this.ringCurrent.x) * lerpRing;
    this.ringCurrent.y += (this.target.y - this.ringCurrent.y) * lerpRing;

    /* Apply positions */
    this.dot.style.left = this.current.x + 'px';
    this.dot.style.top = this.current.y + 'px';
    this.ring.style.left = this.ringCurrent.x + 'px';
    this.ring.style.top = this.ringCurrent.y + 'px';

    /* Mouse glow */
    if (this.glow && this.visible) {
      this.glow.style.left = this.current.x + 'px';
      this.glow.style.top = this.current.y + 'px';
      this.glow.style.opacity = '1';
    } else if (this.glow) {
      this.glow.style.opacity = '0';
    }

    requestAnimationFrame(() => this.animate());
  }
}

let customCursor;

function initCustomCursor() {
  /* Only init on non-touch devices */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const glow = document.querySelector('.mouse-glow');
    if (dot && ring) {
      customCursor = new CustomCursor(dot, ring, glow);
    }
  }
}
```

- [ ] **Step 3: Write DOM init and wire up page load**

```javascript
/* ============================================
   INITIALIZATION — Called when DOM is ready
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCustomCursor();
});
```

- [ ] **Step 4: Verify particles and cursor**

Open in browser. Confirm:
- Particles visible as dots with connecting lines
- Mouse repels nearby particles
- Custom cursor dot + ring follow mouse with lag
- Hovering buttons/links: cursor ring scales up
- On mobile: cursor hidden, particles reduced

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "feat: add particle canvas system and custom cursor"
```

---

### Task 7: JavaScript — Scroll Features (Reveal, Navbar, Timeline, Smooth Scroll)

**Files:**
- Modify: `script.js` — append after existing code

**Interfaces:**
- Consumes: `.reveal` elements, `.navbar`, `.nav-link`, `.timeline-line-fill`, `.timeline-item` DOM elements
- Produces: `initScrollReveal()` — IntersectionObserver with stagger; `initNavbarScroll()` — scrolled class + active section; `initTimelineDraw()` — fill line + light nodes on scroll; `initSmoothScroll()` — nav link click → smooth scroll

- [ ] **Step 1: Write scroll reveal with IntersectionObserver**

Append to `script.js`:

```javascript
/* ============================================
   SCROLL REVEAL — IntersectionObserver
   ============================================ */

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}
```

- [ ] **Step 2: Write navbar scroll state + active section tracker**

```javascript
/* ============================================
   NAVBAR — Scroll State & Active Section
   ============================================ */

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [];

  /* Collect section elements */
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ link, section });
    }
  });

  function updateNavbar() {
    const scrollY = window.scrollY;

    /* Toggle scrolled class */
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* Determine active section */
    let activeSection = sections[0];
    for (const { section } of sections) {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        activeSection = sections.find((s) => s.section === section);
      }
    }

    /* Update active link */
    navLinks.forEach((link) => link.classList.remove('active'));
    if (activeSection) {
      activeSection.link.classList.add('active');
    }
  }

  /* Throttled scroll listener */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* Run once on load */
  updateNavbar();
}
```

- [ ] **Step 3: Write timeline draw animation**

```javascript
/* ============================================
   TIMELINE — Line Fill & Node Activation
   ============================================ */

function initTimelineDraw() {
  const timelineSection = document.getElementById('timeline');
  const lineFill = document.querySelector('.timeline-line-fill');
  const items = document.querySelectorAll('.timeline-item');

  if (!timelineSection || !lineFill || !items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          /* Calculate timeline fill based on section visibility */
          updateTimeline();
        }
      });
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  observer.observe(timelineSection);

  function updateTimeline() {
    const sectionTop = timelineSection.offsetTop;
    const sectionHeight = timelineSection.offsetHeight;
    const scrollY = window.scrollY + window.innerHeight * 0.6;
    const progress = Math.min(1, Math.max(0, (scrollY - sectionTop) / sectionHeight));
    lineFill.style.height = (progress * 100) + '%';

    /* Activate nodes based on scroll position */
    items.forEach((item, index) => {
      const itemTop = item.offsetTop;
      const triggerPoint = sectionTop + (itemTop - sectionTop) * 0.8;
      if (scrollY >= triggerPoint) {
        item.classList.add('active');
      }
    });
  }

  /* Throttled scroll for timeline */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateTimeline();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
```

- [ ] **Step 4: Write smooth scroll navigation**

```javascript
/* ============================================
   SMOOTH SCROLL — Nav Links + Mobile Menu
   ============================================ */

function initSmoothScroll() {
  /* Desktop nav links */
  document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          /* Close mobile menu if open */
          const mobileMenu = document.querySelector('.mobile-menu');
          const hamburger = document.querySelector('.hamburger');
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger?.classList.remove('active');
            document.body.style.overflow = '';
          }
        }
      }
    });
  });

  /* Mobile hamburger toggle */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
}
```

- [ ] **Step 5: Wire into DOMContentLoaded**

Update the DOMContentLoaded handler at the bottom of `script.js`:

```javascript
/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCustomCursor();
  initScrollReveal();
  initNavbarScroll();
  initTimelineDraw();
  initSmoothScroll();
});
```

- [ ] **Step 6: Verify scroll features**

Open in browser. Confirm:
- Sections fade in as you scroll down
- Navbar background intensifies on scroll
- Active nav link changes per visible section
- Timeline line fills as you scroll; dots light up
- Clicking nav links smooth-scrolls to correct section
- Mobile hamburger opens/closes menu

- [ ] **Step 7: Commit**

```bash
git add script.js
git commit -m "feat: add scroll reveal, navbar tracking, timeline draw, smooth scroll"
```

---

### Task 8: JavaScript — 3D Tilt, Project Modal, Number Count-Up, Form Validation, Typewriter

**Files:**
- Modify: `script.js` — append final interactive features

**Interfaces:**
- Consumes: `.project-card`, `.project-card-inner`, `#project-modal`, `.modal-body`, `.stat-card`, `#contact-form`, `.typewriter-text` DOM elements; project data object
- Produces: `init3DTilt()` — mouse-tracking tilt on cards; `initProjectModal()` — open/close with project data fill; `initCountUp()` — animated number counters; `initFormValidation()` — client-side validation + toast; `initTypewriter()` — hero subtitle typing effect; hero entrance sequence trigger

- [ ] **Step 1: Write project data + 3D tilt**

```javascript
/* ============================================
   PROJECT DATA
   ============================================ */

const projectData = {
  'neural-dashboard': {
    type: 'Development',
    title: 'Neural Dashboard',
    desc: 'A real-time analytics dashboard that visualizes neural network training metrics with live data streaming. Features include interactive D3.js charts, WebSocket-powered live updates, and a modular React component architecture. Built for ML researchers to monitor model performance in real time.',
    tech: ['React', 'D3.js', 'WebSocket', 'Node.js', 'Redis'],
    highlights: [
      'Real-time data streaming with < 50ms latency',
      'Custom D3.js visualizations for neural network metrics',
      'Modular architecture supporting 20+ chart types',
      'Dark theme optimized for extended monitoring sessions',
    ],
  },
  'prism-design': {
    type: 'Design',
    title: 'Prism Design System',
    desc: 'A comprehensive design system built from the ground up with token-based theming. Includes 200+ meticulously crafted components, dark/light mode support, and extensive documentation. Used across 5 product teams serving 2M+ end users.',
    tech: ['Figma', 'Design Tokens', 'Storybook', 'CSS Custom Properties', 'Accessibility'],
    highlights: [
      '200+ components with full accessibility compliance',
      'Token-based theming engine with dark/light modes',
      'Interactive Storybook documentation with live playground',
      'Adopted by 5 product teams across the organization',
    ],
  },
  'cloudflow': {
    type: 'Development',
    title: 'CloudFlow Platform',
    desc: 'A serverless workflow automation platform featuring a drag-and-drop pipeline builder. Users can create complex automation flows connecting 50+ services. Includes real-time execution logs, error recovery, and team collaboration features.',
    tech: ['Node.js', 'AWS Lambda', 'PostgreSQL', 'React', 'Docker'],
    highlights: [
      'Drag-and-drop visual pipeline builder',
      'Serverless architecture auto-scaling to 10K+ concurrent executions',
      'Integration with 50+ third-party services',
      'Real-time execution monitoring and automated error recovery',
    ],
  },
  'aether-brand': {
    type: 'Design',
    title: 'Aether Brand Identity',
    desc: 'Complete brand identity project for a luxury AI startup. Delivered brand strategy, visual identity, motion guidelines, and a full UI kit. The brand system balances futuristic aesthetics with approachable luxury, positioning Aether as a premium AI brand.',
    tech: ['Brand Strategy', 'Visual Design', 'Motion Design', 'Typography', 'Art Direction'],
    highlights: [
      'Comprehensive brand strategy and positioning document',
      'Dynamic logo system with responsive variants',
      'Motion design guidelines for all brand touchpoints',
      'Brand guideline documentation spanning 120+ pages',
    ],
  },
  'dataviz-explorer': {
    type: 'Development',
    title: 'DataViz Explorer',
    desc: 'An immersive 3D data visualization tool powered by WebGL and custom GLSL shaders. Transforms complex datasets into explorable 3D landscapes with real-time filtering, animation, and export capabilities. Used by data journalists and researchers worldwide.',
    tech: ['Three.js', 'WebGL', 'TypeScript', 'GLSL', 'React'],
    highlights: [
      'Custom GLSL shaders for unique visual effects',
      'Handles datasets up to 1M+ data points smoothly',
      'Interactive 3D camera with intuitive orbit controls',
      'Export to high-resolution images and animated GIFs',
    ],
  },
  'lumina-app': {
    type: 'Design',
    title: 'Lumina Mobile App',
    desc: 'End-to-end mobile app design for a wellness and meditation platform. Conducted user research with 200+ participants, created wireframes, interactive prototypes, and final high-fidelity designs. The app achieved a 4.8★ rating within the first month of launch.',
    tech: ['UI/UX Design', 'Prototyping', 'User Research', 'Design Systems', 'Motion'],
    highlights: [
      'User research with 200+ participants across 5 countries',
      'Interactive prototypes tested with real users',
      '4.8★ App Store rating within the first month',
      'Design system documented for future feature development',
    ],
  },
};

/* ============================================
   3D CARD TILT
   ============================================ */

function init3DTilt() {
  const cards = document.querySelectorAll('.project-card');

  /* Skip on touch devices */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8; /* -8deg to 8deg */
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.setProperty('--tilt-x', rotateX + 'deg');
      card.style.setProperty('--tilt-y', rotateY + 'deg');
      card.classList.add('tilting');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.classList.remove('tilting');
    });
  });
}
```

- [ ] **Step 2: Write project modal**

```javascript
/* ============================================
   PROJECT MODAL
   ============================================ */

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalBody = modal.querySelector('.modal-body');
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');

  /* Open modal on card click */
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      /* Don't open if clicking the action button directly */
      if (e.target.closest('.card-action')) return;

      const projectId = card.dataset.project;
      const data = projectData[projectId];
      if (!data) return;

      openModal(data);
    });

    /* Card action button also opens modal */
    const actionBtn = card.querySelector('.card-action');
    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = card.dataset.project;
        const data = projectData[projectId];
        if (!data) return;
        openModal(data);
      });
    }
  });

  function openModal(data) {
    /* Fill modal content */
    modalBody.innerHTML = `
      <span class="modal-project-type">${data.type}</span>
      <h2 class="modal-project-title">${data.title}</h2>
      <p class="modal-project-desc">${data.desc}</p>
      <div class="modal-tech-stack">
        ${data.tech.map((t) => `<span>${t}</span>`).join('')}
      </div>
      <ul class="modal-highlights">
        ${data.highlights.map((h) => `<li>${h}</li>`).join('')}
      </ul>
    `;

    /* Show modal */
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    /* Trigger animation */
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
  }

  function closeModal() {
    modal.classList.add('closing');
    modal.classList.remove('active');

    /* Wait for transition to finish */
    const onTransitionEnd = () => {
      modal.classList.remove('closing');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modal.removeEventListener('transitionend', onTransitionEnd);
    };
    modal.addEventListener('transitionend', onTransitionEnd, { once: true });
  }

  /* Close triggers */
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
```

- [ ] **Step 3: Write number count-up**

```javascript
/* ============================================
   NUMBER COUNT-UP ANIMATION
   ============================================ */

function initCountUp() {
  const statCards = document.querySelectorAll('.stat-card[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const numberEl = card.querySelector('.stat-number');
          const target = parseInt(card.dataset.count, 10);
          const suffix = numberEl.dataset.suffix || '';
          const duration = 2000; /* ms */
          const startTime = performance.now();
          let counted = false;

          function update(currentTime) {
            if (counted) return;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            /* easeOutExpo */
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);

            numberEl.textContent = current.toLocaleString() + suffix;

            if (progress >= 1) {
              counted = true;
              numberEl.textContent = target.toLocaleString() + suffix;
            } else {
              requestAnimationFrame(update);
            }
          }

          requestAnimationFrame(update);
          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.5 }
  );

  statCards.forEach((card) => observer.observe(card));
}
```

- [ ] **Step 4: Write form validation + toast**

```javascript
/* ============================================
   FORM VALIDATION
   ============================================ */

function initFormValidation() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');
  if (!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    /* Validate name */
    const nameGroup = form.querySelector('#name').closest('.form-group');
    const nameInput = form.querySelector('#name');
    if (!nameInput.value.trim()) {
      nameGroup.classList.add('error');
      nameGroup.classList.remove('success');
      isValid = false;
    } else {
      nameGroup.classList.remove('error');
      nameGroup.classList.add('success');
    }

    /* Validate email */
    const emailGroup = form.querySelector('#email').closest('.form-group');
    const emailInput = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
      emailGroup.classList.add('error');
      emailGroup.classList.remove('success');
      isValid = false;
    } else {
      emailGroup.classList.remove('error');
      emailGroup.classList.add('success');
    }

    /* Validate message */
    const msgGroup = form.querySelector('#message').closest('.form-group');
    const msgInput = form.querySelector('#message');
    if (!msgInput.value.trim()) {
      msgGroup.classList.add('error');
      msgGroup.classList.remove('success');
      isValid = false;
    } else {
      msgGroup.classList.remove('error');
      msgGroup.classList.add('success');
    }

    if (isValid) {
      /* Show success toast */
      showToast(toast, 'Message sent! I\'ll get back to you soon.');

      /* Show inline success message */
      const successEl = form.querySelector('.form-success');
      if (successEl) {
        successEl.classList.add('visible');
      }

      /* Reset form after delay */
      setTimeout(() => {
        form.reset();
        form.querySelectorAll('.form-group').forEach((g) => {
          g.classList.remove('success', 'error');
        });
        if (successEl) {
          successEl.classList.remove('visible');
        }
      }, 3000);
    }
  });

  /* Clear error on input */
  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group.classList.contains('error')) {
        group.classList.remove('error');
      }
    });
  });
}

function showToast(toast, message) {
  toast.querySelector('.toast-message').textContent = message;
  toast.classList.remove('hiding');
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.add('hiding');
    toast.classList.remove('active');
  }, 3000);
}

/* Email copy functionality */
function initEmailCopy() {
  const emailEl = document.querySelector('[data-copy]');
  if (!emailEl) return;

  emailEl.addEventListener('click', () => {
    const email = emailEl.dataset.copy;
    navigator.clipboard.writeText(email).then(() => {
      const toast = document.getElementById('form-toast');
      showToast(toast, 'Email copied to clipboard!');
    }).catch(() => {
      /* Fallback */
      window.location.href = `mailto:${email}`;
    });
  });
}
```

- [ ] **Step 5: Write typewriter + hero entrance**

```javascript
/* ============================================
   TYPEWRITER EFFECT — Hero Subtitle
   ============================================ */

function initTypewriter() {
  const textEl = document.querySelector('.typewriter-text');
  const cursorEl = document.querySelector('.typewriter-cursor');
  if (!textEl) return;

  const phrases = [
    'A Creative Developer & Digital Designer',
    'Building the Future, One Pixel at a Time',
    'Where Code Meets Aesthetic',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isWaiting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting && !isWaiting) {
      /* Typing */
      textEl.textContent = currentPhrase.slice(0, charIndex);
      charIndex++;

      if (charIndex > currentPhrase.length) {
        isWaiting = true;
        setTimeout(() => {
          isWaiting = false;
          isDeleting = true;
          type();
        }, 2000);
        return;
      }
    } else if (isDeleting) {
      /* Deleting */
      textEl.textContent = currentPhrase.slice(0, charIndex);
      charIndex--;

      if (charIndex <= 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 30 : 70;
    setTimeout(type, speed + Math.random() * 40);
  }

  /* Start typewriter after hero entrance animation */
  type();
}

/* ============================================
   HERO ENTRANCE — Trigger load animations
   ============================================ */

function initHeroEntrance() {
  const hero = document.querySelector('.hero');
  if (hero) {
    /* Small delay to let CSS catch up, then trigger animations */
    requestAnimationFrame(() => {
      hero.classList.add('hero-loaded');
    });
  }
}
```

- [ ] **Step 6: Wire final inits into DOMContentLoaded**

Update the DOMContentLoaded handler:

```javascript
/* ============================================
   INITIALIZATION
   ============================================ */

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
});
```

- [ ] **Step 7: Verify all interactions**

Full manual test pass in browser:
- [ ] Page loads → hero elements animate in sequence
- [ ] Typewriter cycles through phrases
- [ ] Custom cursor follows, scales on interactive elements
- [ ] Particles drift, repel from mouse
- [ ] Scroll → sections reveal, navbar changes, timeline draws
- [ ] Hover project card → 3D tilt + lift + glow + button appears
- [ ] Click project card → modal slides in with correct content
- [ ] Close modal → ESC / backdrop click / close button all work
- [ ] Scroll to About → stats numbers count up
- [ ] Submit form empty → fields shake red
- [ ] Submit form filled → success toast appears
- [ ] Click email → copied to clipboard (or mailto fallback)
- [ ] Mobile hamburger works
- [ ] All nav links smooth scroll
- [ ] Back-to-top scrolls to hero

- [ ] **Step 8: Commit**

```bash
git add script.js
git commit -m "feat: add 3D tilt, project modal, count-up, form validation, typewriter"
```

---

## Final Verification Checklist

After all tasks complete:

- [ ] Open `index.html` in Chrome, Firefox, Safari — verify consistent rendering
- [ ] Test all responsive breakpoints (1200px, 1024px, 768px, 480px)
- [ ] Check `prefers-reduced-motion` — animations should stop
- [ ] No console errors in any browser
- [ ] All copy/placeholder text displays correctly
- [ ] No layout overflow or horizontal scroll
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Modal properly traps focus and prevents body scroll
- [ ] Particles don't cause performance issues on mobile

**Estimated total:** ~1600 lines across 3 files, 8 sequential tasks, ~2-3 hours implementation time.
