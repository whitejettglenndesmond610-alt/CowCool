<script setup>
import { computed, nextTick, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import TransitionGlyph from '@/components/TransitionGlyph.vue'

const rootRef = ref(null)
const fromPage = ref({ number: '01', label: '首页', id: 'home' })
const toPage = ref({ number: '02', label: '关于', id: 'about' })
const direction = ref(1)
const motionRef = ref(null)
let timeline = null

const palettes = {
  home: { back: '#5da9ff', mid: '#9de4cf', front: '#edf8f4', ink: '#15201d', accent: '#59d6b3' },
  about: { back: '#59d6b3', mid: '#98c9ff', front: '#eaf4ff', ink: '#15201d', accent: '#5da9ff' },
  skills: { back: '#5da9ff', mid: '#84dfc5', front: '#dff7ef', ink: '#15201d', accent: '#267f68' },
  projects: { back: '#59d6b3', mid: '#77b7ff', front: '#dcecff', ink: '#15201d', accent: '#5da9ff' },
  timeline: { back: '#59d6b3', mid: '#ffc964', front: '#fff2c9', ink: '#15201d', accent: '#c88713' },
  contact: { back: '#5da9ff', mid: '#59d6b3', front: '#c9f3e5', ink: '#15201d', accent: '#267f68' },
}

const palette = computed(() => palettes[toPage.value.id] ?? palettes.home)
const rootStyle = computed(() => ({
  '--transition-ink': palette.value.ink,
  '--transition-accent': palette.value.accent,
}))

function prepareStrokes(root) {
  root.querySelectorAll('.transition-glyph .glyph-stroke, .route-path').forEach(path => {
    const length = path.getTotalLength?.() ?? 0
    if (length) gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
  })
}

async function play({ from, to, travelDirection, onCovered, onComplete }) {
  timeline?.kill()
  fromPage.value = from
  toPage.value = to
  direction.value = travelDirection
  await nextTick()

  const root = rootRef.value
  if (!root) {
    onCovered?.()
    onComplete?.()
    return
  }

  const leaves = root.querySelectorAll('.transition-leaf')
  const startX = direction.value > 0 ? 118 : -118
  const exitX = direction.value > 0 ? -118 : 118
  const relationship = root.querySelector('.transition-relationship')
  const glyph = root.querySelector('.transition-glyph-wrap')
  const dots = root.querySelectorAll('.transition-glyph .glyph-node')
  const routePath = root.querySelector('.route-path')
  const glyphStrokes = root.querySelectorAll('.transition-glyph .glyph-stroke')
  const decor = root.querySelector('.transition-decor')

  gsap.set(root, { autoAlpha: 1 })
  gsap.set(leaves, { xPercent: startX })
  if (decor) gsap.set(decor, { autoAlpha: 0 })
  gsap.set(relationship, { autoAlpha: 0, x: direction.value * 36 })
  gsap.set(glyph, { autoAlpha: 0, scale: 0.72, rotation: direction.value * -8 })
  gsap.set(dots, { scale: 0, transformOrigin: 'center' })
  prepareStrokes(root)
  motionRef.value?.beginElement?.()

  timeline = gsap.timeline({
    onComplete: () => {
      gsap.set(root, { autoAlpha: 0 })
      onComplete?.()
    },
  })

  timeline
    .to(leaves, { xPercent: 0, duration: 0.28, stagger: 0.04, ease: 'power3.inOut' })
    // 装饰层随遮盖过程柔和淡入,不再突兀蹦出
    .to(decor, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0.12)
    .to(glyph, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.28, ease: 'back.out(1.5)' }, 0.11)
    .to(relationship, { autoAlpha: 1, x: 0, duration: 0.24, ease: 'power3.out' }, 0.14)
    .to(routePath, { strokeDashoffset: 0, duration: 0.32, ease: 'power2.out' }, 0.17)
    .to(glyphStrokes, { strokeDashoffset: 0, duration: 0.3, stagger: 0.015, ease: 'power2.out' }, 0.16)
    .to(dots, { scale: 1, duration: 0.18, stagger: 0.025, ease: 'back.out(2)' }, 0.2)
    .add(() => onCovered?.(), 0.36)
    .to([relationship, glyph], { autoAlpha: 0, scale: 0.94, duration: 0.14, ease: 'power2.in' }, 0.48)
    // 色叶滑走前先淡出装饰层,避免残留色块压在目标页上
    .to(decor, { autoAlpha: 0, duration: 0.16, ease: 'power2.in' }, 0.46)
    .to(leaves, { xPercent: exitX, duration: 0.31, stagger: 0.03, ease: 'power3.inOut' }, 0.5)
}

onUnmounted(() => timeline?.kill())

defineExpose({ play })
</script>

<template>
  <div ref="rootRef" class="pointer-events-none invisible fixed inset-0 z-[70] overflow-hidden" :style="rootStyle" aria-hidden="true">
    <div v-for="(color,index) in [palette.back, palette.mid, palette.front]" :key="index" class="transition-leaf absolute -inset-x-[18%] -inset-y-[12%] will-change-transform" :style="{ zIndex: index }">
      <div class="h-full w-full" :class="direction < 0 ? '-scale-x-100' : ''" :style="{ backgroundColor: color, clipPath: index === 0 ? 'polygon(0 0, 86% 0, 100% 25%, 91% 53%, 100% 82%, 84% 100%, 0 100%)' : index === 1 ? 'polygon(0 0, 91% 0, 100% 18%, 95% 48%, 100% 76%, 89% 100%, 0 100%)' : 'polygon(0 0, 96% 0, 100% 14%, 97% 38%, 100% 65%, 95% 100%, 0 100%)' }" />
    </div>

    <div class="transition-decor absolute inset-0 z-10" aria-hidden="true">
      <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle, rgba(21,32,29,.18) 1px, transparent 1px); background-size: 28px 28px; mask-image: radial-gradient(circle at center, #000, transparent 70%)" />
      <span class="absolute -bottom-[12%] left-[3%] -rotate-6 text-[38vw] font-extrabold leading-none tracking-[-0.12em] text-[var(--transition-ink)] opacity-[0.035]">{{ toPage.number }}</span>
      <span class="absolute right-[4%] top-[13%] rotate-6 text-[15vw] font-extrabold leading-none tracking-[-0.08em] text-[var(--transition-ink)] opacity-[0.035]">{{ toPage.label }}</span>
      <div class="absolute left-[6%] top-[12%] h-36 w-56 -rotate-12 opacity-40" :style="{ backgroundColor: palette.mid, clipPath: 'polygon(8% 8%, 100% 0, 86% 89%, 17% 100%, 0 55%)' }" />
      <div class="absolute bottom-[7%] right-[5%] h-40 w-64 rotate-12 opacity-35" :style="{ backgroundColor: palette.back, clipPath: 'polygon(17% 0, 100% 24%, 79% 100%, 0 73%)' }" />
      <svg class="absolute inset-0 h-full w-full opacity-35" viewBox="0 0 1200 800" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path d="M-40 590 C198 430 318 716 538 566 S881 323 1240 436" :stroke="palette.accent" stroke-width="1.2" />
        <path d="M180 520 C142 380 207 250 348 178M538 566C563 389 681 251 835 160M895 361C1019 269 1083 191 1215 145" :stroke="palette.ink" stroke-width=".8" stroke-dasharray="5 8" />
        <g :fill="palette.accent"><circle cx="180" cy="520" r="5"/><circle cx="538" cy="566" r="5"/><circle cx="895" cy="361" r="5"/></g>
        <path d="M348 178c26-12 46-4 46-4s-7 25-35 28c-18 2-27-10-11-24zM835 160c-25-10-45-1-45-1s10 23 37 24c18 0 25-12 8-23z" :fill="palette.mid" :stroke="palette.accent" />
      </svg>
    </div>

    <div class="absolute inset-0 z-20 flex items-center justify-center px-6 pt-16 text-[var(--transition-ink)]">
      <div class="w-full max-w-3xl text-center">
        <p class="font-mono text-[9px] uppercase tracking-[0.22em] opacity-55">Knowledge route · Page transition</p>
        <div class="transition-glyph-wrap relative mx-auto mt-4 h-36 w-36 md:h-48 md:w-48">
          <i class="absolute inset-0 -rotate-6 opacity-30" :style="{ backgroundColor: palette.mid, clipPath: 'polygon(17% 0, 88% 7%, 100% 68%, 72% 100%, 4% 84%, 0 28%)' }" />
          <TransitionGlyph :page-id="toPage.id" class="relative h-full w-full p-5 md:p-7" />
        </div>

        <div class="transition-relationship mx-auto mt-5 grid max-w-2xl grid-cols-[1fr_0.8fr_1fr] items-center gap-3 md:gap-8">
          <div class="text-right">
            <span class="font-mono text-[9px] opacity-55">{{ fromPage.number }}</span>
            <p class="mt-1 text-lg font-extrabold tracking-[-0.04em] md:text-3xl">{{ fromPage.label }}</p>
          </div>

          <svg viewBox="0 0 220 70" class="h-16 w-full overflow-visible" fill="none" aria-hidden="true">
            <path id="transition-route" class="route-path" d="M6 42 C61 5 136 67 214 25" stroke="currentColor" stroke-width="1.5" />
            <path d="M204 20l10 5-7 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <circle r="5" :fill="palette.accent">
              <animateMotion ref="motionRef" dur=".72s" repeatCount="indefinite" begin="indefinite">
                <mpath href="#transition-route" />
              </animateMotion>
            </circle>
          </svg>

          <div class="text-left">
            <span class="font-mono text-[9px] opacity-55">{{ toPage.number }}</span>
            <p class="mt-1 text-lg font-extrabold tracking-[-0.04em] md:text-3xl">{{ toPage.label }}</p>
          </div>
        </div>

        <div class="mx-auto mt-7 flex max-w-xs items-center justify-center gap-3">
          <i v-for="index in 6" :key="index" class="flex h-4 w-4 items-center justify-center rounded-[42%_58%_40%_60%] border font-mono text-[6px] transition-all" :class="index === Number(toPage.number) ? 'rotate-6 border-[var(--transition-ink)] bg-[var(--transition-ink)] text-white' : 'border-[var(--transition-ink)]/25 text-[var(--transition-ink)]/45'">{{ index }}</i>
        </div>
      </div>
    </div>
  </div>
</template>
