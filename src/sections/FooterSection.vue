<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from '@lucide/vue'

const showButton = ref(false)

function onScroll() {
  showButton.value = window.scrollY > 500
}

let ticking = false
onMounted(() => {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { onScroll(); ticking = false })
      ticking = true
    }
  }, { passive: true })
  onScroll()
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="py-8 px-6 border-t border-t-white/[0.05]">
    <div class="max-w-[1200px] mx-auto flex justify-between items-center max-md:flex-col max-md:gap-4">
      <p class="text-sm text-white/40">&copy; 2026 Shawn Niu. 用好奇心和代码构建。</p>

      <Transition name="fade-up">
        <button v-if="showButton"
          class="w-11 h-11 rounded-full border border-white/[0.06] bg-white/[0.025] flex items-center justify-center text-white/60 hover:text-white hover:border-[#7c3aed] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(124,58,237,0.25)] transition-all duration-200"
          aria-label="回到顶部"
          @click="scrollToTop">
          <ArrowUp class="size-5" />
        </button>
      </Transition>
    </div>
  </footer>
</template>

<style scoped>
.fade-up-enter-active { transition: all 0.3s ease-out; }
.fade-up-leave-active { transition: all 0.2s ease-in; }
.fade-up-enter-from,
.fade-up-leave-to { opacity: 0; transform: translateY(10px); }
</style>
