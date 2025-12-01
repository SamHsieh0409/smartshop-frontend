import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.ngrok-free.app'],
    proxy: {
      //所有 /api 開頭的請求都轉給後端
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
})