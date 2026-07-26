<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { journey } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const rootRef = ref(null)
const activeIndex = ref(0)
const activeItem = computed(() => journey[activeIndex.value])
const motionEnabled = !reducedMotion()
const nodeOffsets = ['translate-y-3', '-translate-y-5', 'translate-y-5', '-translate-y-2']
const nodeRotations = ['-rotate-6', 'rotate-6', '-rotate-3', 'rotate-5']
let ctx = null

function enterDetail(el, done) {
  gsap.fromTo(el, { autoAlpha: 0, y: reducedMotion() ? 0 : 18 }, { autoAlpha: 1, y: 0, duration: reducedMotion() ? 0 : 0.42, ease: 'power3.out', onComplete: done })
  if (!reducedMotion()) {
    gsap.fromTo(el.querySelector('.journey-date'), { yPercent: 55, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out' })
  }
}

function leaveDetail(el, done) {
  gsap.to(el, { autoAlpha: 0, y: reducedMotion() ? 0 : -10, duration: reducedMotion() ? 0 : 0.18, ease: 'power2.in', onComplete: done })
}

onMounted(() => {
  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.journey-enter', { autoAlpha: 1 })
      gsap.set('.journey-path', { strokeDashoffset: 0 })
      return
    }
    gsap.fromTo('.journey-enter', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out', delay: 0.2 })
    const path = rootRef.value.querySelector('.journey-path')
    const length = path?.getTotalLength?.() ?? 0
    if (path) {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, { strokeDashoffset: 0, duration: 1.1, delay: 0.48, ease: 'power2.out' })
    }
    gsap.to('.journey-node-dot', { scale: 1.08, repeat: -1, yoyo: true, duration: 1.7, stagger: 0.25, ease: 'sine.inOut' })
  }, rootRef.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="rootRef" id="timeline" class="relative flex h-full items-center overflow-hidden bg-[#fff8e8] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
    <div class="absolute -bottom-24 -right-12 h-[55vh] w-[55vh] rounded-full border-[70px] border-[#ffc964]/15" />
    <div class="absolute left-[39%] top-[13%] h-28 w-48 -rotate-12 bg-[#ffc964]/10" style="clip-path: polygon(0 18%, 88% 0, 100% 72%, 16% 100%)" />
    <span class="absolute bottom-0 left-0 text-[22vw] font-extrabold leading-[0.7] tracking-[-0.12em] text-[#f2b942]/[0.065]">NEXT</span>

    <div class="relative z-10 mx-auto w-full max-w-[1280px]">
      <div class="journey-enter flex items-start justify-between">
        <div>
          <span class="studio-kicker">Journey map / 成长路径</span>
          <h2 class="mt-4 max-w-5xl text-[clamp(2.3rem,5vw,5rem)] font-extrabold leading-[0.94] tracking-[-0.065em] text-[#15201d]"><span class="inline-block -rotate-1">每一次构建，</span><br><span class="ml-[5%] inline-block rotate-1 text-[#c88713] md:whitespace-nowrap">都是下一个<span class="whitespace-nowrap">节点的起点。</span></span></h2>
        </div>
        <span class="hidden rotate-3 bg-white/65 px-4 py-2 metadata text-[#9a6a16] md:block" style="clip-path: polygon(5% 0, 100% 10%, 94% 100%, 0 82%)">Timeline · 2025 → Next</span>
      </div>

      <div class="journey-enter mt-7 md:mt-12">
        <div class="relative grid grid-cols-4 gap-2">
          <svg class="pointer-events-none absolute left-[8%] top-1 h-14 w-[84%] md:h-20" viewBox="0 0 1000 80" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path id="journey-growth-path" class="journey-path" d="M0 51 C130 2 260 78 402 32 S690 72 1000 22" stroke="#d6b968" stroke-width="2" />
            <circle v-if="motionEnabled" r="4" fill="#59d6b3"><animateMotion dur="7s" repeatCount="indefinite"><mpath href="#journey-growth-path" /></animateMotion></circle>
          </svg>
          <button v-for="(item,index) in journey" :key="item.date" class="group relative z-10 flex flex-col items-center text-center" :class="nodeOffsets[index]" @click="activeIndex=index">
            <span class="journey-node-dot flex h-10 w-10 items-center justify-center rounded-[43%_57%_38%_62%] border-4 transition-all duration-300 md:h-14 md:w-14" :class="[nodeRotations[index], index===activeIndex ? 'border-[#fff8e8] bg-[#15201d] text-white shadow-[0_0_0_2px_#15201d]' : 'border-[#fff8e8] bg-white text-[#9a6a16] shadow-[0_0_0_1px_#dfc98f] group-hover:bg-[#fff1c9]']">
              <span class="font-mono text-[8px] md:text-[10px]">0{{ index+1 }}</span>
            </span>
            <span class="mt-3 font-mono text-[8px] font-semibold md:text-[10px]" :class="index===activeIndex ? 'text-[#15201d]' : 'text-[#9a6a16]'">{{ item.date }}</span>
            <span class="mt-1 hidden max-w-[180px] text-xs font-bold text-[#15201d] md:block">{{ item.title }}</span>
          </button>
        </div>
      </div>

      <Transition mode="out-in" :css="false" @enter="enterDetail" @leave="leaveDetail">
        <article :key="activeItem.date" class="journey-enter relative mt-7 grid items-end gap-5 pt-7 md:mt-8 md:grid-cols-[0.42fr_0.58fr] md:gap-4 md:pt-9">
          <svg class="pointer-events-none absolute inset-x-0 top-0 h-7 w-full" viewBox="0 0 1200 28" preserveAspectRatio="none" fill="none"><path d="M0 20 C270 1 450 30 675 11 S955 7 1200 20" stroke="#dfc98f" /></svg>
          <div class="relative md:-translate-y-1">
            <i class="pointer-events-none absolute -left-8 top-2 h-24 w-64 -rotate-6 bg-[#ffc964]/10" style="clip-path: polygon(3% 22%, 92% 0, 100% 78%, 16% 100%)" />
            <p class="metadata text-[#9a6a16]">Selected moment</p>
            <p class="journey-date relative mt-2 inline-block -rotate-2 text-5xl font-extrabold tracking-[-0.07em] text-[#15201d] md:text-8xl">{{ activeItem.date }}</p>
          </div>
          <div class="md:-translate-y-4 md:rotate-[0.7deg]">
            <h3 class="text-2xl font-extrabold tracking-[-0.04em] text-[#15201d] md:text-4xl">{{ activeItem.title }}</h3>
            <p class="mt-3 max-w-2xl text-xs leading-6 text-[#6f6653] md:text-sm md:leading-7">{{ activeItem.description }}</p>
            <p class="mt-4 metadata text-[#9a6a16]">Keep building · Keep learning</p>
          </div>
        </article>
      </Transition>
    </div>
  </section>
</template>
