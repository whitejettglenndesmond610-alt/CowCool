<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { Menu, X } from '@lucide/vue'
import { reducedMotion } from '@/lib/animations.js'

const props = defineProps({
  pages: { type: Array, required: true },
  activeId: { type: String, required: true },
})

const emit = defineEmits(['navigate'])
const menuOpen = ref(false)
const navRef = ref(null)
const markerRef = ref(null)
const itemRefs = ref([])
const activeIndex = computed(() => props.pages.findIndex(page => page.id === props.activeId))

const desktopOffsets = [
  '-translate-y-1 -rotate-1',
  'translate-y-1 rotate-[0.8deg]',
  '-translate-y-0.5 rotate-1',
  'translate-y-1.5 -rotate-[0.8deg]',
  '-translate-y-1 rotate-[0.6deg]',
  'translate-y-0.5 -rotate-1',
]

const mobileOffsets = [
  'ml-[2%] -rotate-1',
  'ml-[13%] rotate-1',
  'ml-[5%] -rotate-1',
  'ml-[17%] rotate-1',
  'ml-[8%] -rotate-1',
  'ml-[20%] rotate-1',
]

const markerColors = {
  home: '#dff7ef',
  about: '#dcecff',
  skills: '#c9f3e5',
  projects: '#dcecff',
  timeline: '#fff0c2',
  contact: '#bcebdc',
}

let markerReady = false

function setItemRef(el, index) {
  if (el) itemRefs.value[index] = el
}

function updateMarker(animate = true) {
  nextTick(() => {
    const nav = navRef.value
    const marker = markerRef.value
    const target = itemRefs.value[activeIndex.value]
    if (!nav || !marker || !target) return

    const navRect = nav.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const values = {
      x: targetRect.left - navRect.left,
      y: targetRect.top - navRect.top,
      width: targetRect.width,
      height: targetRect.height,
      backgroundColor: markerColors[props.activeId] ?? markerColors.home,
    }

    if (!markerReady || !animate || reducedMotion()) {
      gsap.set(marker, values)
      markerReady = true
      return
    }
    gsap.to(marker, { ...values, duration: 0.48, ease: 'power3.out', overwrite: 'auto' })
  })
}

function go(id) {
  menuOpen.value = false
  emit('navigate', id)
}

watch(() => props.activeId, () => updateMarker(true), { flush: 'post' })

onMounted(() => {
  updateMarker(false)
  window.addEventListener('resize', updateMarker)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMarker)
  if (markerRef.value) gsap.killTweensOf(markerRef.value)
})
</script>

<template>
  <header class="fixed left-0 right-0 top-0 z-[90] px-5 md:px-8">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/20 to-transparent" />
    <div class="relative mx-auto flex h-20 max-w-[1380px] items-center justify-between">
      <button class="group relative z-10 flex items-center gap-3 focus-visible:outline-none" aria-label="前往首页" @click="go('home')">
        <span class="relative flex h-9 w-9 -rotate-3 items-center justify-center rounded-[44%_56%_39%_61%] bg-[#15201d] text-[10px] font-extrabold text-white transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
          SN
          <i class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#59d6b3]" />
        </span>
        <span class="hidden rotate-[0.5deg] text-left sm:block">
          <span class="block text-[11px] font-bold leading-none text-[#15201d]">SHAWN NIU</span>
          <span class="mt-1 block font-mono text-[8px] uppercase tracking-[0.14em] text-muted">Digital studio</span>
        </span>
      </button>

      <nav ref="navRef" class="relative hidden h-12 items-center gap-0.5 md:flex" aria-label="主导航">
        <span ref="markerRef" class="pointer-events-none absolute left-0 top-0 z-0 opacity-70" style="clip-path: polygon(7% 7%, 96% 0, 100% 75%, 82% 100%, 0 86%)" />
        <svg class="pointer-events-none absolute bottom-[1px] left-4 right-4 z-0 h-3 w-[calc(100%-2rem)]" viewBox="0 0 600 12" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M0 7 C105 1 190 11 295 6 S490 1 600 7" stroke="rgba(21,32,29,.16)" />
        </svg>
        <button
          v-for="(page, index) in pages"
          :key="page.id"
          :ref="el => setItemRef(el, index)"
          class="group relative z-10 flex h-9 items-center px-4 text-[11px] font-semibold transition-[color,transform] duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#15201d]/40 lg:px-5"
          :class="[desktopOffsets[index], activeId === page.id ? 'text-[#15201d]' : 'text-muted hover:text-[#15201d]']"
          :aria-current="activeId === page.id ? 'page' : undefined"
          @click="go(page.id)">
          <span :class="activeId === page.id ? 'translate-y-[-1px]' : ''">{{ page.label }}</span>
          <i class="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300" :class="activeId === page.id ? 'h-1 w-6 bg-[#15201d] opacity-100' : 'h-1 w-1 bg-[#88bcae] opacity-65 group-hover:w-2 group-hover:bg-[#59d6b3]'" />
        </button>
      </nav>

      <div class="relative z-10 flex items-center gap-2">
        <span class="hidden -rotate-1 items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#267f68] sm:flex">
          <i class="h-1.5 w-1.5 rounded-full bg-[#59d6b3]" /> Open to learn
        </span>
        <button class="flex h-10 w-10 rotate-3 items-center justify-center rounded-[45%_55%_40%_60%] text-[#15201d] transition-colors hover:bg-white/45 md:hidden" :aria-expanded="menuOpen" :aria-label="menuOpen ? '关闭导航' : '打开导航'" @click="menuOpen = !menuOpen">
          <X v-if="menuOpen" class="size-4" />
          <Menu v-else class="size-4" />
        </button>
      </div>

      <svg class="pointer-events-none absolute -bottom-1 left-0 h-5 w-full" viewBox="0 0 1380 20" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path d="M0 11 C260 2 410 20 650 9 S1090 1 1380 12" stroke="rgba(21,32,29,.12)" />
      </svg>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="nav-menu">
      <div v-if="menuOpen" class="fixed inset-0 z-40 overflow-hidden bg-[#f2faf7]/96 px-6 pt-24 backdrop-blur-2xl md:hidden">
        <div class="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full border-[52px] border-[#5da9ff]/10" />
        <div class="pointer-events-none absolute -bottom-16 -left-20 h-72 w-72 rotate-12 bg-[#c9f3e5]/65" style="clip-path: polygon(18% 0, 100% 22%, 80% 100%, 0 76%)" />
        <nav class="relative mx-auto h-[min(68vh,560px)] w-full max-w-md" aria-label="手机主导航">
          <svg class="pointer-events-none absolute left-2 top-2 h-[96%] w-[72%]" viewBox="0 0 280 560" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path d="M48 0 C205 62 30 145 166 224 S72 380 224 560" stroke="#8bcbb7" stroke-width="1.2" stroke-dasharray="4 7" />
          </svg>
          <button
            v-for="(page, index) in pages"
            :key="page.id"
            class="group relative flex h-[15.5%] w-[78%] items-center gap-4 text-left focus-visible:outline-none"
            :class="mobileOffsets[index]"
            :aria-current="activeId === page.id ? 'page' : undefined"
            @click="go(page.id)">
            <span class="relative z-10 shrink-0 rounded-[43%_57%_39%_61%] transition-all duration-300" :class="activeId === page.id ? 'h-3 w-8 rotate-6 bg-[#15201d] shadow-[0_0_0_7px_rgba(89,214,179,.18)]' : 'h-3 w-3 border border-[#8bcbb7] bg-white/90 group-hover:scale-125'" />
            <span class="relative text-2xl font-extrabold tracking-[-0.04em]" :class="activeId === page.id ? 'text-[#15201d]' : 'text-[#70807b]'">
              {{ page.label }}
              <i v-if="activeId === page.id" class="absolute -bottom-2 left-0 h-2 w-[118%] -rotate-2 bg-[#dcecff]" style="clip-path: polygon(0 18%, 100% 0, 92% 100%, 4% 80%)" />
            </span>
          </button>
        </nav>
        <div class="mx-auto flex max-w-md items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-[#267f68]">
          <span>Swipe or choose</span>
          <span class="flex items-center gap-2"><i class="h-1.5 w-1.5 rounded-full bg-[#59d6b3]" /> Open to learn</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.nav-menu-enter-active,
.nav-menu-leave-active { transition: opacity .3s ease; }
.nav-menu-enter-active nav { transition: transform .45s cubic-bezier(.22,1,.36,1); }
.nav-menu-enter-from,
.nav-menu-leave-to { opacity: 0; }
.nav-menu-enter-from nav { transform: translateY(18px) rotate(-1deg); }
</style>
