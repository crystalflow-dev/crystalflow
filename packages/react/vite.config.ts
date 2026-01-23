import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@reactflo/core': resolve(__dirname, '../core/src'),
      '@reactflo/types': resolve(__dirname, '../types/src'),
    },
  },
});
