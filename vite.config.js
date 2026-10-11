import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve index.html for all routes so BrowserRouter handles them correctly
  // (direct URL access, browser refresh, back/forward navigation)
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
})
