<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  activeIndex: {
    type: Number,
    default: -1,
  },
})

const canvasRef = ref(null)
const rootRef = ref(null)
let renderer = null
let frame = null
let resizeObserver = null
const cleanup = []

onMounted(async () => {
  if (!canvasRef.value || !rootRef.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let THREE
  try {
    THREE = await import('three')
  } catch {
    return
  }

  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true, powerPreference: 'high-performance' })
  } catch {
    return
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 0, 7)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))

  const group = new THREE.Group()
  scene.add(group)

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.18, 1),
    new THREE.MeshBasicMaterial({ color: 0x59d6b3, wireframe: true, transparent: true, opacity: 0.72 }),
  )
  group.add(core)

  const inner = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.63, 0),
    new THREE.MeshBasicMaterial({ color: 0x5da9ff, transparent: true, opacity: 0.18, depthWrite: false }),
  )
  group.add(inner)

  const rings = [1.65, 2.05, 2.38].map((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.008, 6, 120),
      new THREE.MeshBasicMaterial({ color: index === 1 ? 0x5da9ff : 0x8dcfb9, transparent: true, opacity: 0.45 }),
    )
    ring.rotation.set(index * 0.65 + 0.25, index * 0.7, index * 0.35)
    group.add(ring)
    return ring
  })

  const nodePositions = [
    [-2.05, 0.7, 0.2], [1.9, 1.15, -0.15], [2.2, -0.7, 0.25],
    [-1.55, -1.55, -0.2], [0.1, 2.1, 0.1], [0.55, -2.05, 0.25],
  ]
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x9abbb0, transparent: true, opacity: 0.3 })
  const nodes = nodePositions.map((position, index) => {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(index % 2 ? 0.09 : 0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: index % 2 ? 0x5da9ff : 0x59d6b3, transparent: true, opacity: 1 }),
    )
    node.position.set(...position)
    group.add(node)
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), node.position])
    group.add(new THREE.Line(geometry, lineMaterial))
    return node
  })

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  function onPointerMove(event) {
    const rect = rootRef.value.getBoundingClientRect()
    pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7
    pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 0.55
  }
  rootRef.value.addEventListener('pointermove', onPointerMove)
  cleanup.push(() => rootRef.value?.removeEventListener('pointermove', onPointerMove))

  function resize() {
    const rect = rootRef.value.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    renderer.setSize(rect.width, rect.height, false)
    camera.aspect = rect.width / rect.height
    camera.updateProjectionMatrix()
  }
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(rootRef.value)
  resize()

  const clock = new THREE.Clock()
  function render() {
    const time = clock.getElapsedTime()
    pointer.x += (pointer.tx - pointer.x) * 0.055
    pointer.y += (pointer.ty - pointer.y) * 0.055
    group.rotation.y = time * 0.12 + pointer.x
    group.rotation.x = time * 0.055 + pointer.y
    core.rotation.z = time * 0.1
    inner.rotation.x = -time * 0.28
    inner.rotation.y = time * 0.22
    rings.forEach((ring, index) => { ring.rotation.z += 0.0008 * (index + 1) })
    const selected = props.activeIndex
    nodes.forEach((node, index) => {
      const idle = selected < 0
      const on = selected === index
      const pulse = 1 + Math.sin(time * 1.3 + index) * 0.12
      node.scale.setScalar(idle ? pulse : on ? 1.85 : 0.72)
      node.material.opacity = idle ? 1 : on ? 1 : 0.18
    })
    core.material.opacity = selected < 0 ? 0.72 : 0.42
    inner.material.opacity = selected < 0 ? 0.18 : 0.08
    renderer.render(scene, camera)
    frame = requestAnimationFrame(render)
  }
  render()

  cleanup.push(() => {
    cancelAnimationFrame(frame)
    resizeObserver?.disconnect()
    scene.traverse(object => {
      object.geometry?.dispose?.()
      if (Array.isArray(object.material)) object.material.forEach(material => material.dispose())
      else object.material?.dispose?.()
    })
    renderer.dispose()
  })
})

onUnmounted(() => cleanup.forEach(fn => fn()))
</script>

<template>
  <div ref="rootRef" class="relative h-full w-full">
    <div class="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#59d6b3]/35 md:h-64 md:w-64">
      <span class="absolute inset-6 rotate-45 rounded-[2.5rem] border border-[#5da9ff]/30" />
      <span class="absolute inset-[30%] rounded-2xl border border-[#15201d]/15 bg-white/25 rotate-12" />
      <i class="absolute -left-1 top-1/2 h-2 w-2 rounded-full bg-[#59d6b3]" />
      <i class="absolute -right-1 top-1/3 h-2 w-2 rounded-full bg-[#5da9ff]" />
      <i class="absolute bottom-2 left-1/3 h-2 w-2 rounded-full bg-[#59d6b3]" />
    </div>
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true" />
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div class="h-32 w-32 rounded-full bg-[#59d6b3]/20 blur-3xl" />
    </div>
  </div>
</template>
