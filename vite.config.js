import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core vendor chunk
            if (id.includes('react') || id.includes('redux') || id.includes('@reduxjs') || id.includes('router')) {
              return 'vendor-react';
            }
            // UI libraries chunk
            if (id.includes('framer-motion') || id.includes('react-toastify')) {
              return 'vendor-ui';
            }
            // Supabase chunk
            if (id.includes('supabase')) {
              return 'vendor-supabase';
            }
            // Let other dependencies (like react-icons) be handled by Vite's default splitting
            // or bundle them into index if they are small/critical. 
            // Avoid forcing everything into chunks to prevent 'Activity' undefined errors.
          }
        }
      }
    }
  }
})
