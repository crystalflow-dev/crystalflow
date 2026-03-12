import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy'],
        },
      },
    }),
  ],
  server: {
    allowedHosts: ['.ngrok-free.app'],
    watch: {
      // Watch the dist folders of local packages
      ignored: ['!**/node_modules/@crystalflow/**'],
    },
  },
  optimizeDeps: {
    exclude: ['@crystalflow/core', '@crystalflow/types', '@crystalflow/react'],
  },
  build: {
    cssMinify: 'lightningcss',
  },
});
