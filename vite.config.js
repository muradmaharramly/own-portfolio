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
            // 1. Separate React Icons (Must be checked BEFORE 'react' to avoid being captured there)
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            
            // 2. Core Vendor (React, Router, Redux)
            if (id.includes('react') || id.includes('redux') || id.includes('@reduxjs') || id.includes('router')) {
              return 'vendor-react';
            }

            // 3. UI Libraries
            if (id.includes('framer-motion') || id.includes('react-toastify')) {
              return 'vendor-ui';
            }

            // 4. Supabase
            if (id.includes('supabase')) {
              return 'vendor-supabase';
            }
          }
        }
      }
    }
  }
})
