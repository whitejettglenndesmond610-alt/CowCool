<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ArrowUpRight, Copy, FileLock2 } from '@lucide/vue'
import { profile } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

gsap.registerPlugin(MotionPathPlugin)

const rootRef = ref(null)
const planeRef = ref(null)
const emailBtnRef = ref(null)
const showToast = inject('showToast')
const motionEnabled = !reducedMotion()
const emailChars = profile.email.split('')
let ctx = null
let flying = false
let onResizeRipple = null

// ===== 邮箱逐字涟漪 =====
function initRipple() {
  const btn = emailBtnRef.value
  if (!btn || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const chars = Array.from(btn.querySelectorAll('.email-char'))
  if (!chars.length) return

  const yTos = chars.map(el => gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power2.out' }))
  let centers = []
  const measure = () => {
    centers = chars.map(el => {
      const r = el.getBoundingClientRect()
      return r.left + r.width / 2
    })
  }
  measure()
  onResizeRipple = measure
  window.addEventListener('resize', measure)

  btn.addEventListener('pointermove', (e) => {
    centers.forEach((cx, i) => {
      const d = Math.abs(e.clientX - cx)
      const t = Math.max(0, 1 - d / 90)
      yTos[i](-t * 8)
      chars[i].style.color = t > 0.45 ? '#267f68' : ''
    })
  })
  btn.addEventListener('pointerleave', () => {
    yTos.forEach(fn => fn(0))
    chars.forEach(el => { el.style.color = '' })
  })
}

// ===== 图标果冻 =====
function initJelly() {
  const blobs = Array.from(rootRef.value.querySelectorAll('.jelly-blob'))
  blobs.forEach((blob, i) => {
    // idle 呼吸浮动
    gsap.to(blob, {
      y: i % 2 ? 4 : -4,
      rotation: i % 2 ? 2 : -2,
      duration: 2.2 + i * 0.4,
      repeat: -1, yoyo: true, ease: 'sine.inOut',
    })
    // 悬停果冻挤压
    blob.addEventListener('mouseenter', () => {
      gsap.fromTo(blob,
        { scaleX: 1.15, scaleY: 0.85 },
        { scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' },
      )
    })
    blob.addEventListener('mouseleave', () => {
      gsap.fromTo(blob,
        { scaleX: 0.92, scaleY: 1.08 },
        { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' },
      )
    })
  })
}

// ===== 邮箱行 + 图标入场编排 =====
function playEmailIntro() {
  const btn = emailBtnRef.value
  if (!btn) return
  const label = btn.querySelector('.email-label')
  const chars = btn.querySelectorAll('.email-char')
  const caret = btn.querySelector('.email-caret')
  const underline = btn.querySelector('.email-underline')
  const copy = btn.querySelector('.email-copy')
  const blobs = rootRef.value.querySelectorAll('.jelly-blob')

  const tl = gsap.timeline()
  if (label) tl.to(label, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0)
  if (caret) tl.call(() => caret.classList.add('caret-on'), [], 0.05)
  tl.to(chars, { autoAlpha: 1, duration: 0.01, stagger: 0.03, ease: 'none' }, 0.1)
  if (underline) tl.to(underline, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.15 + chars.length * 0.03)
  if (caret) tl.call(() => caret.classList.remove('caret-on'), [], 0.4 + chars.length * 0.03)
  if (copy) tl.to(copy, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.15')
  if (blobs.length) {
    tl.to(blobs, { autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.16, ease: 'back.out(1.8)' }, '-=0.1')
  }
}

// ===== 纸飞机送信 =====
function flyPlane(fromEl, short = false) {
  if (flying || reducedMotion() || !planeRef.value || !fromEl) return
  const plane = planeRef.value
  const sRect = rootRef.value.getBoundingClientRect()
  const rect = fromEl.getBoundingClientRect()
  const startX = rect.left + rect.width / 2 - sRect.left
  const startY = rect.top + rect.height / 2 - sRect.top
  const W = sRect.width
  const H = sRect.height

  flying = true
  const path = short
    ? [
        { x: startX, y: startY },
        { x: startX + W * 0.18, y: startY - H * 0.22 },
        { x: W * 1.08, y: startY - H * 0.35 },
      ]
    : [
        { x: startX, y: startY },
        { x: startX + W * 0.18, y: startY - H * 0.3 },
        { x: W * 0.52, y: startY - H * 0.45 },
        { x: W * 0.78, y: startY - H * 0.18 },
        { x: W * 1.08, y: startY - H * 0.55 },
      ]

  gsap.set(plane, { x: startX, y: startY, xPercent: -50, yPercent: -50, autoAlpha: 1 })
  gsap.to(plane, {
    duration: short ? 1.2 : 2.1,
    ease: 'power1.inOut',
    motionPath: { path, autoRotate: 60 },
    onComplete() {
      gsap.to(plane, { autoAlpha: 0, duration: 0.25, onComplete: () => { flying = false } })
    },
  })
}

// ===== 标题:两半相遇 + 连接弧 =====
function drawConnectArc(h2, left, right) {
  const h2Rect = h2.getBoundingClientRect()
  const l = left.getBoundingClientRect()
  const r = right.getBoundingClientRect()
  const x1 = l.right - h2Rect.left - 8
  const y1 = l.bottom - h2Rect.top - 6
  const x2 = r.left - h2Rect.left + 14
  const y2 = r.bottom - h2Rect.top - 2
  const cx = (x1 + x2) / 2
  const cy = Math.max(y1, y2) + 26

  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.style.cssText = `position:absolute;left:0;top:0;width:${h2Rect.width}px;height:${h2Rect.height + 60}px;pointer-events:none;overflow:visible;`
  const path = document.createElementNS(ns, 'path')
  path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`)
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', '#267f68')
  path.setAttribute('stroke-width', '2')
  path.setAttribute('stroke-linecap', 'round')
  svg.appendChild(path)
  for (const [px, py] of [[x1, y1], [x2, y2]]) {
    const c = document.createElementNS(ns, 'circle')
    c.setAttribute('cx', px)
    c.setAttribute('cy', py)
    c.setAttribute('r', '3.2')
    c.setAttribute('fill', '#59d6b3')
    svg.appendChild(c)
  }
  h2.appendChild(svg)

  const len = path.getTotalLength()
  path.style.strokeDasharray = String(len)
  path.style.strokeDashoffset = String(len)
  gsap.to(path, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' })
  // 连接建立后缓慢呼吸
  gsap.to(svg, { opacity: 0.55, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 })
}

function playMeet() {
  const h2 = rootRef.value?.querySelector('h2')
  const left = h2?.querySelector('.meet-left')
  const right = h2?.querySelector('.meet-right')
  if (!left || !right) return

  const tl = gsap.timeline()
  tl.fromTo(left, { x: -70, autoAlpha: 0, rotate: -6 }, { x: 0, autoAlpha: 1, rotate: -2, duration: 0.85, ease: 'power3.out' }, 0)
    .fromTo(right, { x: 70, autoAlpha: 0, rotate: 5 }, { x: 0, autoAlpha: 1, rotate: 1, duration: 0.85, ease: 'power3.out' }, 0)
    // 相遇一顿:轻挤压回弹
    .to([left, right], { scale: 0.985, duration: 0.1, ease: 'power1.in' }, 0.85)
    .to([left, right], { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, 0.95)
    .add(() => drawConnectArc(h2, left, right), 1.0)
}

function copyEmail() {
  navigator.clipboard.writeText(profile.email)
    .then(() => {
      showToast('邮箱地址已复制')
      flyPlane(emailBtnRef.value)
      if (!reducedMotion()) {
        gsap.fromTo('.copy-signal', { x: 0, autoAlpha: 1, scale: 0.7 }, { x: 220, autoAlpha: 0, scale: 1.2, duration: 0.8, ease: 'power2.out' })
      }
    })
    .catch(() => { window.location.href = `mailto:${profile.email}` })
}

onMounted(() => {
  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.contact-enter', { autoAlpha: 1 })
      gsap.set('.contact-path', { strokeDashoffset: 0 })
      return
    }
    gsap.fromTo('.contact-enter', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.68, stagger: 0.09, ease: 'power3.out', delay: 0.2 })
    gsap.utils.toArray('.contact-path').forEach((path, index) => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, { strokeDashoffset: 0, duration: 0.9, delay: 0.45 + index * 0.12, ease: 'power2.out' })
    })
    // 标题:两半相遇
    gsap.delayedCall(0.3, playMeet)
    // 邮箱行 + 图标:初始隐藏,1.2s 起编排入场
    gsap.set('.email-label', { autoAlpha: 0, y: 8 })
    gsap.set('.email-char', { autoAlpha: 0 })
    gsap.set('.email-copy', { autoAlpha: 0, scale: 0.5 })
    gsap.set('.email-underline', { scaleX: 0, transformOrigin: 'left' })
    gsap.set('.jelly-blob', { autoAlpha: 0, scale: 0 })
    gsap.delayedCall(1.2, playEmailIntro)
    // 邮箱涟漪 + 图标果冻
    if (!reducedMotion()) {
      initRipple()
      initJelly()
    }
  }, rootRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (onResizeRipple) window.removeEventListener('resize', onResizeRipple)
})
</script>

<template>
  <section ref="rootRef" id="contact" class="relative flex h-full items-center overflow-hidden bg-[#c9f3e5] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
    <!-- 纸飞机(预置隐藏) -->
    <svg ref="planeRef" class="pointer-events-none absolute left-0 top-0 z-30 opacity-0" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M4 19 L32 5 L21 31 L17 21 Z" fill="#ffffff" stroke="#15201d" stroke-width="1.6" stroke-linejoin="round" />
      <path d="M17 21 L32 5" stroke="#15201d" stroke-width="1.2" />
      <path d="M21 31 L25 23" stroke="#59d6b3" stroke-width="1.5" />
    </svg>
    <div class="absolute -right-[12vw] -top-[18vw] h-[54vw] w-[54vw] rounded-full border-[8vw] border-white/30" />
    <div class="absolute -bottom-32 left-[12%] h-72 w-72 rounded-full bg-[#5da9ff]/15 blur-2xl" />
    <span class="absolute -bottom-8 right-0 text-[19vw] font-extrabold leading-none tracking-[-0.1em] text-[#267f68]/[0.055]">HELLO</span>
    <svg class="pointer-events-none absolute inset-0 h-full w-full opacity-55" viewBox="0 0 1200 800" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path id="contact-network-main" class="contact-path" d="M80 610 C250 520 350 700 530 590 S820 430 1110 520" stroke="#4aa98d" stroke-width="1.2" />
      <path class="contact-path" d="M530 590 C560 430 650 330 760 220" stroke="#5da9ff" stroke-width="1" />
      <path class="contact-path" d="M820 500 C930 370 1030 300 1170 250" stroke="#4aa98d" stroke-width="1" />
      <path class="contact-path" d="M210 565 C185 430 215 330 330 245" stroke="#5da9ff" stroke-width="1" />
      <circle v-if="motionEnabled" r="4" fill="#15201d"><animateMotion dur="8s" repeatCount="indefinite"><mpath href="#contact-network-main" /></animateMotion></circle>
      <g fill="#59d6b3"><circle cx="80" cy="610" r="4"/><circle cx="530" cy="590" r="4"/><circle cx="820" cy="500" r="4"/><circle cx="1110" cy="520" r="4"/></g>
      <path d="M760 220c26-13 45-6 45-6s-5 24-32 29c-18 3-28-8-13-23zM330 245c-23-10-40-1-40-1s8 22 34 23c17 1 24-11 6-22z" fill="#fff" fill-opacity=".16" stroke="#4aa98d" />
    </svg>

    <div class="relative z-10 mx-auto w-full max-w-[1280px]">
      <div class="contact-enter flex items-center justify-between">
        <span class="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.14em] text-[#267f68]">
          <svg class="h-6 w-12" viewBox="0 0 48 24" fill="none" aria-hidden="true">
            <path d="M2 15C12 5 22 20 32 9S42 7 46 10" stroke="#267f68" stroke-width="1.2" />
            <circle cx="2" cy="15" r="2.5" fill="#15201d" />
            <circle cx="32" cy="9" r="2.5" fill="#5da9ff" />
            <circle cx="46" cy="10" r="2.5" fill="#59d6b3" />
          </svg>
          Signal open
        </span>
        <span class="rotate-2 metadata text-[#267f68]">Zhengzhou · China</span>
      </div>

      <div class="contact-enter mt-8 md:mt-12">
        <span class="metadata text-[#267f68]">Contact / 建立连接</span>
        <h2 class="relative mt-4 max-w-6xl text-[clamp(3rem,8vw,8rem)] font-extrabold leading-[0.86] tracking-[-0.075em] text-[#15201d]">
          <span class="meet-left inline-block -rotate-2 will-change-transform">有想法，</span><br><span class="meet-right ml-[7%] inline-block rotate-1 will-change-transform">一起<span class="relative text-white">做出来。</span></span>
        </h2>
      </div>

      <div class="mt-8 grid items-end gap-6 md:mt-12 md:grid-cols-[1fr_auto]">
        <button ref="emailBtnRef" class="email-button group w-fit max-w-full origin-left text-left md:rotate-[0.7deg]" aria-label="复制邮箱地址" @click="copyEmail">
          <span class="email-label metadata text-[#267f68]">Email · 点击复制</span>
          <span class="relative mt-2 flex items-center gap-2 pb-2 text-[clamp(.95rem,2.5vw,2.25rem)] font-extrabold tracking-[-0.04em] text-[#15201d] transition-colors group-hover:border-[#267f68] sm:gap-3">
            <span class="email-address inline-block"><span v-for="(ch, i) in emailChars" :key="i" class="email-char inline-block will-change-transform">{{ ch }}</span></span><span class="email-caret inline-block text-[#267f68]" aria-hidden="true">▍</span>
            <span class="email-copy relative shrink-0">
              <Copy class="email-copy-icon size-4 md:size-5" />
              <span class="copy-hint pointer-events-none absolute -right-1 -top-6 font-mono text-[7px] tracking-[0.12em] text-[#267f68]">COPY</span>
            </span>
            <i class="email-underline pointer-events-none absolute bottom-[-2px] left-0 h-[2px] w-full bg-[#15201d]" />
            <i class="email-hover-line pointer-events-none absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-[#267f68] via-[#59d6b3] to-[#5da9ff]" />
            <i class="email-hover-dot pointer-events-none absolute bottom-[-5px] left-0 h-2 w-2 rounded-full bg-[#15201d]" />
            <i class="copy-signal pointer-events-none absolute bottom-[-5px] left-0 h-2 w-2 rounded-full bg-[#5da9ff] opacity-0" />
          </span>
        </button>

        <div class="flex flex-wrap items-center gap-3 md:-translate-y-2">
          <a :href="profile.github" target="_blank" rel="noopener noreferrer" class="jelly-blob group flex h-20 w-20 flex-col items-center justify-center rounded-[46%_54%_42%_58%] bg-[#15201d] text-white shadow-[0_14px_35px_rgba(21,32,29,.14)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(21,32,29,.2)] md:h-28 md:w-28" @click="flyPlane($event.currentTarget, true)">
            <ArrowUpRight class="size-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" /><span class="mt-2 font-mono text-[9px] font-semibold tracking-[0.08em]">GITHUB</span>
          </a>
          <div class="jelly-blob flex h-20 w-20 flex-col items-center justify-center rounded-[58%_42%_60%_40%] border-2 border-[#267f68]/35 bg-white/75 text-[#267f68] shadow-[0_12px_30px_rgba(38,127,104,.08)] md:h-28 md:w-28">
            <FileLock2 class="size-6" /><span class="mt-2 text-center font-mono text-[8px] font-semibold leading-4">PDF<br>待提供</span>
          </div>
        </div>
      </div>

      <div class="contact-enter relative mt-8 flex items-center justify-between pt-5 text-[9px] text-[#267f68] md:mt-10 md:text-xs">
        <svg class="pointer-events-none absolute inset-x-0 top-0 h-5 w-full" viewBox="0 0 1200 20" preserveAspectRatio="none" fill="none"><path d="M0 14 C285 0 465 22 684 9 S1002 5 1200 15" stroke="rgba(38,127,104,.3)" /></svg>
        <span>© 2026 Shawn Niu</span>
        <span class="flex items-center gap-2"><i class="h-2 w-2 rounded-full bg-[#15201d]" />Open to ideas</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.email-address,
.email-copy-icon,
.copy-hint,
.email-hover-line,
.email-hover-dot {
  transition: transform .32s cubic-bezier(.22, 1, .36, 1), opacity .25s ease;
}

.copy-hint,
.email-hover-dot { opacity: 0; }
.email-hover-line { transform: scaleX(0); }

/* 打字光标 */
.email-caret {
  opacity: 0;
}

.email-caret.caret-on {
  opacity: 1;
  animation: caret-blink 0.65s steps(2) infinite;
}

@keyframes caret-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.email-button:hover .email-address { transform: translateY(-3px); }
.email-button:hover .email-copy-icon { transform: translate(2px, -2px) rotate(-8deg) scale(1.12); color: #267f68; }
.email-button:hover .copy-hint { transform: translateY(-2px); opacity: 1; }
.email-button:hover .email-hover-line { transform: scaleX(1); }
.email-button:hover .email-hover-dot {
  opacity: 1;
  animation: email-scan 1.15s cubic-bezier(.22, 1, .36, 1) infinite;
}

@keyframes email-scan {
  0% { left: 0; transform: scale(.7); }
  70%, 100% { left: calc(100% - 8px); transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .email-button:hover .email-hover-dot { animation: none; left: calc(100% - 8px); }
}
</style>
