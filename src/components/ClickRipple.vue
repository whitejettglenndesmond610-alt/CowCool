<script setup>
import { onMounted, onUnmounted } from 'vue'

let container

function createRipple(e) {
  if (e.target.closest('button, a, .project-card, input, textarea, .skill-tag')) return

  const ripple = document.createElement('div')
  const size = 30
  ripple.style.cssText = `
    position: fixed;
    left: ${e.clientX - size / 2}px;
    top: ${e.clientY - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    border: 1.5px solid rgba(0, 200, 232, 0.5);
    pointer-events: none;
    z-index: 9998;
    animation: click-ripple 0.7s ease-out forwards;
  `
  container.appendChild(ripple)
  ripple.addEventListener('animationend', () => ripple.remove())
}

onMounted(() => {
  container = document.body
  document.addEventListener('click', createRipple)
})

onUnmounted(() => {
  document.removeEventListener('click', createRipple)
})
</script>

<template>
  <div />
</template>

<style>
@keyframes click-ripple {
  0% {
    transform: scale(0);
    opacity: 0.8;
    border-width: 1.5px;
  }
  100% {
    transform: scale(3);
    opacity: 0;
    border-width: 0.2px;
  }
}
</style>
