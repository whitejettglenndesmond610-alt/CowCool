<script setup>
import { watch, nextTick, computed } from 'vue'
import gsap from 'gsap'
import { Button } from '@/components/ui/button'
import { X } from '@lucide/vue'

const props = defineProps({ data: { type: Object, default: null } })
const emit = defineEmits(['close'])

const isOpen = computed(() => props.data !== null)

watch(isOpen, async (val) => {
  await nextTick()
  const m = document.getElementById('project-modal')
  const panel = m?.querySelector('.modal-panel')
  const backdrop = m?.querySelector('.modal-backdrop')
  if (!m || !panel || !backdrop) return

  if (val) {
    document.body.style.overflow = 'hidden'
    gsap.set(m, { display: 'flex' })
    const isMobile = window.innerWidth <= 768
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    if (isMobile) {
      gsap.fromTo(panel, { y: '100%' }, { y: '0%', duration: 0.45, ease: 'expo.out' })
    } else {
      gsap.fromTo(panel, { x: '100%' }, { x: '0%', duration: 0.45, ease: 'expo.out' })
    }
    gsap.fromTo('.modal-fade-in', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.2, ease: 'expo.out' })
  }
})

function handleClose() {
  const m = document.getElementById('project-modal')
  const panel = m?.querySelector('.modal-panel')
  const backdrop = m?.querySelector('.modal-backdrop')
  if (!m || !panel || !backdrop) return

  const isMobile = window.innerWidth <= 768
  gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: 'power2.in' })
  if (isMobile) {
    gsap.to(panel, { y: '100%', duration: 0.4, ease: 'expo.in', onComplete: finish })
  } else {
    gsap.to(panel, { x: '100%', duration: 0.4, ease: 'expo.in', onComplete: finish })
  }

  function finish() {
    m.style.display = 'none'
    document.body.style.overflow = ''
    emit('close')
  }
}

function onKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) handleClose()
}

watch(isOpen, (val) => {
  if (val) document.addEventListener('keydown', onKeydown)
  else document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      id="project-modal"
      class="fixed inset-0 z-[2000] hidden items-center justify-end"
      :class="{ 'justify-end': true, 'md:!items-end': false }"
      aria-hidden="true"
      role="dialog"
      aria-label="Project Details"
    >
      <div class="modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-md" @click="handleClose" />
      <div class="modal-panel relative w-full max-w-[560px] h-screen bg-surface border-l border-white/5 md:border-l px-10 py-16 md:px-10 md:py-16 overflow-y-auto md:max-w-[560px] md:h-screen md:rounded-none
                  max-md:max-w-full max-md:h-[90vh] max-md:border-l-0 max-md:border-t max-md:rounded-t-2xl max-md:mt-auto max-md:bottom-0"
      >
        <Button
          variant="ghost"
          size="icon"
          class="absolute top-5 right-5 rounded-full text-muted hover:text-white hover:bg-white/5 modal-close-btn"
          @click="handleClose"
        >
          <X class="size-5" />
        </Button>
        <div class="modal-body" v-if="data">
          <span class="modal-fade-in block text-xs font-semibold uppercase tracking-[0.1em] text-[#89AACC] mb-2 font-mono">
            {{ data.type }}
          </span>
          <h2 class="modal-fade-in text-3xl font-extrabold text-white mb-5" style="font-family: Inter, sans-serif;">
            {{ data.title }}
          </h2>
          <p class="modal-fade-in text-muted leading-relaxed mb-7">
            {{ data.desc }}
          </p>
          <div class="modal-fade-in flex flex-wrap gap-2 mb-7">
            <span
              v-for="t in data.tech"
              :key="t"
              class="px-3.5 py-1.5 text-xs rounded-full border font-mono"
              style="background: rgba(78,133,191,0.1); border-color: rgba(78,133,191,0.25); color: #4E85BF;"
            >
              {{ t }}
            </span>
          </div>
          <ul class="space-y-3">
            <li v-for="h in data.highlights" :key="h" class="modal-fade-in relative pl-5 text-muted text-sm leading-relaxed">
              <span class="absolute left-0 top-2 w-2 h-2 rounded-full bg-[#89AACC]" style="box-shadow: 0 0 8px #89AACC;" />
              {{ h }}
            </li>
          </ul>

          <div v-if="data.demo || data.github" class="modal-fade-in flex gap-3 mt-8">
            <a v-if="data.demo" :href="data.demo" target="_blank" rel="noopener"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(78,133,191,0.3)] transition-shadow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              在线演示
            </a>
            <a v-if="data.github" :href="data.github" target="_blank" rel="noopener"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-semibold hover:border-[#4E85BF] hover:text-[#4E85BF] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
