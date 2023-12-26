import { defineConfig } from 'vite'
import ViteRails from 'vite-plugin-rails'
import ReactPlugin from '@vitejs/plugin-react'

export default defineConfig({
  assetsInclude: [
    /\.wenv$/,
    /\.gltf$/
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.wenv': 'dataurl',
        '.gltf': 'dataurl'
      }
    }
  },
  plugins: [
    ViteRails({
      compress: { brotli: false },
      compression: {filter: /\.(js|mjs|json|css|wenv|gltf|html)$/i },
      stimulus: false
    }),
    ReactPlugin(),
  ]
});
