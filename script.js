/* ============================================
   SCRIPT.JS — Shawn Niu Portfolio
   All interactive logic for the portfolio site
   ============================================ */

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
        const force = ((repulsionRadius - dist) / repulsionRadius) * 0.8;
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

      /* Glow near mouse */
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let color = `rgba(200, 210, 255, ${p.opacity})`;
      if (dist < 180) {
        color = `rgba(0, 210, 255, ${p.opacity + 0.2})`;
      }

      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}

let particleSystem;

function initParticles() {
  const canvas = document.getElementById('particles');
  if (canvas) {
    particleSystem = new ParticleSystem(canvas);
  }
}

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

/* ============================================
   TIMELINE — Line Fill & Node Activation
   ============================================ */

function initTimelineDraw() {
  const timelineSection = document.getElementById('timeline');
  const lineFill = document.querySelector('.timeline-line-fill');
  const items = document.querySelectorAll('.timeline-item');

  if (!timelineSection || !lineFill || !items.length) return;

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

  updateTimeline();
}

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
    desc: 'End-to-end mobile app design for a wellness and meditation platform. Conducted user research with 200+ participants, created wireframes, interactive prototypes, and final high-fidelity designs. The app achieved a 4.8-star rating within the first month of launch.',
    tech: ['UI/UX Design', 'Prototyping', 'User Research', 'Design Systems', 'Motion'],
    highlights: [
      'User research with 200+ participants across 5 countries',
      'Interactive prototypes tested with real users',
      '4.8-star App Store rating within the first month',
      'Design system documented for future feature development',
    ],
  },
};

/* ============================================
   3D CARD TILT
   ============================================ */

function init3DTilt() {
  const cards = document.querySelectorAll('.project-card');

  /* Skip on touch devices or if prefers-reduced-motion */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    modal.scrollTop = 0;
    modal.querySelector('.modal-panel').scrollTop = 0;

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
      showToast(toast, "Message sent! I'll get back to you soon.");

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

/* ============================================
   EMAIL COPY
   ============================================ */

function initEmailCopy() {
  const emailEl = document.querySelector('[data-copy]');
  if (!emailEl) return;

  emailEl.addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailEl.dataset.copy;
    navigator.clipboard.writeText(email).then(() => {
      const toast = document.getElementById('form-toast');
      showToast(toast, 'Email copied to clipboard!');
    }).catch(() => {
      /* Fallback: open mail client */
      window.location.href = 'mailto:' + email;
    });
  });
}

/* ============================================
   TYPEWRITER EFFECT — Hero Subtitle
   ============================================ */

function initTypewriter() {
  const textEl = document.querySelector('.typewriter-text');
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

  /* Start typewriter */
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
