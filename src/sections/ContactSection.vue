<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ArrowUpRight, Copy, FileLock2 } from '@lucide/vue'
import { profile } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const rootRef = ref(null)
const showToast = inject('showToast')
const motionEnabled = !reducedMotion()
let ctx = null

function copyEmail() {
  navigator.clipboard.writeText(profile.email)
    .then(() => {
      showToast('邮箱地址已复制')
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
  }, rootRef.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="rootRef" id="contact" class="relative flex h-full items-center overflow-hidden bg-[#c9f3e5] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
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
        <span class="flex h-11 w-11 -rotate-6 items-center justify-center rounded-[42%_58%_38%_62%] bg-[#15201d] font-mono text-[9px] text-white">06</span>
        <span class="rotate-2 metadata text-[#267f68]">Zhengzhou · China</span>
      </div>

      <div class="contact-enter mt-8 md:mt-12">
        <span class="metadata text-[#267f68]">Contact / 建立连接</span>
        <h2 class="mt-4 max-w-6xl text-[clamp(3rem,8vw,8rem)] font-extrabold leading-[0.86] tracking-[-0.075em] text-[#15201d]">
          <span class="inline-block -rotate-2">有想法，</span><br><span class="ml-[7%] inline-block rotate-1">一起<span class="relative text-white">做出来。</span></span>
        </h2>
      </div>

      <div class="mt-8 grid items-end gap-6 md:mt-12 md:grid-cols-[1fr_auto]">
        <button v-magnetic="{ strength: 0.08, radius: 120 }" class="contact-enter group w-fit max-w-full text-left md:-rotate-1" @click="copyEmail">
          <span class="metadata text-[#267f68]">Email · 点击复制</span>
          <span class="relative mt-2 flex items-center gap-3 border-b-2 border-[#15201d] pb-2 text-xl font-extrabold tracking-[-0.04em] text-[#15201d] transition-colors group-hover:border-[#267f68] md:text-4xl">
            {{ profile.email }} <Copy class="size-4 shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-[#267f68] md:size-5" />
            <i class="copy-signal pointer-events-none absolute bottom-[-5px] left-0 h-2 w-2 rounded-full bg-[#5da9ff] opacity-0" />
          </span>
        </button>

        <div class="contact-enter flex flex-wrap items-center gap-2 md:-translate-y-5 md:gap-1">
          <a v-magnetic="{ strength: 0.12, radius: 100 }" :href="profile.github" target="_blank" rel="noopener noreferrer" class="group flex h-20 w-20 -rotate-6 flex-col items-center justify-center rounded-[46%_54%_42%_58%] bg-[#15201d] text-white transition-transform hover:-translate-y-1 md:h-24 md:w-24">
            <ArrowUpRight class="size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-12" /><span class="mt-1 font-mono text-[8px]">GITHUB</span>
          </a>
          <div class="flex h-20 w-20 translate-y-3 rotate-6 flex-col items-center justify-center rounded-[58%_42%_60%_40%] border border-[#267f68]/30 bg-white/35 text-[#267f68] md:h-24 md:w-24">
            <FileLock2 class="size-5" /><span class="mt-1 text-center font-mono text-[7px] leading-3">PDF<br>待提供</span>
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
