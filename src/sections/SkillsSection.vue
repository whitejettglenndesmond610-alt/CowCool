<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import CapabilityIcon from '@/components/CapabilityIcon.vue'
import { capabilityGroups } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const rootRef = ref(null)
const motionEnabled = !reducedMotion()
const bandLayouts = ['lg:w-[96%] lg:-rotate-[0.5deg]', 'lg:ml-[6%] lg:w-[94%] lg:rotate-[0.7deg]', 'lg:ml-[2%] lg:w-[98%] lg:-rotate-[0.35deg]']
const bandColors = ['rgba(93,169,255,.09)', 'rgba(89,214,179,.11)', 'rgba(255,201,100,.11)']
const skillRotations = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1', 'rotate-1']
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.skills-enter', { autoAlpha: 1 })
      gsap.set('.skills-trunk', { strokeDashoffset: 0 })
      return
    }
    gsap.fromTo('.skills-enter', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.07, ease: 'power3.out', delay: 0.2 })
    const path = rootRef.value.querySelector('.skills-trunk')
    const length = path?.getTotalLength?.() ?? 0
    if (path) {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, { strokeDashoffset: 0, duration: 1, delay: 0.45, ease: 'power2.out' })
    }
  }, rootRef.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="rootRef" id="skills" class="relative flex h-full items-center overflow-hidden bg-[#eaf8f3] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
    <div class="absolute inset-0 opacity-30" style="background-image:radial-gradient(circle,rgba(38,127,104,.22) 1px,transparent 1px);background-size:26px 26px" />
    <div class="absolute right-0 top-0 h-full w-[18%] bg-white/20" />
    <span class="absolute -bottom-8 right-0 text-[17vw] font-extrabold leading-none tracking-[-0.1em] text-[#267f68]/[0.045]">SYSTEM</span>

    <div class="relative z-10 mx-auto w-full max-w-[1320px]">
      <div class="skills-enter relative grid items-end gap-4 pb-5 lg:grid-cols-[1fr_0.45fr]">
        <svg class="pointer-events-none absolute -bottom-2 left-0 h-7 w-full" viewBox="0 0 1200 28" preserveAspectRatio="none" fill="none"><path d="M0 19 C225 3 388 31 605 13 S970 4 1200 20" stroke="#15201d" stroke-width="2" /></svg>
        <div>
          <span class="studio-kicker">Capability system / 能力结构</span>
          <h2 class="mt-4 text-[clamp(2.4rem,5.2vw,5.3rem)] font-extrabold leading-[0.96] tracking-[-0.07em] text-[#15201d]">
            <span class="inline-block -rotate-1">三层能力，</span><span class="ml-[3%] inline-block translate-y-1 rotate-1 text-[#267f68]">一条实践路径。</span>
          </h2>
        </div>
        <p class="hidden rotate-1 text-right text-xs leading-6 text-muted lg:block">从开发基础出发，经由 AI 应用能力，最终落到可维护、可部署的工程实现。</p>
      </div>

      <div class="skills-list relative mt-3">
        <svg class="pointer-events-none absolute bottom-1 left-[3.5%] top-1 z-10 hidden h-[calc(100%-8px)] w-[7%] md:block" viewBox="0 0 100 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path id="skills-growth-trunk" class="skills-trunk" d="M48 0 C12 98 84 166 46 252 S15 430 66 600" stroke="url(#skillGradient)" stroke-width="1.8" />
          <defs><linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="600" gradientUnits="userSpaceOnUse"><stop stop-color="#5da9ff"/><stop offset=".52" stop-color="#59d6b3"/><stop offset="1" stop-color="#ffc964"/></linearGradient></defs>
          <circle v-if="motionEnabled" r="5" fill="#15201d"><animateMotion dur="5.5s" repeatCount="indefinite"><mpath href="#skills-growth-trunk" /></animateMotion></circle>
        </svg>
        <article v-for="(group,groupIndex) in capabilityGroups" :key="group.id" class="skills-enter group relative grid gap-3 border-b border-[#b6d9ce] py-4 transition-transform duration-300 hover:-translate-y-1 md:grid-cols-[0.08fr_0.22fr_0.32fr_0.38fr] md:items-center md:gap-5 md:py-6" :class="bandLayouts[groupIndex]">
          <span class="pointer-events-none absolute inset-y-2 left-[8%] right-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" :style="{ backgroundColor: bandColors[groupIndex], clipPath: 'polygon(2% 13%, 97% 0, 100% 74%, 84% 100%, 0 87%)' }" />
          <span class="relative font-mono text-[9px] text-[#267f68]"><i class="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#59d6b3] shadow-[0_0_0_5px_rgba(89,214,179,.13)]" />{{ group.number }}</span>
          <div class="flex items-center gap-3">
            <CapabilityIcon :type="group.id" />
            <div>
              <h3 class="text-xl font-extrabold tracking-[-0.035em] text-[#15201d] md:text-2xl">{{ group.title }}</h3>
              <p class="mt-1 text-[10px] text-muted md:hidden">{{ group.summary }}</p>
            </div>
          </div>
          <p class="hidden text-xs leading-6 text-muted md:block">{{ group.summary }}</p>
          <div class="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
            <span v-for="(skill,index) in group.skills" :key="skill" class="flex items-center gap-1.5 font-mono text-[9px] font-medium text-[#15201d] transition-transform duration-300 group-hover:translate-y-[-2px] md:text-[10px]" :class="skillRotations[index % skillRotations.length]">
              <i class="h-1.5 w-1.5 rounded-full" :class="index % 2 ? 'bg-[#5da9ff]' : 'bg-[#59d6b3]'" />{{ skill }}
            </span>
          </div>
        </article>
      </div>

      <div class="skills-enter mt-5 flex items-center justify-between">
        <span class="metadata text-[#267f68]">Foundation → AI application → Engineering</span>
        <span class="hidden max-w-lg text-right text-[10px] text-muted md:block">能力来自项目中的实际使用，不使用虚构的熟练度百分比。</span>
      </div>
    </div>
  </section>
</template>
