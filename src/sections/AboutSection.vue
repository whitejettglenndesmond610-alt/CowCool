<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { target: 5, suffix: '+', label: '完成项目', icon: 'project' },
  { target: 10, suffix: '+', label: '掌握技术栈', icon: 'star' },
  { target: 2025, suffix: '', label: '开始学习编程', icon: 'time' },
  { target: 1, suffix: '+', label: 'AI 项目经验', icon: 'heart' },
]

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target, 10)
    const suffix = el.dataset.suffix || ''
    gsap.fromTo(el,
      { textContent: '0' },
      {
        textContent: target,
        duration: 2,
        ease: 'expo.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: el.closest('.stat-card'),
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate() {
          el.textContent = Math.floor(gsap.getProperty(el, 'textContent')).toLocaleString() + suffix
        },
        onComplete() {
          el.textContent = target.toLocaleString() + suffix
        },
      }
    )
  })
})
</script>

<template>
  <section id="about" class="relative py-[120px] max-md:py-[60px]">
    <div class="max-w-[1200px] mx-auto px-6">
      <div class="text-center mb-16 reveal">
        <h2 class="section-title text-[clamp(2rem,4vw,3rem)] mb-3">关于我</h2>
        <p class="text-muted text-base">AI 应用开发者 · Python 学习者 · RAG 实践者</p>
      </div>

      <div class="grid grid-cols-2 gap-10 max-lg:grid-cols-1 max-lg:gap-8">
        <div class="glass-card gradient-border p-10 max-md:p-7 relative overflow-hidden reveal">
          <div class="relative w-[100px] h-[100px] mx-auto mb-6">
            <div class="w-full h-full rounded-full bg-surface border-2 border-white/10 flex items-center justify-center text-muted relative z-[1]">
              <svg viewBox="0 0 100 100" fill="none" class="w-3/5"><circle cx="50" cy="38" r="16" stroke="currentColor" stroke-width="2"/><path d="M20 85c0-16.569 13.431-30 30-30s30 13.431 30 30" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div class="absolute -inset-1.5 rounded-full animate-[spin_6s_linear_infinite]" style="border:2px solid transparent; background: linear-gradient(135deg,#89AACC,#4E85BF,#89AACC) border-box; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;" />
          </div>

          <div class="flex flex-wrap gap-2.5 justify-center mb-6">
            <span class="text-xs font-medium px-4 py-1.5 rounded-full border border-white/10 text-[#89AACC] bg-white/[0.025] font-mono">AI 应用开发</span>
            <span class="text-xs font-medium px-4 py-1.5 rounded-full border border-white/10 text-[#89AACC] bg-white/[0.025] font-mono">Python</span>
            <span class="text-xs font-medium px-4 py-1.5 rounded-full border border-white/10 text-[#89AACC] bg-white/[0.025] font-mono">计算机科学</span>
          </div>

          <div class="text-muted text-sm leading-relaxed space-y-4">
            <p>我是 牛帅 (Shawn)，郑州工商学院计算机科学与技术专业在读学生（2025.09 – 2027.06 预计毕业）。</p>
            <p>相信「动手实践 + 技术理解」是最好的学习方式。从课程中掌握操作系统、数据库、计算机网络等核心基础，同时主动尝试新技术：用 LangChain + FAISS 构建本地知识库 RAG 问答系统，用 Gradio 搭建 AI 应用界面。</p>
            <p>目前的学习路线：夯实计算机基础 → 掌握 Python/JavaScript 开发 → 深入 AI 应用实践。目标是成为能将 AI 技术落地为实际应用的工程师。</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5 max-md:gap-3">
          <div v-for="s in stats" :key="s.label" class="stat-card glass-card p-7 max-md:p-5 text-center flex flex-col items-center gap-2.5 cursor-default reveal" data-interactive>
            <span class="text-[#89AACC]/80">
              <svg v-if="s.icon === 'project'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>
              <svg v-else-if="s.icon === 'star'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>
              <svg v-else-if="s.icon === 'time'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </span>
            <span class="stat-number text-4xl font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#89AACC] to-[#4E85BF] max-md:text-3xl" style="font-family: Inter, sans-serif;" :data-target="s.target" :data-suffix="s.suffix">0</span>
            <span class="text-xs text-muted font-medium">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
