import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia
export * from './user'
export * from './message'
export * from './unreadMessages'
export * from './thread'

// AI聊天部分
export * from './aiMessage'
