import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,  // Changed from 3000 to avoid conflict with sonesoebid_frontend
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
