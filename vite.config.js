import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Vue from '@vitejs/plugin-vue'
import Devtools from 'vite-plugin-vue-devtools'
import PKG from 'vite-plugin-package-configs'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import UnoCss from 'unocss/vite'
import { DestylerImageResolver } from '@destyler/image/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    VueRouter({
      dts: true,
    }),
    Devtools(),
    Vue(),
    PKG(),
    Components({
      resolvers: [
        DestylerImageResolver(),
      ],
      dts: true,
    }),
    UnoCss(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          'vue-router/auto': ['useLink'],
        },
      ],
      dts: true,
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }),
  ],
})
