import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'
import { magneticDirective } from './lib/magnetic.js'

const app = createApp(App)
app.directive('magnetic', magneticDirective)
app.mount('#app')
