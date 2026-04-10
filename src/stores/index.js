import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia
export * from './user'
export * from './message'
export * from './unreadMessages'
export * from './thread'
export * from './notification'
export * from './websocket'

// AI聊天部分
export * from './ai'
export * from './aiMessages'
