<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import dancePreview from '@/assets/dance-focus-preview.jpg'
import { reducedMotion } from '@/lib/animations.js'

defineProps({
  project: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})

const rootRef = ref(null)
const scoreBars = [62, 78, 54, 86, 70]
const waveBars = [30, 58, 82, 46, 68, 92, 55, 76, 38, 64, 88, 48, 72, 42, 61, 84, 52, 70, 36, 56]
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.preview-enter', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: reducedMotion() ? 0 : 0.45, stagger: 0.05, ease: 'power3.out' })
    if (reducedMotion()) return

    gsap.to('.agent-run-dot', { x: 132, duration: 2.6, repeat: -1, ease: 'none' })
    gsap.fromTo('.agent-score-bar', { scaleX: 0.2, transformOrigin: 'left' }, { scaleX: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' })
    gsap.to('.agent-evidence-dot', { scale: 1.55, repeat: -1, yoyo: true, duration: 1.2, stagger: 0.2, ease: 'sine.inOut' })

    gsap.to('.dance-track', { x: 16, y: -5, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to('.dance-playhead', { xPercent: 740, duration: 4.6, repeat: -1, ease: 'none' })
    gsap.to('.dance-photo', { x: 10, scale: 1.08, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to('.dance-ghost', { x: 22, autoAlpha: 0.08, duration: 2.8, repeat: -1, yoyo: true, stagger: 0.12, ease: 'sine.inOut' })
    gsap.to('.dance-ribbon', { strokeDashoffset: -80, duration: 3, repeat: -1, ease: 'none' })

    gsap.to('.music-bar', { scaleY: 0.28, transformOrigin: 'center', duration: 0.48, repeat: -1, yoyo: true, stagger: { each: 0.035, from: 'random' }, ease: 'sine.inOut' })
    gsap.to('.music-playhead', { x: 250, duration: 4.2, repeat: -1, ease: 'none' })
    gsap.fromTo('.lyric-line', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.55, stagger: 0.12, ease: 'power2.out' })

    gsap.to('.portfolio-core', { rotation: 360, duration: 16, repeat: -1, ease: 'none' })
    gsap.to('.portfolio-node', { scale: 1.55, repeat: -1, yoyo: true, duration: 1.4, stagger: 0.18, ease: 'sine.inOut' })
    gsap.to('.portfolio-shard', { x: 16, y: -9, rotation: '+=4', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to('.portfolio-page-tab', { y: -4, duration: 1.8, repeat: -1, yoyo: true, stagger: 0.16, ease: 'sine.inOut' })
  }, rootRef.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <div ref="rootRef" class="relative h-full w-full">
    <template v-if="compact">
      <div v-if="project.preview === 'agent'" class="h-full overflow-hidden bg-white/75 p-4" style="clip-path: polygon(3% 0,97% 4%,100% 84%,90% 100%,0 92%)">
        <div class="flex items-center justify-between"><span class="metadata text-[#267f68]">AGENT BENCH</span><span class="font-mono text-[7px] text-muted">UNIFIED V3</span></div>
        <div class="mt-5 grid grid-cols-[0.34fr_0.66fr] gap-4">
          <div class="grid gap-2"><i v-for="width in [72,48,61]" :key="width" class="h-2 rounded-full bg-[#d9f4eb]" :style="{ width: `${width}%` }" /></div>
          <div class="grid gap-2"><div v-for="(width,index) in scoreBars.slice(0,3)" :key="width" class="h-2 bg-[#e7eeec]"><i class="agent-score-bar block h-full" :class="index === 1 ? 'bg-[#5da9ff]' : 'bg-[#59d6b3]'" :style="{ width: `${width}%` }" /></div></div>
        </div>
      </div>

      <div v-else-if="project.preview === 'dance'" class="relative h-full overflow-hidden bg-[#eef7f7] p-3 text-[#16333b]" style="clip-path: polygon(2% 8%,96% 0,100% 88%,8% 100%,0 70%)">
        <div class="flex items-center justify-between"><span class="font-mono text-[7px] text-[#267f68]">SAM 2.1 / MOTION CROP</span><span class="rounded-full bg-[#16333b] px-2 py-1 font-mono text-[6px] text-white">9:16</span></div>
        <div class="absolute inset-x-[12%] bottom-5 top-8 overflow-hidden rounded-xl bg-gradient-to-br from-[#2d6471] via-[#387d82] to-[#8bc7b8]">
          <i class="dance-photo absolute -inset-2 bg-cover" :style="{ backgroundImage: `linear-gradient(90deg,rgba(22,74,85,.35),rgba(22,74,85,.05)),url(${dancePreview})`, backgroundPosition: 'center 47%' }" />
          <i class="dance-track absolute left-[18%] top-[7%] h-[84%] w-[64%] rounded-lg border border-[#ffc964] shadow-[0_0_0_1px_rgba(255,255,255,.25)]" />
          <i class="dance-playhead absolute bottom-0 left-[10%] top-0 w-px bg-white/65" />
        </div>
      </div>

      <div v-else-if="project.preview === 'music'" class="h-full overflow-hidden bg-[#fff8ec] p-4" style="clip-path: polygon(5% 0,100% 9%,94% 100%,0 88%)">
        <div class="flex items-center justify-between"><span class="metadata text-[#9c612e]">AURAMUSE</span><span class="font-mono text-[7px] text-[#8758a8]">TEXT PLAN / DEMO</span></div>
        <div class="mt-8 flex h-14 items-center justify-center gap-1.5"><i v-for="(height,index) in waveBars.slice(0,14)" :key="index" class="music-bar w-1 rounded-full" :class="index % 3 ? 'bg-[#e9a64e]' : 'bg-[#a576c2]'" :style="{ height: `${height}%` }" /></div>
      </div>

      <div v-else class="relative h-full overflow-hidden bg-white/80" style="clip-path: polygon(2% 5%,96% 0,100% 86%,88% 100%,0 92%)">
        <div class="absolute inset-y-0 left-0 w-[38%] bg-[#15201d] p-4 text-white"><span class="font-mono text-[7px] text-[#8be2c8]">SN / STUDIO</span><p class="mt-6 text-2xl font-extrabold leading-[.78]">Shawn<br><span class="ml-3">Niu.</span></p></div>
        <div class="studio-grid absolute inset-y-0 right-0 w-[67%]"><span class="absolute right-3 top-3 metadata text-[#3975b9]">DAYLIGHT SYSTEM</span><div class="portfolio-core absolute left-[54%] top-[58%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[43%_57%_38%_62%] border border-[#59d6b3]"><i class="absolute inset-3 rotate-45 rounded-xl border border-[#5da9ff]"/><i class="absolute inset-[46%] rounded-full bg-[#15201d]"/></div></div>
      </div>
    </template>

    <template v-else>
      <div v-if="project.preview === 'agent'" class="h-full overflow-hidden rounded-[2.7rem_1.2rem_3rem_1.5rem] border-4 border-white bg-[#f8fbfa] shadow-[0_35px_80px_rgba(33,111,91,.18)]">
        <div class="preview-enter flex h-12 items-center justify-between border-b border-[#cfe0da] px-5"><span class="font-mono text-[8px] text-[#267f68]">AGENT BENCH / CONTROL ROOM</span><span class="rounded-full bg-[#15201d] px-3 py-1 font-mono text-[7px] text-white">UNIFIED V3</span></div>
        <div class="grid h-[calc(100%-3rem)] grid-cols-[0.27fr_0.73fr]">
          <aside class="border-r border-[#cfe0da] bg-[#eef8f4] p-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-[44%_56%_40%_60%] bg-[#15201d] font-mono text-[9px] text-white">AB</div>
            <p class="mt-5 metadata text-[#267f68]">Workspace</p>
            <div class="mt-3 grid gap-2"><span v-for="(item,index) in ['Agent plaza','Experiments','Evidence','Leaderboard']" :key="item" class="rounded-lg px-2 py-2 font-mono text-[7px]" :class="index === 1 ? 'bg-white text-[#15201d]' : 'text-muted'">{{ item }}</span></div>
            <div class="mt-5 border-t border-[#cfe0da] pt-3"><span class="font-mono text-[7px] text-muted">WORKER STATUS</span><div class="mt-2 flex gap-1"><i v-for="i in 4" :key="i" class="h-2 w-2 rounded-full" :class="i < 4 ? 'bg-[#59d6b3]' : 'bg-[#cfe0da]'" /></div></div>
          </aside>
          <main class="p-5">
            <div class="preview-enter flex items-end justify-between"><div><p class="metadata text-[#3975b9]">Evaluation experiment</p><h3 class="mt-1 text-lg font-extrabold text-[#15201d]">Agent capability matrix</h3></div><span class="font-mono text-[7px] text-[#267f68]">RUNNING</span></div>
            <div class="preview-enter relative mt-4 h-1 overflow-hidden rounded-full bg-[#e3ece9]"><i class="block h-full w-2/3 bg-[#59d6b3]"/><i class="agent-run-dot absolute left-0 top-[-2px] h-2 w-2 rounded-full bg-[#15201d]"/></div>
            <div class="mt-5 grid grid-cols-[0.58fr_0.42fr] gap-4">
              <section class="preview-enter rounded-2xl border border-[#dbe7e3] bg-white p-4">
                <div v-for="(width,index) in scoreBars" :key="width" class="mb-3 grid grid-cols-[0.4fr_0.6fr] items-center gap-2 last:mb-0"><span class="font-mono text-[6px] text-muted">{{ ['REASON','RETRIEVAL','DATA','INSTRUCTION','CONTEXT'][index] }}</span><span class="h-2 rounded-full bg-[#edf2f0]"><i class="agent-score-bar block h-full rounded-full" :class="index % 2 ? 'bg-[#5da9ff]' : 'bg-[#59d6b3]'" :style="{ width: `${width}%` }" /></span></div>
              </section>
              <section class="preview-enter rounded-2xl bg-[#15201d] p-4 text-white"><p class="font-mono text-[7px] text-[#8be2c8]">EVIDENCE CHAIN</p><div class="mt-4 grid gap-3"><span v-for="item in ['ANSWER','JUDGE','CITATION','ARTIFACT']" :key="item" class="flex items-center gap-2 font-mono text-[6px] text-white/65"><i class="agent-evidence-dot h-1.5 w-1.5 rounded-full bg-[#59d6b3]"/>{{ item }}</span></div></section>
            </div>
          </main>
        </div>
      </div>

      <div v-else-if="project.preview === 'dance'" class="h-full overflow-hidden rounded-[1.4rem_3rem_1.8rem_2.4rem] border-4 border-white bg-[#eef7f7] shadow-[0_35px_90px_rgba(29,78,90,.22)]">
        <div class="preview-enter flex h-12 items-center justify-between border-b border-[#c7dfdc] px-5"><div class="flex items-center gap-3"><span class="flex h-7 w-7 items-center justify-center rounded-[44%_56%_40%_60%] bg-[#16333b] font-mono text-[7px] text-white">DF</span><span class="font-mono text-[8px] text-[#267f68]">MOTION REFRAME STUDIO</span></div><span class="rounded-full bg-[#d9f4eb] px-3 py-1 font-mono text-[6px] text-[#267f68]">SAM 2.1 · SUBJECT LOCKED</span></div>
        <div class="grid h-[calc(100%-3rem)] grid-cols-[0.76fr_0.24fr] gap-3 p-4">
          <main class="grid grid-rows-[1fr_auto] gap-3">
            <div class="preview-enter relative overflow-hidden rounded-[1.5rem_1rem_1.8rem_1rem] bg-gradient-to-br from-[#255664] via-[#3a7d82] to-[#9acdbd]">
              <div class="dance-photo absolute -inset-3 bg-cover" :style="{ backgroundImage: `linear-gradient(90deg,rgba(19,75,86,.5),rgba(19,75,86,.08) 58%,rgba(19,75,86,.25)),url(${dancePreview})`, backgroundPosition: 'center 48%' }" />
              <div class="absolute inset-0 opacity-20" style="background-image:linear-gradient(rgba(255,255,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.16) 1px,transparent 1px);background-size:48px 48px"/>
              <div class="absolute inset-y-0 left-[29%] right-[29%] border-x border-dashed border-white/35" />
              <svg class="absolute inset-0 h-full w-full" viewBox="0 0 520 260" preserveAspectRatio="none" fill="none"><path class="dance-ribbon" d="M-30 205C88 112 150 238 267 118S421 97 558 22" stroke="#d9f4eb" stroke-opacity=".45" stroke-width="2" stroke-dasharray="8 8"/><path d="M-20 232C108 171 172 270 287 181S431 151 550 90" stroke="#5da9ff" stroke-opacity=".35"/></svg>
              <div class="dance-track absolute left-[18%] top-[6%] h-[88%] w-[62%] rounded-xl border border-[#ffc964] shadow-[0_0_0_1px_rgba(255,255,255,.22)]"><i class="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-[#ffc964]"/><i class="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-[#ffc964]"/><span class="absolute -top-5 left-0 rounded bg-[#ffc964] px-2 py-1 font-mono text-[6px] text-[#664810]">TARGET 01 · LOCKED</span></div>
              <span class="absolute bottom-3 left-4 font-mono text-[6px] text-white/70">DEMO FOOTAGE · FRAME 0421 / 0903</span>
            </div>
            <div class="preview-enter rounded-xl bg-white p-3"><div class="flex items-center gap-3"><span class="font-mono text-[6px] text-muted">00:00</span><div class="relative h-7 flex-1 overflow-hidden rounded-lg bg-[#e7f0ee]"><i v-for="i in 20" :key="i" class="inline-block h-full w-[5%] border-r border-[#bdd4ce]"/><i class="dance-playhead absolute bottom-0 left-[10%] top-0 w-px bg-[#3975b9]"/></div><span class="font-mono text-[6px] text-muted">00:30</span></div></div>
          </main>
          <aside class="preview-enter grid content-start gap-3"><section class="rounded-2xl bg-[#16333b] p-4 text-white"><span class="font-mono text-[6px] text-[#8be2c8]">OUTPUT FRAME</span><p class="mt-3 text-2xl font-extrabold">9:16</p><p class="mt-1 font-mono text-[6px] text-white/45">404 × 720</p></section><section class="rounded-2xl bg-white p-4"><span class="font-mono text-[6px] text-[#267f68]">PIPELINE</span><div class="mt-3 grid gap-2"><span v-for="item in ['MASK','SMOOTH','AUDIO']" :key="item" class="flex items-center justify-between font-mono text-[6px] text-muted">{{ item }}<i class="h-1.5 w-1.5 rounded-full bg-[#59d6b3]"/></span></div></section><section class="rounded-2xl bg-[#dcecff] p-4"><span class="font-mono text-[6px] text-[#3975b9]">EXPORT</span><p class="mt-2 text-[8px] font-bold text-[#16333b]">MP4 + SOURCE AUDIO</p></section></aside>
        </div>
      </div>

      <div v-else-if="project.preview === 'music'" class="h-full overflow-hidden rounded-[3rem_1.2rem_2.2rem_2rem] border-4 border-white bg-[#fff8ed] shadow-[0_35px_85px_rgba(151,94,46,.2)]">
        <div class="preview-enter flex h-12 items-center justify-between px-5"><div><span class="text-sm font-extrabold text-[#492c3e]">AuraMuse</span><span class="ml-2 font-mono text-[6px] text-[#9c612e]">AI MUSIC WORKBENCH</span></div><span class="rotate-2 bg-[#f4d9ff] px-3 py-1 font-mono text-[6px] text-[#754494]">TEXT PLAN / DEMO</span></div>
        <div class="grid h-[calc(100%-3rem)] grid-cols-[0.38fr_0.62fr] gap-3 px-4 pb-4">
          <aside class="preview-enter rounded-[1.6rem_1rem_2rem_1rem] bg-[#f5e7d7] p-4"><p class="font-mono text-[7px] text-[#9c612e]">CREATE</p><div class="mt-3 rounded-xl bg-white/70 p-3"><span class="font-mono text-[6px] text-muted">PROMPT</span><p class="mt-2 text-[8px] font-semibold leading-4 text-[#492c3e]">温暖、轻盈，带有夏夜气息的旋律</p></div><div class="mt-3 grid gap-2"><span v-for="item in ['LYRICS','STYLE','VOCAL','REMIX']" :key="item" class="rounded-lg bg-white/45 px-3 py-2 font-mono text-[6px] text-[#7d5e52]">{{ item }}</span></div></aside>
          <main class="grid grid-rows-[0.62fr_0.38fr] gap-3">
            <section class="preview-enter relative overflow-hidden rounded-2xl bg-[#37293f] p-4 text-white"><div class="flex justify-between"><span class="font-mono text-[7px] text-[#efb35d]">ARRANGEMENT PLAN</span><span class="font-mono text-[6px] text-white/35">DEEPSEEK</span></div><div class="relative mt-7 flex h-20 items-center gap-1"><i v-for="(height,index) in waveBars" :key="index" class="music-bar w-1 rounded-full" :class="index % 3 ? 'bg-[#efb35d]' : 'bg-[#b789d1]'" :style="{ height: `${height}%` }"/><i class="music-playhead absolute bottom-0 left-0 top-0 w-px bg-white/70"/></div></section>
            <section class="preview-enter grid grid-cols-[0.58fr_0.42fr] gap-3"><div class="rounded-2xl bg-white p-3"><span class="font-mono text-[6px] text-[#8758a8]">LYRICS DRAFT</span><div class="mt-3 grid gap-2"><i v-for="width in [92,78,86]" :key="width" class="lyric-line h-1.5 rounded-full bg-[#eadcf0]" :style="{ width: `${width}%` }"/></div></div><div class="rounded-2xl bg-[#f5d79f] p-3"><span class="font-mono text-[6px] text-[#8a5820]">LIBRARY</span><p class="mt-3 text-lg font-extrabold text-[#492c3e]">03</p></div></section>
          </main>
        </div>
      </div>

      <div v-else class="h-full overflow-hidden rounded-[1.4rem_3rem_1.8rem_2.6rem] border-4 border-white bg-[#f8fbfa] shadow-[0_35px_85px_rgba(57,117,185,.2)]">
        <div class="relative grid h-full grid-cols-[0.42fr_0.58fr]">
          <section class="preview-enter relative z-10 overflow-hidden bg-[#15201d] p-6 text-white" style="clip-path: polygon(0 0,100% 0,88% 43%,100% 100%,0 100%)"><div class="flex items-center gap-3"><span class="flex h-8 w-8 -rotate-6 items-center justify-center rounded-[44%_56%_39%_61%] bg-white font-mono text-[7px] text-[#15201d]">SN</span><span class="font-mono text-[6px] tracking-[.18em] text-[#8be2c8]">DAYLIGHT / SYSTEM</span></div><p class="mt-14 font-mono text-[7px] text-white/45">DESIGN · MOTION · CODE</p><h3 class="mt-3 text-5xl font-extrabold leading-[.76] tracking-[-.08em]">Shawn<br><span class="ml-7">Niu<span class="text-[#59d6b3]">.</span></span></h3><p class="mt-6 max-w-44 text-[9px] font-semibold leading-4 text-white/75">把想法做成可运行的 AI 应用</p><div class="absolute bottom-6 left-6 flex gap-2"><i class="h-2 w-8 rounded-full bg-[#59d6b3]"/><i class="h-2 w-5 rounded-full bg-[#5da9ff]"/><i class="h-2 w-3 rounded-full bg-[#ffc964]"/></div></section>
          <section class="studio-grid preview-enter relative overflow-hidden bg-[#f8fbfa]">
            <div class="absolute left-6 right-6 top-5 flex items-center justify-between"><span class="font-mono text-[6px] text-muted">INTERACTIVE KNOWLEDGE CORE</span><span class="font-mono text-[6px] text-[#267f68]">06 CONNECTED PAGES</span></div>
            <div class="portfolio-shard absolute inset-[13%] rotate-6 bg-[#dff7ef]/80" style="clip-path: polygon(18% 0,80% 5%,100% 40%,88% 91%,43% 100%,0 78%,4% 24%)"/>
            <svg class="absolute inset-[12%] h-[76%] w-[76%]" viewBox="0 0 300 260" fill="none"><path d="M150 130C93 83 58 67 15 49M150 130c57-50 91-70 136-93M150 130c-58 47-91 70-131 105M150 130c55 45 89 69 130 106" stroke="#91cdbb" stroke-dasharray="4 6"/><circle cx="15" cy="49" r="4" fill="#59d6b3"/><circle cx="286" cy="37" r="4" fill="#5da9ff"/><circle cx="19" cy="235" r="4" fill="#5da9ff"/><circle cx="280" cy="236" r="4" fill="#59d6b3"/></svg>
            <div class="portfolio-core absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[44%_56%_39%_61%] border border-[#59d6b3]"><i class="absolute inset-6 rotate-45 rounded-[2rem_1rem_2.4rem_1.3rem] border border-[#5da9ff]"/><i class="absolute inset-[45%] rounded-full bg-[#15201d] shadow-[0_0_0_8px_rgba(89,214,179,.16)]"/></div>
            <span v-for="(node,index) in ['PYTHON','RAG','VUE','GSAP']" :key="node" class="absolute flex items-center gap-1.5 font-mono text-[6px] text-[#3975b9]" :class="['left-[8%] top-[25%]','right-[7%] top-[22%]','left-[9%] bottom-[22%]','right-[7%] bottom-[18%]'][index]"><i class="portfolio-node h-1.5 w-1.5 rounded-full bg-[#59d6b3]"/>{{ node }}</span>
            <div class="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2"><span v-for="(page,index) in ['HOME','ABOUT','SKILLS','WORK']" :key="page" class="portfolio-page-tab rounded-full border border-[#cdded8] bg-white/75 px-3 py-1 font-mono text-[6px]" :class="index === 3 ? 'text-[#3975b9]' : 'text-muted'">{{ page }}</span></div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
