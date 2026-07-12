<script setup>
import { onMounted, onUnmounted } from 'vue'

function update() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  const bar = document.querySelector('.scroll-progress-bar')
  if (bar) bar.style.width = progress + '%'
}

let ticking = false
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => { update(); ticking = false })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="scroll-progress-bar fixed top-0 left-0 h-0.5 bg-gradient-to-r from-[#89AACC] to-[#4E85BF] z-[2000] transition-width duration-100" style="width: 0%; border-radius: 0 2px 2px 0;" />
</template>
