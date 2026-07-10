<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['openModal'])

const projects = [
  {
    id: 'dance-booking', type: 'Full-Stack Project', title: '舞蹈室课堂预约系统',
    desc: '一个完整的舞蹈室课程预约平台 — 包含课程管理、学生注册和实时可用性追踪功能。',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MySQL'],
    tech: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MySQL'],
    highlights: [
      'Complete CRUD system for class and student management',
      'Real-time availability display with conflict detection',
      'Responsive admin dashboard with schedule overview',
      'Form validation, error handling, and user-friendly UI',
    ],
    preview: 'browser-booking',
    demo: 'https://github.com/whitejettglenndesmond610-alt/dance-booking',
    github: 'https://github.com/whitejettglenndesmond610-alt/dance-booking',
  },
  {
    id: 'portfolio-site', type: 'Frontend Project', title: '学生个人作品集网站',
    desc: '一个自建的个人作品集网站，带有粒子背景、3D 卡片效果和流畅的滚动动画 — 全部从零编写。',
    tags: ['HTML', 'CSS', 'JavaScript', '动画'],
    tech: ['HTML', 'CSS', 'JavaScript', 'CSS Animations', 'Canvas API'],
    highlights: [
      'Particle system with mouse repulsion and connection lines',
      '3D perspective card tilt following cursor movement',
      'Custom cursor with GSAP quickTo smooth follow',
      'ScrollTrigger-driven scroll reveal animations',
    ],
    preview: 'browser-portfolio',
    demo: 'https://github.com/whitejettglenndesmond610-alt/portfolio',
    github: 'https://github.com/whitejettglenndesmond610-alt/portfolio',
  },
  {
    id: 'ai-builder', type: 'AI Experiment', title: 'AI 建站交互实验',
    desc: '尝试用 AI API 从自然语言生成网站布局 — 探索 AI 辅助开发的未来可能性。',
    tags: ['AI API', 'JavaScript', '提示词设计'],
    tech: ['AI API', 'JavaScript', 'Prompt Engineering', 'HTML/CSS Generation'],
    highlights: [
      'Natural language input → structured HTML/CSS output',
      'Multi-turn conversation for iterative design refinement',
      'Template system combining AI output with predefined patterns',
      'Explored prompt engineering techniques for code generation',
    ],
    preview: 'ai',
    demo: 'https://github.com/whitejettglenndesmond610-alt/ai-builder',
    github: 'https://github.com/whitejettglenndesmond610-alt/ai-builder',
  },
  {
    id: 'booking-app', type: 'UI/UX Design', title: '课堂预约 App 原型',
    desc: '一个课程预约的手机 App 原型 — 在 Figma 中设计了用户流程、线框图和交互式高保真模型。',
    tags: ['Figma', '原型设计', '移动端 UI'],
    tech: ['Figma', 'Prototyping', 'Mobile UI Design', 'User Flows'],
    highlights: [
      'Complete user research phase with persona development',
      'Interactive prototype with full booking flow simulation',
      'Dark mode UI design for comfortable nighttime use',
      'Responsive component library for consistent design',
    ],
    preview: 'mobile',
    demo: '#',
    github: '#',
  },
  {
    id: 'dataviz-tool', type: 'Data Visualization', title: '数据可视化小工具',
    desc: '一个用 Chart.js 和 Canvas 构建的交互式数据看板 — 获取实时数据并渲染动态图表。',
    tags: ['Chart.js', 'Canvas', 'REST API'],
    tech: ['Chart.js', 'Canvas API', 'JavaScript', 'REST API Integration'],
    highlights: [
      'Multiple chart types: bar, line, pie, and radar charts',
      'Real-time data fetching with loading and error states',
      'Interactive tooltips, zoom, and data point selection',
      'Dark theme dashboard layout optimized for data viewing',
    ],
    preview: 'chart',
    demo: 'https://github.com/whitejettglenndesmond610-alt/dataviz',
    github: 'https://github.com/whitejettglenndesmond610-alt/dataviz',
  },
  {
    id: 'interactive-ui', type: 'Creative Development', title: '前端动态交互页面',
    desc: '一系列创意前端实验合集 — 包括 CSS 动画、SVG 交互和动态视觉效果。',
    tags: ['CSS 动画', 'SVG', 'JavaScript'],
    tech: ['CSS Animations', 'SVG', 'JavaScript', 'Creative Coding'],
    highlights: [
      'CSS-only morphing shapes with keyframe animations',
      'SVG path drawing on scroll with stroke-dasharray',
      'Physics-inspired spring animations with easing curves',
      'Generative geometric patterns with Canvas API',
    ],
    preview: 'ui',
    demo: 'https://github.com/whitejettglenndesmond610-alt/interactive-ui',
    github: 'https://github.com/whitejettglenndesmond610-alt/interactive-ui',
  },
]

function handleCardClick(project) {
  emit('openModal', project)
}

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.querySelectorAll('.project-card').forEach(card => {
    const setX = gsap.quickTo(card, '--tilt-x', { suffix: 'deg' })
    const setY = gsap.quickTo(card, '--tilt-y', { suffix: 'deg' })

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect()
      const cx = r.width / 2
      const cy = r.height / 2
      setX(((e.clientY - r.top - cy) / cy) * -8)
      setY(((e.clientX - r.left - cx) / cx) * 8)
      card.classList.add('tilting')
    })
    card.addEventListener('mouseleave', () => {
      setX(0); setY(0)
      card.classList.remove('tilting')
    })
  })
})
</script>

<template>
  <section id="projects" class="py-[120px] max-md:py-[60px]">
    <div class="max-w-[1200px] mx-auto px-6">
      <div class="text-center mb-16 reveal">
        <h2 class="section-title text-[clamp(2rem,4vw,3rem)] mb-3">精选作品</h2>
        <p class="text-white/40 text-base">我引以为豪的项目</p>
      </div>

      <div class="grid grid-cols-2 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-6">
        <article
          v-for="p in projects"
          :key="p.id"
          class="project-card group cursor-pointer reveal"
          :data-project="p.id"
          @click="handleCardClick(p)"
        >
          <div class="project-card-inner relative rounded-2xl bg-white/[0.025] backdrop-blur-xl border border-white/[0.06] overflow-hidden transition-all duration-500 group-[:hover]:-translate-y-3 group-[:hover]:border-transparent group-[:hover]:shadow-[0_8px_50px_rgba(0,200,232,0.15)]"
               :class="`
                 group-[.tilting]:-translate-y-3 group-[.tilting]:border-transparent
                 group-[.tilting]:[transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]
               `"
          >
            <div class="absolute -inset-[2px] rounded-[calc(1rem+2px)] bg-gradient-to-r from-[#00c8e8] via-[#7c3aed] to-[#f472b6] opacity-0 group-[:hover]:opacity-100 transition-opacity duration-400 z-[-1]" />

            <!-- Preview image -->
            <div class="relative h-[220px] overflow-hidden bg-[#0c0e14] max-lg:h-[180px]">
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(108,92,231,0.15),transparent_70%)] opacity-0 group-[:hover]:opacity-100 transition-opacity duration-400" />

              <!-- Browser mockup -->
              <template v-if="p.preview.startsWith('browser')">
                <div class="flex flex-col h-full">
                  <div class="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/[0.04] border-b border-white/[0.04]">
                    <span class="w-2 h-2 rounded-full bg-[#ff5f57]" />
                    <span class="w-2 h-2 rounded-full bg-[#febc2e]" />
                    <span class="w-2 h-2 rounded-full bg-[#28c840]" />
                  </div>
                  <div class="mx-3.5 my-2 h-[18px] rounded bg-white/[0.04] relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,200,232,0.08)] to-transparent bg-[length:200%_100%] opacity-0 group-[:hover]:opacity-100 animate-[shimmer_1.5s_ease-in-out_infinite]" />
                  </div>
                  <div class="flex-1 mx-3.5 mb-3.5 rounded-md bg-white/[0.015] flex items-center justify-center overflow-hidden">
                    <template v-if="p.preview === 'browser-booking'">
                      <div class="w-full p-2 flex flex-col gap-1.5">
                        <div class="h-4 rounded-sm bg-[rgba(0,200,232,0.12)]" />
                        <div class="h-3.5 rounded-sm bg-white/[0.04]" />
                        <div class="h-3.5 rounded-sm bg-white/[0.04]" />
                        <div class="h-3.5 rounded-sm bg-white/[0.04]" />
                        <div class="h-3.5 rounded-sm bg-[rgba(124,58,237,0.1)]" />
                      </div>
                    </template>
                    <template v-else>
                      <div class="flex flex-col items-center justify-center gap-2.5 p-5">
                        <div class="h-2 rounded w-1/2 bg-[rgba(0,200,232,0.15)]" />
                        <div class="h-2 rounded w-4/5 bg-white/[0.06]" />
                        <div class="flex gap-2 mt-2">
                          <span class="w-[54px] h-3.5 rounded-full bg-[rgba(0,200,232,0.25)]" />
                          <span class="w-[54px] h-3.5 rounded-full border border-white/10 bg-transparent" />
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </template>

              <!-- AI nodes -->
              <template v-else-if="p.preview === 'ai'">
                <div class="relative w-full h-full">
                  <span class="absolute w-3.5 h-3.5 rounded-full bg-[rgba(0,200,232,0.3)] border-2 border-[rgba(0,200,232,0.5)]" style="top:20%;left:15%" />
                  <span class="absolute w-3.5 h-3.5 rounded-full bg-[rgba(0,200,232,0.3)] border-2 border-[rgba(0,200,232,0.5)] animate-[pulse_2.5s_ease-in-out_infinite] max-md:animate-none" style="top:15%;right:20%" />
                  <span class="absolute w-3.5 h-3.5 rounded-full bg-[rgba(0,200,232,0.3)] border-2 border-[rgba(0,200,232,0.5)] animate-[pulse_3s_ease-in-out_infinite_0.8s] max-md:animate-none" style="bottom:25%;left:25%" />
                  <span class="absolute w-3.5 h-3.5 rounded-full bg-[rgba(0,200,232,0.3)] border-2 border-[rgba(0,200,232,0.5)]" style="bottom:20%;right:15%" />
                  <div class="absolute h-px bg-[rgba(0,200,232,0.15)] origin-left" style="top:27%;left:20%;width:55%;transform:rotate(12deg);border-top:1px dashed rgba(0,200,232,0.2)" />
                  <div class="absolute h-px bg-[rgba(124,58,237,0.15)] origin-left" style="top:50%;left:18%;width:60%;transform:rotate(-8deg);border-top:1px dashed rgba(124,58,237,0.2)" />
                  <div class="absolute h-px bg-[rgba(0,200,232,0.12)] origin-left" style="bottom:30%;left:22%;width:50%;transform:rotate(5deg);border-top:1px dashed rgba(0,200,232,0.12)" />
                </div>
              </template>

              <!-- Mobile mockup -->
              <template v-else-if="p.preview === 'mobile'">
                <div class="flex items-center justify-center p-4">
                  <div class="w-[140px] h-full border-2 border-white/10 rounded-[18px] p-2 flex flex-col gap-2 bg-white/[0.015] max-md:w-[120px]">
                    <div class="w-10 h-1 rounded-sm bg-white/15 mx-auto" />
                    <div class="flex justify-between text-[7px] text-white/20 px-1">
                      <span>9:41</span><span>●●●●</span>
                    </div>
                    <div class="flex flex-col gap-1.5 flex-1 px-1">
                      <div class="h-2.5 rounded-sm bg-white/[0.05]" />
                      <div class="h-2.5 rounded-sm w-3/5 bg-white/[0.05]" />
                      <div class="h-4 rounded-md bg-[rgba(0,200,232,0.2)] mt-1" />
                    </div>
                  </div>
                </div>
              </template>

              <!-- Chart bars -->
              <template v-else-if="p.preview === 'chart'">
                <div class="w-4/5 h-[70%] relative mx-auto my-auto top-1/2 -translate-y-1/2">
                  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:25%_25%]" />
                  <div class="absolute bottom-0 left-0 right-0 flex items-end justify-around h-full px-2">
                    <span class="w-[12%] rounded-t-sm bg-[rgba(0,200,232,0.2)]" style="height:45%" />
                    <span class="w-[12%] rounded-t-sm bg-[rgba(0,200,232,0.2)]" style="height:75%" />
                    <span class="w-[12%] rounded-t-sm bg-[rgba(0,200,232,0.4)]" style="height:90%" />
                    <span class="w-[12%] rounded-t-sm bg-[rgba(0,200,232,0.2)]" style="height:60%" />
                    <span class="w-[12%] rounded-t-sm bg-[rgba(0,200,232,0.2)]" style="height:35%" />
                  </div>
                </div>
              </template>

              <!-- UI shapes -->
              <template v-else>
                <div class="relative w-4/5 h-[70%] mx-auto my-auto top-1/2 -translate-y-1/2">
                  <span class="absolute w-10 h-10 rounded-full border-2 border-[rgba(0,200,232,0.3)] transition-all duration-500 group-[:hover]:scale-120 group-[:hover]:translate-x-1 group-[:hover]:-translate-y-1 group-[:hover]:border-[rgba(0,200,232,0.6)]" style="top:15%;left:15%" />
                  <span class="absolute w-0 h-0 border-l-[18px] border-r-[18px] border-b-[32px] border-transparent border-b-[rgba(124,58,237,0.2)] transition-all duration-500 group-[:hover]:rotate-[15deg] group-[:hover]:-translate-x-1 group-[:hover]:-translate-y-1 group-[:hover]:!border-b-[rgba(124,58,237,0.45)]" style="top:10%;right:20%" />
                  <span class="absolute w-7 h-7 bg-[rgba(244,114,182,0.12)] border-2 border-[rgba(244,114,182,0.2)] rotate-[15deg] transition-all duration-500 group-[:hover]:rotate-[35deg] group-[:hover]:scale-115 group-[:hover]:bg-[rgba(244,114,182,0.2)]" style="bottom:20%;left:25%" />
                  <span class="absolute w-9 h-9 rounded-full border-2 border-[rgba(0,200,232,0.2)] transition-all duration-500 group-[:hover]:scale-120 group-[:hover]:-translate-x-1 group-[:hover]:translate-y-1 group-[:hover]:border-[rgba(0,200,232,0.5)]" style="bottom:25%;right:18%" />
                </div>
              </template>
            </div>

            <div class="p-6">
              <span class="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#00c8e8] font-mono block mb-2">{{ p.type }}</span>
              <h3 class="text-[1.4rem] font-bold text-white mb-2" style="font-family: Inter, sans-serif;">{{ p.title }}</h3>
              <p class="text-sm text-white/60 leading-relaxed mb-4">{{ p.desc }}</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="t in p.tags" :key="t" class="text-[11px] font-medium px-3 py-1 rounded-full font-mono" style="background: rgba(108,92,231,0.1); border: 1px solid rgba(108,92,231,0.2); color: #7c3aed;">
                  {{ t }}
                </span>
              </div>
            </div>

            <!-- Action button -->
            <div class="absolute bottom-6 right-6 flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00c8e8] to-[#7c3aed] text-white text-xs font-semibold opacity-0 translate-y-2.5 group-[:hover]:opacity-100 group-[:hover]:translate-y-0 transition-all duration-300 cursor-pointer hover:shadow-[0_4px_20px_rgba(108,92,231,0.5)]" @click.stop="handleCardClick(p)">
              <span>查看详情</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="transition-transform duration-200 group-hover:translate-x-[3px]"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
