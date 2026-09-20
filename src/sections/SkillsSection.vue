<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import CapabilityIcon from '@/components/CapabilityIcon.vue'
import { capabilityGroups } from '@/data/portfolio.js'
import { reducedMotion } from '@/lib/animations.js'

const rootRef = ref(null)
const motionEnabled = !reducedMotion()
const bandLayouts = ['lg:w-[96%] lg:-rotate-[0.5deg]', 'lg:ml-[6%] lg:w-[94%] lg:rotate-[0.7deg]', 'lg:ml-[2%] lg:w-[98%] lg:-rotate-[0.35deg]']
const bandColors = ['rgba(93,169,255,.08)', 'rgba(89,214,179,.09)', 'rgba(255,201,100,.09)']
const shadowColors = ['rgba(93,169,255,.28)', 'rgba(89,214,179,.30)', 'rgba(255,201,100,.30)']
const ghostColors = ['rgba(93,169,255,.10)', 'rgba(38,127,104,.10)', 'rgba(232,163,61,.12)']
const tagRotations = ['-2deg', '1deg', '2deg', '-1deg', '1.5deg']
const tagRadius = [
  '58% 42% 55% 45% / 48% 55% 45% 52%',
  '42% 58% 45% 55% / 55% 45% 58% 42%',
  '55% 45% 40% 60% / 45% 58% 42% 55%',
]
// 手绘分隔线(每条波浪略有不同)
const dividerPaths = [
  'M0 14 C210 4 390 22 620 10 S950 4 1200 15',
  'M0 10 C260 20 430 4 660 16 S990 22 1200 9',
  'M0 12 C190 2 410 24 640 12 S960 6 1200 16',
]

// 标题逐字
const titleLine1 = ['三', '层', '能', '力', '，']
const titleLine2 = ['一', '条', '实', '践', '路', '径', '。']

let ctx = null

const expandedGroup = ref(null)
const expandedData = computed(() => capabilityGroups.find(g => g.id === expandedGroup.value) ?? null)

function toggleExpand(id) {
  expandedGroup.value = expandedGroup.value === id ? null : id
}

onMounted(() => {
  const root = rootRef.value
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  ctx = gsap.context(() => {
    if (reducedMotion()) {
      gsap.set('.skills-enter', { autoAlpha: 1 })
      gsap.set('.skills-trunk', { strokeDashoffset: 0 })
      return
    }
    // 行:底部掀开
    gsap.fromTo('.skills-enter',
      { autoAlpha: 0, y: 26, clipPath: 'inset(100% 0% 0% 0%)' },
      { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, stagger: 0.09, ease: 'expo.out', delay: 0.2, clearProps: 'clipPath' },
    )
    // 标题:逐字从上方落下,落地弹跳
    gsap.fromTo('.title-char',
      { y: -90, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.05, ease: 'bounce.out', delay: 0.4 },
    )
    const path = root.querySelector('.skills-trunk')
    const length = path?.getTotalLength?.() ?? 0
    if (path) {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, { strokeDashoffset: 0, duration: 1, delay: 0.5, ease: 'power2.out' })
    }
  }, root)

  // 幽灵编号:随鼠标反向漂移(惯性)
  if (finePointer && !reducedMotion()) {
    const ghosts = Array.from(root.querySelectorAll('.ghost-num'))
    if (!ghosts.length) return
    const movers = ghosts.map((el, i) => {
      gsap.set(el, { rotation: -6 })
      return {
        x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power2.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power2.out' }),
        depth: 12 + i * 7,
      }
    })
    const onMove = (e) => {
      const r = root.getBoundingClientRect()
      const nx = (e.clientX - (r.left + r.width / 2)) / r.width
      const ny = (e.clientY - (r.top + r.height / 2)) / r.height
      movers.forEach(({ x, y, depth }) => {
        x(-nx * depth)
        y(-ny * depth)
      })
    }
    root.addEventListener('pointermove', onMove)
    ctx?.add?.(() => {})
    onUnmounted(() => root.removeEventListener('pointermove', onMove))
  }
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section ref="rootRef" id="skills" class="relative flex h-full items-center overflow-hidden bg-[#eaf8f3] px-5 pb-5 pt-24 md:px-8 md:pb-7 md:pt-24">
    <div class="absolute inset-0 opacity-30" style="background-image:radial-gradient(circle,rgba(38,127,104,.22) 1px,transparent 1px);background-size:26px 26px" />
    <div class="absolute right-0 top-0 h-full w-[18%] bg-white/20" />
    <span class="absolute -bottom-8 right-0 text-[17vw] font-extrabold leading-none tracking-[-0.1em] text-[#267f68]/[0.045]">SYSTEM</span>

    <div class="relative z-10 mx-auto w-full max-w-[1320px]">
      <div class="skills-enter relative grid items-end gap-4 pb-5 lg:grid-cols-[1fr_0.45fr]">
        <svg class="pointer-events-none absolute -bottom-2 left-0 h-7 w-full" viewBox="0 0 1200 28" preserveAspectRatio="none" fill="none"><path d="M0 19 C225 3 388 31 605 13 S970 4 1200 20" stroke="#15201d" stroke-width="2" /></svg>
        <div>
          <span class="studio-kicker flex items-center gap-3">
            <svg class="h-6 w-12" viewBox="0 0 48 24" fill="none" aria-hidden="true">
              <path d="M6 17 C14 13 18 15 24 11 S36 7 42 9" stroke="#8dbdf2" stroke-width="1.1" stroke-linecap="round" />
              <circle cx="8" cy="17" r="3" fill="#5da9ff" />
              <circle cx="24" cy="11" r="3" fill="#59d6b3" />
              <circle cx="41" cy="9" r="3" fill="#ffc964" />
              <path d="M4 21 C16 19 32 20 44 19" stroke="#267f68" stroke-width="1" stroke-linecap="round" opacity=".5" />
            </svg>
            Capability system / 能力结构
          </span>
          <h2 class="mt-4 text-[clamp(2.4rem,5.2vw,5.3rem)] font-extrabold leading-[0.96] tracking-[-0.07em] text-[#15201d]">
            <span class="inline-block -rotate-1"><span v-for="(ch, i) in titleLine1" :key="`a${i}`" class="title-char inline-block will-change-transform">{{ ch }}</span></span>
            <span class="ml-[3%] inline-block translate-y-1 rotate-1 text-[#267f68]"><span v-for="(ch, i) in titleLine2" :key="`b${i}`" class="title-char inline-block will-change-transform">{{ ch }}</span></span>
          </h2>
        </div>
        <p class="hidden rotate-1 text-right text-xs leading-6 text-muted lg:block">从开发基础出发，经由 AI 应用能力，最终落到可维护、可部署的工程实现。</p>
      </div>

      <div class="skills-list relative mt-3">
        <svg class="pointer-events-none absolute bottom-1 left-[3.5%] top-1 z-10 hidden h-[calc(100%-8px)] w-[7%] md:block" viewBox="0 0 100 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path id="skills-growth-trunk" class="skills-trunk" d="M48 0 C12 98 84 166 46 252 S15 430 66 600" stroke="url(#skillGradient)" stroke-width="1.8" />
          <defs><linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="600" gradientUnits="userSpaceOnUse"><stop stop-color="#5da9ff"/><stop offset=".52" stop-color="#59d6b3"/><stop offset="1" stop-color="#ffc964"/></linearGradient></defs>
          <circle v-if="motionEnabled" r="5" fill="#15201d"><animateMotion dur="5.5s" repeatCount="indefinite"><mpath href="#skills-growth-trunk" /></animateMotion></circle>
        </svg>

        <article
          v-for="(group, groupIndex) in capabilityGroups"
          :key="group.id"
          class="band-row skills-enter group relative isolate cursor-pointer select-none py-5 transition-all duration-300 md:py-7"
          :class="[bandLayouts[groupIndex], expandedGroup && expandedGroup !== group.id ? 'opacity-40' : 'opacity-100']"
          :style="{ '--sc': shadowColors[groupIndex] }"
          role="button"
          tabindex="0"
          :aria-expanded="expandedGroup === group.id"
          @click="toggleExpand(group.id)"
          @keydown.enter.prevent="toggleExpand(group.id)"
        >
          <!-- 巨型幽灵编号(随鼠标反向漂移) -->
          <span
            class="ghost-num pointer-events-none absolute -top-3 right-[3%] -z-10 hidden select-none font-display italic leading-none md:block"
            :style="{ color: ghostColors[groupIndex], fontSize: 'clamp(4.5rem, 9vw, 8.5rem)' }"
            aria-hidden="true"
          >{{ group.number }}</span>

          <!-- 悬停荧光扫色 -->
          <span class="band-sweep pointer-events-none absolute inset-y-2 left-[8%] right-0 -z-10" :style="{ backgroundColor: bandColors[groupIndex], clipPath: 'polygon(2% 13%, 97% 0, 100% 74%, 84% 100%, 0 87%)' }" />

          <div class="grid gap-3 md:grid-cols-[0.08fr_0.22fr_0.32fr_0.38fr] md:items-center md:gap-5">
            <span class="relative font-mono text-[9px] text-[#267f68]">
              <i
                class="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#59d6b3]"
                :class="expandedGroup === group.id ? 'node-pulse' : 'shadow-[0_0_0_5px_rgba(89,214,179,.13)]'"
              />{{ group.number }}
            </span>
            <div class="band-icon flex items-center gap-3">
              <CapabilityIcon :type="group.id" class="transition-transform duration-500 group-hover:rotate-[15deg]" />
              <div>
                <h3 class="relative inline-block text-xl font-extrabold tracking-[-0.035em] text-[#15201d] transition-transform duration-300 group-hover:translate-x-1 md:text-2xl">
                  {{ group.title }}
                  <i class="title-mark" :class="expandedGroup === group.id ? 'title-mark-on' : ''" :style="{ backgroundColor: bandColors[groupIndex] }" aria-hidden="true" />
                </h3>
                <p class="mt-1 text-[10px] text-muted md:hidden">{{ group.summary }}</p>
              </div>
            </div>
            <p class="hidden border-l-2 pl-3 text-xs leading-6 text-muted transition-transform duration-500 group-hover:translate-x-0.5 md:block" :style="{ borderColor: shadowColors[groupIndex] }">{{ group.summary }}</p>
            <div class="flex flex-wrap gap-x-3 gap-y-2 md:justify-end">
              <span
                v-for="(skill, index) in group.skills"
                :key="skill"
                class="skill-tag flex items-center gap-1.5 border-[1.5px] border-[#15201d]/15 bg-white/60 px-2.5 py-1 font-mono text-[9px] font-medium text-[#15201d] md:text-[10px]"
                :style="{ '--rot': tagRotations[index % tagRotations.length], '--i': index, borderRadius: tagRadius[index % 3] }"
              >
                <i class="h-1.5 w-1.5 rounded-full" :class="index % 2 ? 'bg-[#5da9ff]' : 'bg-[#59d6b3]'" />{{ skill }}
              </span>
            </div>
          </div>

          <!-- 点击展开 evidence -->
          <div class="grid transition-all duration-300 ease-out md:col-span-4" :class="expandedGroup === group.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
            <div class="overflow-hidden">
              <p class="pt-3 text-[10px] leading-5 text-muted md:pl-[30%] md:text-[11px] md:leading-6">
                <span class="font-semibold text-[#267f68]">实践来源 →</span> {{ group.evidence }}
              </p>
            </div>
          </div>

          <!-- 手绘波浪分隔线 -->
          <svg class="pointer-events-none absolute -bottom-1 left-0 h-4 w-full" viewBox="0 0 1200 28" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path :d="dividerPaths[groupIndex]" stroke="#b6d9ce" stroke-width="1.6" />
          </svg>
        </article>
      </div>

      <div class="skills-enter mt-5 flex items-center justify-between">
        <span class="metadata text-[#267f68]">Foundation → <span class="font-display italic">AI application</span> → Engineering</span>
        <Transition name="evidence" mode="out-in">
          <p :key="expandedGroup ?? 'default'" class="hidden max-w-lg text-right text-[10px] text-muted md:block">
            {{ expandedData ? `${expandedData.title} · ${expandedData.evidence}` : '能力来自项目中的实际使用，不使用虚构的熟练度百分比。' }}
          </p>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 悬停:荧光色带从左扫到右 + 彩色投影 */
.band-row {
  transition: box-shadow 0.4s ease, transform 0.3s ease, opacity 0.35s ease;
}

.band-row:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 34px -18px var(--sc);
}

.band-sweep {
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.band-row:hover .band-sweep {
  transform: scaleX(1);
}

/* 行悬停:技能标签依次跳起 */
.skill-tag {
  transform: rotate(var(--rot, 0deg));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: calc(var(--i, 0) * 45ms);
}

.band-row:hover .skill-tag {
  transform: rotate(var(--rot, 0deg)) translateY(-4px);
}

/* 展开时组名手绘下划线 */
.title-mark {
  position: absolute;
  left: -2%;
  bottom: -3px;
  height: 5px;
  width: 104%;
  clip-path: polygon(0 35%, 8% 0, 52% 30%, 78% 5%, 100% 40%, 96% 100%, 40% 75%, 10% 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.title-mark-on {
  transform: scaleX(1);
}

/* 展开时编号节点脉冲 */
.node-pulse {
  box-shadow: 0 0 0 5px rgba(89, 214, 179, 0.18);
  animation: node-pulse 1.6s ease-in-out infinite;
}

@keyframes node-pulse {
  0%, 100% { box-shadow: 0 0 0 5px rgba(89, 214, 179, 0.18); }
  50% { box-shadow: 0 0 0 9px rgba(89, 214, 179, 0.05); }
}

.evidence-enter-active { transition: all 0.3s ease-out; }
.evidence-leave-active { transition: all 0.18s ease-in; }
.evidence-enter-from,
.evidence-leave-to { opacity: 0; transform: translateY(6px); }
</style>
