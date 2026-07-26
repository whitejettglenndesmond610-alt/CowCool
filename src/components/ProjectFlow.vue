<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { reducedMotion } from '@/lib/animations.js'

const props = defineProps({ projectId: { type: String, required: true } })
const rootRef = ref(null)
let ctx = null

const labels = computed(() => props.projectId === 'local-rag'
  ? ['DOC', 'CHUNK', 'FAISS', 'LLM']
  : ['CONTENT', 'PAGE', 'MOTION', 'DEPLOY'])

onMounted(() => {
  ctx = gsap.context(() => {
    const path = rootRef.value?.querySelector('.project-flow-path')
    const dot = rootRef.value?.querySelector('.project-flow-dot')
    if (!path) return
    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: reducedMotion() ? 0 : length })
    if (reducedMotion()) return
    gsap.to(path, { strokeDashoffset: 0, duration: 0.85, ease: 'power2.out' })
    gsap.to(dot, {
      x: 390,
      keyframes: { y: [0, -28, 22, -14, 0] },
      duration: 4.8,
      ease: 'none',
      repeat: -1,
    })
  }, rootRef.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div ref="rootRef" class="relative h-full min-h-44 w-full">
    <svg viewBox="0 0 500 170" class="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
      <path class="project-flow-path" d="M55 88 C120 28 168 142 222 88 S328 30 445 88" stroke="#75bfa8" stroke-width="1.5"/>
      <circle class="project-flow-dot" cx="55" cy="88" r="5" fill="#5da9ff"/>
      <g v-for="(label,index) in labels" :key="label" :transform="`translate(${[55,180,320,445][index]} 88)`">
        <circle r="20" fill="white" stroke="#bddbd1"/>
        <circle r="4" :fill="index % 2 ? '#5da9ff' : '#59d6b3'"/>
      </g>
    </svg>
    <span v-for="(label,index) in labels" :key="label" class="absolute top-[67%] -translate-x-1/2 font-mono text-[7px] text-muted" :style="{ left: `${[11,36,64,89][index]}%` }">{{ label }}</span>
  </div>
</template>
