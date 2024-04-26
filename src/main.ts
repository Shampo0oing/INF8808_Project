import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { createHead } from '@unhead/vue'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles/main.scss'

const app = createApp(App)
const head = createHead()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})
app.use(head)
app.use(router)
app.mount('#app')
