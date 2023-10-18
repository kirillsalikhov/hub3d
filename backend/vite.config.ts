import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
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
    RubyPlugin(),
    ReactPlugin(),
  ]
});
