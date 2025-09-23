import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
     vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // server: {
  //   port: 5173, // 前端开发服务器端口
  //   proxy: {
  //     // 代理所有以 /api 开头的请求
  //     '/api': {
  //       target: 'http://localhost:10086', // 后端服务器地址
  //       changeOrigin: true, // 允许跨域
  //       rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，去掉 /api 前缀
  //     },
  //     // 代理WebSocket连接
  //     '/ws': {
  //       target: 'ws://localhost:10086', // WebSocket服务器地址
  //       ws: true, // 启用WebSocket代理
  //       changeOrigin: true
  //     }
  //   }
  // }
})
