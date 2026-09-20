<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ArrowUpRight } from '@lucide/vue'
import ProjectPreview from '@/components/ProjectPreview.vue'
import { projects } from '@/data/portfolio.js'
import { pendingProjectId } from '@/lib/projectSelection.js'
import { reducedMotion } from '@/lib/animations.js'

const emit = defineEmits(['openProject'])
const rootRef = ref(null)
const activeIndex = ref(0)
const direction = ref(1)
const activeProject = computed(() => projects[activeIndex.value])
const selectorOffsets = ['lg:translate-x-1 lg:-rotate-2', 'lg:translate-x-6 lg:rotate-1', 'lg:translate-x-2 lg:-rotate-1', 'lg:translate-x-8 lg:rotate-2']
const techRotations = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1', 'rotate-1']
const projectThemes = {
  agent: { stage: '#d9f4eb', glow: 'rgba(89,214,179,.22)', clip: 'polygon(9% 0,100% 4%,96% 88%,74% 100%,4% 94%,0 16%)', tilt: 'rotate-[-2deg]', bg: '#e9f6f0', marker: '#a8e5cd' },
  dance: { stage: '#c9ddf1', glow: 'rgba(35,64,80,.16)', clip: 'polygon(3% 8%,94% 0,100% 78%,88% 100%,0 92%)', tilt: 'rotate-[1.5deg]', bg: '#e6f0fa', marker: '#a9c9e8' },
  music: { stage: '#f7dfbd', glow: 'rgba(171,108,196,.17)', clip: 'polygon(8% 0,100% 10%,94% 100%,15% 94%,0 68%,3% 18%)', tilt: 'rotate-[-1deg]', bg: '#f8f1e4', marker: '#f0cf9a' },
  portfolio: { stage: '#dcecff', glow: 'rgba(93,169,255,.2)', clip: 'polygon(5% 3%,96% 0,100% 87%,82% 100%,0 92%)', tilt: 'rotate-[2deg]', bg: '#edf6ff', marker: '#b9d9ff' },
}
const activeTheme = computed(() => projectThemes[activeProject.value.preview] ?? projectThemes.portfolio)
let ctx = null
let onPointerMove = null
const onResizeMarker = () => updateMarker(false)

// ===== 选择器滑动标记 =====
const selectorRef = ref(null)
const markerRef = ref(null)
const selectorRefs = []
let markerReady = false

function setSelectorRef(el, i) {
  if (el) selectorRefs[i] = el
}

function updateMarker(animate = true) {
  nextTick(() => {
    const box = selectorRef.value
    const marker = markerRef.value
    const target = selectorRefs[activeIndex.value]
    if (!box || !marker || !target) return
    const b = box.getBoundingClientRect()
    const t = target.getBoundingClientRect()
    const values = {
      x: t.left - b.left,
      y: t.top - b.top,
      width: t.width,
      height: t.height,
      backgroundColor: activeTheme.value.marker,
    }
    if (!markerReady || !animate || reducedMotion()) {
      gsap.set(marker, values)
      markerReady = true
      return
    }
    gsap.to(marker, { ...values, duration: 0.48, ease: 'power3.out', overwrite: 'auto' })
  })
}

function select(index) {
  if (index === activeIndex.value) return
  direction.value = index > activeIndex.value ? 1 : -1
  activeIndex.value = index
}

watch(activeIndex, () => updateMarker(true))

// ===== 按项目类型定制的窗口登场 =====
// Agent Bench → 模块拼装:遮罩格随机翻缩消失,像 dashboard 模块依次上线
function fxAgent(tl, el) {
  const wipe = el.querySelector('.preview-wipe')
  const wrap = el.querySelector('.fx-tiles')
  const tiles = el.querySelectorAll('.fx-tile')
  if (!wipe || !wrap || !tiles.length) return
  tl.set(wipe, { autoAlpha: 0 }, 0.05)
    .set(wrap, { opacity: 1 }, 0.05)
    .set(wipe, { autoAlpha: 1 }, 0.12)
    .to(tiles, { scale: 0, autoAlpha: 0, duration: 0.45, stagger: { each: 0.045, from: 'random' }, ease: 'back.in(1.6)' }, 0.15)
    .set(wrap, { opacity: 0 }, 1.0)
}

// Dance Focus → 光圈快门:圆形光圈从中心打开
function fxDance(tl, el) {
  const wipe = el.querySelector('.preview-wipe')
  if (!wipe) return
  tl.fromTo(wipe,
    { clipPath: 'circle(0% at 50% 50%)', rotation: -3 },
    { clipPath: 'circle(140% at 50% 50%)', rotation: 0, duration: 0.8, ease: 'power2.inOut' }, 0.05)
}

// AuraMuse → 声波柱阵:均衡器柱随机升起铺满,再落下揭示新窗口
function fxMusic(tl, el) {
  const wipe = el.querySelector('.preview-wipe')
  const wrap = el.querySelector('.fx-bars')
  const bars = el.querySelectorAll('.fx-bar')
  if (!wipe || !wrap || !bars.length) return
  tl.set(wipe, { autoAlpha: 0 }, 0.05)
    .set(wrap, { opacity: 1 }, 0.05)
    .to(bars, { scaleY: 1, duration: 0.22, stagger: { each: 0.025, from: 'random' }, ease: 'power2.out' }, 0.05)
    .set(wipe, { autoAlpha: 1 }, 0.5)
    .to(bars, { scaleY: 0, duration: 0.32, stagger: { each: 0.025, from: 'random' }, ease: 'power3.in' }, 0.58)
    .set(wrap, { opacity: 0 }, 1.15)
}

// 作品集网站 → 标签页放大:小圆角卡片弹性放大到全尺寸
function fxPortfolio(tl, el) {
  const wipe = el.querySelector('.preview-wipe')
  if (!wipe) return
  tl.fromTo(wipe,
    { scale: 0.25, y: 60, borderRadius: '42px', autoAlpha: 0, transformOrigin: 'center center' },
    { scale: 1, y: 0, borderRadius: '0px', autoAlpha: 1, duration: 0.75, ease: 'back.out(1.3)', clearProps: 'transform,borderRadius,opacity,visibility' }, 0.05)
}

const previewFx = { agent: fxAgent, dance: fxDance, music: fxMusic, portfolio: fxPortfolio }

// ===== 标题:按项目类型定制 =====
function charsOf(str) {
  return str.split('')
}

// Agent Bench → 终端打印:逐字阶梯出现 + 方块光标
function titleAgent(tl, el) {
  const chars = el.querySelectorAll('.title-char')
  const caret = el.querySelector('.title-caret')
  if (caret) tl.call(() => caret.classList.add('caret-blink'), [], 0)
  tl.fromTo(chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: 0.035, ease: 'none' }, 0)
  if (caret) tl.call(() => caret.classList.remove('caret-blink'), [], chars.length * 0.035 + 0.35)
}

// Dance Focus → 对焦:失焦拉回清晰
function titleDance(tl, el) {
  const wrap = el.querySelector('.title-wrap')
  if (!wrap) return
  tl.fromTo(wrap,
    { autoAlpha: 0.35, scale: 1.06, filter: 'blur(10px)' },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out', clearProps: 'filter,scale,opacity,visibility' }, 0)
}

// AuraMuse → 音符弹跳:逐字弹起
function titleMusic(tl, el) {
  const chars = el.querySelectorAll('.title-char')
  tl.fromTo(chars,
    { autoAlpha: 0, y: 24, scale: 0.6 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.045, ease: 'elastic.out(1, 0.5)' }, 0)
}

// 作品集网站 → 翻页行:绕顶边翻起
function titlePortfolio(tl, el) {
  const lines = el.querySelectorAll('.title-line')
  tl.fromTo(lines,
    { rotationX: -90, autoAlpha: 0, transformOrigin: 'top center', transformPerspective: 800 },
    { rotationX: 0, autoAlpha: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.3)' }, 0)
}

const titleFx = { agent: titleAgent, dance: titleDance, music: titleMusic, portfolio: titlePortfolio }

// ===== 切换转场:标题遮罩 + 窗口登场(按项目类型) + 信息层 =====
function enterCard(el, done) {
  if (reducedMotion()) {
    gsap.set(el, { autoAlpha: 1 })
    done()
    return
  }
  gsap.set(el, { autoAlpha: 1 })
  const tl = gsap.timeline({ onComplete: done })

  const key = activeProject.value.preview
  ;(titleFx[key] ?? titlePortfolio)(tl, el)
  ;(previewFx[key] ?? fxPortfolio)(tl, el)

  tl.fromTo(el.querySelectorAll('.info-item'),
    { autoAlpha: 0, y: 14 },
    { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, 0.3)
  const number = el.querySelector('.project-number')
  if (number) {
    tl.fromTo(number,
      { yPercent: direction.value * 55, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.65, ease: 'power3.out' }, 0)
  }
}

function leaveCard(el, done) {
  gsap.to(el, { autoAlpha: 0, x: reducedMotion() ? 0 : direction.value * -22, duration: reducedMotion() ? 0 : 0.25, ease: 'power2.in', onComplete: done })
}

onMounted(() => {
  // 跨页预选:从经历页项目卡跳入时定位到对应项目
  if (pendingProjectId.value) {
    const i = projects.findIndex(p => p.id === pendingProjectId.value)
    if (i >= 0) {
      direction.value = i > activeIndex.value ? 1 : -1
      activeIndex.value = i
    }
    pendingProjectId.value = null
  }

  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.project-enter', { autoAlpha: 1 })
      return
    }
    gsap.fromTo('.project-enter',
      { autoAlpha: 0, y: 26, clipPath: 'inset(100% 0% 0% 0%)' },
      { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, stagger: 0.09, ease: 'expo.out', delay: 0.2, clearProps: 'clipPath' },
    )
  }, rootRef.value)

  updateMarker(false)
  window.addEventListener('resize', onResizeMarker)

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion()) return
  onPointerMove = (event) => {
    const preview = rootRef.value?.querySelector('.product-window')
    const depth = rootRef.value?.querySelector('.preview-depth')
    if (!preview) return
    const rect = preview.getBoundingClientRect()
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
    const x = inside ? (event.clientX - rect.left) / rect.width - 0.5 : 0
    const y = inside ? (event.clientY - rect.top) / rect.height - 0.5 : 0
    // 外壳倾斜 + 内部内容反向 0.5x 位移(隔着玻璃看的景深)
    gsap.to(preview, { rotationY: x * 4, rotationX: -y * 4, duration: 0.5, ease: 'power3.out', transformPerspective: 1200, overwrite: 'auto' })
    if (depth) gsap.to(depth, { x: -x * 16, y: -y * 16, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
  }
  document.addEventListener('mousemove', onPointerMove)
})

onUnmounted(() => {
  ctx?.revert()
  window.removeEventListener('resize', onResizeMarker)
  if (onPointerMove) document.removeEventListener('mousemove', onPointerMove)
})
</script>

<template>
  <section ref="rootRef" id="projects" class="relative flex h-full items-center overflow-hidden bg-[#edf6ff] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
    <!-- 整页主题底色(随项目过渡) -->
    <div class="absolute inset-0 transition-colors duration-[800ms]" :style="{ backgroundColor: activeTheme.bg }" aria-hidden="true" />
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
        <div ref="selectorRef" class="relative flex gap-2 lg:mt-8 lg:grid lg:w-full lg:gap-2">
          <!-- 手绘滑动标记 -->
          <span ref="markerRef" class="pointer-events-none absolute left-0 top-0 z-0 opacity-70" style="clip-path: polygon(7% 7%, 96% 0, 100% 75%, 82% 100%, 0 86%)" aria-hidden="true" />
          <button
            v-for="(project, index) in projects"
            :key="project.id"
            :ref="el => setSelectorRef(el, index)"
            v-magnetic="{ strength: 0.2, radius: 60 }"
            class="group relative z-10 flex items-center gap-2 rounded-full border px-2.5 py-2 transition-all lg:w-[118%] lg:rounded-none lg:border-0 lg:bg-transparent lg:px-4 lg:py-2.5"
            :class="[selectorOffsets[index], index === activeIndex ? 'border-[#15201d] bg-[#15201d] text-white lg:bg-transparent lg:text-[#15201d]' : 'border-white bg-white/60 text-muted lg:hover:text-[#3975b9]']"
            :aria-label="`查看${project.title}`"
            @click="select(index)">
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
              <div class="info-item flex items-center gap-3"><span class="flex -rotate-3 items-center gap-2 bg-[#dff7ef] px-3 py-1 font-mono text-[8px] text-[#267f68]" style="clip-path: polygon(6% 0, 100% 14%, 94% 100%, 0 82%)"><i class="h-1.5 w-1.5 rounded-full bg-[#59d6b3]" />{{ activeProject.status }}</span><span class="metadata rotate-2 text-muted">Project {{ activeProject.number }}</span></div>
              <p class="info-item mt-6 inline-block -rotate-1 metadata text-[#3975b9]">{{ activeProject.subtitle }}</p>
              <h2 class="relative mt-3 max-w-2xl text-3xl font-extrabold leading-[0.98] tracking-[-0.05em] text-[#15201d] md:text-5xl lg:-mr-24 lg:-rotate-1">
                <span class="title-wrap inline-block">
                  <span class="block overflow-hidden"><span class="title-line block will-change-transform"><span v-for="(ch, ci) in charsOf(activeProject.titleLead)" :key="ci" class="title-char inline-block will-change-transform">{{ ch === ' ' ? ' ' : ch }}</span></span></span>
                  <span class="block overflow-hidden"><span class="title-line block will-change-transform"><span v-for="(ch, ci) in charsOf(activeProject.titleTail)" :key="ci" class="title-char inline-block will-change-transform">{{ ch === ' ' ? ' ' : ch }}</span></span><span class="title-caret inline-block text-[#59d6b3] opacity-0" aria-hidden="true">▍</span></span>
                </span>
              </h2>
              <p class="info-item mt-5 max-w-xl text-xs leading-6 text-muted md:text-sm md:leading-7">{{ activeProject.description }}</p>
              <div class="info-item mt-5 flex flex-wrap gap-x-3 gap-y-2">
                <span v-for="(tech,index) in activeProject.tech.slice(0, 5)" :key="tech" class="inline-block font-mono text-[8px] text-muted" :class="techRotations[index]">{{ tech }}</span>
              </div>
              <div class="info-item mt-5 h-32 max-w-xl overflow-hidden border border-[#bfd7ef] bg-white/55 px-3 md:mt-6 md:h-40 md:px-4 lg:hidden" style="clip-path: polygon(3% 0, 97% 5%, 100% 82%, 90% 100%, 0 92%)">
                <ProjectPreview :key="`compact-${activeProject.id}`" :project="activeProject" compact />
              </div>
              <button v-magnetic="{ strength: 0.14, radius: 110 }" class="info-item studio-button-primary mt-7 -rotate-1" @click="emit('openProject', activeProject)">项目详情 <ArrowUpRight class="size-4" /></button>
            </div>
          </div>

          <div class="project-stage relative hidden overflow-hidden transition-colors duration-500 lg:block" :style="{ backgroundColor: activeTheme.stage, clipPath: activeTheme.clip }">
            <!-- 擦入转场层 -->
            <div class="preview-wipe absolute inset-0">
              <div class="product-window absolute left-[7%] top-[8%] h-[84%] w-[88%] will-change-transform" :class="activeTheme.tilt">
                <div class="preview-depth h-full w-full">
                  <ProjectPreview :key="activeProject.id" :project="activeProject" />
                </div>
              </div>
            </div>

            <!-- 特效层(独立于 wipe,不被其透明度影响) -->
            <div class="fx-tiles pointer-events-none absolute inset-0 z-10 grid grid-cols-4 grid-rows-3 opacity-0" aria-hidden="true">
              <i v-for="i in 12" :key="i" class="fx-tile block border border-white/20" :style="{ backgroundColor: activeTheme.stage }" />
            </div>
            <div class="fx-bars pointer-events-none absolute inset-0 z-10 flex items-stretch gap-[3px] px-[3px] opacity-0" aria-hidden="true">
              <i v-for="i in 10" :key="i" class="fx-bar flex-1 origin-bottom scale-y-0 rounded-t-sm" :class="i % 3 ? 'bg-[#efb35d]' : 'bg-[#b789d1]'" />
            </div>
          </div>
        </article>
      </Transition>

      <div class="project-enter lg:hidden">
        <span class="metadata text-muted">{{ activeProject.number }} / {{ String(projects.length).padStart(2,'0') }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Agent 标题光标:打印期间闪烁 */
.caret-blink {
  opacity: 1;
  animation: caret-blink 0.65s steps(2) infinite;
}

@keyframes caret-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
