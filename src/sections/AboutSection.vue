<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { BookOpen, Calendar, GraduationCap, User } from '@lucide/vue'
import { profile } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const rootRef = ref(null)
let ctx = null

const principles = [
  { number: '01', title: '先理解', text: '不仅让代码运行，也理解技术为什么这样工作。', color: '#5da9ff', offset: 'md:-translate-y-1 md:-rotate-1' },
  { number: '02', title: '再构建', text: '把课程知识和新工具放进真实项目中验证。', color: '#59d6b3', offset: 'md:translate-y-3 md:rotate-1' },
  { number: '03', title: '持续迭代', text: '认真完成，也保持开放并主动修正方向。', color: '#ffc964', offset: 'md:-translate-y-2 md:-rotate-1' },
]

const identityItems = [
  { label: 'Name', value: profile.name, icon: User, color: '#5da9ff', offset: 'lg:-translate-x-2 lg:-rotate-2' },
  { label: 'School', value: profile.school, icon: GraduationCap, color: '#59d6b3', offset: 'lg:translate-x-5 lg:translate-y-5 lg:rotate-2' },
  { label: 'Major', value: profile.major, icon: BookOpen, color: '#ffc964', offset: 'lg:translate-x-8 lg:-translate-y-1 lg:rotate-1' },
  { label: 'Period', value: profile.educationPeriod, icon: Calendar, color: '#5da9ff', offset: 'lg:-translate-x-1 lg:translate-y-5 lg:-rotate-2' },
]

onMounted(() => {
  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.about-enter', { autoAlpha: 1 })
      gsap.set('.growth-path', { strokeDashoffset: 0 })
      return
    }
    gsap.fromTo('.about-enter', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.075, ease: 'power3.out', delay: 0.2 })
    gsap.utils.toArray('.growth-path').forEach((path, index) => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, { strokeDashoffset: 0, duration: 0.8, delay: 0.45 + index * 0.1, ease: 'power2.out' })
    })
    gsap.fromTo('.growth-node', { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.4, stagger: 0.1, delay: 0.8, ease: 'back.out(1.8)' })
    gsap.to('.growth-node', { scale: 1.25, repeat: -1, yoyo: true, duration: 1.8, stagger: 0.25, ease: 'sine.inOut' })
  }, rootRef.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="rootRef" id="about" class="relative flex h-full items-center overflow-hidden bg-white px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
    <div class="absolute right-0 top-0 h-full w-[7px] bg-gradient-to-b from-[#5da9ff] via-[#59d6b3] to-[#ffc964]" />
    <div class="absolute right-[8%] top-[17%] h-24 w-24 border-r border-t border-[#5da9ff]/20" />
    <div class="absolute bottom-[13%] left-[4%] h-16 w-16 border-b border-l border-[#59d6b3]/25" />
    <svg class="pointer-events-none absolute left-[53.5%] top-[31%] hidden h-[38%] w-24 -translate-x-1/2 lg:block" viewBox="0 0 96 360" fill="none" aria-hidden="true">
      <path class="growth-path" d="M48 350 C48 280 42 230 48 170 C54 112 48 68 48 12" stroke="#89cdb8" stroke-width="1.5" />
      <path class="growth-path" d="M48 255 C29 235 18 222 8 196" stroke="#5da9ff" stroke-width="1.2" />
      <path class="growth-path" d="M48 205 C66 184 77 170 88 145" stroke="#59d6b3" stroke-width="1.2" />
      <path class="growth-path" d="M48 135 C32 117 25 101 20 82" stroke="#ffc964" stroke-width="1.2" />
      <circle class="growth-node" cx="48" cy="255" r="4" fill="#59d6b3" />
      <circle class="growth-node" cx="48" cy="205" r="4" fill="#5da9ff" />
      <circle class="growth-node" cx="48" cy="135" r="4" fill="#ffc964" />
      <path d="M8 196c14-4 20 2 20 2s-4 11-18 8c-7-2-9-6-2-10zM88 145c-14-3-20 3-20 3s5 11 19 7c7-2 8-7 1-10zM20 82c12-2 17 4 17 4s-6 9-17 4c-6-3-6-7 0-8z" fill="#59d6b3" fill-opacity=".15" stroke="#59d6b3" stroke-width=".8" />
    </svg>

    <div class="relative z-10 mx-auto w-full max-w-[1280px]">
      <div class="about-enter flex items-center justify-between border-b border-stroke pb-4">
        <div class="flex items-center gap-4">
          <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#15201d] font-mono text-[9px] text-white">02</span>
          <span class="metadata text-muted">Personal profile / 个人档案</span>
        </div>
        <span class="hidden text-4xl font-extrabold tracking-[-0.06em] text-[#15201d]/[0.055] md:block">ABOUT</span>
      </div>

      <div class="mt-6 grid gap-7 lg:mt-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-20">
        <div class="relative z-10">
          <span class="pointer-events-none absolute -left-3 top-[18%] hidden h-20 w-44 rotate-[-8deg] bg-[#dcecff]/65 lg:block" style="clip-path: polygon(7% 16%, 91% 0, 100% 73%, 18% 100%, 0 58%)" />
          <h2 class="about-enter text-[clamp(2.5rem,5.2vw,5.7rem)] font-extrabold leading-[0.96] tracking-[-0.07em] text-[#15201d]">
            <span class="relative inline-block -rotate-[1deg]">认真构建，</span><br><span class="relative ml-[6%] inline-block rotate-[1deg] text-[#5da9ff] lg:-mr-20">也持续保持好奇。</span>
          </h2>
          <p class="about-enter mt-6 max-w-2xl text-lg font-semibold leading-relaxed tracking-[-0.025em] text-[#15201d] md:text-2xl">
            我是 {{ profile.name }}，一名计算机科学学生，也是一名正在形成自己方法的 AI 应用构建者。
          </p>
          <p class="about-enter mt-4 max-w-2xl text-xs leading-6 text-muted md:text-sm md:leading-7">
            从计算机基础、Python 和数据库出发，我逐渐把注意力集中到本地模型、知识检索与 RAG 应用。希望做出的东西不仅能够展示，也能真正使用、理解和继续维护。
          </p>
        </div>

        <aside class="about-enter relative lg:-ml-4 lg:pt-1">
          <div class="flex items-center justify-between">
            <p class="metadata text-[#3975b9]">Identity constellation / 2026</p>
            <span class="hidden -rotate-6 bg-[#fff2c9] px-3 py-1 font-mono text-[8px] text-[#9a6a16] lg:inline">STILL GROWING</span>
          </div>
          <svg class="pointer-events-none absolute inset-x-3 top-12 hidden h-[270px] w-[95%] lg:block" viewBox="0 0 520 270" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path class="growth-path" d="M25 50 C145 5 155 116 265 80 S382 28 500 82 M92 190 C170 142 265 238 360 171 S448 142 510 204" stroke="#acd8ca" stroke-width="1.2" stroke-dasharray="3 6" />
            <path class="growth-path" d="M265 80 C245 126 260 147 360 171" stroke="#8dbdf2" stroke-width="1" />
          </svg>
          <dl class="relative mt-4 grid grid-cols-1 gap-x-7 gap-y-1 border-t-2 border-[#15201d] pt-2 md:grid-cols-2 lg:min-h-[280px] lg:content-center lg:border-0 lg:pt-0">
            <div v-for="item in identityItems" :key="item.label" class="group relative z-10 border-b border-stroke bg-white/75 px-1 py-4 transition-transform duration-300 hover:-translate-y-1 md:py-5 lg:bg-white/90 lg:px-3" :class="item.offset">
              <dt class="metadata flex items-center gap-2 text-muted"><component :is="item.icon" class="size-3.5" :style="{ color: item.color }" />{{ item.label }}</dt>
              <dd class="mt-2 text-right text-sm font-semibold text-[#15201d]" :class="item.label === 'Name' ? 'text-lg font-bold' : item.label === 'Period' ? 'font-mono text-xs text-[#267f68]' : ''">{{ item.value }}</dd>
              <i class="absolute -left-1 bottom-[-3px] h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: item.color }" />
            </div>
          </dl>
          <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 lg:-mt-1 lg:justify-end">
            <span v-for="(item,index) in ['AI 探索', '工程能力', '动手实践', '创意表达', '认真可靠']" :key="item" class="inline-block font-mono text-[9px] text-muted" :class="index % 2 ? 'rotate-2' : '-rotate-1'">{{ item }}</span>
          </div>
        </aside>
      </div>

      <div class="about-enter relative mt-6 hidden grid-cols-3 gap-8 pt-5 md:grid lg:mt-2">
        <svg class="pointer-events-none absolute inset-x-0 top-0 h-6 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none" fill="none"><path d="M0 18 C280 0 405 25 650 11 S935 3 1200 16" stroke="#cfe0db" /></svg>
        <article v-for="principle in principles" :key="principle.number" class="border-l-2 pl-4" :class="principle.offset" :style="{ borderColor: principle.color }">
          <div class="flex items-center gap-2"><span class="font-mono text-[8px] text-muted">{{ principle.number }}</span><span class="text-sm font-bold text-[#15201d]">{{ principle.title }}</span></div>
          <p class="mt-2 text-[10px] leading-5 text-muted">{{ principle.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
