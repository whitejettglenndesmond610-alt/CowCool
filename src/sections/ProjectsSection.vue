<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ArrowUpRight, ChevronLeft, ChevronRight } from '@lucide/vue'
import ProjectFlow from '@/components/ProjectFlow.vue'
import { projects } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const emit = defineEmits(['openProject'])
const rootRef = ref(null)
const activeIndex = ref(0)
const direction = ref(1)
const activeProject = computed(() => projects[activeIndex.value])
const selectorOffsets = ['lg:translate-x-1 lg:-rotate-2', 'lg:translate-x-8 lg:rotate-2']
const techRotations = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1', 'rotate-1']
let ctx = null
let onPointerMove = null

function select(index) {
  if (index === activeIndex.value) return
  direction.value = index > activeIndex.value ? 1 : -1
  activeIndex.value = index
}

function previous() { select((activeIndex.value - 1 + projects.length) % projects.length) }
function next() { select((activeIndex.value + 1) % projects.length) }

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
    <div class="absolute left-[17%] top-[18%] h-24 w-32 rotate-12 bg-[#c9f3e5]/40" style="clip-path: polygon(12% 0, 100% 22%, 83% 100%, 0 71%)" />
    <span class="absolute -bottom-12 left-[35%] text-[20vw] font-extrabold leading-none tracking-[-0.1em] text-[#5da9ff]/[0.045]">WORK</span>

    <div class="relative z-10 mx-auto grid w-full max-w-[1360px] gap-5 lg:grid-cols-[0.2fr_1.8fr] lg:gap-5">
      <aside class="project-enter flex items-center justify-between lg:flex-col lg:items-start lg:justify-center">
        <div>
          <span class="metadata text-[#3975b9]">Selected work</span>
          <p class="mt-1 text-xs font-bold text-[#15201d]">真实项目</p>
        </div>
        <div class="flex gap-2 lg:mt-12 lg:grid lg:w-full lg:gap-5">
          <button v-for="(project, index) in projects" :key="project.id" class="group relative flex items-center gap-2 rounded-full border px-3 py-2 transition-all lg:w-[115%] lg:rounded-none lg:border-0 lg:bg-transparent lg:px-4 lg:py-3" :class="[selectorOffsets[index], index === activeIndex ? 'border-[#15201d] bg-[#15201d] text-white lg:text-[#15201d]' : 'border-white bg-white/60 text-muted lg:hover:text-[#3975b9]']" @click="select(index)">
            <i class="absolute bottom-0 left-0 right-[14%] hidden h-px origin-left transition-transform duration-300 lg:block" :class="index === activeIndex ? 'scale-x-100 bg-[#15201d]' : 'scale-x-50 bg-[#bcd2e8] group-hover:scale-x-100'" />
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-[45%_55%_42%_58%] font-mono text-[8px]" :class="index === activeIndex ? 'bg-[#15201d] text-[#59d6b3]' : 'bg-white text-[#3975b9]'">{{ project.number }}</span>
            <span class="hidden text-xs font-bold lg:inline">{{ project.title }}</span>
          </button>
        </div>
        <div class="hidden gap-2 lg:flex">
          <button class="icon-button" aria-label="上一个项目" @click="previous"><ChevronLeft class="size-4" /></button>
          <button class="icon-button" aria-label="下一个项目" @click="next"><ChevronRight class="size-4" /></button>
        </div>
      </aside>

      <Transition mode="out-in" :css="false" @enter="enterCard" @leave="leaveCard">
        <article :key="activeProject.id" class="project-enter grid min-h-[520px] overflow-visible md:min-h-[610px] lg:grid-cols-[0.84fr_1.16fr]">
          <div class="relative z-20 flex flex-col justify-center p-5 md:p-8 lg:p-10 lg:pr-0">
            <span class="project-number absolute right-4 top-0 rotate-6 text-[8rem] font-extrabold leading-none text-[#5da9ff]/[0.08] md:text-[12rem] lg:-right-20 lg:text-[16rem]">{{ activeProject.number }}</span>
            <div class="relative z-10">
              <div class="flex items-center gap-3"><span class="flex -rotate-3 items-center gap-2 bg-[#dff7ef] px-3 py-1 font-mono text-[8px] text-[#267f68]" style="clip-path: polygon(6% 0, 100% 14%, 94% 100%, 0 82%)"><i class="h-1.5 w-1.5 rounded-full bg-[#59d6b3]" />{{ activeProject.status }}</span><span class="metadata rotate-2 text-muted">Project {{ activeProject.number }}</span></div>
              <p class="mt-6 inline-block -rotate-1 metadata text-[#3975b9]">{{ activeProject.subtitle }}</p>
              <h2 class="relative mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-[-0.05em] text-[#15201d] md:text-5xl lg:-mr-24 lg:-rotate-1"><template v-if="activeProject.id === 'local-rag'">多知识库本地 AI <span class="whitespace-nowrap">问答系统</span></template><template v-else>{{ activeProject.title }}</template></h2>
              <p class="mt-5 max-w-xl text-xs leading-6 text-muted md:text-sm md:leading-7">{{ activeProject.description }}</p>
              <div class="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                <span v-for="(tech,index) in activeProject.tech.slice(0, 5)" :key="tech" class="inline-block font-mono text-[8px] text-muted" :class="techRotations[index]">{{ tech }}</span>
              </div>
              <div class="mt-6 hidden h-40 max-w-xl overflow-hidden border border-[#bfd7ef] bg-white/55 px-4 md:block lg:hidden" style="clip-path: polygon(3% 0, 97% 5%, 100% 82%, 90% 100%, 0 92%)">
                <ProjectFlow :key="`compact-${activeProject.id}`" :project-id="activeProject.id" />
              </div>
              <button v-magnetic="{ strength: 0.14, radius: 110 }" class="studio-button-primary mt-7 -rotate-1" @click="emit('openProject', activeProject)">项目详情 <ArrowUpRight class="size-4" /></button>
            </div>
          </div>

          <div class="project-stage relative hidden overflow-hidden bg-[#dcecff] lg:block" style="clip-path: polygon(9% 0, 100% 4%, 96% 88%, 74% 100%, 4% 94%, 0 16%)">
            <div class="absolute inset-0" style="background-image:radial-gradient(circle,rgba(57,117,185,.2) 1px,transparent 1px);background-size:20px 20px" />
            <span class="absolute right-[4%] top-[8%] z-20 rotate-6 bg-[#ffc964] px-3 py-1 font-mono text-[8px] text-[#72500f]">BUILD / TEST / SHIP</span>
            <div class="product-window absolute left-[9%] top-[11%] h-[78%] w-[84%] rotate-[-3deg] overflow-hidden rounded-[2.5rem_1rem_3rem_1.5rem] border-4 border-white bg-white shadow-[0_35px_80px_rgba(57,117,185,.2)] will-change-transform">
              <div class="flex h-12 items-center justify-between border-b border-stroke px-5"><div class="flex gap-1.5"><i class="h-2 w-2 rounded-full bg-[#ff8d82]"/><i class="h-2 w-2 rounded-full bg-[#ffd56a]"/><i class="h-2 w-2 rounded-full bg-[#59d6b3]"/></div><span class="metadata text-muted">{{ activeProject.id }}.studio</span></div>
              <div class="grid h-[calc(100%-3rem)] grid-cols-[0.3fr_0.7fr]">
                <div class="border-r border-stroke bg-[#f8fbfa] p-4"><p class="metadata text-[#3975b9]">System</p><div class="mt-5 grid gap-2"><span v-for="(item,index) in activeProject.highlights" :key="item" class="h-8 rounded-lg" :class="index === activeIndex ? 'bg-[#dff7ef]' : 'border border-stroke bg-white'"/></div></div>
                <div class="p-6"><div class="flex justify-between"><span class="h-3 w-28 rounded-full bg-[#15201d]"/><span class="h-7 w-16 rounded-full bg-[#5da9ff]"/></div><div class="mt-7 h-[64%] rounded-3xl bg-[#f5f8f7] px-3"><ProjectFlow :key="activeProject.id" :project-id="activeProject.id" /></div></div>
              </div>
            </div>
          </div>
        </article>
      </Transition>

      <div class="project-enter flex items-center justify-between lg:hidden">
        <span class="metadata text-muted">{{ activeProject.number }} / {{ String(projects.length).padStart(2,'0') }}</span>
        <div class="flex gap-2"><button class="icon-button" @click="previous"><ChevronLeft class="size-4"/></button><button class="icon-button" @click="next"><ChevronRight class="size-4"/></button></div>
      </div>
    </div>
  </section>
</template>
