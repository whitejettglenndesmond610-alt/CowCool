<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { journey, projects } from '@/data/portfolio.js'
import { pendingProjectId } from '@/lib/projectSelection.js'
import { reducedMotion } from '@/lib/animations.js'

const emit = defineEmits(['navigate'])

// 跳转项目页并定位到对应项目
function goProject(id) {
  pendingProjectId.value = id
  emit('navigate', 'projects')
}

const rootRef = ref(null)
const activeIndex = ref(0)
const activeItem = computed(() => journey[activeIndex.value])
const relatedProjects = computed(() =>
  (activeItem.value.projectIds ?? [])
    .map(id => projects.find(p => p.id === id))
    .filter(Boolean),
)
const visitedIdx = ref([0])
const nodeOffsets = ['translate-y-3', '-translate-y-5', 'translate-y-5', '-translate-y-2']
const nodeRotations = ['-rotate-6', 'rotate-6', '-rotate-3', 'rotate-5']
let ctx = null
let onResizeMeasure = null

// ===== 标题:逐字亮起 =====
const titleLine1 = '每一次构建，'.split('')
const titleLine2a = '都是下一个'.split('')
const titleLine2b = '节点的起点。'.split('')

function playTitleNodes() {
  const h2 = rootRef.value?.querySelector('h2')
  if (!h2) return
  const chars = Array.from(h2.querySelectorAll('.title-char'))
  if (!chars.length) return

  // 逐字亮起
  gsap.fromTo(chars,
    { autoAlpha: 0, y: 14 },
    { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
  )
}
const ENROLL = new Date(2025, 8, 1).getTime()
const now = ref(Date.now())
let clockTimer = null
const daysSince = computed(() => Math.max(0, Math.floor((now.value - ENROLL) / 86400000)))
const clock = computed(() => new Date(now.value).toTimeString().slice(0, 8))

// ===== 旅行者 =====
const svgRef = ref(null)
const pathRef = ref(null)
const visitedPathRef = ref(null)
const dotRef = ref(null)
const nodeRefs = []
let pathLen = 0
let nodeTs = []
const travel = { t: 0 }
let dragging = false

function setNodeRef(el, i) {
  if (el) nodeRefs[i] = el
}

// 路径上采样,找每个节点按钮中心对应的 t
function measureNodeTs() {
  const path = pathRef.value
  const svg = path?.ownerSVGElement
  if (!path || !svg) return
  pathLen = path.getTotalLength()
  const svgRect = svg.getBoundingClientRect()
  if (!svgRect.width) return

  nodeTs = nodeRefs.map((btn) => {
    if (!btn) return 0
    const r = btn.getBoundingClientRect()
    const nodeX = ((r.left + r.width / 2 - svgRect.left) / svgRect.width) * 1000
    return nearestT(nodeX, null).t
  })
}

// 找路径上离指定 SVG 坐标(或视口坐标)最近的 t
function nearestT(xSvg, clientPoint) {
  const path = pathRef.value
  const svg = path?.ownerSVGElement
  let best = 0
  let bestDist = Infinity
  const svgRect = svg?.getBoundingClientRect()
  for (let s = 0; s <= 300; s++) {
    const pt = path.getPointAtLength((s / 300) * pathLen)
    let d
    if (clientPoint && svgRect) {
      const px = svgRect.left + (pt.x / 1000) * svgRect.width
      const py = svgRect.top + (pt.y / 80) * svgRect.height
      d = Math.hypot(px - clientPoint.x, py - clientPoint.y)
    } else {
      d = Math.abs(pt.x - xSvg)
    }
    if (d < bestDist) { bestDist = d; best = s / 300 }
  }
  return { t: best, dist: bestDist }
}

function renderTravel() {
  const path = pathRef.value
  const dot = dotRef.value
  const visited = visitedPathRef.value
  if (!path || !dot || !visited) return
  const pt = path.getPointAtLength(travel.t * pathLen)
  dot.setAttribute('cx', pt.x)
  dot.setAttribute('cy', pt.y)
  visited.style.strokeDashoffset = String(pathLen * (1 - travel.t))
  nodeTs.forEach((nt, i) => {
    if (travel.t >= nt - 0.005 && !visitedIdx.value.includes(i)) {
      visitedIdx.value = [...visitedIdx.value, i]
    }
  })
}

function travelTo(index, onArrive) {
  const target = nodeTs[index] ?? 0
  if (reducedMotion()) {
    travel.t = target
    renderTravel()
    onArrive?.()
    return
  }
  const dist = Math.abs(target - travel.t)
  gsap.to(travel, {
    t: target,
    duration: Math.max(0.4, dist * 2.2),
    ease: 'power2.inOut',
    overwrite: 'auto',
    onUpdate: renderTravel,
    onComplete: () => onArrive?.(),
  })
}

function selectNode(index) {
  if (index === activeIndex.value) return
  travelTo(index, () => { activeIndex.value = index })
}

// ===== 可拖拽旅行者 =====
function onSvgPointerDown(e) {
  if (!pathLen) return
  dragging = true
  gsap.killTweensOf(travel)
  svgRef.value?.setPointerCapture?.(e.pointerId)
  dragMove(e)
}

function onSvgPointerMove(e) {
  if (dragging) dragMove(e)
}

function onSvgPointerUp() {
  if (!dragging) return
  dragging = false
  // 吸附到最近节点并选中
  let nearest = 0
  let nd = Infinity
  nodeTs.forEach((nt, i) => {
    const d = Math.abs(nt - travel.t)
    if (d < nd) { nd = d; nearest = i }
  })
  if (nearest === activeIndex.value) travelTo(nearest)
  else selectNode(nearest)
}

function dragMove(e) {
  const path = pathRef.value
  if (!path || !pathLen) return
  travel.t = nearestT(null, { x: e.clientX, y: e.clientY }).t
  renderTravel()
}

// ===== 详情转场 =====
function enterDetail(el, done) {
  if (reducedMotion()) {
    gsap.set(el, { autoAlpha: 1 })
    done()
    return
  }
  gsap.set(el, { autoAlpha: 1 })
  const tl = gsap.timeline({ onComplete: done })
  tl.fromTo(el.querySelectorAll('.date-char'),
    { yPercent: 115, autoAlpha: 0 },
    { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, 0)
    .fromTo(el.querySelector('.detail-title'),
      { yPercent: 115 },
      { yPercent: 0, duration: 0.7, ease: 'expo.out' }, 0.1)
    .fromTo(el.querySelector('.detail-desc'),
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.32)
    .fromTo(el.querySelectorAll('.detail-skill'),
      { autoAlpha: 0, y: 10, scale: 0.8 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: 'back.out(1.7)' }, 0.44)
    .fromTo(el.querySelectorAll('.detail-project'),
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 0.56)
    .fromTo(el.querySelectorAll('.detail-note, .detail-tag, .detail-days'),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' }, 0.66)
}

function leaveDetail(el, done) {
  gsap.to(el, { autoAlpha: 0, y: reducedMotion() ? 0 : -10, duration: reducedMotion() ? 0 : 0.18, ease: 'power2.in', onComplete: done })
}

onMounted(() => {
  clockTimer = setInterval(() => { now.value = Date.now() }, 1000)

  nextTick(() => {
    measureNodeTs()
    travel.t = 0
    if (visitedPathRef.value) {
      visitedPathRef.value.style.strokeDasharray = String(pathLen)
      visitedPathRef.value.style.strokeDashoffset = String(pathLen)
    }
    renderTravel()
  })

  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.journey-enter, .journey-nodes', { autoAlpha: 1 })
      gsap.set('.journey-path', { strokeDashoffset: 0 })
      measureNodeTs()
      travel.t = nodeTs[0] ?? 0
      renderTravel()
      return
    }
    gsap.fromTo('.journey-enter',
      { autoAlpha: 0, y: 26, clipPath: 'inset(100% 0% 0% 0%)' },
      { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, stagger: 0.09, ease: 'expo.out', delay: 0.2, clearProps: 'clipPath' },
    )
    // 节点行:普通浮现(不用擦除,避免圆圈被 clip 边缘裁切)
    gsap.fromTo('.journey-nodes',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.35 },
    )
    const path = rootRef.value.querySelector('.journey-path')
    const length = path?.getTotalLength?.() ?? 0
    if (path) {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, { strokeDashoffset: 0, duration: 1.1, delay: 0.48, ease: 'power2.out' })
    }
    gsap.delayedCall(1.3, () => travelTo(0))
    // 标题:节点点亮连线
    gsap.delayedCall(0.4, playTitleNodes)
  }, rootRef.value)

  onResizeMeasure = () => {
    measureNodeTs()
    renderTravel()
  }
  window.addEventListener('resize', onResizeMeasure)
})

onUnmounted(() => {
  ctx?.revert()
  if (clockTimer) clearInterval(clockTimer)
  if (onResizeMeasure) window.removeEventListener('resize', onResizeMeasure)
})
</script>

<template>
  <section ref="rootRef" id="timeline" class="relative flex h-full items-center overflow-hidden bg-[#fff8e8] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
    <div class="absolute -bottom-24 -right-12 h-[55vh] w-[55vh] rounded-full border-[70px] border-[#ffc964]/15" />
    <div class="absolute left-[39%] top-[13%] h-28 w-48 -rotate-12 bg-[#ffc964]/10" style="clip-path: polygon(0 18%, 88% 0, 100% 72%, 16% 100%)" />
    <span class="absolute bottom-0 left-0 text-[22vw] font-extrabold leading-[0.7] tracking-[-0.12em] text-[#f2b942]/[0.065]">NEXT</span>

    <div class="relative z-10 mx-auto w-full max-w-[1280px]">
      <div class="journey-enter flex items-start justify-between">
        <div>
          <span class="studio-kicker flex items-center gap-3">
            <svg class="h-6 w-12" viewBox="0 0 48 24" fill="none" aria-hidden="true">
              <path d="M4 19 C12 11 18 21 26 13 S36 5 40 8" stroke="#c88713" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="3 4" />
              <circle cx="12" cy="14" r="2.4" fill="#ffc964" />
              <circle cx="27" cy="12" r="2.4" fill="#e8a33d" />
              <path d="M40 8 L40 3" stroke="#c88713" stroke-width="1.2" stroke-linecap="round" />
              <path d="M40 3 L46 5 L40 7.5 Z" fill="#59d6b3" />
            </svg>
            Journey map / 成长路径
          </span>
          <h2 class="relative mt-4 max-w-5xl text-[clamp(2.3rem,5vw,5rem)] font-extrabold leading-[0.94] tracking-[-0.065em] text-[#15201d]">
            <span class="inline-block -rotate-1"><span v-for="(ch, i) in titleLine1" :key="`a${i}`" class="title-char inline-block will-change-transform">{{ ch }}</span></span><br><span class="title-line-2 ml-[5%] inline-block rotate-1 text-[#c88713] md:whitespace-nowrap"><span v-for="(ch, i) in titleLine2a" :key="`b${i}`" class="title-char inline-block will-change-transform">{{ ch }}</span><span class="whitespace-nowrap"><span v-for="(ch, i) in titleLine2b" :key="`c${i}`" class="title-char inline-block will-change-transform">{{ ch }}</span></span></span>
          </h2>
        </div>
        <span class="hidden rotate-3 bg-white/65 px-4 py-2 metadata text-[#9a6a16] md:block" style="clip-path: polygon(5% 0, 100% 10%, 94% 100%, 0 82%)">Timeline · 2025 → Next</span>
      </div>

      <div class="journey-nodes mt-7 md:mt-12">
        <div class="relative grid grid-cols-4 gap-2">
          <svg
            ref="svgRef"
            class="absolute left-[8%] top-1 h-14 w-[84%] cursor-grab touch-none active:cursor-grabbing md:h-20"
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
            @pointerdown="onSvgPointerDown"
            @pointermove="onSvgPointerMove"
            @pointerup="onSvgPointerUp"
            @pointercancel="onSvgPointerUp"
          >
            <path ref="pathRef" class="journey-path" d="M0 51 C130 2 260 78 402 32 S690 72 1000 22" stroke="#d6b968" stroke-width="2" />
            <path ref="visitedPathRef" d="M0 51 C130 2 260 78 402 32 S690 72 1000 22" stroke="#59d6b3" stroke-width="2.6" stroke-linecap="round" />
            <circle ref="dotRef" r="6" fill="#15201d" stroke="#fff8e8" stroke-width="2" />
          </svg>
          <button
            v-for="(item,index) in journey"
            :key="item.date"
            :ref="el => setNodeRef(el, index)"
            class="node-btn group relative z-10 flex flex-col items-center text-center"
            :class="nodeOffsets[index]"
            @click="selectNode(index)">
            <span class="journey-node-dot relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[43%_57%_38%_62%] border-4 transition-all duration-300 md:h-14 md:w-14" :class="[nodeRotations[index], index===activeIndex ? 'border-[#fff8e8] bg-[#15201d] text-white shadow-[0_0_0_2px_#15201d]' : visitedIdx.includes(index) ? 'border-[#fff8e8] bg-[#dff7ef] text-[#267f68] shadow-[0_0_0_1px_#9fd8c4]' : 'border-[#fff8e8] bg-white text-[#9a6a16] shadow-[0_0_0_1px_#dfc98f] group-hover:bg-[#fff1c9]']">
              <span v-if="index===activeIndex" class="node-ring absolute -inset-[7px] rounded-full border border-dashed border-[#15201d]/45" aria-hidden="true" />
              <span class="font-mono text-[8px] md:text-[10px]">0{{ index+1 }}</span>
            </span>
            <span class="relative z-10 mt-4 font-mono text-[8px] font-semibold md:text-[10px]" :class="index===activeIndex ? 'text-[#15201d]' : 'text-[#9a6a16]'">{{ item.date }}</span>
            <span class="mt-1 hidden max-w-[180px] text-xs font-bold text-[#15201d] md:block">{{ item.title }}</span>
          </button>
        </div>
        <p class="mt-2 text-center font-mono text-[8px] uppercase tracking-[0.14em] text-[#c8ab6d]">可拖动路径上的圆点旅行</p>
      </div>

      <Transition mode="out-in" :css="false" @enter="enterDetail" @leave="leaveDetail">
        <article :key="activeItem.date" class="journey-enter relative mt-5 grid items-end gap-5 pt-6 md:mt-6 md:grid-cols-[0.42fr_0.58fr] md:gap-4 md:pt-7">
          <svg class="pointer-events-none absolute inset-x-0 top-0 h-7 w-full" viewBox="0 0 1200 28" preserveAspectRatio="none" fill="none"><path d="M0 20 C270 1 450 30 675 11 S955 7 1200 20" stroke="#dfc98f" /></svg>
          <div class="relative md:-translate-y-1">
            <i class="pointer-events-none absolute -left-8 top-2 h-24 w-64 -rotate-6 bg-[#ffc964]/10" style="clip-path: polygon(3% 22%, 92% 0, 100% 78%, 16% 100%)" />
            <p class="metadata text-[#9a6a16]">Selected moment</p>
            <p class="journey-date relative mt-2 inline-block -rotate-2 text-5xl font-extrabold tracking-[-0.07em] text-[#15201d] md:text-8xl">
              <span v-for="(ch, ci) in activeItem.date.split('')" :key="ci" class="date-mask"><span class="date-char inline-block will-change-transform">{{ ch }}</span></span>
            </p>
            <p class="detail-days mt-3 flex items-center font-mono text-[10px] text-[#9a6a16]">
              <i class="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#59d6b3]" />入学第 {{ daysSince }} 天 · {{ clock }}
            </p>
          </div>
          <div class="md:-translate-y-4 md:rotate-[0.7deg]">
            <h3 class="text-2xl font-extrabold tracking-[-0.04em] text-[#15201d] md:text-4xl">
              <span class="block overflow-hidden"><span class="detail-title block will-change-transform">{{ activeItem.title }}</span></span>
            </h3>
            <p class="detail-desc mt-3 max-w-2xl text-xs leading-6 text-[#6f6653] md:text-sm md:leading-7">{{ activeItem.description }}</p>

            <!-- 阶段技能 -->
            <div v-if="activeItem.skills?.length" class="mt-4 flex flex-wrap gap-2">
              <span v-for="s in activeItem.skills" :key="s" class="detail-skill rounded-full border border-[#dfc98f] bg-white/60 px-2.5 py-1 font-mono text-[9px] font-semibold text-[#9a6a16]">{{ s }}</span>
            </div>

            <!-- 关联项目 -->
            <div v-if="relatedProjects.length" class="mt-4 flex flex-wrap gap-2">
              <button
                v-for="p in relatedProjects"
                :key="p.id"
                type="button"
                class="detail-project group flex items-center gap-2 rounded-xl border border-[#dfc98f] bg-white/70 px-3 py-2 text-left transition-all hover:-translate-y-0.5 hover:border-[#c88713] hover:shadow-[3px_4px_0_rgba(200,135,19,0.15)]"
                @click="goProject(p.id)">
                <span class="flex h-6 w-6 items-center justify-center rounded-[45%_55%_42%_58%] bg-[#15201d] font-mono text-[7px] text-[#ffc964]">{{ p.number }}</span>
                <span class="text-[11px] font-bold text-[#15201d]">{{ p.navTitle }}</span>
                <span class="text-xs text-[#c88713] transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>

            <!-- 备注便签 -->
            <p v-if="activeItem.note" class="detail-note mt-3 inline-block -rotate-1 bg-[#fff2c9] px-3 py-1.5 font-mono text-[9px] font-semibold text-[#9a6a16] shadow-[2px_3px_0_rgba(21,32,29,0.08)]">{{ activeItem.note }}</p>

            <p class="detail-tag mt-3 block metadata text-[#9a6a16]">Keep building · Keep learning</p>
          </div>
        </article>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
/* 当前节点的手绘虚线圈:缓慢旋转 */
.node-ring {
  animation: node-ring-spin 9s linear infinite;
}

@keyframes node-ring-spin {
  to { transform: rotate(360deg); }
}

/* 未选中节点 hover:阴影加深(gsap 管 transform,这里只动滤镜) */
.node-btn:hover .journey-node-dot {
  filter: drop-shadow(0 4px 6px rgba(21, 32, 29, 0.15));
}

/* 节点呼吸:阴影脉冲(不动 transform,避免遮挡错位) */
.journey-node-dot {
  animation: node-breathe 2.4s ease-in-out infinite;
}

.node-btn:nth-child(2) .journey-node-dot { animation-delay: 0.4s; }
.node-btn:nth-child(3) .journey-node-dot { animation-delay: 0.8s; }
.node-btn:nth-child(4) .journey-node-dot { animation-delay: 1.2s; }

@keyframes node-breathe {
  0%, 100% { filter: drop-shadow(0 0 0 rgba(21, 32, 29, 0)); }
  50% { filter: drop-shadow(0 3px 5px rgba(21, 32, 29, 0.12)); }
}

/* 日期里程表遮罩 */
.date-mask {
  display: inline-block;
  overflow: hidden;
}
</style>
