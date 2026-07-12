<script setup>
import { ref, inject, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Send, Mail, MapPin } from '@lucide/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const socials = [
  { name: 'github', label: 'GitHub', icon: 'github', url: 'https://github.com/whitejettglenndesmond610-alt' },
  { name: 'bilibili', label: 'Bilibili', icon: 'bilibili', url: 'https://space.bilibili.com/450593682' },
  { name: 'wechat', label: 'WeChat', icon: 'wechat', url: '#' },
  { name: 'email', label: 'Email', icon: 'email', url: '#' },
]

const showToast = inject('showToast')

const form = ref({
  name: '',
  email: '',
  message: '',
})

const errors = ref({})
const submitted = ref(false)

function validate() {
  const errs = {}
  if (!form.value.name.trim()) errs.name = '请输入你的姓名'
  if (!form.value.email.trim()) errs.email = '请输入你的邮箱'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errs.email = '请输入有效的邮箱地址'
  if (!form.value.message.trim()) errs.message = '请输入你的留言'
  errors.value = errs
  return Object.keys(errs).length === 0
}

function handleSubmit() {
  submitted.value = false

  if (!validate()) {
    Object.keys(errors.value).forEach(field => {
      const el = document.querySelector(`.form-group-${field}`)
      if (el) gsap.fromTo(el, { x: 0 }, { x: [-6, 6, -4, 4, 0], duration: 0.4, ease: 'power2.out' })
    })
    return
  }

  submitted.value = true
  showToast('演示模式 — 请通过邮箱或社交链接联系我！')

  setTimeout(() => {
    form.value = { name: '', email: '', message: '' }
    errors.value = {}
    submitted.value = false
  }, 4000)
}

function copyEmail() {
  navigator.clipboard.writeText('1186806617@qq.com').then(() => {
    showToast('邮箱地址已复制到剪贴板！')
  }).catch(() => {
    window.location.href = 'mailto:1186806617@qq.com'
  })
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const icons = document.querySelectorAll('.social-link')
  if (icons.length) {
    gsap.set(icons, { opacity: 0, scale: 0.8, y: 12 })
    gsap.to(icons, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.5, stagger: 0.12, ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.social-links-container',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
  }
})
</script>

<template>
  <section id="contact" class="relative py-[120px] max-md:py-[60px] overflow-hidden">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(78,133,191,0.08),transparent_70%)] pointer-events-none" />

    <div class="max-w-[1200px] mx-auto px-6 relative z-[1]">
      <div class="text-center mb-16 reveal">
        <h2 class="section-title text-[clamp(2rem,5vw,3.5rem)] mb-3">联系我</h2>
        <p class="text-muted text-base">有问题或只是想打个招呼？</p>
      </div>

      <div class="grid grid-cols-2 gap-10 max-lg:grid-cols-1 max-lg:gap-6">
        <form class="glass-card p-10 max-md:p-7 reveal" @submit.prevent="handleSubmit" novalidate>
          <!-- Name -->
          <div :class="['form-group-name relative mb-7', { 'has-error': errors.name }]">
            <input
              v-model="form.name"
              type="text"
              placeholder="你的姓名"
              autocomplete="name"
              :class="[
                'w-full px-4 py-3.5 rounded-lg text-white text-sm outline-none transition-all duration-200',
                'bg-white/[0.025] border',
                errors.name ? 'border-[#89AACC]' : 'border-stroke focus:border-[#4E85BF]',
              ]"
            />
            <label class="absolute left-4 transition-all duration-200 pointer-events-none text-muted text-sm"
              :class="form.name ? '-top-2.5 text-xs text-[#89AACC] bg-bg px-1' : 'top-1/2 -translate-y-1/2'">
              你的姓名
            </label>
            <p v-if="errors.name" class="text-xs text-[#89AACC] mt-1.5 pl-1">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div :class="['form-group-email relative mb-7', { 'has-error': errors.email }]">
            <input
              v-model="form.email"
              type="email"
              placeholder="你的邮箱"
              autocomplete="email"
              :class="[
                'w-full px-4 py-3.5 rounded-lg text-white text-sm outline-none transition-all duration-200',
                'bg-white/[0.025] border',
                errors.email ? 'border-[#89AACC]' : 'border-stroke focus:border-[#4E85BF]',
              ]"
            />
            <label class="absolute left-4 transition-all duration-200 pointer-events-none text-muted text-sm"
              :class="form.email ? '-top-2.5 text-xs text-[#89AACC] bg-bg px-1' : 'top-1/2 -translate-y-1/2'">
              你的邮箱
            </label>
            <p v-if="errors.email" class="text-xs text-[#89AACC] mt-1.5 pl-1">{{ errors.email }}</p>
          </div>

          <!-- Message -->
          <div :class="['form-group-message relative mb-7', { 'has-error': errors.message }]">
            <textarea
              v-model="form.message"
              placeholder="你的留言"
              rows="5"
              :class="[
                'w-full px-4 py-3.5 rounded-lg text-white text-sm outline-none transition-all duration-200 resize-none',
                'bg-white/[0.025] border',
                errors.message ? 'border-[#89AACC]' : 'border-stroke focus:border-[#4E85BF]',
              ]"
            />
            <label class="absolute left-4 top-[18px] transition-all duration-200 pointer-events-none text-muted text-sm"
              :class="form.message ? '-top-2.5 text-xs text-[#89AACC] bg-bg px-1' : ''">
              你的留言
            </label>
            <p v-if="errors.message" class="text-xs text-[#89AACC] mt-1.5 pl-1">{{ errors.message }}</p>
          </div>

          <Button type="submit" :disabled="submitted"
            class="w-full justify-center bg-gradient-to-r from-[#89AACC] to-[#4E85BF] text-white font-semibold rounded-full h-12 hover:shadow-[0_0_30px_rgba(78,133,191,0.3)] transition-shadow">
            <Send class="size-4 mr-2" />
            <template v-if="submitted">演示模式 — 未实际发送</template>
            <template v-else>发送消息</template>
          </Button>

          <p v-if="submitted" class="text-center text-[#89AACC] font-medium text-sm mt-4 p-3 rounded-lg border border-[rgba(137,170,204,0.12)] bg-[rgba(137,170,204,0.05)]">
            这是演示模式。请通过邮箱或下方的社交链接联系我！
          </p>
        </form>

        <!-- Contact info -->
        <div class="flex flex-col gap-5">
          <div class="glass-card p-6 flex flex-col items-center gap-2 text-center">
            <Mail class="size-6 text-[#89AACC] mb-1" />
            <span class="text-xs uppercase tracking-[0.1em] text-muted">邮箱</span>
            <a href="mailto:1186806617@qq.com"
              class="text-sm text-white font-mono cursor-pointer hover:text-[#89AACC] transition-colors"
              @click.prevent="copyEmail">
              1186806617@qq.com
            </a>
          </div>

          <div class="social-links-container flex gap-3 justify-center flex-wrap">
            <a v-for="s in socials" :key="s.name"
              :href="s.name === 'email' ? '#' : s.url"
              :target="s.name === 'email' ? undefined : '_blank'"
              :rel="s.name === 'email' ? undefined : 'noopener noreferrer'"
              :aria-label="s.label"
              @click="s.name === 'email' ? ($event.preventDefault(), copyEmail()) : null"
              class="social-link glass-card !w-[50px] !h-[50px] !rounded-full !flex !items-center !justify-center !p-0 text-muted hover:!text-[#89AACC] hover:!border-[#89AACC] hover:!-translate-y-1 hover:!shadow-[0_0_30px_rgba(137,170,204,0.3)]"
            >
              <template v-if="s.icon === 'github'">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </template>
              <template v-else-if="s.icon === 'bilibili'">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="9 10 14 12 9 14"/></svg>
              </template>
              <template v-else-if="s.icon === 'wechat'">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M16 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M12 22c5.523 0 10-3.581 10-8s-4.477-8-10-8S2 9.581 2 14c0 2.1 1 4 2.6 5.2L4 22l3-2.5c1.5.5 3.2.7 5 .7z"/></svg>
              </template>
              <template v-else>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M16 8v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><rect x="2" y="10" width="20" height="12" rx="2"/></svg>
              </template>
            </a>
          </div>

          <p class="flex items-center justify-center gap-2 text-sm text-muted">
            <MapPin class="size-4" /> 中国 — 学生开发者
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
