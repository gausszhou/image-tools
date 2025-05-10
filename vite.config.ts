import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/image-tools/',
  server: {
    port: 2001
  },
  build: {
    outDir: 'dist/image-tools'
  }
})