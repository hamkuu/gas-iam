import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // listen on 0.0.0.0 so Docker can expose the port
    proxy: {
      '/api': backendUrl,
      '/accounts': backendUrl,
    },
  },
})
