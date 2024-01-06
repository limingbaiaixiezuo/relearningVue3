import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
// collapse
import { ElCollapseTransition } from 'element-plus'
// fade/zoom
// import 'element-plus/lib/theme-chalk/base.css'


const app = createApp(App)
globalThis.vueApp = app;

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.component(ElCollapseTransition.name, ElCollapseTransition)

app.mount('#app')
