/**
 * =============================================
 * SCRIPT.JS — Shawn Niu 个人作品集 交互逻辑
 * 这个文件包含了网站所有的 JavaScript 功能：
 *   粒子背景 | 自定义鼠标 | 滚动动画 | 导航栏
 *   时间线 | 3D 卡片倾斜 | 项目弹窗 | 数字滚动
 *   表单验证 | 邮箱复制 | 打字机效果 | 视差效果
 *
 * 动画引擎: GSAP 3 + ScrollTrigger
 * =============================================
 */

/* ============================================
   GSAP 插件注册
   ============================================ */

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(false);

/* ============================================
   性能预设 — 为所有 GSAP 动画设置默认值
   ============================================ */

gsap.defaults({
  overwrite: 'auto',
});

/* ============================================
   粒子系统（ParticleSystem）
   — 在 Canvas 上绘制随机的粒子点
   — 粒子之间会连成线条
   — 鼠标靠近时粒子会被推开（斥力效果）
   — 鼠标附近的粒子会改变颜色
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

  updateSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const w = window.innerWidth;
    if (w > 1200)       this.count = 80;
    else if (w > 768)   this.count = 40;
    else                this.count = 25;
  }

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

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateParticles() {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;

      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulsionRadius = 120;

      if (dist < repulsionRadius && dist > 0) {
        const force = ((repulsionRadius - dist) / repulsionRadius) * 0.8;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx *= 0.999;
      p.vy *= 0.999;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.2) {
        p.vx = (p.vx / speed) * 1.2;
        p.vy = (p.vy / speed) * 1.2;
      }
    }
  }

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

  drawParticles() {
    const ctx = this.ctx;
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

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
   自定义鼠标指针（CustomCursor）
   — 使用 GSAP quickTo 实现丝滑跟随
   — 悬停在可交互元素上时放大
   ============================================ */

class CustomCursor {
  constructor(dot, ring, glow) {
    this.dot = dot;
    this.ring = ring;
    this.glow = glow || null;
    this.visible = false;
    this.interactive = false;
    this.tX = 0;
    this.tY = 0;
    this.dX = 0;
    this.dY = 0;
    this.rX = 0;
    this.rY = 0;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, scale: 1 });
    gsap.set(this.glow, { xPercent: -50, yPercent: -50 });

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.tX = e.clientX;
      this.tY = e.clientY;
      if (!this.visible) {
        this.dX = this.rX = e.clientX;
        this.dY = this.rY = e.clientY;
        this.visible = true;
        gsap.set(this.dot, { x: e.clientX, y: e.clientY, opacity: 1 });
        gsap.set(this.ring, { x: e.clientX, y: e.clientY, opacity: 1 });
        if (this.glow) {
          gsap.set(this.glow, { x: e.clientX, y: e.clientY, opacity: 1 });
        }
      }
    });

    document.addEventListener('mouseleave', () => {
      this.visible = false;
      gsap.to([this.dot, this.ring], { opacity: 0, duration: 0.15 });
      if (this.glow) {
        gsap.to(this.glow, { opacity: 0, duration: 0.15 });
      }
    });

    const interactives = document.querySelectorAll(
      'a, button, .project-card, .skill-tag, .social-link, .glass-card, input, textarea, .nav-link'
    );
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.interactive = true;
        this.dot.classList.add('hover-interactive');
        this.ring.classList.add('hover-interactive');
        gsap.to(this.dot, { scale: 2, duration: 0.3, overwrite: 'auto' });
        gsap.to(this.ring, { scale: 1.8, duration: 0.3, overwrite: 'auto' });
      });
      el.addEventListener('mouseleave', () => {
        this.interactive = false;
        this.dot.classList.remove('hover-interactive');
        this.ring.classList.remove('hover-interactive');
        gsap.to(this.dot, { scale: 1, duration: 0.3, overwrite: 'auto' });
        gsap.to(this.ring, { scale: 1, duration: 0.3, overwrite: 'auto' });
      });
    });
  }

  animate() {
    const lerpDot = 0.55;
    const lerpRing = 0.3;

    this.dX += (this.tX - this.dX) * lerpDot;
    this.dY += (this.tY - this.dY) * lerpDot;
    this.rX += (this.tX - this.rX) * lerpRing;
    this.rY += (this.tY - this.rY) * lerpRing;

    gsap.set(this.dot, { x: this.dX, y: this.dY });
    gsap.set(this.ring, { x: this.rX, y: this.rY });

    if (this.glow && this.visible) {
      gsap.set(this.glow, { x: this.dX, y: this.dY, opacity: 1 });
    } else if (this.glow) {
      gsap.set(this.glow, { opacity: 0 });
    }

    requestAnimationFrame(() => this.animate());
  }
}

let customCursor;

function initCustomCursor() {
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
   滚动显示动画（Scroll Reveal）→ GSAP ScrollTrigger
   — 替代 IntersectionObserver，使用 ScrollTrigger
   — 元素进入视口时淡入上移，离开时反向
   ============================================ */

function initScrollReveal() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  gsap.utils.toArray('.reveal').forEach((el) => {
    if (el.closest('.reveal-stagger') || el.closest('.hero')) return;

    if (isReduced) {
      gsap.set(el, { opacity: 1, clearProps: 'transform' });
      return;
    }

    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
}

/* ============================================
   导航栏滚动行为（Navbar Scroll）→ GSAP ScrollTrigger
   — 使用 ScrollTrigger 检测滚动位置
   — 添加/移除 .scrolled 类
   — 高亮当前区块对应的导航链接
   ============================================ */

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [];

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ link, section });
    }
  });

  function updateNavbar(scrollY) {
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let activeSection = sections[0];
    for (const { section } of sections) {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        activeSection = sections.find((s) => s.section === section);
      }
    }

    navLinks.forEach((link) => link.classList.remove('active'));
    if (activeSection) {
      activeSection.link.classList.add('active');
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateNavbar(window.scrollY);
}

/* ============================================
   时间线填充动画（Timeline Draw）→ GSAP ScrollTrigger scrub
   — 中间竖线随滚动填充
   — 节点在对应位置激活发光
   ============================================ */

function initTimelineDraw() {
  const timelineSection = document.getElementById('timeline');
  const lineFill = document.querySelector('.timeline-line-fill');
  const items = document.querySelectorAll('.timeline-item');

  if (!timelineSection || !lineFill || !items.length) return;

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.fromTo(lineFill,
    { height: '0%' },
    {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timelineSection,
        start: 'top 60%',
        end: 'bottom 60%',
        scrub: isReduced ? 0 : 0.3,
      },
    }
  );

  items.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      onEnter: () => item.classList.add('active'),
      onLeaveBack: () => item.classList.remove('active'),
    });
  });
}

/* ============================================
   平滑滚动（Smooth Scroll）
   ============================================ */

function initSmoothScroll() {
  document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
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
   项目数据（Project Data）
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
      'Custom cursor with GSAP quickTo smooth follow and hover states',
      'ScrollTrigger-driven scroll reveal animations',
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
   3D 卡片倾斜效果（3D Card Tilt）→ GSAP quickTo
   — 鼠标在项目卡片上移动时，卡片跟随鼠标方向倾斜
   — 使用 quickTo 实现丝滑 CSS 变量过渡
   ============================================ */

function init3DTilt() {
  const cards = document.querySelectorAll('.project-card');

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach((card) => {
    const setTiltX = gsap.quickTo(card, '--tilt-x', { suffix: 'deg' });
    const setTiltY = gsap.quickTo(card, '--tilt-y', { suffix: 'deg' });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      setTiltX(rotateX);
      setTiltY(rotateY);
      card.classList.add('tilting');
    });

    card.addEventListener('mouseleave', () => {
      setTiltX(0);
      setTiltY(0);
      card.classList.remove('tilting');
    });
  });
}

/* ============================================
   项目详情弹窗（Project Modal）→ GSAP Timeline
   — 使用 GSAP timeline 实现流畅的开关动画
   — 从右侧滑入 / 滑出
   ============================================ */

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalBody = modal.querySelector('.modal-body');
  const modalPanel = modal.querySelector('.modal-panel');
  const backdrop = modal.querySelector('.modal-backdrop');
  const closeBtn = modal.querySelector('.modal-close');

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-action')) return;

      const projectId = card.dataset.project;
      const data = projectData[projectId];
      if (!data) return;

      openModal(data);
    });

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
    const isCurrentMobile = window.innerWidth <= 768;

    gsap.killTweensOf([modalPanel, backdrop]);

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

    modal.setAttribute('aria-hidden', 'false');
    modalPanel.scrollTop = 0;
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline();

    if (isCurrentMobile) {
      tl
        .set(modal, { display: 'flex' })
        .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)
        .fromTo(modalPanel, { y: '100%' }, { y: '0%', duration: 0.45, ease: 'expo.out' }, 0.05);
    } else {
      tl
        .set(modal, { display: 'flex' })
        .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)
        .fromTo(modalPanel, { x: '100%' }, { x: '0%', duration: 0.45, ease: 'expo.out' }, 0.05);
    }

    tl.play();
    modal.classList.add('active');

    gsap.fromTo('.modal-project-type', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', delay: 0.15 });
    gsap.fromTo('.modal-project-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', delay: 0.2 });
    gsap.fromTo('.modal-project-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', delay: 0.25 });
    gsap.fromTo('.modal-tech-stack span', { opacity: 0, y: 15, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)', stagger: 0.05, delay: 0.35 });
    gsap.fromTo('.modal-highlights li', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out', stagger: 0.08, delay: 0.55 });
  }

  function closeModal() {
    const isCurrentMobile = window.innerWidth <= 768;
    modal.classList.remove('active');

    gsap.killTweensOf([modalPanel, backdrop]);

    if (isCurrentMobile) {
      gsap.to(modalPanel, {
        y: '100%',
        duration: 0.4,
        ease: 'expo.in',
        onStart: () => {
          gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: 'power2.in' });
        },
        onComplete: () => {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        },
      });
    } else {
      gsap.to(modalPanel, {
        x: '100%',
        duration: 0.4,
        ease: 'expo.in',
        onStart: () => {
          gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: 'power2.in' });
        },
        onComplete: () => {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        },
      });
    }
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ============================================
   数字滚动动画（Count-Up）→ GSAP
   — 使用 GSAP 内置缓动，数字从 0 滚动到目标值
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

          gsap.fromTo(numberEl,
            { textContent: '0' },
            {
              textContent: target,
              duration: 2,
              ease: 'expo.out',
              snap: { textContent: 1 },
              onUpdate() {
                numberEl.textContent = Math.floor(gsap.getProperty(numberEl, 'textContent')).toLocaleString() + suffix;
              },
              onComplete() {
                numberEl.textContent = target.toLocaleString() + suffix;
              },
            }
          );

          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.5 }
  );

  statCards.forEach((card) => observer.observe(card));
}

/* ============================================
   表单验证（Form Validation）→ GSAP shake
   — 验证失败时使用 GSAP 抖动动画
   ============================================ */

function initFormValidation() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');
  if (!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const nameGroup = form.querySelector('#name').closest('.form-group');
    const nameInput = form.querySelector('#name');
    if (!nameInput.value.trim()) {
      nameGroup.classList.add('error');
      nameGroup.classList.remove('success');
      gsap.fromTo(nameGroup, { x: 0 }, { x: [-6, 6, -4, 4, 0], duration: 0.4, ease: 'power2.out' });
      isValid = false;
    } else {
      nameGroup.classList.remove('error');
      nameGroup.classList.add('success');
    }

    const emailGroup = form.querySelector('#email').closest('.form-group');
    const emailInput = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
      emailGroup.classList.add('error');
      emailGroup.classList.remove('success');
      gsap.fromTo(emailGroup, { x: 0 }, { x: [-6, 6, -4, 4, 0], duration: 0.4, ease: 'power2.out' });
      isValid = false;
    } else {
      emailGroup.classList.remove('error');
      emailGroup.classList.add('success');
    }

    const msgGroup = form.querySelector('#message').closest('.form-group');
    const msgInput = form.querySelector('#message');
    if (!msgInput.value.trim()) {
      msgGroup.classList.add('error');
      msgGroup.classList.remove('success');
      gsap.fromTo(msgGroup, { x: 0 }, { x: [-6, 6, -4, 4, 0], duration: 0.4, ease: 'power2.out' });
      isValid = false;
    } else {
      msgGroup.classList.remove('error');
      msgGroup.classList.add('success');
    }

    if (isValid) {
      const submitBtn = form.querySelector('.btn-submit');
      const submitText = submitBtn.querySelector('.btn-submit-text');
      const originalText = submitText.textContent;

      submitText.textContent = '演示模式 — 未实际发送';
      gsap.to(submitBtn, { opacity: 0.7, duration: 0.2 });

      const successEl = form.querySelector('.form-success');
      if (successEl) {
        successEl.classList.add('visible');
        gsap.fromTo(successEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' });
      }

      showToast(toast, '演示模式 — 请通过邮箱或社交链接联系我！');

      setTimeout(() => {
        submitText.textContent = originalText;
        gsap.to(submitBtn, { opacity: 1, duration: 0.2 });
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

  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group.classList.contains('error')) {
        group.classList.remove('error');
      }
    });
  });
}

/**
 * showToast — 使用 GSAP 动画显示底部提示条
 */
function showToast(toast, message) {
  toast.querySelector('.toast-message').textContent = message;

  gsap.fromTo('.toast-message', { opacity: 0 }, { opacity: 1, duration: 0.1 });

  toast.classList.remove('hiding');
  toast.classList.add('active');

  gsap.fromTo(toast,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' }
  );

  setTimeout(() => {
    toast.classList.add('hiding');
    toast.classList.remove('active');
    gsap.to(toast, { y: -20, opacity: 0, duration: 0.3, ease: 'expo.in' });
  }, 3000);
}

/* ============================================
   邮箱复制功能（Email Copy）
   ============================================ */

function initEmailCopy() {
  const emailEl = document.querySelector('[data-copy]');
  if (emailEl) {
    emailEl.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailEl.dataset.copy;
      copyEmailToClipboard(email);
    });
  }

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
    showToast(toast, '邮箱地址已复制到剪贴板！');
  }).catch(() => {
    window.location.href = 'mailto:' + email;
  });
}

/* ============================================
   打字机效果（Typewriter Effect）
   — 保持原有精确定时逻辑
   ============================================ */

function initTypewriter() {
  const textEl = document.querySelector('.typewriter-text');
  if (!textEl) return;

  const phrases = [
    '用代码和 AI 构建酷东西',
    '前端学习者 · AI 探索者 · 创意制造者',
    '当学习遇见创造',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isWaiting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting && !isWaiting) {
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

  type();
}

/* ============================================
   Hero 入场动画（Hero Entrance）→ GSAP Timeline
   — 使用 GSAP timeline 替代 CSS 关键帧动画
   — 页面加载后各元素依次淡入上移
   ============================================ */

function initHeroEntrance() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReduced) {
    hero.classList.add('hero-loaded');
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => hero.classList.add('hero-loaded'),
  });

  tl.fromTo('.hero-bg-text',
    { opacity: 0 },
    { opacity: 1, duration: 1.2, ease: 'power1.inOut' },
    0
  );

  tl.fromTo('.hero-rings',
    { opacity: 0 },
    { opacity: 1, duration: 0.8, ease: 'power1.inOut' },
    0.2
  );

  tl.fromTo('.hero-id-card',
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' },
    0.3
  );

  tl.fromTo('.hero-greeting',
    { opacity: 0, y: 30, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' },
    0.3
  );

  tl.fromTo('.hero-title',
    { opacity: 0, y: 30, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' },
    0.6
  );

  tl.fromTo('.hero-subtitle',
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: 'power1.out' },
    1.0
  );

  tl.fromTo('.hero-description',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
    1.3
  );

  tl.fromTo('.hero-buttons',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
    1.6
  );
}

/* ============================================
   Hero 视差效果（Hero Parallax）→ GSAP quickTo
   — 背景文字跟随鼠标移动，产生深度感
   ============================================ */

function initHeroParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const setX = gsap.quickTo(bgText, 'x', { duration: 0.8, ease: 'power2.out' });
  const setY = gsap.quickTo(bgText, 'y', { duration: 0.8, ease: 'power2.out' });

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * -20;
    const y = (e.clientY / window.innerHeight - 0.5) * -20;
    setX(x);
    setY(y);
  });
}

/* ============================================
   社交图标逐个弹出（Social Stagger）→ GSAP ScrollTrigger
   — 使用 ScrollTrigger + stagger 实现逐个弹出
   ============================================ */

function initSocialStagger() {
  const container = document.querySelector('.contact-socials.reveal-stagger');
  if (!container) return;

  const icons = container.querySelectorAll('.social-link');
  if (!icons.length) return;

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReduced) {
    gsap.set(icons, { opacity: 1, clearProps: 'transform' });
    return;
  }

  gsap.set(icons, { opacity: 0, scale: 0.8, y: 12 });

  gsap.to(icons, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.12,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
}

/* ============================================
   初始化（Initialization）
   — 等待 GSAP 加载完毕后启动
   ============================================ */

function bootstrap() {
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
}

if (typeof gsap !== 'undefined') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
      bootstrap();
    }
  });
}
