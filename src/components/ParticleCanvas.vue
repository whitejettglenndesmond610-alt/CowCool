<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const canvasRef = ref(null)
let animationId = null
let particles = []
const mouse = { x: -1000, y: -1000 }
let ctx = null
let canvas = null
const count = window.innerWidth > 1200 ? 80 : window.innerWidth > 768 ? 40 : 25

function initParticles() {
  particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    })
  }
}

function updateParticles() {
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < -10) p.x = canvas.width + 10
    if (p.x > canvas.width + 10) p.x = -10
    if (p.y < -10) p.y = canvas.height + 10
    if (p.y > canvas.height + 10) p.y = -10

    const dx = p.x - mouse.x
    const dy = p.y - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 120 && dist > 0) {
      const force = ((120 - dist) / 120) * 0.8
      p.vx += (dx / dist) * force
      p.vy += (dy / dist) * force
    }
    p.vx *= 0.999
    p.vy *= 0.999
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
    if (speed > 1.2) {
      p.vx = (p.vx / speed) * 1.2
      p.vy = (p.vy / speed) * 1.2
    }
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 130) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(78,133,191,${0.08 * (1 - dist / 130)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    const dx = p.x - mouse.x
    const dy = p.y - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    let color = `rgba(200,210,255,${p.opacity})`
    if (dist < 180) color = `rgba(0,210,255,${p.opacity + 0.2})`
    ctx.fillStyle = color
    ctx.fill()
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  updateParticles()
  drawConnections()
  drawParticles()
  animationId = requestAnimationFrame(animate)
}

function onMouseDown(e) {
  const x = e.clientX
  const y = e.clientY
  for (const p of particles) {
    const dx = p.x - x
    const dy = p.y - y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 200 && dist > 0) {
      const force = (1 - dist / 200) * 5
      p.vx += (dx / dist) * force
      p.vy += (dy / dist) * force
    }
  }
}

function onMouseMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

function onMouseLeave() {
  mouse.x = -1000
  mouse.y = -1000
}

function onResize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

onMounted(() => {
  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initParticles()
  animate()

  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('resize', onResize)
  document.addEventListener('mousedown', onMouseDown)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('mousedown', onMouseDown)
})
</script>

<template>
  <canvas ref="canvasRef" id="particles" aria-hidden="true" />
</template>
