import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import compression from 'vite-plugin-compression';
import Unocss from 'unocss/vite';
import presetIcons from '@unocss/preset-icons';
import presetWind from '@unocss/preset-wind';
import transformerDirective from '@unocss/transformer-directives';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  plugins: [
    svgr(),
    Unocss({
      transformers: [transformerDirective()],
      presets: [
        presetWind(),
        presetIcons({
          prefix: 'i-',
          extraProperties: {
            display: 'inline-block',
            'vertical-align': 'middle',
          },
        }),
      ],
      theme: {
        breakpoints: {
          tiny: '350px',
          mini: '375px',
          mobile: '460px',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
        colors: {
          purple: {
            normal: '#6667ab', // className="bg-purple-primary"
            normalHover: '#5a5c9a',
            dark: '#4d4d80',
            darkHover: '#3D3E67',
            darkActive: '#2E2E4D',
          },
          green: {
            normal: '#96d8de',
            normalHover: '#87c2c8',
          },
          grey: {
            normal: '#f0eee9',
            normalHover: '#d8d6d2',
          },
          violet: {
            normal: '#302c4d',
            normalHover: '#2b2845',
          },
          error: {
            normal: '#E96170',
          },
        },
      },
    }),
    react(),
    compression(),
  ],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@contracts': path.resolve(__dirname, 'src/contracts'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@router': path.resolve(__dirname, 'src/router'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@service': path.resolve(__dirname, 'src/service'),
      punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      'crypto-addr-codec': 'crypto-addr-codec/dist/index.js',
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      plugins: [visualizer()],
      output: {
        // manualChunks: (id) => {
        //   // if (id.includes('node_modules') && !id.includes('buffer') && !id.includes('polyfill')) {
        //   //   return 'vendor';
        //   // }
        // },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true, process: true }), NodeModulesPolyfillPlugin()],
    },
  },
  server: {
    proxy: {
      '/v0': {
        target: 'http://app-test.conflux-chain.org.cn/',
        changeOrigin: true,
      },
    },
  },
});
