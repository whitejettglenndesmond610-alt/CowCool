<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ArrowUpRight, LockKeyhole, X } from '@lucide/vue'
import { reducedMotion } from '@/lib/animations.js'

const props = defineProps({ project: { type: Object, required: true } })
const emit = defineEmits(['close'])
const panelRef = ref(null)
const backdropRef = ref(null)

function close() {
  const duration = reducedMotion() ? 0 : 0.3
  gsap.to(panelRef.value, { xPercent: 105, duration, ease: 'power3.in' })
  gsap.to(backdropRef.value, { autoAlpha: 0, duration, onComplete: () => emit('close') })
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  const duration = reducedMotion() ? 0 : 0.55
  gsap.fromTo(backdropRef.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: duration * 0.55 })
  gsap.fromTo(panelRef.value, { xPercent: 105 }, { xPercent: 0, duration, ease: 'power4.out' })
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex justify-end">
      <button ref="backdropRef" class="absolute inset-0 cursor-default bg-[#15201d]/20 backdrop-blur-sm" aria-label="关闭项目详情" @click="close" />
      <aside ref="panelRef" class="relative h-full w-full max-w-xl overflow-y-auto border-l border-stroke bg-white p-6 shadow-[-30px_0_80px_rgba(21,32,29,.12)] md:p-10">
        <div class="flex items-center justify-between">
          <span class="metadata text-[#5da9ff]">Project / {{ project.number }}</span>
          <button class="icon-button" aria-label="关闭" @click="close"><X class="size-4" /></button>
        </div>
        <p class="mt-12 metadata text-muted">{{ project.subtitle }}</p>
        <h2 class="mt-3 text-3xl font-extrabold leading-tight text-[#15201d] md:text-5xl">{{ project.title }}</h2>
        <p class="mt-6 text-sm leading-7 text-muted">{{ project.description }}</p>

        <div class="mt-10 border-t border-stroke pt-7">
          <p class="metadata text-muted">项目目标</p>
          <p class="mt-3 text-sm leading-7 text-[#15201d]">{{ project.goal }}</p>
        </div>

        <div class="mt-8">
          <p class="metadata text-muted">核心实现</p>
          <ul class="mt-4 grid gap-3">
            <li v-for="item in project.highlights" :key="item" class="flex gap-3 rounded-xl bg-[#f5f8f7] p-3 text-sm text-[#15201d]">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#59d6b3]" />{{ item }}
            </li>
          </ul>
        </div>

        <div class="mt-8">
          <p class="metadata text-muted">项目结果</p>
          <p class="mt-3 text-sm leading-7 text-[#15201d]">{{ project.result }}</p>
        </div>

        <div class="mt-8 flex flex-wrap gap-2">
          <span v-for="tech in project.tech" :key="tech" class="rounded-full border border-stroke px-3 py-1.5 font-mono text-[10px] text-muted">{{ tech }}</span>
        </div>

        <div class="mt-10 flex flex-wrap gap-3">
          <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer" class="studio-button-primary">
            查看 GitHub <ArrowUpRight class="size-4" />
          </a>
          <a v-if="project.live" :href="project.live" target="_blank" rel="noopener noreferrer" class="studio-button-secondary">
            在线预览 <ArrowUpRight class="size-4" />
          </a>
          <p v-if="project.visibility === 'private'" class="inline-flex items-center gap-2 rounded-full bg-[#e8f8f2] px-4 py-2 font-mono text-[10px] text-[#267f68]">
            <LockKeyhole class="size-3.5" /> Private Build · 源码未公开
          </p>
        </div>
      </aside>
    </div>
  </Teleport>
</template>
