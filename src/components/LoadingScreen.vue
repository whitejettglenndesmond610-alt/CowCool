<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const words = ['设计', '创造', '激励']
const wordIndex = ref(0)
const count = ref(0)
const isVisible = ref(true)
let rafId = null
let wordTimer = null
let startTime = null

function animate(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / 2700, 1)
  count.value = Math.floor(progress * 100)

  if (progress < 1) {
    rafId = requestAnimationFrame(animate)
  } else {
    count.value = 100
    setTimeout(() => {
      isVisible.value = false
      setTimeout(() => {
        const loader = document.querySelector('.page-loader')
        if (loader) {
          gsap.to(loader, { opacity: 0, duration: 0.6, ease: 'power2.in', onComplete: () => loader.remove() })
        }
      }, 400)
    }, 400)
  }
}

onMounted(() => {
  rafId = requestAnimationFrame(animate)
  wordTimer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % words.length
  }, 900)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (wordTimer) clearInterval(wordTimer)
})
</script>

<template>
  <div v-if="isVisible" class="page-loader fixed inset-0 z-[9999] bg-bg flex items-center justify-center">
    <div class="absolute top-8 left-8 md:top-10 md:left-10 text-xs text-muted uppercase tracking-[0.3em] opacity-0"
      ref="labelRef" style="animation: fade-in-up 0.6s ease-out 0.1s forwards;">
      Portfolio
    </div>

    <div class="text-center">
      <div class="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80 h-[1.2em] flex items-center justify-center overflow-hidden">
        <Transition name="word" mode="out-in">
          <span :key="wordIndex">{{ words[wordIndex] }}</span>
        </Transition>
      </div>
    </div>

    <div class="absolute bottom-8 right-8 md:bottom-10 md:right-10">
      <span class="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums">
        {{ String(count).padStart(3, '0') }}
      </span>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
      <div class="h-full" :style="{
        background: 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
        transform: `scaleX(${count / 100})`,
        transformOrigin: 'left',
        boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
      }" />
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.word-enter-active { transition: all 0.3s ease-in-out; }
.word-leave-active { transition: all 0.3s ease-in-out; }
.word-enter-from { opacity: 0; transform: translateY(20px); }
.word-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
