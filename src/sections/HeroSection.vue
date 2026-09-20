<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { annotate } from 'rough-notation'
import { ArrowRight, Mail } from '@lucide/vue'
import HeroFluid from '@/components/HeroFluid.vue'
import KnowledgeCore from '@/components/KnowledgeCore.vue'
import { profile } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const emit = defineEmits(['navigate'])
const rootRef = ref(null)
const statementMark = ref(null)
const buildingMark = ref(null)
const activeIndex = ref(-1)
let ctx = null
const annotations = []

const firstName = ['S', 'h', 'a', 'w', 'n']
const lastName = ['N', 'i', 'u']

const nodes = [
  { label: 'Python', position: 'left-[5%] top-[21%]', tone: 'sky', note: '用于数据处理、网页交互、算法练习与课程项目。' },
  { label: 'RAG', position: 'right-[7%] top-[18%]', tone: 'mint', note: '已实践本地 RAG、多格式文档导入、模型切换与多轮对话。' },
  { label: 'LangChain', position: 'right-[1%] top-[52%]', tone: 'sky', note: '关注知识检索、本地模型与可交互 AI 产品。' },
  { label: 'FAISS', position: 'left-[3%] bottom-[23%]', tone: 'mint', note: '用于本地知识检索。' },
  { label: 'Vue', position: 'right-[16%] bottom-[12%]', tone: 'sky', note: '这个站点用 Vue 3 搭建。' },
  { label: 'Engineering', position: 'left-[37%] top-[8%]', tone: 'mint', note: '用于版本管理、环境配置、数据管理和线上发布。' },
]

function selectNode(index) {
  activeIndex.value = activeIndex.value === index ? -1 : index
}

onMounted(() => {
  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.hero-enter, .hero-letter, .knowledge-stage, .ability-node', { autoAlpha: 1 })
      gsap.set('.hero-link', { strokeDashoffset: 0 })
      return
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.52 })
    timeline
      .fromTo('.hero-enter', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.085 })
      .fromTo('.hero-letter', { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.045 }, '-=0.55')
      .fromTo('.knowledge-stage', { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, '-=0.65')
      .fromTo('.ability-node', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.06, clearProps: 'opacity,visibility' }, '-=0.45')

    gsap.utils.toArray('.hero-link').forEach((path, index) => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      timeline.to(path, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.out' }, 1 + index * 0.045)
    })
    gsap.to('.ability-node i', { scale: 1.65, repeat: -1, yoyo: true, duration: 1.5, stagger: 0.18, ease: 'sine.inOut' })
    gsap.to('.hero-scan-dot', { rotation: 360, transformOrigin: '400px 300px', repeat: -1, duration: 9, ease: 'none' })
    gsap.to('.hero-shard', { y: -10, rotation: '+=3', repeat: -1, yoyo: true, duration: 3.6, stagger: 0.45, ease: 'sine.inOut' })

    if (statementMark.value) {
      annotations.push(annotate(statementMark.value, {
        type: 'underline',
        color: '#59d6b3',
        strokeWidth: 2.2,
        padding: 3,
        animationDuration: 820,
      }))
    }
    if (buildingMark.value) {
      annotations.push(annotate(buildingMark.value, {
        type: 'circle',
        color: '#e8c15a',
        strokeWidth: 1.6,
        padding: 10,
        animationDuration: 740,
      }))
    }

    gsap.delayedCall(1.55, () => {
      annotations.forEach((mark) => mark.show())
    })
  }, rootRef.value)
})

onUnmounted(() => {
  annotations.splice(0).forEach((mark) => mark.remove())
  ctx?.revert()
})
</script>

<template>
  <section ref="rootRef" id="home" class="studio-grid relative flex h-full items-center overflow-hidden bg-[#f5f8f7] px-5 pb-8 pt-24 md:px-8 md:pb-8 md:pt-24">
    <HeroFluid />
    <div class="hero-shard pointer-events-none absolute -left-12 top-[24%] h-28 w-52 rotate-[-12deg] bg-[#dcecff]/55" style="clip-path: polygon(8% 12%, 100% 0, 87% 84%, 16% 100%, 0 58%)" />
    <div class="hero-shard pointer-events-none absolute bottom-[10%] right-[5%] h-28 w-40 rotate-12 bg-[#c9f3e5]/60" style="clip-path: polygon(18% 0, 100% 24%, 72% 100%, 0 78%)" />

    <div class="relative mx-auto flex h-full w-full max-w-[1380px] flex-col justify-center md:block">
      <div class="knowledge-stage absolute right-[-4%] top-1/2 hidden h-[min(72vh,740px)] w-[min(62%,860px)] -translate-y-1/2 md:block lg:right-[-2%]">
        <div class="absolute inset-[7%] rotate-3 bg-[#dff7ef]/45" style="clip-path: polygon(19% 0, 78% 4%, 100% 31%, 91% 83%, 61% 100%, 11% 91%, 0 45%)" />
        <div class="absolute inset-0 studio-grid opacity-45" style="mask-image:radial-gradient(ellipse at center,#000 35%,transparent 74%)" />

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

        <KnowledgeCore :active-index="activeIndex" />

        <button
          v-for="(node, index) in nodes"
          :key="node.label"
          type="button"
          class="ability-node absolute z-10 flex cursor-pointer items-center border-0 bg-transparent p-0 font-mono text-[9px] font-semibold transition-opacity duration-300"
          :class="[
            node.position,
            node.tone === 'mint' ? 'text-[#267f68]' : 'text-[#3975b9]',
            activeIndex < 0 || activeIndex === index ? 'opacity-100' : 'opacity-35',
          ]"
          @click="selectNode(index)">
          <i class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full" :class="node.tone === 'mint' ? 'bg-[#59d6b3]' : 'bg-[#5da9ff]'" />{{ node.label }}
        </button>

        <p v-if="activeIndex >= 0" class="pointer-events-none absolute bottom-5 left-6 right-6 z-10 font-mono text-[10px] leading-5 text-[#15201d]">
          {{ nodes[activeIndex].label }} · {{ nodes[activeIndex].note }}
        </p>
      </div>

      <div class="relative z-20 max-w-xl py-2 md:flex md:h-full md:max-w-[38rem] md:flex-col md:justify-center">
        <div class="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 bg-[#f5f8f7]/80 blur-2xl md:-inset-x-12" />
        <div class="hero-enter inline-block -rotate-1 studio-kicker">AI application builder · Zhengzhou</div>

        <h1 class="relative mt-5 text-[clamp(3.5rem,8vw,8.6rem)] font-extrabold leading-[0.76] tracking-[-0.075em] text-[#15201d]">
          <span class="relative inline-block -rotate-2">
            <span v-for="(letter, index) in firstName" :key="`s${index}`" class="hero-letter inline-block">{{ letter }}</span>
          </span>
          <br>
          <span class="relative ml-[8%] inline-block rotate-1">
            <span v-for="(letter, index) in lastName" :key="`n${index}`" class="hero-letter inline-block">{{ letter }}</span>
            <span class="hero-letter inline-block text-[#59d6b3]">.</span>
          </span>
        </h1>

        <div class="hero-enter mt-6 flex flex-wrap gap-3">
          <button v-magnetic="{ strength: 0.14, radius: 110 }" class="studio-button-primary" @click="emit('navigate', 'projects')">
            查看项目 <ArrowRight class="size-4" />
          </button>
          <button v-magnetic="{ strength: 0.14, radius: 110 }" class="studio-button-secondary" @click="emit('navigate', 'contact')">
            联系我 <Mail class="size-4" />
          </button>
        </div>

        <p class="hero-enter relative mt-7 max-w-xl rotate-[0.4deg] text-xl font-semibold leading-tight tracking-[-0.035em] text-[#15201d] md:text-3xl">
          把想法做成<span ref="statementMark">可运行的 AI 应用</span>
        </p>
        <p class="hero-enter mt-3 max-w-md text-[11px] leading-5 text-muted md:text-xs md:leading-6">
          计算机科学与技术在读，关注本地知识库、RAG 和可交互 AI 产品。
        </p>

        <div class="hero-enter relative mt-6 flex max-w-md items-center justify-between pt-4">
          <svg class="pointer-events-none absolute inset-x-0 top-0 h-4 w-full" viewBox="0 0 500 16" preserveAspectRatio="none" fill="none"><path d="M0 10 C105 1 204 17 310 7 S420 3 500 11" stroke="#cbdad5" /></svg>
          <span class="metadata text-muted">Computer Science · {{ profile.school }}</span>
          <span ref="buildingMark" class="metadata inline-flex items-center gap-2 text-[#267f68]"><i class="h-1.5 w-1.5 rounded-full bg-[#59d6b3]" /> Building now</span>
        </div>
      </div>

      <div class="relative mx-auto mt-2 w-full max-w-md md:hidden">
        <div class="knowledge-stage relative h-[190px] w-full">
          <div class="absolute inset-0 studio-grid opacity-40" style="mask-image:radial-gradient(ellipse at center,#000 35%,transparent 75%)" />
          <KnowledgeCore :active-index="activeIndex" />
        </div>
        <div class="mt-3 flex flex-wrap gap-x-3 gap-y-2">
          <button
            v-for="(node, index) in nodes"
            :key="`m-${node.label}`"
            type="button"
            class="ability-node cursor-pointer border-0 bg-transparent p-0 font-mono text-[9px] font-semibold"
            :class="[
              node.tone === 'mint' ? 'text-[#267f68]' : 'text-[#3975b9]',
              activeIndex < 0 || activeIndex === index ? 'opacity-100' : 'opacity-35',
            ]"
            @click="selectNode(index)">
            <i class="mr-1 inline-block h-1.5 w-1.5 rounded-full" :class="node.tone === 'mint' ? 'bg-[#59d6b3]' : 'bg-[#5da9ff]'" />{{ node.label }}
          </button>
        </div>
        <p v-if="activeIndex >= 0" class="mt-2 font-mono text-[10px] leading-5 text-[#15201d]">
          {{ nodes[activeIndex].label }} · {{ nodes[activeIndex].note }}
        </p>
      </div>
    </div>
  </section>
</template>
