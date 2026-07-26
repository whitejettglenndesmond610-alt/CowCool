<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { reducedMotion } from '@/lib/animations.js'

const emit = defineEmits(['complete'])
const rootRef = ref(null)
const backdropRef = ref(null)
const networkRef = ref(null)
const contentRef = ref(null)
const markRef = ref(null)
const taglineRef = ref(null)
const hintRef = ref(null)
const leftLeafRef = ref(null)
const rightLeafRef = ref(null)
let ctx = null
let timeline = null
let finishing = false

function complete() {
  if (finishing) return
  finishing = true
  emit('complete')
}

function skip() {
  if (finishing || reducedMotion()) return
  finishing = true
  timeline?.kill()
  gsap.set([leftLeafRef.value, rightLeafRef.value], { autoAlpha: 1 })
  timeline = gsap.timeline({ onComplete: () => emit('complete') })
    .to([contentRef.value, networkRef.value], { autoAlpha: 0, scale: 0.96, duration: 0.12, ease: 'power2.in' })
    .to(backdropRef.value, { autoAlpha: 0, duration: 0.2, ease: 'power2.out' }, 0.04)
    .to(leftLeafRef.value, { xPercent: -112, duration: 0.28, ease: 'power3.inOut' }, 0.03)
    .to(rightLeafRef.value, { xPercent: 112, duration: 0.28, ease: 'power3.inOut' }, 0.03)
}

function onKeydown(event) {
  if (['Enter', ' ', 'Escape'].includes(event.key)) {
    event.preventDefault()
    skip()
  }
}

onMounted(() => {
  if (reducedMotion()) {
    complete()
    return
  }

  window.addEventListener('keydown', onKeydown)
  rootRef.value?.focus({ preventScroll: true })

  ctx = gsap.context(() => {
    const paths = rootRef.value.querySelectorAll('.intro-branch')
    const nodes = rootRef.value.querySelectorAll('.intro-node')
    const leaves = rootRef.value.querySelectorAll('.intro-leaf-node')

    paths.forEach(path => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
    })
    gsap.set(nodes, { scale: 0, transformOrigin: 'center' })
    gsap.set(leaves, { scale: 0, transformOrigin: 'center' })
    gsap.set([leftLeafRef.value, rightLeafRef.value], { autoAlpha: 0 })

    timeline = gsap.timeline({ onComplete: complete })
      .fromTo(markRef.value, { autoAlpha: 0, scale: 0.35, rotation: -14 }, { autoAlpha: 1, scale: 1, rotation: -3, duration: 0.3, ease: 'back.out(1.8)' }, 0.04)
      .to(paths, { strokeDashoffset: 0, duration: 0.42, stagger: 0.045, ease: 'power2.out' }, 0.18)
      .to(nodes, { scale: 1, duration: 0.22, stagger: 0.045, ease: 'back.out(2.2)' }, 0.38)
      .to(leaves, { scale: 1, duration: 0.28, stagger: 0.055, ease: 'back.out(1.9)' }, 0.5)
      .fromTo(taglineRef.value, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' }, 0.62)
      .fromTo(hintRef.value, { autoAlpha: 0 }, { autoAlpha: 0.55, duration: 0.25, ease: 'power2.out' }, 0.78)
      .to(markRef.value, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.76)
      .set([leftLeafRef.value, rightLeafRef.value], { autoAlpha: 1 }, 1.02)
      .to([contentRef.value, hintRef.value], { autoAlpha: 0, scale: 0.96, duration: 0.16, ease: 'power2.in' }, 1.03)
      .to(networkRef.value, { autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 1.03)
      .to(backdropRef.value, { autoAlpha: 0, duration: 0.34, ease: 'power2.out' }, 1.08)
      .to(leftLeafRef.value, { xPercent: -112, duration: 0.42, ease: 'power4.inOut' }, 1.05)
      .to(rightLeafRef.value, { xPercent: 112, duration: 0.42, ease: 'power4.inOut' }, 1.05)
  }, rootRef.value)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  timeline?.kill()
  ctx?.revert()
})
</script>

<template>
  <button ref="rootRef" type="button" class="fixed inset-0 z-[120] cursor-pointer overflow-hidden text-[#15201d] outline-none" aria-label="跳过开屏动画" @click="skip">
    <div ref="backdropRef" class="absolute inset-0 bg-[#f5f8f7]">
      <div class="absolute inset-0 opacity-45" style="background-image: linear-gradient(rgba(21,32,29,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(21,32,29,.045) 1px,transparent 1px);background-size:34px 34px" />
      <div class="absolute -left-16 top-[18%] h-44 w-72 -rotate-12 bg-[#dcecff]/55" style="clip-path: polygon(8% 13%,100% 0,86% 88%,16% 100%,0 58%)" />
      <div class="absolute -bottom-20 right-[4%] h-56 w-80 rotate-12 bg-[#c9f3e5]/65" style="clip-path: polygon(17% 0,100% 23%,79% 100%,0 74%)" />
    </div>

    <svg ref="networkRef" class="absolute inset-0 z-10 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
      <path class="intro-branch" d="M600 402C511 355 433 295 337 264" stroke="#86cdb8" stroke-width="1.3" />
      <path class="intro-branch" d="M600 402C705 339 806 289 915 250" stroke="#75aff0" stroke-width="1.3" />
      <path class="intro-branch" d="M600 402C506 464 425 518 314 557" stroke="#75aff0" stroke-width="1.2" />
      <path class="intro-branch" d="M600 402C701 469 805 528 922 565" stroke="#86cdb8" stroke-width="1.2" />
      <path class="intro-branch" d="M600 402C590 326 604 240 650 171" stroke="#e2b34d" stroke-width="1.2" />
      <path class="intro-branch" d="M600 402C611 493 587 588 538 650" stroke="#86cdb8" stroke-width="1.2" />

      <g>
        <circle class="intro-node" cx="337" cy="264" r="6" fill="#59d6b3"/><circle class="intro-node" cx="915" cy="250" r="6" fill="#5da9ff"/>
        <circle class="intro-node" cx="314" cy="557" r="6" fill="#5da9ff"/><circle class="intro-node" cx="922" cy="565" r="6" fill="#59d6b3"/>
        <circle class="intro-node" cx="650" cy="171" r="6" fill="#ffc964"/><circle class="intro-node" cx="538" cy="650" r="6" fill="#59d6b3"/>
      </g>

      <g fill="#dff7ef" stroke="#59b99c" stroke-width="1">
        <path class="intro-leaf-node" d="M337 264c-34-18-57-5-57-5s11 36 50 38c27 2 38-16 7-33z"/>
        <path class="intro-leaf-node" d="M915 250c32-20 57-9 57-9s-8 37-47 43c-27 4-40-13-10-34z"/>
        <path class="intro-leaf-node" d="M314 557c-31-14-51-1-51-1s13 31 47 29c24-1 33-17 4-28z"/>
        <path class="intro-leaf-node" d="M922 565c31-16 52-4 52-4s-10 32-45 32c-24 0-35-15-7-28z"/>
      </g>
    </svg>

    <div ref="contentRef" class="absolute inset-0 z-20 flex items-center justify-center px-5">
      <div class="flex flex-col items-center">
        <span ref="markRef" class="relative flex h-20 w-20 items-center justify-center rounded-[44%_56%_39%_61%] bg-[#15201d] text-xl font-extrabold text-white shadow-[0_24px_70px_rgba(21,32,29,.18)] opacity-0 md:h-24 md:w-24 md:text-2xl">
          SN
          <i class="absolute right-[18%] top-[18%] h-2 w-2 rounded-full bg-[#59d6b3] md:h-2.5 md:w-2.5" />
        </span>
        <div ref="taglineRef" class="mt-6 opacity-0">
          <p class="text-base font-extrabold tracking-[-0.03em] md:text-xl">AI 应用构建者</p>
          <p class="mt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#66736f]">Knowledge grows through building</p>
        </div>
      </div>
    </div>

    <p ref="hintRef" class="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.18em] text-[#66736f] opacity-0">Click anywhere to enter</p>

    <div ref="leftLeafRef" class="absolute -bottom-[8%] -left-[8%] -top-[8%] z-[15] w-[66%] bg-[#edf8f4] opacity-0" style="clip-path: polygon(0 0,86% 0,100% 23%,91% 50%,100% 78%,84% 100%,0 100%)" />
    <div ref="rightLeafRef" class="absolute -bottom-[8%] -right-[8%] -top-[8%] z-[15] w-[66%] bg-[#eaf4ff] opacity-0" style="clip-path: polygon(14% 0,100% 0,100% 100%,16% 100%,0 78%,9% 50%,0 23%)" />
  </button>
</template>
