<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const milestones = [
  {
    year: '2025.09',
    title: '进入大学 · 计算机科学',
    desc: '进入郑州工商学院计算机科学与技术专业，开始系统学习编程基础与计算机理论。',
    side: 'left',
  },
  {
    year: '2025 下',
    title: '前端入门 · 作品集网站',
    desc: '学习 HTML5、CSS3、JavaScript，从零构建个人作品集网站，集成 Swiper.js 轮播与 ScrollReveal 滚动动画。',
    side: 'right',
  },
  {
    year: '2026 上',
    title: '全栈尝试 · 课程项目',
    desc: '完成舞蹈室课堂预约系统，涉及前端界面、后端 API 和 MySQL 数据库，初步理解全栈开发流程。',
    side: 'left',
  },
  {
    year: '2026 中',
    title: 'AI 探索 · RAG 知识库',
    desc: '学习 LangChain + FAISS + Ollama，构建本地部署的多知识库 AI 问答系统，支持多格式文档导入与多轮对话。',
    side: 'right',
  },
  {
    year: '2026 下 - 至今',
    title: '持续进阶 · 深化实践',
    desc: '夯实计算机基础（OS、计算机网络），深入学习 Python 与 AI 应用框架，目标是成为能将 AI 落地的应用开发工程师。',
    side: 'left',
  },
]

onMounted(() => {
  const lineFill = document.querySelector('.timeline-line-fill')
  if (lineFill) {
    gsap.fromTo(lineFill,
      { height: '0%' },
      {
        height: '100%', ease: 'none',
        scrollTrigger: {
          trigger: '#timeline',
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.3,
        },
      }
    )
  }

  document.querySelectorAll('.timeline-item').forEach(item => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      onEnter: () => item.classList.add('active'),
      onLeaveBack: () => item.classList.remove('active'),
    })
  })
})
</script>

<template>
  <section id="timeline" class="py-[120px] max-md:py-[60px]">
    <div class="max-w-[1200px] mx-auto px-6">
      <div class="text-center mb-16 reveal">
        <h2 class="section-title text-[clamp(2rem,4vw,3rem)] mb-3">学习历程</h2>
        <p class="text-muted text-base">从入门到 AI 实践的学习之路</p>
      </div>

      <div class="relative">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/[0.06] overflow-hidden max-md:left-5 max-md:translate-x-0">
          <div class="timeline-line-fill w-full bg-gradient-to-b from-[#89AACC] to-[#4E85BF]" />
        </div>

        <div class="relative">
          <div
            v-for="(m, i) in milestones"
            :key="i"
            class="timeline-item flex items-start mb-[60px] relative last:mb-0 reveal"
          >
            <div class="timeline-dot absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-bg border-2 border-white/15 z-[1] transition-all duration-300 group-[.active]:bg-[#89AACC] group-[.active]:border-[#89AACC] max-md:left-5 max-md:translate-x-0" :class="{'active':false}" />

            <div
              class="glass-card timeline-content w-[calc(50%-50px)] p-7 max-md:w-[calc(100%-56px)] max-md:ml-14 max-md:mr-0"
              :class="m.side === 'left' ? 'mr-auto' : 'ml-auto'"
            >
              <span :class="[m.side === 'left' ? 'mr-auto' : 'ml-auto', 'max-md:!ml-0']">
                <span class="text-xs font-bold text-[#89AACC] font-mono block mb-1.5">{{ m.year }}</span>
                <h3 class="text-lg font-bold text-white mb-2" style="font-family: Inter, sans-serif;">{{ m.title }}</h3>
                <p class="text-sm text-muted leading-relaxed">{{ m.desc }}</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
