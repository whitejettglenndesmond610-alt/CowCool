<script setup>
const categories = [
  {
    title: '编程语言',
    skills: ['Python', 'C/C++', 'JavaScript', 'SQL', 'HTML / CSS'],
  },
  {
    title: 'AI 与框架',
    skills: ['LangChain', 'FAISS', 'Gradio', 'Ollama', 'Pytesseract OCR'],
  },
  {
    title: '开发工具',
    skills: ['Git', 'VS Code', 'PyCharm', 'Linux', 'MySQL'],
  },
]
</script>

<template>
  <section id="skills" class="relative py-[120px] max-md:py-[60px] overflow-hidden">
    <div class="max-w-[1200px] mx-auto px-6 relative z-[1]">
      <div class="text-center mb-16 reveal">
        <h2 class="section-title text-[clamp(2rem,4vw,3rem)] mb-3">技能与工具</h2>
        <p class="text-muted text-base">正在学习和使用的技术栈</p>
      </div>

      <div class="relative">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.06] max-md:hidden">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#89AACC] animate-[spin_20s_linear_infinite]" />
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-[#4E85BF] animate-[spin_25s_linear_infinite_reverse]" />
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#89AACC] animate-[spin_30s_linear_infinite]" />
        </div>

        <div class="grid grid-cols-3 gap-10 max-lg:grid-cols-1 max-lg:gap-8">
          <div v-for="cat in categories" :key="cat.title" class="text-center reveal">
            <h3 class="text-xl font-bold text-white mb-6 flex items-center justify-center gap-2" style="font-family: Inter, sans-serif;">
              <span class="text-[#89AACC] text-xs">➤</span> {{ cat.title }}
            </h3>
            <div class="flex flex-wrap gap-2.5 justify-center">
              <span
                v-for="skill in cat.skills"
                :key="skill"
                class="text-[13px] font-medium px-5 py-2 rounded-full border border-white/[0.08] text-muted bg-white/[0.025] backdrop-blur-md font-mono cursor-default transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:text-white hover:bg-white/[0.05] hover:border-[#4E85BF] hover:shadow-[0_0_40px_rgba(78,133,191,0.25)] hover:z-10"
                data-interactive
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
