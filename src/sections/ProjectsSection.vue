<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['openModal'])

const projects = [
  {
    id: 'rag-system',
    type: 'AI 应用 · RAG',
    title: '多知识库本地 AI 问答系统',
    desc: '基于 LangChain + FAISS 构建的本地部署 RAG 系统，支持多格式文档导入、语义检索与多轮对话，集成 Ollama 本地大模型。',
    tags: ['Python', 'LangChain', 'FAISS', 'Ollama', 'Gradio'],
    demo: 'https://github.com/whitejettglenndesmond610-alt',
    github: 'https://github.com/whitejettglenndesmond610-alt',
  },
  {
    id: 'portfolio-website',
    type: '前端 · 作品集',
    title: '个人作品集网站',
    desc: '从零构建的个人展示网站，包含自我介绍、技能、项目等模块，集成 Swiper.js 轮播与 ScrollReveal 滚动动画。',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Swiper.js'],
    demo: 'https://github.com/whitejettglenndesmond610-alt',
    github: 'https://github.com/whitejettglenndesmond610-alt',
  },
  {
    id: 'dance-booking',
    type: '全栈 · 课程项目',
    title: '舞蹈室课堂预约系统',
    desc: '带前端界面、后端 API 和数据库的完整预约平台，实现课程管理、学生注册和实时可用性追踪。',
    tags: ['HTML', 'CSS', 'JS', 'Node.js', 'MySQL'],
    demo: 'https://github.com/whitejettglenndesmond610-alt/dance-booking',
    github: 'https://github.com/whitejettglenndesmond610-alt/dance-booking',
  },
  {
    id: 'dataviz-tool',
    type: '数据可视化',
    title: '数据可视化小工具',
    desc: '用 Chart.js 和 Canvas 构建的交互式数据看板，支持多种图表类型与实时数据获取。',
    tags: ['Chart.js', 'Canvas', 'JavaScript', 'API'],
    demo: 'https://github.com/whitejettglenndesmond610-alt/dataviz',
    github: 'https://github.com/whitejettglenndesmond610-alt/dataviz',
  },
]

const totalCards = projects.length
const sectionRef = ref(null)

function handleCardClick(project) {
  emit('openModal', project)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const triggers = []

  nextTick(() => {
    const cards = document.querySelectorAll('.stacking-card')
    if (!cards.length) return

    cards.forEach((card, index) => {
      const targetScale = 1 - (totalCards - 1 - index) * 0.04
      gsap.set(card, { scale: targetScale, transformOrigin: 'center top' })

      const trigger = ScrollTrigger.create({
        trigger: card.parentElement,
        start: 'top top',
        end: 'bottom top+=100',
        scrub: 1,
        onUpdate(self) {
          const fromScale = targetScale
          const toScale = 0.96 - (totalCards - 1 - index) * 0.02
          const scale = fromScale + (toScale - fromScale) * self.progress
          const y = self.progress * 16
          gsap.set(card, { scale, y, overwrite: 'auto' })
        },
      })
      triggers.push(trigger)
    })
  })

  onUnmounted(() => triggers.forEach(t => t.kill()))
})
</script>

<template>
  <section ref="sectionRef" id="projects" class="bg-bg py-12 md:py-16">
    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-10 md:mb-14 reveal">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-8 h-px bg-stroke" />
        <span class="text-xs text-muted uppercase tracking-[0.3em]">精选作品</span>
      </div>
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-3xl md:text-5xl lg:text-6xl text-text-primary mb-3 font-display">
            我的<span class="italic">项目</span>
          </h2>
          <p class="text-sm md:text-base text-muted max-w-md">
            从课程作业到独立开发，每个项目都是学习路上的里程碑。
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
      <div v-for="(p, i) in projects" :key="p.id" class="h-[90vh] w-full pb-6">
        <div
          class="stacking-card sticky w-full rounded-[2rem] bg-surface border border-stroke overflow-hidden cursor-pointer group shadow-2xl shadow-black/40"
          :style="{ top: `${80 + i * 32}px`, zIndex: totalCards - i, willChange: 'transform, scale' }"
          @click="handleCardClick(p)"
        >
          <div class="grid grid-cols-12 gap-6 p-8 md:p-14 min-h-[520px]">
            <div class="col-span-7 flex flex-col justify-center">
              <span class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#89AACC] mb-4">{{ p.type }}</span>
              <h3 class="text-3xl md:text-5xl font-display italic text-text-primary mb-5 leading-[1.1]">{{ p.title }}</h3>
              <p class="text-sm md:text-base text-muted leading-relaxed mb-8 max-w-lg">{{ p.desc }}</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="t in p.tags"
                  :key="t"
                  class="text-[11px] font-medium px-3 py-1 rounded-full border border-white/10 text-[#89AACC] bg-white/[0.025] font-mono"
                >{{ t }}</span>
              </div>
            </div>

            <div class="col-span-5 relative flex items-center justify-center rounded-3xl overflow-hidden">
              <div
                class="absolute inset-0"
                style="background-image: radial-gradient(circle, rgba(137,170,204,0.12) 1px, transparent 1px); background-size: 5px 5px;"
              />
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(137,170,204,0.04),transparent_70%)]" />
              <div class="relative z-10 flex flex-col items-center justify-center gap-3">
                <span class="text-[8rem] md:text-[11rem] font-display italic text-text-primary/[0.04] select-none leading-none">{{ i + 1 }}</span>
                <span class="text-xs text-muted font-mono tracking-[0.2em] uppercase">{{ p.type.split('·')[0] }}</span>
              </div>
            </div>
          </div>

          <div class="absolute bottom-8 right-10 flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.03] border border-stroke text-sm text-muted group-hover:text-[#89AACC] group-hover:border-[#89AACC]/40 group-hover:bg-[#89AACC]/5 transition-all duration-300">
            查看详情
            <span class="text-base group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
