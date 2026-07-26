<script setup>
import { computed, markRaw, onMounted, onUnmounted, provide, ref } from 'vue'
import AppNavigation from '@/components/AppNavigation.vue'
import BrandIntro from '@/components/BrandIntro.vue'
import PageTransition from '@/components/PageTransition.vue'
import ProjectDetail from '@/components/ProjectDetail.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import HeroSection from '@/sections/HeroSection.vue'
import AboutSection from '@/sections/AboutSection.vue'
import SkillsSection from '@/sections/SkillsSection.vue'
import ProjectsSection from '@/sections/ProjectsSection.vue'
import TimelineSection from '@/sections/TimelineSection.vue'
import ContactSection from '@/sections/ContactSection.vue'
import { useToast } from '@/composables/useToast.js'
import { reducedMotion } from '@/lib/animations.js'

const pages = [
  { id: 'home', number: '01', label: '首页', component: markRaw(HeroSection) },
  { id: 'about', number: '02', label: '关于', component: markRaw(AboutSection) },
  { id: 'skills', number: '03', label: '能力', component: markRaw(SkillsSection) },
  { id: 'projects', number: '04', label: '项目', component: markRaw(ProjectsSection) },
  { id: 'timeline', number: '05', label: '经历', component: markRaw(TimelineSection) },
  { id: 'contact', number: '06', label: '联系', component: markRaw(ContactSection) },
]

const hashId = window.location.hash.slice(1)
const hashIndex = pages.findIndex(page => page.id === hashId)
const activeIndex = ref(hashIndex >= 0 ? hashIndex : 0)
const transitioning = ref(false)
const previewMode = new URLSearchParams(window.location.search).has('preview')
const introVisible = ref(!previewMode && sessionStorage.getItem('studio-intro') !== 'seen')
const transitionRef = ref(null)
const selectedProject = ref(null)
const touchStart = { x: 0, y: 0, blocked: false }

const currentPage = computed(() => pages[activeIndex.value])
const { toast, showToast } = useToast()
provide('showToast', showToast)

function commitPage(targetIndex, updateHistory) {
  activeIndex.value = targetIndex
  if (updateHistory) {
    window.history.pushState({ page: pages[targetIndex].id }, '', `#${pages[targetIndex].id}`)
  }
}

function completeIntro() {
  introVisible.value = false
  sessionStorage.setItem('studio-intro', 'seen')
}

function navigate(target, { updateHistory = true } = {}) {
  const targetIndex = typeof target === 'number' ? target : pages.findIndex(page => page.id === target)
  if (targetIndex < 0 || targetIndex >= pages.length || targetIndex === activeIndex.value || transitioning.value) return

  if (reducedMotion()) {
    commitPage(targetIndex, updateHistory)
    return
  }

  transitioning.value = true
  const direction = targetIndex > activeIndex.value ? 1 : -1
  const player = transitionRef.value
  if (!player) {
    commitPage(targetIndex, updateHistory)
    transitioning.value = false
    return
  }

  player.play({
    from: currentPage.value,
    to: pages[targetIndex],
    travelDirection: direction,
    onCovered: () => commitPage(targetIndex, updateHistory),
    onComplete: () => { transitioning.value = false },
  })
}

function onTouchStart(event) {
  const touch = event.changedTouches[0]
  touchStart.x = touch.clientX
  touchStart.y = touch.clientY
  touchStart.blocked = Boolean(event.target.closest('button, a, [role="dialog"]'))
}

function onTouchEnd(event) {
  if (touchStart.blocked || selectedProject.value) return
  const touch = event.changedTouches[0]
  const dx = touch.clientX - touchStart.x
  const dy = touch.clientY - touchStart.y
  if (Math.abs(dx) < 58 || Math.abs(dx) < Math.abs(dy) * 1.25) return
  navigate(activeIndex.value + (dx < 0 ? 1 : -1))
}

function onPopState() {
  navigate(window.location.hash.slice(1) || 'home', { updateHistory: false })
}

onMounted(() => {
  if (hashIndex < 0) window.history.replaceState({ page: 'home' }, '', '#home')
  window.addEventListener('popstate', onPopState)
})

onUnmounted(() => window.removeEventListener('popstate', onPopState))
</script>

<template>
  <div class="relative h-[100dvh] overflow-hidden bg-bg" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
    <BrandIntro v-if="introVisible" @complete="completeIntro" />
    <AppNavigation :pages="pages" :active-id="currentPage.id" @navigate="navigate" />
    <PageTransition ref="transitionRef" />

    <main class="absolute inset-0">
      <component
        :is="currentPage.component"
        :key="`${currentPage.id}-${introVisible ? 'intro' : 'ready'}`"
        class="page-panel"
        @navigate="navigate"
        @open-project="selectedProject = $event"
      />
    </main>

    <div class="paper-noise" aria-hidden="true" />
    <ToastNotification :toast="toast" />
    <ProjectDetail v-if="selectedProject" :project="selectedProject" @close="selectedProject = null" />
  </div>
</template>
