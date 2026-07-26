import gsap from 'gsap'

export const magneticDirective = {
  mounted(el, binding) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const strength = binding.value?.strength ?? 0.16
    const radius = binding.value?.radius ?? 90
    const setX = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
    const setY = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })

    function onMove(event) {
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      if (Math.hypot(dx, dy) <= radius) {
        setX(dx * strength)
        setY(dy * strength)
      } else {
        setX(0)
        setY(0)
      }
    }

    function reset() {
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)' })
    }

    document.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', reset)
    el._magneticCleanup = () => {
      document.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', reset)
    }
  },
  unmounted(el) {
    el._magneticCleanup?.()
  },
}
