<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { annotate } from 'rough-notation'
import { BookOpen, Calendar, GraduationCap, User } from '@lucide/vue'
import { profile } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const rootRef = ref(null)
const paraRef = ref(null)
let ctx = null
const cleanupFns = []

// ===== 手稿批注:关键词手绘圈画 =====
const annots = [
  { type: 'circle', color: '#5da9ff' },
  { type: 'underline', color: '#e15a64' },
  { type: 'highlight', color: '#59d6b355' },
  { type: 'underline', color: '#e15a64' },
]
let marks = []
let annotsReady = false

function initAnnotations(reduced) {
  const wrap = paraRef.value
  if (!wrap || annotsReady) return
  annotsReady = true

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  wrap.querySelectorAll('.annot').forEach((span, i) => {
    const cfg = annots[i]
    if (!cfg) return
    const mark = annotate(span, {
      type: cfg.type,
      color: cfg.color,
      animationDuration: reduced ? 0 : 700,
      strokeWidth: 1.8,
      padding: cfg.type === 'circle' ? 6 : 3,
      iterations: 2,
      multiline: true,
    })
    marks[i] = mark

    if (reduced) {
      mark.show()
    } else {
      gsap.delayedCall(i * 0.6, () => mark.show())
    }

    // 悬停词组:批注擦掉重新描画一遍
    if (finePointer && !reduced) {
      span.addEventListener('mouseenter', () => {
        mark.hide()
        mark.show()
      })
    }
  })
}

const principles = [
  { number: '01', title: '先理解', text: '不仅让代码运行，也理解技术为什么这样工作。', color: '#5da9ff' },
  { number: '02', title: '再构建', text: '把课程知识和新工具放进真实项目中验证。', color: '#59d6b3' },
  { number: '03', title: '持续迭代', text: '认真完成，也保持开放并主动修正方向。', color: '#ffc964' },
]

const identityItems = [
  { label: 'Name', value: profile.name, detail: '牛帅 · 英文名 Shawn，两个都在用。', icon: User, color: '#5da9ff', base: { x: -8, y: 0, r: -2 } },
  { label: 'School', value: profile.school, detail: '河南郑州 · 本科在读。', icon: GraduationCap, color: '#59d6b3', base: { x: 20, y: 20, r: 2 } },
  { label: 'Major', value: profile.major, detail: '核心课:操作系统、数据库、计算机网络。', icon: BookOpen, color: '#ffc964', base: { x: 32, y: -4, r: 1 } },
  { label: 'Period', value: profile.educationPeriod, detail: '预计 2027 年 6 月毕业。', icon: Calendar, color: '#5da9ff', base: { x: -4, y: 20, r: -2 } },
]

const activeCard = ref(-1)
const cardEls = []
const cardBase = identityItems.map(i => i.base)

// 大标题逐字(用于指针波浪互动)
const titleLine1 = ['认', '真', '构', '建', '，']
const titleLine2 = ['也', '持', '续', '保', '持', '好', '奇', '。']

// 卡片开合:弹性放大跳出,其余缩小后退(gsap 接管 transform/opacity)
function toggleCard(index) {
  activeCard.value = activeCard.value === index ? -1 : index
  if (reducedMotion()) return

  cardEls.forEach((el, i) => {
    if (!el) return
    if (activeCard.value === -1) {
      gsap.to(el, { scale: 1, opacity: 1, duration: 0.65, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' })
    } else if (i === activeCard.value) {
      gsap.to(el, { scale: 1.04, opacity: 1, duration: 0.5, ease: 'back.out(2.2)', overwrite: 'auto' })
    } else {
      gsap.to(el, { scale: 0.95, opacity: 0.35, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    }
  })
}

onMounted(() => {
  const root = rootRef.value
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = reducedMotion()

  ctx = gsap.context(() => {
    if (reduced) {
      gsap.set('.about-enter', { autoAlpha: 1 })
      gsap.set('.growth-path', { strokeDashoffset: 0 })
      initAnnotations(true)
      return
    }

    // 入场:从底部向上掀开的擦除 + 轻微模糊到清晰
    gsap.fromTo('.about-enter',
      { autoAlpha: 0, y: 26, clipPath: 'inset(100% 0% 0% 0%)', filter: 'blur(4px)' },
      { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)', duration: 0.75, stagger: 0.08, ease: 'expo.out', delay: 0.2, clearProps: 'clipPath,filter' },
    )
    // 标题字逐个 3D 翻转立起
    const heading = root.querySelector('h2')
    if (heading) gsap.set(heading, { transformPerspective: 800 })
    gsap.fromTo('.title-char',
      { rotationX: -95, autoAlpha: 0 },
      { rotationX: 0, autoAlpha: 1, duration: 0.7, stagger: 0.045, ease: 'back.out(1.6)', delay: 0.5, transformOrigin: '50% 100% -12px' },
    )
    // 档案卡基准错落位(gsap 接管 transform)
    if (window.matchMedia('(min-width: 1024px)').matches) {
      cardEls.forEach((el, i) => {
        if (el) gsap.set(el, { x: cardBase[i].x, y: cardBase[i].y, rotation: cardBase[i].r })
      })
    }
    // 主干先画,枝条跟随,节点弹出,叶片最后长出
    const stems = gsap.utils.toArray('.growth-path')
    stems.forEach((path, index) => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, { strokeDashoffset: 0, duration: 0.8, delay: 0.45 + index * 0.1, ease: 'power2.out' })
    })
    gsap.fromTo('.growth-node', { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.4, stagger: 0.1, delay: 1.05, ease: 'back.out(1.8)' })
    // 叶片:从枝梢位置长出(缩放原点对齐叶片根部)
    const leafOrigins = ['26px 198px', '70px 148px', '35px 84px']
    gsap.utils.toArray('.growth-leaf').forEach((leaf, index) => {
      gsap.fromTo(leaf,
        { autoAlpha: 0, scale: 0, svgOrigin: leafOrigins[index] },
        { autoAlpha: 1, scale: 1, duration: 0.45, delay: 1.15 + index * 0.12, ease: 'back.out(2.2)' },
      )
    })

    // 手稿批注:入场落幕后依次描画
    gsap.delayedCall(1.35, () => initAnnotations(false))

    // 光晕呼吸
    gsap.fromTo('.growth-halo', { opacity: 0 }, { opacity: 0.22, duration: 1, delay: 1.1 })
    gsap.to('.growth-halo', { opacity: 0.1, repeat: -1, yoyo: true, duration: 2.2, stagger: 0.5, ease: 'sine.inOut', delay: 2 })

    // 枝干 idle 摆动
    gsap.to('.growth-sway', {
      rotation: 1.4, svgOrigin: '48 350', repeat: -1, yoyo: true,
      duration: 3.4, ease: 'sine.inOut', delay: 1.2,
    })

    // 「也持续保持好奇。」荧光笔循环扫过
    const hl = root.querySelector('.hl-sweep')
    if (hl) {
      gsap.timeline({ repeat: -1, repeatDelay: 2.8, delay: 1.6 })
        .fromTo(hl, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' })
        .to(hl, { opacity: 0, duration: 0.5, ease: 'power1.in', delay: 1.4 })
    }

    // 关键词标签:随机漂浮(gsap 接管 transform,基准旋转在设定时写入)
    gsap.utils.toArray('.kw-tag').forEach((tag, index) => {
      const baseRot = index % 2 ? 2 : -1
      gsap.set(tag, { rotation: baseRot })
      gsap.to(tag, {
        y: () => -4 - Math.random() * 5,
        rotation: () => baseRot + (Math.random() - 0.5) * 3,
        repeat: -1, yoyo: true,
        duration: 1.6 + Math.random() * 1.2,
        ease: 'sine.inOut',
        delay: index * 0.22,
      })
    })
  }, root)

  // ===== 指针感应(纯视觉):树向光标倾斜 + 节点微亮,无任何弹出 =====
  if (!finePointer || reduced) return

  const svg = root.querySelector('.growth-svg')
  if (!svg) return

  const pointerGroup = svg.querySelector('.growth-pointer')
  const nodeEls = Array.from(svg.querySelectorAll('.growth-node'))
  const haloEls = Array.from(svg.querySelectorAll('.growth-halo'))
  if (!pointerGroup || !nodeEls.length) return

  const tiltTo = gsap.quickTo(pointerGroup, 'rotation', { duration: 0.9, ease: 'power2.out', svgOrigin: '48 350' })
  const nodeScales = nodeEls.map((el, i) => gsap.quickTo(el, 'scale', { duration: 0.4, ease: 'power2.out', svgOrigin: `48 ${[255, 205, 135][i]}` }))
  const haloScales = haloEls.map((el, i) => gsap.quickTo(el, 'scale', { duration: 0.4, ease: 'power2.out', svgOrigin: `48 ${[255, 205, 135][i]}` }))
  const haloOpacities = haloEls.map(el => gsap.quickTo(el, 'opacity', { duration: 0.3, ease: 'power1.out', overwrite: 'auto' }))

  // 视差层(data-depth 控制深度)
  const pxLayers = Array.from(root.querySelectorAll('.px-layer'))
  const pxTos = pxLayers.map(el => ({
    depth: parseFloat(el.dataset.depth || '0.5'),
    x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power2.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power2.out' }),
  }))

  // 大标题逐字波浪
  const charEls = Array.from(root.querySelectorAll('.title-char'))
  const charY = charEls.map(el => gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power2.out' }))
  let charCenters = []

  // 原则区随指针轻微倾斜(gsap 接管 transform,基准值见模板注释)
  const isDesktop = window.matchMedia('(min-width: 768px)').matches
  const principleBase = isDesktop
    ? [{ y: -4, r: -1 }, { y: 12, r: 1 }, { y: -8, r: -1 }]
    : [{ y: 0, r: 0 }, { y: 0, r: 0 }, { y: 0, r: 0 }]
  const principleEls = Array.from(root.querySelectorAll('.principle-card'))
  principleEls.forEach((el, i) => gsap.set(el, { y: principleBase[i].y, rotation: principleBase[i].r }))
  const principleRot = principleEls.map(el => gsap.quickTo(el, 'rotation', { duration: 0.6, ease: 'power2.out' }))
  const principleYTos = principleEls.map(el => gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power2.out' }))

  // 标题速度感形变:鼠标快划时倾斜,急停回弹
  const headingEl = root.querySelector('h2')
  const skewTo = headingEl ? gsap.quickTo(headingEl, 'skewX', { duration: 0.55, ease: 'power2.out' }) : null
  let lastPX = 0
  let lastPT = 0

  let centers = []
  function measure() {
    centers = nodeEls.map(el => {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    })
    charCenters = charEls.map(el => {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    })
  }
  measure()
  window.addEventListener('resize', measure)
  cleanupFns.push(() => window.removeEventListener('resize', measure))

  function onPointerMove(event) {
    const sectionRect = root.getBoundingClientRect()
    const nx = (event.clientX - (sectionRect.left + sectionRect.width * 0.5)) / sectionRect.width
    const ny = (event.clientY - (sectionRect.top + sectionRect.height * 0.5)) / sectionRect.height

    // 速度 → 倾斜形变
    if (skewTo) {
      const now = performance.now()
      if (lastPT) {
        const vx = (event.clientX - lastPX) / Math.max(now - lastPT, 1)
        skewTo(gsap.utils.clamp(-5, 5, vx * 3.2))
      }
      lastPX = event.clientX
      lastPT = now
    }

    // 树向光标方向倾斜(以区域中心为基准,±2.5deg)
    tiltTo(nx * 2.5)

    // 节点邻近感应:只放大 + 光晕,作为纯视觉氛围
    centers.forEach((c, i) => {
      const d = Math.hypot(event.clientX - c.x, event.clientY - c.y)
      const t = Math.max(0, 1 - d / 130)
      nodeScales[i](1 + t * 0.85)
      haloScales[i](1 + t * 1.3)
      haloOpacities[i](0.18 + t * 0.6)
    })

    // 视差层
    pxTos.forEach(({ depth, x, y }) => {
      x(nx * depth * 44)
      y(ny * depth * 44)
    })

    // 标题逐字波浪
    charCenters.forEach((c, i) => {
      const d = Math.hypot(event.clientX - c.x, event.clientY - c.y)
      const t = Math.max(0, 1 - d / 110)
      charY[i](-t * 14)
    })

    // 原则区倾斜
    principleEls.forEach((el, i) => {
      principleRot[i](principleBase[i].r + nx * (i - 1) * 1.8)
      principleYTos[i](principleBase[i].y + ny * (i - 1) * 9)
    })
  }

  function onPointerLeave() {
    tiltTo(0)
    skewTo?.(0)
    lastPT = 0
    nodeScales.forEach(fn => fn(1))
    haloScales.forEach(fn => fn(1))
    pxTos.forEach(({ x, y }) => { x(0); y(0) })
    charY.forEach(fn => fn(0))
    principleEls.forEach((el, i) => {
      principleRot[i](principleBase[i].r)
      principleYTos[i](principleBase[i].y)
    })
  }

  root.addEventListener('pointermove', onPointerMove)
  root.addEventListener('pointerleave', onPointerLeave)
  cleanupFns.push(() => {
    root.removeEventListener('pointermove', onPointerMove)
    root.removeEventListener('pointerleave', onPointerLeave)
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  marks.forEach(mark => { try { mark.remove() } catch {} })
  marks = []
  ctx?.revert()
})
</script>

<template>
  <section ref="rootRef" id="about" class="relative flex h-full items-center overflow-hidden bg-[#f3f8ff] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
    <div class="px-layer absolute right-[8%] top-[17%] h-24 w-24 border-r border-t border-[#5da9ff]/20" data-depth="0.6" aria-hidden="true" />
    <div class="px-layer absolute bottom-[13%] left-[4%] h-16 w-16 border-b border-l border-[#59d6b3]/25" data-depth="0.9" aria-hidden="true" />

    <!-- 生长曲线:纯装饰,指针靠近时轻微倾斜与微亮 -->
    <svg class="growth-svg pointer-events-none absolute left-[53.5%] top-[31%] hidden h-[38%] w-24 -translate-x-1/2 lg:block" viewBox="0 0 96 360" fill="none" aria-hidden="true">
      <g class="growth-pointer">
        <g class="growth-sway">
          <path class="growth-path" d="M48 350 C48 280 42 230 48 170 C54 112 48 68 48 12" stroke="#89cdb8" stroke-width="1.5" />
          <path class="growth-path" d="M48 255 C29 235 18 222 8 196" stroke="#5da9ff" stroke-width="1.2" />
          <path class="growth-path" d="M48 205 C66 184 77 170 88 145" stroke="#59d6b3" stroke-width="1.2" />
          <path class="growth-path" d="M48 135 C32 117 25 101 20 82" stroke="#ffc964" stroke-width="1.2" />
          <circle class="growth-halo" cx="48" cy="255" r="11" fill="#59d6b3" opacity="0" />
          <circle class="growth-halo" cx="48" cy="205" r="11" fill="#5da9ff" opacity="0" />
          <circle class="growth-halo" cx="48" cy="135" r="11" fill="#ffc964" opacity="0" />
          <circle class="growth-node" cx="48" cy="255" r="4" fill="#59d6b3" />
          <circle class="growth-node" cx="48" cy="205" r="4" fill="#5da9ff" />
          <circle class="growth-node" cx="48" cy="135" r="4" fill="#ffc964" />
          <path class="growth-leaf" d="M8 196c14-4 20 2 20 2s-4 11-18 8c-7-2-9-6-2-10z" fill="#59d6b3" fill-opacity=".15" stroke="#59d6b3" stroke-width=".8" />
          <path class="growth-leaf" d="M88 145c-14-3-20 3-20 3s5 11 19 7c7-2 8-7 1-10z" fill="#59d6b3" fill-opacity=".15" stroke="#59d6b3" stroke-width=".8" />
          <path class="growth-leaf" d="M20 82c12-2 17 4 17 4s-6 9-17 4c-6-3-6-7 0-8z" fill="#59d6b3" fill-opacity=".15" stroke="#59d6b3" stroke-width=".8" />
        </g>
      </g>
    </svg>

    <div class="relative z-10 mx-auto w-full max-w-[1280px]">
      <div class="about-enter flex items-center justify-between border-b border-stroke pb-4">
        <div class="flex items-center gap-3">
          <svg class="h-6 w-12" viewBox="0 0 48 24" fill="none" aria-hidden="true">
            <path d="M8 19C4 10 9 3 18 3c8 0 13 6 11 13-1 3-1 5 1 6" stroke="#5da9ff" stroke-width="1.2" stroke-linecap="round" />
            <path d="M13 20c-3-7 0-13 6-13 6 0 9 5 7 10-1 3 0 5 2 6" stroke="#59d6b3" stroke-width="1.2" stroke-linecap="round" />
            <path d="M18 20c-2-4-1-9 3-9 4 0 5 4 3 8" stroke="#267f68" stroke-width="1.2" stroke-linecap="round" />
            <circle cx="38" cy="8" r="3" fill="#ffc964" />
            <path d="M34 16h10" stroke="#15201d" stroke-width="1.2" stroke-linecap="round" />
          </svg>
          <span class="metadata text-muted">Personal profile / 个人档案</span>
        </div>
        <span class="px-layer hidden text-4xl font-extrabold tracking-[-0.06em] text-[#15201d]/[0.055] md:block" data-depth="1.2" aria-hidden="true">ABOUT</span>
      </div>

      <div class="mt-6 grid gap-7 lg:mt-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-20">
        <div class="relative z-10">
          <div class="px-layer pointer-events-none absolute -left-3 top-[18%] hidden lg:block" data-depth="1.0" aria-hidden="true">
            <span class="block h-20 w-44 rotate-[-8deg] bg-[#dcecff]/65" style="clip-path: polygon(7% 16%, 91% 0, 100% 73%, 18% 100%, 0 58%)" />
          </div>
          <h2 class="about-enter text-[clamp(2.5rem,5.2vw,5.7rem)] font-extrabold leading-[0.96] tracking-[-0.07em] text-[#15201d]">
            <span class="relative inline-block -rotate-[1deg]"><span v-for="(ch, i) in titleLine1" :key="`a${i}`" class="title-char inline-block will-change-transform">{{ ch }}</span></span><br><span class="relative isolate ml-[6%] inline-block rotate-[1deg] text-[#5da9ff] lg:-mr-20"><i class="hl-sweep pointer-events-none absolute inset-y-[10%] inset-x-0 -z-10 bg-[#dcecff]/70" style="clip-path: polygon(2% 18%, 98% 0, 100% 82%, 0 100%); transform: scaleX(0); transform-origin: left;" aria-hidden="true" /><span v-for="(ch, i) in titleLine2" :key="`b${i}`" class="title-char inline-block will-change-transform">{{ ch }}</span></span>
          </h2>
          <div ref="paraRef" class="relative">
            <p class="about-enter mt-6 max-w-2xl text-lg font-semibold leading-relaxed tracking-[-0.025em] text-[#15201d] md:text-2xl">
              我是 <span class="annot cursor-default">Shawn Niu</span>，一名计算机科学学生，也是一名<span class="annot cursor-default">正在形成自己方法</span>的 AI 应用构建者。
            </p>
            <p class="about-enter mt-4 max-w-2xl text-xs leading-6 text-muted md:text-sm md:leading-7">
              从计算机基础、Python 和数据库出发，我逐渐把注意力集中到<span class="annot cursor-default">本地模型、知识检索与 RAG 应用</span>。希望做出的东西不仅能够展示，也能<span class="annot cursor-default">真正使用、理解和继续维护</span>。
            </p>
          </div>
        </div>

        <aside class="about-enter relative lg:-ml-4 lg:pt-1">
          <div class="flex items-center justify-between">
            <p class="metadata text-[#3975b9]">Identity constellation / 2026</p>
            <span class="px-layer hidden lg:inline" data-depth="1.4" aria-hidden="true"><span class="inline-block -rotate-6 bg-[#fff2c9] px-3 py-1 font-mono text-[8px] text-[#9a6a16]">STILL GROWING</span></span>
          </div>
          <svg class="pointer-events-none absolute inset-x-3 top-12 hidden h-[270px] w-[95%] lg:block" viewBox="0 0 520 270" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path class="growth-path" d="M25 50 C145 5 155 116 265 80 S382 28 500 82 M92 190 C170 142 265 238 360 171 S448 142 510 204" stroke="#acd8ca" stroke-width="1.2" stroke-dasharray="3 6" />
            <path class="growth-path" d="M265 80 C245 126 260 147 360 171" stroke="#8dbdf2" stroke-width="1" />
          </svg>
          <dl class="relative mt-4 grid grid-cols-1 gap-x-7 gap-y-1 border-t-2 border-[#15201d] pt-2 md:grid-cols-2 lg:min-h-[280px] lg:content-center lg:border-0 lg:pt-0">
            <div
              v-for="(item, index) in identityItems"
              :key="item.label"
              :ref="el => { if (el) cardEls[index] = el }"
              role="button"
              tabindex="0"
              :aria-expanded="activeCard === index"
              class="group relative cursor-pointer select-none border-b border-stroke bg-white/75 hover:z-20 lg:bg-white/90 will-change-transform"
              :class="activeCard === index ? 'z-30' : 'z-10'"
              @click="toggleCard(index)"
              @keydown.enter.prevent="toggleCard(index)"
            >
              <div v-magnetic="{ strength: 0.12, radius: 70 }" class="px-1 py-4 md:py-5 lg:px-3">
                <dt class="metadata flex items-center gap-2 text-muted"><component :is="item.icon" class="size-3.5" :style="{ color: item.color }" />{{ item.label }}</dt>
                <dd class="mt-2 text-right text-sm font-semibold text-[#15201d]" :class="item.label === 'Name' ? 'text-lg font-bold' : item.label === 'Period' ? 'font-mono text-xs text-[#267f68]' : ''">{{ item.value }}</dd>
                <div class="grid transition-all duration-300 ease-out" :class="activeCard === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
                  <p class="overflow-hidden text-right text-[10px] leading-5 text-muted">
                    <span class="block pt-2">{{ item.detail }}</span>
                  </p>
                </div>
              </div>
              <i class="absolute -left-1 bottom-[-3px] h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: item.color }" />
            </div>
          </dl>
          <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 lg:-mt-1 lg:justify-end">
            <span v-for="item in ['AI 探索', '工程能力', '动手实践', '创意表达', '认真可靠']" :key="item" v-magnetic="{ strength: 0.3, radius: 36 }" class="inline-block cursor-default px-1 py-0.5"><span class="kw-tag inline-block font-mono text-[9px] text-muted will-change-transform">{{ item }}</span></span>
          </div>
        </aside>
      </div>

      <div class="about-enter relative mt-6 hidden grid-cols-3 gap-8 pt-5 md:grid lg:mt-2">
        <svg class="pointer-events-none absolute inset-x-0 top-0 h-6 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none" fill="none"><path d="M0 18 C280 0 405 25 650 11 S935 3 1200 16" stroke="#cfe0db" /></svg>
        <article v-for="principle in principles" :key="principle.number" class="principle-card group cursor-default border-l-2 pl-4 will-change-transform" :style="{ borderColor: principle.color }">
          <div class="flex items-center gap-2">
            <span class="font-mono text-[8px] text-muted">{{ principle.number }}</span>
            <span class="relative text-sm font-bold text-[#15201d]">
              {{ principle.title }}
              <i class="principle-mark absolute -bottom-1 left-0 h-[3px] w-full" :style="{ backgroundColor: principle.color }" aria-hidden="true" />
            </span>
          </div>
          <p class="mt-2 text-[10px] leading-5 text-muted transition-colors duration-300 group-hover:text-[#15201d]/70">{{ principle.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 手绘感下划线:悬停原则条目时画出 */
.principle-mark {
  clip-path: polygon(0 35%, 8% 0, 52% 30%, 78% 5%, 100% 40%, 96% 100%, 40% 75%, 10% 100%);
  transform: scaleX(0);
  transform-origin: left;
  opacity: 0.75;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.group:hover .principle-mark {
  transform: scaleX(1);
}
</style>