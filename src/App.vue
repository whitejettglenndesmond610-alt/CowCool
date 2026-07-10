<script setup>
import { onMounted } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import ClickRipple from './components/ClickRipple.vue'
import ParticleCanvas from './components/ParticleCanvas.vue'
import CustomCursor from './components/CustomCursor.vue'
import ProjectModal from './components/ProjectModal.vue'
import ToastNotification from './components/ToastNotification.vue'
import NavbarSection from './sections/NavbarSection.vue'
import HeroSection from './sections/HeroSection.vue'
import AboutSection from './sections/AboutSection.vue'
import SkillsSection from './sections/SkillsSection.vue'
import ProjectsSection from './sections/ProjectsSection.vue'
import TimelineSection from './sections/TimelineSection.vue'
import ContactSection from './sections/ContactSection.vue'
import FooterSection from './sections/FooterSection.vue'
import { useToast } from './composables/useToast.js'
import { provide, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { toast, showToast } = useToast()
provide('showToast', showToast)

const modalData = ref(null)
provide('modalData', modalData)

function openModal(data) {
  modalData.value = data
}

function closeModal() {
  modalData.value = null
}

provide('openModal', openModal)
provide('closeModal', closeModal)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.utils.toArray('.reveal').forEach(el => {
    if (el.closest('.hero')) return
    if (el.closest('.no-reveal')) return

    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8, ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  })
})
</script>

<template>
  <LoadingScreen />
  <ScrollProgress />
  <ClickRipple />
  <div class="relative">
    <ParticleCanvas />
    <CustomCursor />
    <ToastNotification :toast="toast" />

    <div class="glow-orb" style="width:500px;height:500px;background:radial-gradient(circle,#7c3aed,transparent 70%);top:10%;left:-10%;animation:floatOrb1 12s ease-in-out infinite" aria-hidden="true" />
    <div class="glow-orb" style="width:400px;height:400px;background:radial-gradient(circle,#00c8e8,transparent 70%);top:50%;right:-8%;animation:floatOrb2 15s ease-in-out infinite" aria-hidden="true" />
    <div class="glow-orb" style="width:350px;height:350px;background:radial-gradient(circle,#f472b6,transparent 70%);bottom:-5%;left:30%;animation:floatOrb3 10s ease-in-out infinite" aria-hidden="true" />

    <NavbarSection />
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection @open-modal="openModal" />
      <TimelineSection />
      <ContactSection />
    </main>
    <FooterSection />

    <ProjectModal :data="modalData" @close="closeModal" />

    <div class="mouse-glow" style="position:fixed;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(108,92,231,0.08),transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);opacity:0" aria-hidden="true" />
  </div>
</template>
