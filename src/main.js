import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const app = createApp(App)
app.config.globalProperties.$gsap = gsap
app.mount('#app')
