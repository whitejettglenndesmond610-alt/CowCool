<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

let dX = 0, dY = 0, rX = 0, rY = 0, tX = 0, tY = 0
let visible = false
let dotEl, ringEl, glowEl
let rafId = null

const lerpDot = 0.55
const lerpRing = 0.3

function loop() {
  dX += (tX - dX) * lerpDot
  dY += (tY - dY) * lerpDot
  rX += (tX - rX) * lerpRing
  rY += (tY - rY) * lerpRing

  gsap.set(dotEl, { x: dX, y: dY })
  gsap.set(ringEl, { x: rX, y: rY })

  if (glowEl && visible) {
    gsap.set(glowEl, { x: dX, y: dY, opacity: 1 })
  } else if (glowEl) {
    gsap.set(glowEl, { opacity: 0 })
  }

  rafId = requestAnimationFrame(loop)
}

function onMouseMove(e) {
  tX = e.clientX
  tY = e.clientY
  if (!visible) {
    dX = rX = e.clientX
    dY = rY = e.clientY
    visible = true
    gsap.set([dotEl, ringEl], { x: e.clientX, y: e.clientY, opacity: 1 })
  }
}

function onMouseLeave() {
  visible = false
  gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.15 })
  if (glowEl) gsap.to(glowEl, { opacity: 0, duration: 0.15 })
}

function onInteractiveEnter() {
  gsap.to(dotEl, { scale: 2, duration: 0.3, overwrite: 'auto' })
  gsap.to(ringEl, { scale: 1.8, duration: 0.3, overwrite: 'auto' })
}

function onInteractiveLeave() {
  gsap.to(dotEl, { scale: 1, duration: 0.3, overwrite: 'auto' })
  gsap.to(ringEl, { scale: 1, duration: 0.3, overwrite: 'auto' })
}

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  dotEl = document.querySelector('.cursor-dot')
  ringEl = document.querySelector('.cursor-ring')
  glowEl = document.querySelector('.mouse-glow')

  if (!dotEl || !ringEl) return

  gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, scale: 1 })
  gsap.set(glowEl, { xPercent: -50, yPercent: -50 })
  gsap.set('.cursor-dot, .cursor-ring', { opacity: 0 })

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)

  const interactives = document.querySelectorAll('a, button, .project-card, input, textarea, [data-interactive]')
  interactives.forEach(el => {
    el.addEventListener('mouseenter', onInteractiveEnter)
    el.addEventListener('mouseleave', onInteractiveLeave)
  })

  loop()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<template>
  <div class="cursor-dot" aria-hidden="true" />
  <div class="cursor-ring" aria-hidden="true" />
</template>
