<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme.js'
import { Sun, Moon } from '@lucide/vue'

const { theme, toggleTheme } = useTheme()

const scrolled = ref(false)
const mobileOpen = ref(false)
const activeSection = ref('home')

const links = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'timeline', label: '历程' },
  { id: 'contact', label: '联系' },
]

function onScroll() {
  scrolled.value = window.scrollY > 100
  const y = window.scrollY + 100

  const offsets = links.map(l => {
    const el = document.getElementById(l.id)
    return { id: l.id, top: el ? el.offsetTop : 0 }
  })

  let current = 'home'
  for (const o of offsets) {
    if (y >= o.top) current = o.id
  }
  activeSection.value = current
}

let ticking = false
function handleScroll() {
  if (!ticking) {
    requestAnimationFrame(() => { onScroll(); ticking = false })
    ticking = true
  }
}

function scrollTo(id) {
  mobileOpen.value = false
  document.body.style.overflow = ''
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
  document.body.style.overflow = mobileOpen.value ? 'hidden' : ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  onScroll()
})

onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 transition-all"
    :class="scrolled ? 'bg-bg/80 backdrop-blur-md shadow-md shadow-black/10' : ''">
    <div class="inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-2 py-2">
      <a href="#home" @click.prevent="scrollTo('home')"
        class="w-9 h-9 rounded-full relative group flex-shrink-0">
        <span class="absolute inset-0 rounded-full accent-gradient group-hover:[animation:gradient-shift_6s_ease_infinite] transition-all" />
        <span class="absolute inset-[2px] rounded-full bg-bg flex items-center justify-center">
          <span class="font-display italic text-[13px] text-text-primary">SN</span>
        </span>
      </a>

      <span class="w-px h-5 bg-stroke mx-1 hidden sm:block" />

      <button v-for="(link, i) in links" :key="link.id"
        @click="scrollTo(link.id)"
        :class="[
          'text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors',
          activeSection === link.id
            ? 'text-text-primary bg-stroke/50'
            : 'text-muted hover:text-text-primary hover:bg-stroke/50',
        ]">
        {{ link.label }}
      </button>

      <span class="w-px h-5 bg-stroke mx-1 hidden sm:block" />

      <button @click="toggleTheme"
        class="w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-text-primary hover:bg-stroke/50 transition-colors">
        <Sun v-if="theme === 'dark'" class="size-3.5" />
        <Moon v-else class="size-3.5" />
      </button>

      <span class="w-px h-5 bg-stroke mx-1 hidden sm:block" />

      <button @click="scrollTo('contact')"
        class="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-text-primary relative group">
        <span class="absolute inset-[-2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity accent-gradient" />
        <span class="relative z-10 flex items-center gap-1 bg-surface rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
          联系我
          <span class="text-xs ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform inline-block">↗</span>
        </span>
      </button>
    </div>
  </nav>

  <Teleport to="body">
    <div
      class="fixed inset-0 z-[999] bg-bg/95 backdrop-blur-3xl flex items-center justify-center transition-all duration-300 hidden max-md:flex"
      :class="mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'">
      <ul class="flex flex-col items-center gap-8">
        <li v-for="link in links" :key="link.id">
          <button @click="scrollTo(link.id)"
            class="text-3xl font-bold text-muted hover:text-text-primary transition-colors font-display">
            {{ link.label }}
          </button>
        </li>
      </ul>
    </div>
  </Teleport>
</template>
