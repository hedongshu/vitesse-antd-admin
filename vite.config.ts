import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Markdown from 'vite-plugin-md'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Inspect from 'vite-plugin-inspect'
import Prism from 'markdown-it-prism'
import LinkAttributes from 'markdown-it-link-attributes'
import Unocss from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { viteMockServe } from 'vite-plugin-mock'
import themePreprocessorPlugin from '@zougt/vite-plugin-theme-preprocessor'

import { AntDesignVueResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'

const markdownWrapperClasses = 'prose prose-sm m-auto text-left'

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build'
  console.log(command, mode)

  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    base: process.env.VITE_APP_BASE,
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },

    plugins: [

      Vue({
        include: [/\.vue$/, /\.md$/],
        reactivityTransform: true,
      }),

      vueJsx(),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ['vue', 'tsx', 'md'],
        exclude: ['**/components/*.vue', '**/components/**/*.vue', '**/components/*.tsx', '**/components/**/*.tsx'],
      }),

      // https://icones.netlify.app/
      Icons({
        autoInstall: true,
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(
        {
          exclude: ['**/components/*.vue', '**/components/**/*.vue', '**/components/*.tsx', '**/components/**/*.tsx'],
        },
      ),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vue-i18n',
          'vue/macros',
          '@vueuse/head',
          '@vueuse/core',
        ],
        dts: 'src/auto-imports.d.ts',
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/],
        dts: 'src/components.d.ts',
        resolvers: [
          IconsResolver(),
          VueUseComponentsResolver(),
          AntDesignVueResolver(),
        ],
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss(),

      // https://github.com/antfu/vite-plugin-md
      Markdown({
        wrapperClasses: markdownWrapperClasses,
        headEnabled: true,
        markdownItSetup(md) {
          // https://prismjs.com/
          md.use(Prism)
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })
        },
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        include: [path.resolve(__dirname, 'locales/**')],
      }),

      // https://github.com/antfu/vite-plugin-inspect
      // Visit http://localhost:3333/__inspect/ to see the inspector
      Inspect(),

      viteMockServe({
        ignore: /^\_/,
        mockPath: 'mock',
        logger: true,
        localEnabled: !isBuild,
        prodEnabled: isBuild, // ??????????????????????????? mock????????????????????????????????????????????????
        // ????????????????????????
        // injectCode ??????prodEnabled??????
        // https://github.com/anncwb/vite-plugin-mock/issues/9
        // ?????????????????????????????? main.ts
        injectCode: `
           import { setupProdMockServer } from '../mock/_createProdMockServer';
     
           setupProdMockServer();
           `,
      }),

      themePreprocessorPlugin({
        less: {
          // ???????????????????????????
          multipleScopeVars: [
            {
              scopeName: 'light',
              path: path.resolve('src/styles/light.less'),
            },
            {
              scopeName: 'dark',
              path: path.resolve('src/styles/dark.less'),
            },
          ],
          defaultScopeName: 'light', // ????????? multipleScopeVars[0].scopeName
          extract: false, // ??????????????????????????????????????????css??????
        },
      }),
    ],

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },

    server: {
      port: parseInt(process.env.VITE_PORT || '3000'),
    },

    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue', '@vueuse', 'vue-demi'],
      },
    },
  }
})
