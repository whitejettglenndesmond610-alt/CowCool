<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import gsap from 'gsap'
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
  const y = window.scrollY
  scrolled.value = y > 50

  const offsets = links.map(l => {
    const el = document.getElementById(l.id)
    return { id: l.id, top: el ? el.offsetTop - 120 : 0 }
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
  if (!el) return
  window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' })
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
  <nav
    class="fixed top-0 left-0 right-0 z-[1000] px-6 h-[70px] border-b transition-all duration-400"
    :class="scrolled
      ? 'bg-[#0a0a0f]/85 backdrop-blur-xl border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
      : 'bg-[#0a0a0f]/60 backdrop-blur-md border-transparent'"
  >
    <div class="max-w-[1200px] mx-auto h-full flex items-center justify-between">
      <a href="#home" @click.prevent="scrollTo('home')"
        class="text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00c8e8] to-[#7c3aed] z-[1001] hover:opacity-80 transition-opacity">
        SN
      </a>

      <ul class="hidden md:flex items-center gap-8">
        <li v-for="l in links" :key="l.id">
          <a :href="'#' + l.id" @click.prevent="scrollTo(l.id)"
            class="text-sm font-medium relative py-2 transition-colors"
            :class="activeSection === l.id ? 'text-white' : 'text-white/60 hover:text-white'">
            {{ l.label }}
            <span class="absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-[#00c8e8] to-[#7c3aed] transition-all duration-300"
              :class="activeSection === l.id ? 'w-full' : 'w-0'" />
          </a>
        </li>
      </ul>

      <div class="hidden md:flex items-center gap-3">
        <button @click="toggleTheme"
          class="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-white/60 hover:text-white hover:border-[#7c3aed] transition-all"
          :title="theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'">
          <Sun v-if="theme === 'dark'" class="size-4" />
          <Moon v-else class="size-4" />
        </button>

        <Button class="text-xs font-semibold rounded-full border-white/10 bg-white/[0.025] backdrop-blur-md
          hover:border-[#7c3aed] hover:shadow-[0_0_40px_rgba(124,58,237,0.25)]" variant="outline" size="sm"
          @click="scrollTo('contact')">
          联系我
        </Button>
      </div>

      <button class="hidden max-md:flex flex-col gap-1.5 p-2 z-[1001]" @click="toggleMobile"
        aria-label="Toggle menu">
        <span class="block w-6 h-0.5 bg-white rounded-full transition-all duration-300"
          :class="mobileOpen ? 'rotate-45 translate-y-[7px]' : ''" />
        <span class="block w-6 h-0.5 bg-white rounded-full transition-opacity"
          :class="mobileOpen ? 'opacity-0' : ''" />
        <span class="block w-6 h-0.5 bg-white rounded-full transition-all duration-300"
          :class="mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''" />
      </button>
    </div>
  </nav>

  <Teleport to="body">
    <div
      class="fixed inset-0 z-[999] bg-[#0a0a0f]/95 backdrop-blur-3xl flex items-center justify-center transition-all duration-300 hidden max-md:flex"
      :class="mobileOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'">
      <ul class="flex flex-col items-center gap-8">
        <li v-for="l in links" :key="l.id">
          <a :href="'#' + l.id" @click.prevent="scrollTo(l.id)"
            class="text-3xl font-bold text-white/60 hover:text-[#00c8e8] transition-colors"
            style="font-family: Inter, sans-serif;">
            {{ l.label }}
          </a>
        </li>
      </ul>
    </div>
  </Teleport>
</template>
