<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'

onMounted(() => {
  const tl = gsap.timeline({
    onComplete: () => {
      const loader = document.querySelector('.page-loader')
      if (loader) {
        gsap.to(loader, {
          opacity: 0, duration: 0.6, ease: 'power2.in',
          onComplete: () => loader.remove()
        })
      }
    }
  })

  tl.fromTo('.loader-text', { opacity: 0, y: 20, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' })
    .to('.loader-text', { opacity: 0, y: -20, duration: 0.5, delay: 1.2, ease: 'power2.in' })
    .fromTo('.loader-bar', { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'expo.inOut' }, 0.3)
})
</script>

<template>
  <div class="page-loader fixed inset-0 z-[9999] bg-[#06080d] flex flex-col items-center justify-center gap-8">
    <div class="loader-text text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00c8e8] to-[#7c3aed]"
      style="font-family: Inter, sans-serif;">
      SHAWN NIU
    </div>
    <div class="loader-bar w-40 h-0.5 rounded-full bg-gradient-to-r from-[#00c8e8] to-[#7c3aed] origin-left" />
  </div>
</template>
