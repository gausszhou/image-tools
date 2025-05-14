import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [react()],
  server: {
    port: 2001
  },
  build: {
    outDir: process.env.VITE_BUILD_DIR || 'dist',
  }
})