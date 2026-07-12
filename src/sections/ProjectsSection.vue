<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['openModal'])

const projects = [
  {
    id: 'rag-system',
    type: 'AI 应用 · RAG',
    title: '多知识库本地 AI 问答系统',
    desc: '基于 LangChain + FAISS 构建的本地部署 RAG 系统，支持多格式文档导入、语义检索与多轮对话，集成 Ollama 本地大模型。',
    tags: ['Python', 'LangChain', 'FAISS', 'Ollama', 'Gradio'],
    span: 'md:col-span-7',
    aspect: 'aspect-[16/10]',
    demo: 'https://github.com/whitejettglenndesmond610-alt',
    github: 'https://github.com/whitejettglenndesmond610-alt',
  },
  {
    id: 'portfolio-website',
    type: '前端 · 作品集',
    title: '个人作品集网站',
    desc: '从零构建的个人展示网站，包含自我介绍、技能、项目等模块，集成 Swiper.js 轮播与 ScrollReveal 滚动动画。',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Swiper.js', 'ScrollReveal'],
    span: 'md:col-span-5',
    aspect: 'aspect-[4/5]',
    demo: 'https://github.com/whitejettglenndesmond610-alt',
    github: 'https://github.com/whitejettglenndesmond610-alt',
  },
  {
    id: 'dance-booking',
    type: '全栈 · 课程项目',
    title: '舞蹈室课堂预约系统',
    desc: '带前端界面、后端 API 和数据库的完整预约平台，实现课程管理、学生注册和实时可用性追踪。',
    tags: ['HTML', 'CSS', 'JS', 'Node.js', 'MySQL'],
    span: 'md:col-span-5',
    aspect: 'aspect-[4/5]',
    demo: 'https://github.com/whitejettglenndesmond610-alt/dance-booking',
    github: 'https://github.com/whitejettglenndesmond610-alt/dance-booking',
  },
  {
    id: 'dataviz-tool',
    type: '数据可视化',
    title: '数据可视化小工具',
    desc: '用 Chart.js 和 Canvas 构建的交互式数据看板，支持多种图表类型与实时数据获取。',
    tags: ['Chart.js', 'Canvas', 'JavaScript', 'API'],
    span: 'md:col-span-7',
    aspect: 'aspect-[16/10]',
    demo: 'https://github.com/whitejettglenndesmond610-alt/dataviz',
    github: 'https://github.com/whitejettglenndesmond610-alt/dataviz',
  },
]

function handleCardClick(project) {
  emit('openModal', project)
}

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.querySelectorAll('.project-card').forEach(card => {
    const inner = card.querySelector('.project-card-inner')
    if (!inner) return

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect()
      const cx = r.width / 2
      const cy = r.height / 2
      const x = ((e.clientY - r.top - cy) / cy) * -5
      const y = ((e.clientX - r.left - cx) / cx) * 5
      inner.style.transform = `rotateX(${x}deg) rotateY(${y}deg) translateY(-8px)`
    })
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)'
    })
  })
})
</script>

<template>
  <section id="projects" class="bg-bg py-12 md:py-16">
    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
      <div class="mb-10 md:mb-14 reveal">
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

      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        <article
          v-for="p in projects"
          :key="p.id"
          :class="[p.span, 'project-card group cursor-pointer reveal']"
          @click="handleCardClick(p)"
        >
          <div :class="[
            p.aspect,
            'project-card-inner relative rounded-3xl bg-surface border border-stroke overflow-hidden transition-all duration-500',
          ]">
            <div class="absolute inset-0 flex items-center justify-center bg-surface overflow-hidden">
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(137,170,204,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span class="text-5xl md:text-7xl font-display italic text-text-primary/5 select-none">{{ p.type.split('·')[0] }}</span>
            </div>

            <div
              class="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
              style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 4px 4px;"
            />

            <div class="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 backdrop-blur-lg transition-all duration-500 flex items-center justify-center">
              <span class="relative px-5 py-2 rounded-full">
                <span class="absolute inset-[-3px] rounded-full accent-gradient opacity-60" />
                <span class="relative z-10 bg-white text-black text-sm px-5 py-2 rounded-full">
                  查看 — <span class="font-display italic">{{ p.title }}</span>
                </span>
              </span>
            </div>

            <div class="absolute bottom-5 left-5 right-5">
              <span class="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#89AACC] block mb-1">{{ p.type }}</span>
              <h3 class="text-lg font-bold text-text-primary max-md:text-base">{{ p.title }}</h3>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
