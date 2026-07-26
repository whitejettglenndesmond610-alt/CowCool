export const profile = {
  name: 'Shawn Niu',
  role: 'AI 应用开发 / 计算机科学学生',
  statement: '把想法做成可运行的 AI 应用',
  school: '郑州工商学院',
  major: '计算机科学与技术',
  educationPeriod: '2025.09 — 2027.06',
  email: '1186806617@qq.com',
  github: 'https://github.com/whitejettglenndesmond610-alt',
}

export const capabilityGroups = [
  {
    id: 'foundation',
    number: '01',
    title: '开发基础',
    summary: '把想法变成结构清晰、可以运行的程序。',
    skills: ['Python', 'C / C++', 'JavaScript', 'SQL', 'HTML / CSS'],
    evidence: '用于数据处理、网页交互、算法练习与课程项目。',
  },
  {
    id: 'ai',
    number: '02',
    title: 'AI 应用',
    summary: '关注知识检索、本地模型与可交互 AI 产品。',
    skills: ['LangChain', 'FAISS', 'Ollama', 'Gradio', 'OCR'],
    evidence: '已实践本地 RAG、多格式文档导入、模型切换与多轮对话。',
  },
  {
    id: 'engineering',
    number: '03',
    title: '工程实现',
    summary: '让项目更容易维护、调试、部署和继续迭代。',
    skills: ['Git', 'Linux', 'MySQL', 'Vite', 'Vercel'],
    evidence: '用于版本管理、环境配置、数据管理和线上发布。',
  },
]

export const projects = [
  {
    id: 'local-rag',
    number: '01',
    status: '个人项目',
    title: '多知识库本地 AI 问答系统',
    subtitle: 'LOCAL RAG KNOWLEDGE SYSTEM',
    goal: '构建一个兼顾数据隐私、知识库扩展与模型切换能力的本地 AI 应用。',
    description: '支持 PDF、DOCX、TXT 与图片 OCR 导入，通过 FAISS 完成语义检索，并结合本地大模型实现连续问答。',
    tech: ['Python', 'LangChain', 'FAISS', 'Ollama', 'Gradio', 'Pytesseract'],
    highlights: ['多格式文档解析与递归切分', '本地向量检索与多轮对话', 'Qwen / Mistral 等模型切换', '可增量更新的知识库'],
    result: '完成可本地部署的交互式 Web 界面，核心数据无需上传第三方服务。',
    github: '',
    accent: 'mint',
  },
  {
    id: 'portfolio',
    number: '02',
    status: '持续迭代',
    title: '个人品牌与作品集网站',
    subtitle: 'PERSONAL DIGITAL STUDIO',
    goal: '建立一个可以长期承载个人经历、能力和真实项目的在线空间。',
    description: '从视觉系统、全屏导航到动效和部署流程均独立实现，并针对桌面端与移动端设计不同交互。',
    tech: ['Vue 3', 'Tailwind CSS', 'GSAP', 'Three.js', 'Vite', 'Vercel'],
    highlights: ['可点击的全屏页面系统', '响应式交互与低动态模式', '模块化 3D 知识核心', 'GitHub 与 Vercel 自动部署'],
    result: '形成可持续维护的个人品牌网站，并作为前端与动效实践项目持续迭代。',
    github: 'https://github.com/whitejettglenndesmond610-alt/nn',
    accent: 'sky',
  },
]

export const journey = [
  {
    date: '2025.09',
    title: '开始系统学习计算机科学',
    description: '进入郑州工商学院计算机科学与技术专业，建立编程与计算机基础知识框架。',
  },
  {
    date: '2025 — 2026',
    title: '从网页开发进入工程实践',
    description: '通过个人网站与课程项目练习前端交互、数据库、版本管理和部署流程。',
  },
  {
    date: '2026',
    title: '聚焦本地 AI 与 RAG',
    description: '开始使用 LangChain、FAISS、Ollama 和 Gradio，将模型能力做成可操作的应用。',
  },
  {
    date: 'NEXT',
    title: '向可落地的 AI 应用开发前进',
    description: '继续补强工程基础，用更多真实项目验证从需求、实现到交付的完整能力。',
  },
]
