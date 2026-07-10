<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const typewriterText = ref('')
const phrases = ['用代码和 AI 构建酷东西', '前端学习者 · AI 探索者 · 创意制造者', '当学习遇见创造']
let phraseIndex = 0
let charIndex = 0
let isDeleting = false
let isWaiting = false
let timer = null

function type() {
  const phrase = phrases[phraseIndex]
  if (!isDeleting && !isWaiting) {
    typewriterText.value = phrase.slice(0, charIndex)
    charIndex++
    if (charIndex > phrase.length) {
      isWaiting = true
      timer = setTimeout(() => { isWaiting = false; isDeleting = true; type() }, 2000)
      return
    }
  } else if (isDeleting) {
    typewriterText.value = phrase.slice(0, charIndex)
    charIndex--
    if (charIndex <= 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length }
  }
  timer = setTimeout(type, (isDeleting ? 30 : 70) + Math.random() * 40)
}

onMounted(() => {
  const tl = gsap.timeline()

  tl.fromTo('.hero-bg-text', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power1.inOut' }, 0)
    .fromTo('.hero-rings-wrapper', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.inOut' }, 0.2)
    .fromTo('.hero-id-card', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, 0.3)
    .fromTo('.hero-greeting', { opacity: 0, y: 30, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }, 0.3)
    .fromTo('.hero-title', { opacity: 0, y: 30, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }, 0.6)
    .fromTo('.hero-subtitle', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 1.0)
    .fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 1.3)
    .fromTo('.hero-btns', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 1.6)

  type()

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const bgText = document.querySelector('.hero-bg-text')
  if (!bgText) return
  const setX = gsap.quickTo(bgText, 'x', { duration: 0.8, ease: 'power2.out' })
  const setY = gsap.quickTo(bgText, 'y', { duration: 0.8, ease: 'power2.out' })

  function onMove(e) {
    setX((e.clientX / window.innerWidth - 0.5) * -20)
    setY((e.clientY / window.innerHeight - 0.5) * -20)
  }
  document.addEventListener('mousemove', onMove)
  onUnmounted(() => document.removeEventListener('mousemove', onMove))
})

onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-[120px] pb-[60px]">
    <!-- Background text -->
    <div class="hero-bg-text absolute inset-0 grid grid-cols-3 content-center justify-items-center gap-2 lg:gap-x-10 pointer-events-none z-0 opacity-0">
      <span v-for="n in 9" :key="n" class="text-[clamp(3rem,6vw,5rem)] font-black text-white/[0.03] tracking-[0.25em] whitespace-nowrap select-none leading-none" style="font-family: Inter, sans-serif;">SHAWN NIU</span>
    </div>

    <!-- Energy rings -->
    <div class="hero-rings-wrapper absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 w-[600px] h-[600px] opacity-0 max-md:w-[340px] max-md:h-[340px]">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00c8e8] opacity-[0.08] animate-[spin_18s_linear_infinite] w-[380px] h-[200px] max-md:w-[260px] max-md:h-[140px]" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c3aed] opacity-[0.06] animate-[spin_22s_linear_infinite_reverse] w-[480px] h-[260px] max-md:w-[320px] max-md:h-[180px]" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00c8e8] opacity-[0.05] animate-[spin_26s_linear_infinite] w-[580px] h-[320px] max-md:w-[380px] max-md:h-[220px]" />
    </div>

    <!-- ID Card -->
    <div class="hero-id-card absolute top-[20%] right-[8%] z-[2] w-[240px] p-7 flex flex-col items-center gap-3 text-center glass-card opacity-0 max-md:static max-md:mx-auto max-md:mb-8 max-md:w-[220px]">
      <div class="w-14 h-14 rounded-full bg-[#0c0e14] border-2 border-[#00c8e8]/30 flex items-center justify-center text-[#00c8e8]" style="box-shadow: 0 0 20px rgba(0,200,232,0.15);">
        <svg viewBox="0 0 100 100" fill="none" class="w-3/5"><circle cx="50" cy="38" r="16" stroke="currentColor" stroke-width="2"/><path d="M20 85c0-16.569 13.431-30 30-30s30 13.431 30 30" stroke="currentColor" stroke-width="2"/></svg>
      </div>
      <span class="text-lg font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00c8e8] to-[#7c3aed] bg-[length:200%_auto] animate-shimmer" style="font-family: Inter, sans-serif;">SHAWN NIU</span>
      <span class="text-xs text-white/40 font-medium">学生开发者 & AI 探索者</span>
      <div class="flex gap-1.5">
        <span class="text-[10px] px-2.5 py-[3px] rounded-full border border-[#00c8e8]/15 text-[#00c8e8] font-mono" style="background: rgba(0,200,232,0.08);">前端</span>
        <span class="text-[10px] px-2.5 py-[3px] rounded-full border border-[#00c8e8]/15 text-[#00c8e8] font-mono" style="background: rgba(0,200,232,0.08);">AI</span>
        <span class="text-[10px] px-2.5 py-[3px] rounded-full border border-[#00c8e8]/15 text-[#00c8e8] font-mono" style="background: rgba(0,200,232,0.08);">设计</span>
      </div>
    </div>

    <!-- Content -->
    <div class="hero-content relative z-[1] text-center max-w-[800px]">
      <p class="hero-greeting text-sm font-medium text-white/40 tracking-[0.1em] uppercase mb-4">
        你好，我是
      </p>
      <h1 class="hero-title text-[clamp(3.5rem,8vw,8rem)] font-black leading-none tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00c8e8] to-[#7c3aed] bg-[length:200%_200%] animate-shimmer mb-5" style="font-family: Inter, sans-serif; filter: drop-shadow(0 0 30px rgba(108,92,231,0.3));">
        SHAWN NIU
      </h1>
      <p class="hero-subtitle text-[clamp(1rem,2vw,1.3rem)] text-[#00c8e8] mb-6 min-h-[1.6em] font-medium font-mono">
        <span>{{ typewriterText }}</span><span class="animate-[blink_0.8s_step-end_infinite] font-light">|</span>
      </p>
      <p class="hero-desc text-base text-white/70 max-w-[520px] mx-auto mb-10 leading-relaxed">
        一个对构建数字体验充满热情的学生开发者。我探索前端开发、AI 工具和创意设计的交汇点 — 在每天学习新东西的同时，构建能解决实际问题的项目。
      </p>
      <div class="hero-btns flex flex-wrap gap-4 justify-center">
        <a href="#projects" @click.prevent="document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})" class="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00c8e8] to-[#7c3aed] text-white font-semibold text-sm tracking-wider shadow-[0_4px_20px_rgba(108,92,231,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(108,92,231,0.5)] transition-all duration-200 active:scale-[0.97]">
          <span>查看项目</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="transition-transform duration-200 group-hover:translate-x-1"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <a href="#contact" @click.prevent="document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})" class="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold text-sm tracking-wider backdrop-blur-md bg-white/[0.03] hover:border-[#00c8e8] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,200,232,0.3)] transition-all duration-200 active:scale-[0.97]">
          <span>联系我</span>
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[1] opacity-60 max-md:hidden">
      <span class="text-[10px] uppercase tracking-[0.15em] text-white/40">滚动</span>
      <div class="w-px h-10 bg-gradient-to-b from-transparent via-[#00c8e8] to-transparent animate-[drawLine_2s_ease-in-out_infinite_alternate]" />
    </div>
  </section>
</template>
