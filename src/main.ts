import './assets/main.css'
import registerDirectives from './directives'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'

const pinia = createPinia()
// import MBNonUniformGridHeatmap from '@/components';
// import { GridLayout, GridItem } from 'vue-grid-layout';


// collapse
// import { ElCollapseTransition } from 'element-plus'
// fade/zoom
// import 'element-plus/lib/theme-chalk/base.css'


const app = createApp(App)
registerDirectives(app);
app.use(createPinia())
app.use(pinia)
app.use(router)
// app.use(MBNonUniformGridHeatmap)
// app.use(ElementPlus, { size: 'small', zIndex: 3000 })
// app.component(ElCollapseTransition.name, ElCollapseTransition)
// app.component('GridLayout', GridLayout);
// app.component('GridItem', GridItem);
app.mount('#app')
