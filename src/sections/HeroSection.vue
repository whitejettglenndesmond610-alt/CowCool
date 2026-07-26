<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ArrowRight, Mail } from '@lucide/vue'
import KnowledgeCore from '@/components/KnowledgeCore.vue'
import { profile } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const emit = defineEmits(['navigate'])
const rootRef = ref(null)
let ctx = null

const nodes = [
  { label: 'Python', position: 'left-[5%] top-[21%]', tone: 'sky' },
  { label: 'RAG', position: 'right-[7%] top-[18%]', tone: 'mint' },
  { label: 'LangChain', position: 'right-[1%] top-[52%]', tone: 'sky' },
  { label: 'FAISS', position: 'left-[3%] bottom-[23%]', tone: 'mint' },
  { label: 'Vue', position: 'right-[16%] bottom-[12%]', tone: 'sky' },
  { label: 'Engineering', position: 'left-[37%] top-[8%]', tone: 'mint' },
]

onMounted(() => {
  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.hero-enter, .knowledge-stage, .ability-node', { autoAlpha: 1 })
      gsap.set('.hero-link', { strokeDashoffset: 0 })
      return
    }
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.52 })
    timeline
      .fromTo('.hero-enter', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.085 })
      .fromTo('.knowledge-stage', { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, '-=0.65')
      .fromTo('.ability-node', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.06 }, '-=0.45')

    gsap.utils.toArray('.hero-link').forEach((path, index) => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      timeline.to(path, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.out' }, 1 + index * 0.045)
    })
    gsap.to('.ability-node i', { scale: 1.65, repeat: -1, yoyo: true, duration: 1.5, stagger: 0.18, ease: 'sine.inOut' })
    gsap.to('.hero-scan-dot', { rotation: 360, transformOrigin: '400px 300px', repeat: -1, duration: 9, ease: 'none' })
    gsap.to('.hero-shard', { y: -10, rotation: '+=3', repeat: -1, yoyo: true, duration: 3.6, stagger: 0.45, ease: 'sine.inOut' })
  }, rootRef.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="rootRef" id="home" class="studio-grid relative flex h-full items-center overflow-hidden bg-[#f5f8f7] px-5 pb-8 pt-24 md:px-8 md:pb-8 md:pt-24">
    <div class="hero-shard pointer-events-none absolute -left-12 top-[24%] h-28 w-52 rotate-[-12deg] bg-[#dcecff]/55" style="clip-path: polygon(8% 12%, 100% 0, 87% 84%, 16% 100%, 0 58%)" />
    <div class="hero-shard pointer-events-none absolute bottom-[10%] right-[5%] h-28 w-40 rotate-12 bg-[#c9f3e5]/60" style="clip-path: polygon(18% 0, 100% 24%, 72% 100%, 0 78%)" />
    <div class="mx-auto grid w-full max-w-[1380px] items-center gap-4 lg:grid-cols-[0.94fr_1.06fr] lg:gap-0">
      <div class="relative z-20 py-2 lg:py-8">
        <div class="hero-enter inline-block -rotate-1 studio-kicker">AI application builder · Zhengzhou</div>

        <h1 class="hero-enter relative mt-6 text-[clamp(3.5rem,8vw,8.6rem)] font-extrabold leading-[0.76] tracking-[-0.075em] text-[#15201d]">
          <span class="relative inline-block -rotate-2">Shawn</span><br><span class="relative ml-[8%] inline-block rotate-1">Niu<span class="text-[#59d6b3]">.</span></span>
        </h1>

        <p class="hero-enter relative mt-6 max-w-xl rotate-[0.4deg] text-xl font-semibold leading-tight tracking-[-0.035em] text-[#15201d] md:text-3xl lg:-mr-10">
          {{ profile.statement }}
        </p>
        <p class="hero-enter mt-4 max-w-lg text-xs leading-6 text-muted md:text-sm md:leading-7">
          计算机科学与技术在读，关注本地知识库、RAG 和可交互 AI 产品。通过持续构建，把学习中的技术变成真实、可运行的作品。
        </p>

        <div class="hero-enter mt-7 flex flex-wrap gap-3">
          <button v-magnetic="{ strength: 0.14, radius: 110 }" class="studio-button-primary" @click="emit('navigate', 'projects')">
            查看项目 <ArrowRight class="size-4" />
          </button>
          <button v-magnetic="{ strength: 0.14, radius: 110 }" class="studio-button-secondary" @click="emit('navigate', 'contact')">
            联系我 <Mail class="size-4" />
          </button>
        </div>

        <div class="hero-enter relative mt-8 flex max-w-lg items-center justify-between pt-5">
          <svg class="pointer-events-none absolute inset-x-0 top-0 h-4 w-full" viewBox="0 0 500 16" preserveAspectRatio="none" fill="none"><path d="M0 10 C105 1 204 17 310 7 S420 3 500 11" stroke="#cbdad5" /></svg>
          <span class="metadata text-muted">Computer Science · {{ profile.school }}</span>
          <span class="metadata flex items-center gap-2 text-[#267f68]"><i class="h-1.5 w-1.5 rounded-full bg-[#59d6b3]" /> Building now</span>
        </div>
      </div>

      <div class="knowledge-stage relative hidden h-[min(68vh,700px)] min-h-[500px] md:block lg:-ml-14 lg:w-[calc(100%+3.5rem)]">
        <div class="absolute inset-[7%] rotate-3 bg-[#dff7ef]/45" style="clip-path: polygon(19% 0, 78% 4%, 100% 31%, 91% 83%, 61% 100%, 11% 91%, 0 45%)" />
        <div class="absolute inset-0 studio-grid opacity-45" style="mask-image:radial-gradient(ellipse at center,#000 35%,transparent 74%)" />
        <div class="absolute left-6 top-6 z-10">
          <p class="metadata text-muted">Interactive knowledge core</p>
          <p class="mt-1 text-xs font-semibold text-[#15201d]">能力节点 / 实时连接</p>
        </div>
        <div class="absolute right-6 top-6 z-10 text-right">
          <p class="metadata text-[#5da9ff]">SYSTEM 01</p>
          <p class="mt-1 font-mono text-[9px] text-muted">POINTER REACTIVE</p>
        </div>
        <span class="hero-shard absolute left-[13%] top-[12%] z-10 -rotate-6 bg-[#fff2c9] px-3 py-1 font-mono text-[8px] text-[#8a6316]">LEARN → CONNECT</span>

        <svg class="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <g stroke="rgba(64,139,116,.28)" stroke-width="1.1" stroke-dasharray="4 7">
            <path class="hero-link" d="M400 300 C300 230 190 140 90 120" />
            <path class="hero-link" d="M400 300 C520 210 650 150 735 120" />
            <path class="hero-link" d="M400 300 C545 300 670 320 780 330" />
            <path class="hero-link" d="M400 300 C265 350 175 430 70 465" />
            <path class="hero-link" d="M400 300 C510 390 610 475 690 520" />
            <path class="hero-link" d="M400 300 C395 205 380 125 350 76" />
          </g>
          <circle class="hero-scan-dot" cx="400" cy="82" r="4" fill="#5da9ff" />
          <circle class="hero-scan-dot" cx="615" cy="300" r="3" fill="#59d6b3" opacity=".75" />
        </svg>

        <KnowledgeCore />

        <span
          v-for="node in nodes"
          :key="node.label"
          class="ability-node absolute z-10 flex items-center font-mono text-[9px] font-semibold"
          :class="[node.position, node.tone === 'mint' ? 'text-[#267f68]' : 'text-[#3975b9]']">
          <i class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full" :class="node.tone === 'mint' ? 'bg-[#59d6b3]' : 'bg-[#5da9ff]'" />{{ node.label }}
        </span>

        <div class="absolute bottom-5 left-6 right-6 flex items-center justify-between border-t border-stroke/80 pt-3">
          <span class="metadata text-muted">Move pointer to inspect</span>
          <span class="metadata text-muted">06 connected nodes</span>
        </div>
      </div>

      <div class="knowledge-stage relative mx-auto h-[190px] w-full max-w-md md:hidden">
        <div class="absolute inset-0 studio-grid opacity-40" style="mask-image:radial-gradient(ellipse at center,#000 35%,transparent 75%)" />
        <KnowledgeCore />
        <span class="absolute bottom-4 left-4 metadata text-muted">Knowledge core / touch view</span>
      </div>
    </div>
  </section>
</template>
