<script setup>
import { watch, ref } from 'vue'
import gsap from 'gsap'

const props = defineProps({ toast: { type: Object, required: true } })

watch(() => props.toast.visible, (val) => {
  const el = document.querySelector('.toast')
  if (!el) return
  if (val) {
    gsap.killTweensOf(el)
    gsap.fromTo(el, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' })
  } else {
    gsap.to(el, { y: -20, opacity: 0, duration: 0.3, ease: 'expo.in' })
  }
})
</script>

<template>
  <div class="toast" aria-hidden="true">
    <span class="text-[#00c8e8] text-lg">✔</span>
    <span>{{ toast.message }}</span>
  </div>
</template>
