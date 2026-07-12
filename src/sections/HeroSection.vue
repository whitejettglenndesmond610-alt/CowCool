<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const roles = ['AI 应用开发者', 'Python', '知识库构建', 'RAG 实践']
const roleIndex = ref(0)
const videoRef = ref(null)
let roleTimer = null

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo('.name-reveal',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
  )
    .fromTo('.blur-in',
      { opacity: 0, filter: 'blur(10px)', y: 20 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 },
      '-=0.8',
    )

  roleTimer = setInterval(() => {
    roleIndex.value = (roleIndex.value + 1) % roles.length
  }, 2000)

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

onUnmounted(() => { if (roleTimer) clearInterval(roleTimer) })
</script>

<template>
  <section id="home" class="relative h-screen w-full overflow-hidden">
    <div class="hero-bg-text absolute inset-0 grid grid-cols-3 content-center justify-items-center gap-2 lg:gap-x-10 pointer-events-none z-0">
      <span v-for="n in 9" :key="n" class="text-[clamp(3rem,6vw,5rem)] font-black text-white/[0.02] tracking-[0.25em] whitespace-nowrap select-none leading-none font-body">SHAWN NIU</span>
    </div>

    <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
      <div class="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
        计算机科学与技术 · 郑州工商学院
      </div>

      <h1 class="name-reveal text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight text-text-primary mb-6">
        Shawn Niu
      </h1>

      <div class="blur-in text-sm md:text-lg lg:text-xl text-muted mb-4">
        一个<span :key="roleIndex" class="font-display italic text-text-primary animate-role-fade-in inline-block">&nbsp;{{ roles[roleIndex] }}&nbsp;</span>在郑州
      </div>

      <p class="blur-in text-sm md:text-base text-muted max-w-md mb-12">
        热衷 Python 开发与 AI 应用实践，专注本地化 RAG 知识库系统构建。动手实践驱动学习，从课程项目到独立作品，持续探索技术边界。
      </p>

      <div class="blur-in inline-flex gap-4">
        <a href="#projects" @click.prevent="document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})"
          class="relative rounded-full text-sm px-7 py-3.5 hover:scale-105 transition-transform group overflow-hidden inline-block">
          <span class="absolute inset-0 rounded-full accent-gradient" />
          <span class="relative z-10 text-bg font-medium text-white">查看项目</span>
        </a>
        <a href="#contact" @click.prevent="document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})"
          class="rounded-full border-2 border-stroke text-text-primary text-sm px-7 py-3.5 hover:scale-105 transition-transform relative group overflow-hidden inline-block">
          <span class="relative z-10">联系我</span>
          <span class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity accent-gradient" />
        </a>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 max-md:hidden">
      <span class="text-xs text-muted uppercase tracking-[0.2em]">滚动</span>
      <div class="w-px h-10 bg-stroke relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-text-primary animate-scroll-down" />
      </div>
    </div>
  </section>
</template>
