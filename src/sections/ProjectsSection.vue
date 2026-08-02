<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ArrowUpRight } from '@lucide/vue'
import ProjectPreview from '@/components/ProjectPreview.vue'
import { projects } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const emit = defineEmits(['openProject'])
const rootRef = ref(null)
const activeIndex = ref(0)
const direction = ref(1)
const activeProject = computed(() => projects[activeIndex.value])
const selectorOffsets = ['lg:translate-x-1 lg:-rotate-2', 'lg:translate-x-6 lg:rotate-1', 'lg:translate-x-2 lg:-rotate-1', 'lg:translate-x-8 lg:rotate-2']
const techRotations = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1', 'rotate-1']
const projectThemes = {
  agent: { stage: '#d9f4eb', glow: 'rgba(89,214,179,.22)', clip: 'polygon(9% 0,100% 4%,96% 88%,74% 100%,4% 94%,0 16%)', tilt: 'rotate-[-2deg]' },
  dance: { stage: '#c9ddf1', glow: 'rgba(35,64,80,.16)', clip: 'polygon(3% 8%,94% 0,100% 78%,88% 100%,0 92%)', tilt: 'rotate-[1.5deg]' },
  music: { stage: '#f7dfbd', glow: 'rgba(171,108,196,.17)', clip: 'polygon(8% 0,100% 10%,94% 100%,15% 94%,0 68%,3% 18%)', tilt: 'rotate-[-1deg]' },
  portfolio: { stage: '#dcecff', glow: 'rgba(93,169,255,.2)', clip: 'polygon(5% 3%,96% 0,100% 87%,82% 100%,0 92%)', tilt: 'rotate-[2deg]' },
}
const activeTheme = computed(() => projectThemes[activeProject.value.preview] ?? projectThemes.portfolio)
let ctx = null
let onPointerMove = null

function select(index) {
  if (index === activeIndex.value) return
  direction.value = index > activeIndex.value ? 1 : -1
  activeIndex.value = index
}

function enterCard(el, done) {
  gsap.fromTo(el, { autoAlpha: 0, x: reducedMotion() ? 0 : direction.value * 40 }, { autoAlpha: 1, x: 0, duration: reducedMotion() ? 0 : 0.5, ease: 'power3.out', onComplete: done })
  const number = el.querySelector('.project-number')
  if (number && !reducedMotion()) {
    gsap.fromTo(number, { yPercent: direction.value * 55, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.65, ease: 'power3.out' })
  }
}

function leaveCard(el, done) {
  gsap.to(el, { autoAlpha: 0, x: reducedMotion() ? 0 : direction.value * -22, duration: reducedMotion() ? 0 : 0.2, ease: 'power2.in', onComplete: done })
}

onMounted(() => {
  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.project-enter', { autoAlpha: 1 })
      return
    }
    gsap.fromTo('.project-enter', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out', delay: 0.2 })
  }, rootRef.value)

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion()) return
  onPointerMove = (event) => {
    const preview = rootRef.value?.querySelector('.product-window')
    if (!preview) return
    const rect = preview.getBoundingClientRect()
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
    const x = inside ? (event.clientX - rect.left) / rect.width - 0.5 : 0
    const y = inside ? (event.clientY - rect.top) / rect.height - 0.5 : 0
    gsap.to(preview, { rotationY: x * 4, rotationX: -y * 4, duration: 0.5, ease: 'power3.out', transformPerspective: 1200, overwrite: 'auto' })
  }
  document.addEventListener('mousemove', onPointerMove)
})

onUnmounted(() => {
  ctx?.revert()
  if (onPointerMove) document.removeEventListener('mousemove', onPointerMove)
})
</script>

<template>
  <section ref="rootRef" id="projects" class="relative flex h-full items-center overflow-hidden bg-[#edf6ff] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
    <div class="absolute -right-20 top-[5%] h-[82vh] w-[56vw] rotate-[-5deg] border border-white/80 bg-white/40" style="clip-path: polygon(12% 0, 100% 7%, 94% 88%, 62% 100%, 7% 93%, 0 18%)" />
    <div class="absolute left-[17%] top-[18%] h-24 w-32 rotate-12 transition-colors duration-500" :style="{ backgroundColor: activeTheme.glow, clipPath: 'polygon(12% 0,100% 22%,83% 100%,0 71%)' }" />
    <div class="absolute right-[14%] top-[24%] h-72 w-72 rounded-full blur-3xl transition-colors duration-500" :style="{ backgroundColor: activeTheme.glow }" />
    <span class="absolute -bottom-12 left-[35%] text-[20vw] font-extrabold leading-none tracking-[-0.1em] text-[#5da9ff]/[0.045]">WORK</span>

    <div class="relative z-10 mx-auto grid w-full max-w-[1360px] gap-5 lg:grid-cols-[0.2fr_1.8fr] lg:gap-5">
      <aside class="project-enter flex items-center justify-between lg:flex-col lg:items-start lg:justify-center">
        <div>
          <span class="metadata text-[#3975b9]">Selected work</span>
          <p class="mt-1 text-xs font-bold text-[#15201d]">真实项目</p>
        </div>
        <div class="flex gap-2 lg:mt-8 lg:grid lg:w-full lg:gap-2">
          <button v-for="(project, index) in projects" :key="project.id" class="group relative flex items-center gap-2 rounded-full border px-2.5 py-2 transition-all lg:w-[118%] lg:rounded-none lg:border-0 lg:bg-transparent lg:px-4 lg:py-2.5" :class="[selectorOffsets[index], index === activeIndex ? 'border-[#15201d] bg-[#15201d] text-white lg:text-[#15201d]' : 'border-white bg-white/60 text-muted lg:hover:text-[#3975b9]']" :aria-label="`查看${project.title}`" @click="select(index)">
            <i class="absolute bottom-0 left-0 right-[14%] hidden h-px origin-left transition-transform duration-300 lg:block" :class="index === activeIndex ? 'scale-x-100 bg-[#15201d]' : 'scale-x-50 bg-[#bcd2e8] group-hover:scale-x-100'" />
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-[45%_55%_42%_58%] font-mono text-[8px]" :class="index === activeIndex ? 'bg-[#15201d] text-[#59d6b3]' : 'bg-white text-[#3975b9]'">{{ project.number }}</span>
            <span class="whitespace-nowrap text-[11px] font-bold lg:text-xs">{{ project.navTitle }}</span>
          </button>
        </div>
      </aside>

      <Transition mode="out-in" :css="false" @enter="enterCard" @leave="leaveCard">
        <article :key="activeProject.id" class="project-enter grid min-h-[520px] overflow-visible md:min-h-[610px] lg:grid-cols-[0.84fr_1.16fr]">
          <div class="relative z-20 flex flex-col justify-center p-5 md:p-8 lg:p-10 lg:pr-0">
            <span class="project-number absolute right-4 top-0 rotate-6 text-[8rem] font-extrabold leading-none text-[#5da9ff]/[0.08] md:text-[12rem] lg:-right-20 lg:text-[16rem]">{{ activeProject.number }}</span>
            <div class="relative z-10">
              <div class="flex items-center gap-3"><span class="flex -rotate-3 items-center gap-2 bg-[#dff7ef] px-3 py-1 font-mono text-[8px] text-[#267f68]" style="clip-path: polygon(6% 0, 100% 14%, 94% 100%, 0 82%)"><i class="h-1.5 w-1.5 rounded-full bg-[#59d6b3]" />{{ activeProject.status }}</span><span class="metadata rotate-2 text-muted">Project {{ activeProject.number }}</span></div>
              <p class="mt-6 inline-block -rotate-1 metadata text-[#3975b9]">{{ activeProject.subtitle }}</p>
              <h2 class="relative mt-3 max-w-2xl text-3xl font-extrabold leading-[0.98] tracking-[-0.05em] text-[#15201d] md:text-5xl lg:-mr-24 lg:-rotate-1"><span class="block">{{ activeProject.titleLead }}</span><span class="block">{{ activeProject.titleTail }}</span></h2>
              <p class="mt-5 max-w-xl text-xs leading-6 text-muted md:text-sm md:leading-7">{{ activeProject.description }}</p>
              <div class="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                <span v-for="(tech,index) in activeProject.tech.slice(0, 5)" :key="tech" class="inline-block font-mono text-[8px] text-muted" :class="techRotations[index]">{{ tech }}</span>
              </div>
              <div class="mt-5 h-32 max-w-xl overflow-hidden border border-[#bfd7ef] bg-white/55 px-3 md:mt-6 md:h-40 md:px-4 lg:hidden" style="clip-path: polygon(3% 0, 97% 5%, 100% 82%, 90% 100%, 0 92%)">
                <ProjectPreview :key="`compact-${activeProject.id}`" :project="activeProject" compact />
              </div>
              <button v-magnetic="{ strength: 0.14, radius: 110 }" class="studio-button-primary mt-7 -rotate-1" @click="emit('openProject', activeProject)">项目详情 <ArrowUpRight class="size-4" /></button>
            </div>
          </div>

          <div class="project-stage relative hidden overflow-hidden transition-colors duration-500 lg:block" :style="{ backgroundColor: activeTheme.stage, clipPath: activeTheme.clip }">
            <ProjectPreview :key="activeProject.id" :project="activeProject" class="product-window absolute left-[7%] top-[8%] h-[84%] w-[88%] will-change-transform" :class="activeTheme.tilt" />
          </div>
        </article>
      </Transition>

      <div class="project-enter lg:hidden">
        <span class="metadata text-muted">{{ activeProject.number }} / {{ String(projects.length).padStart(2,'0') }}</span>
      </div>
    </div>
  </section>
</template>
