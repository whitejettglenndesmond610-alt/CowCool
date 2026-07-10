<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const milestones = [
  {
    year: '2023', title: '初识前端 · First Steps',
    desc: '从在线教程开始学习 HTML、CSS 和 JavaScript。构建了第一个静态网页，爱上了看到代码在浏览器中活起来的感觉。',
    side: 'left',
  },
  {
    year: '2024 上', title: '第一个完整项目 · First Full Project',
    desc: '构建了一个完整的全栈网页应用 — 一个带前端界面、后端 API 和数据库的舞蹈室课程预约系统。了解了各个部分如何协同工作。',
    side: 'right',
  },
  {
    year: '2024 下', title: '探索 AI · Discovering AI',
    desc: '开始尝试 AI 驱动的开发工具和 API。构建结合前端界面与 AI 能力的项目 — 彻底改变了我对可能性的认知。',
    side: 'left',
  },
  {
    year: '2025 上', title: '作品集网站 · Portfolio Site',
    desc: '从零开始设计和构建了这个个人作品集网站 — 展示了我学到的所有东西，包括自定义动画、交互元素和体现我个人风格的设计。',
    side: 'right',
  },
  {
    year: '2025-Now', title: '持续探索 · Keep Exploring',
    desc: '深入学习现代前端框架、全栈模式和 AI 集成。构建更复杂的项目，始终在寻找下一个挑战。',
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
        <h2 class="section-title text-[clamp(2rem,4vw,3rem)] mb-3">我的历程</h2>
        <p class="text-white/40 text-base">至今的学习之路</p>
      </div>

      <div class="relative">
        <!-- Center line -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/[0.06] overflow-hidden max-md:left-5 max-md:translate-x-0">
          <div class="timeline-line-fill w-full bg-gradient-to-b from-[#00c8e8] to-[#7c3aed]" />
        </div>

        <div class="relative">
          <div
            v-for="(m, i) in milestones"
            :key="i"
            class="timeline-item flex items-start mb-[60px] relative last:mb-0 reveal"
          >
            <!-- Dot -->
            <div class="timeline-dot absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#06080d] border-2 border-white/15 z-[1] transition-all duration-300 group-[.active]:bg-[#00c8e8] group-[.active]:border-[#00c8e8] max-md:left-5 max-md:translate-x-0" :class="{'active':false}" />

            <!-- Content -->
            <div
              class="glass-card timeline-content w-[calc(50%-50px)] p-7 max-md:w-[calc(100%-56px)] max-md:ml-14 max-md:mr-0"
              :class="m.side === 'left' ? 'mr-auto' : 'ml-auto'"
            >
              <span :class="[m.side === 'left' ? 'mr-auto' : 'ml-auto', 'max-md:!ml-0']">
                <span class="text-xs font-bold text-[#00c8e8] font-mono block mb-1.5">{{ m.year }}</span>
                <h3 class="text-lg font-bold text-white mb-2" style="font-family: Inter, sans-serif;">{{ m.title }}</h3>
                <p class="text-sm text-white/60 leading-relaxed">{{ m.desc }}</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
