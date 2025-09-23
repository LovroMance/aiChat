import { createPinia } from 'pinia'
import { ref } from 'vue'

const pinia = createPinia()

export const isLoading = ref(false)  // 是否正在加载中

export default pinia
export * from './User'
export * from './message'
export * from './unreadMessages'
export * from './thread'
