<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { reducedMotion } from '@/lib/animations.js'

const rootRef = ref(null)
const PALETTE = ['#5da9ff', '#59d6b3', '#7ec8ff']

let fluid = null
let canvas = null
let lastX = 0
let lastY = 0
let hiddenPaused = false
let cancelled = false

function splatFromEvent(event) {
  if (!fluid || !canvas) return
  const rect = canvas.getBoundingClientRect()
  if (!rect.width || !rect.height) return

  const x = event.clientX
  const y = event.clientY
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    lastX = x
    lastY = y
    return
  }

  const dx = (x - lastX) * 5
  const dy = (lastY - y) * 5
  lastX = x
  lastY = y
  if (Math.abs(dx) < 0.8 && Math.abs(dy) < 0.8) return

  const localX = (x - rect.left) * (canvas.width / rect.width)
  const localY = y - rect.top
  fluid.splatAtLocation(localX, localY, dx, dy)
}

function onPointerMove(event) {
  splatFromEvent(event)
}

function onVisibility() {
  if (!fluid) return
  if (document.hidden) {
    if (!hiddenPaused) hiddenPaused = fluid.togglePause()
    return
  }
  if (hiddenPaused) {
    fluid.togglePause()
    hiddenPaused = false
  }
}

onMounted(async () => {
  if (!rootRef.value || reducedMotion()) return

  let WebGLFluidEnhanced
  try {
    ({ default: WebGLFluidEnhanced } = await import('webgl-fluid-enhanced'))
  } catch {
    return
  }
  if (cancelled || !rootRef.value) return

  const mobile = window.matchMedia('(max-width: 767px)').matches

  try {
    fluid = new WebGLFluidEnhanced(rootRef.value)
    fluid.setConfig({
      simResolution: mobile ? 64 : 128,
      dyeResolution: mobile ? 256 : 512,
      densityDissipation: mobile ? 4.2 : 3.4,
      velocityDissipation: 0.7,
      pressure: 0.55,
      curl: 8,
      splatRadius: mobile ? 0.1 : 0.07,
      splatForce: 1400,
      shading: false,
      colorful: false,
      colorPalette: PALETTE,
      hover: false,
      backgroundColor: '#ffffff',
      transparent: false,
      brightness: 0.22,
      bloom: false,
      sunrays: false,
    })
    fluid.start()
  } catch {
    fluid = null
    return
  }
  if (cancelled) {
    try { fluid.stop() } catch {}
    fluid = null
    return
  }

  canvas = rootRef.value.querySelector('canvas')
  if (canvas) {
    canvas.style.pointerEvents = 'none'
    canvas.style.mixBlendMode = 'multiply'
    canvas.style.opacity = '0.28'
    canvas.setAttribute('aria-hidden', 'true')
  }

  lastX = window.innerWidth * 0.35
  lastY = window.innerHeight * 0.45

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
})

onUnmounted(() => {
  cancelled = true
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('visibilitychange', onVisibility)
  try {
    fluid?.stop()
  } catch {}
  fluid = null
  canvas = null
})
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div ref="rootRef" class="h-full w-full" />
  </div>
</template>
