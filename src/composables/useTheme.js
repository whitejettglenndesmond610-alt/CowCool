import { ref, watch } from 'vue'

const STORAGE_KEY = 'theme-preference'
const theme = ref(localStorage.getItem(STORAGE_KEY) || 'dark')

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem(STORAGE_KEY, t)
  theme.value = t
}

function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}

applyTheme(theme.value)

export function useTheme() {
  return { theme, toggleTheme }
}
