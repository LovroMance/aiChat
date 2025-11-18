import { createApp } from 'vue'
import '@/assets/common.css'
// import '@/assets/css/variability.css'
import '@/assets/root/variable.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import pinia from './stores'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia).use(router).use(ElementPlus)

// 加载/初始化 数据
import { initializeAppData } from '@/service/appService'
initializeAppData()

app.mount('#app')
