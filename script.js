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

/* ============================================
   TYPEWRITER EFFECT — Hero Subtitle
   ============================================ */

function initTypewriter() {
  const textEl = document.querySelector('.typewriter-text');
  if (!textEl) return;

  const phrases = [
    'Building Cool Stuff with Code & AI',
    '前端学习者 · AI 探索者 · 创意制造者',
    'Where Learning Meets Creating',
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
  initHeroParallax();
  initSocialStagger();
});
