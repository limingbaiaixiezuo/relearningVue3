import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    visualizer({
      open: true, // 设置为 true 则构建完成后自动打开浏览器展示报告
      gzipSize: true, // 如果需要查看 gzip 后的大小，设置为 true
      brotliSize: true, // 如果需要查看使用 brotli 压缩后的大小，设置为 true
      filename: 'report.html' // 生成的报告文件名，默认为 report.html
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
      // '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        // 你可以在这里添加 Less 的全局变量等
        modifyVars: {
          'primary-color': '#ff4757',
        },
        javascriptEnabled: true,
      },
    },
  },
})
