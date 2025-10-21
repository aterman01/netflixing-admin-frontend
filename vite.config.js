import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://netflixing-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    allowedHosts: [
      'admin.netflixing.com',
      '.railway.app',
      'localhost'
    ]
  }
})
