import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Development da CORS muammosini oldini olish uchun proxy
    // (Backend CORS sozlasa bu shart emas, lekin zararı yo'q)
    proxy: {
      '/api': {
        target: 'https://zukko.pythonanywhere.com',
        changeOrigin: true,
        secure: true,
      },
      '/token': {
        target: 'https://zukko.pythonanywhere.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
