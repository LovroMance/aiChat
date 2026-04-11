import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

import { defineConfig, loadEnv } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_PROXY_API_TARGET || env.VITE_APP_API_BASE
  const wsTarget = env.VITE_PROXY_WS_TARGET || env.VITE_APP_WS_BASE || apiTarget

  const createHttpProxy = () => ({
    target: apiTarget,
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: '',
  })

  return {
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
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: apiTarget
      ? {
          proxy: {
            '^/auth(/|$)': createHttpProxy(),
            '^/user(/|$)': createHttpProxy(),
            '^/thread(/|$)': createHttpProxy(),
            '^/relation(/|$)': createHttpProxy(),
            '^/debug(/|$)': createHttpProxy(),
            '^/file(/|$)': createHttpProxy(),
            '/ws': {
              target: wsTarget,
              changeOrigin: true,
              secure: false,
              ws: true,
            },
          },
        }
      : undefined,
  }
})
