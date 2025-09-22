import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // eslint-disable-next-line no-undef
        target: process.env.NODE_ENV === 'production' 
          ? 'https://your-vercel-app.vercel.app' 
          : 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth'],
          ui: ['lucide-react', 'bootstrap']
        }
      }
    }
  },
  define: {
    // Make environment variables available at build time
    __API_URL__: JSON.stringify(
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV === 'production' 
        ? '' // Use relative URLs in production (same domain)
        : 'http://localhost:3000'
    ),
  },
})