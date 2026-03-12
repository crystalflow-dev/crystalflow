import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CrystalFlow',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@xyflow/react',
        '@crystalflow/core',
        '@crystalflow/types',
        '@monaco-editor/react',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          '@xyflow/react': 'ReactFlow',
          '@crystalflow/core': 'CrystalFlowCore',
          '@crystalflow/types': 'CrystalFlowTypes',
          '@monaco-editor/react': 'MonacoReact',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'react.css';
          return assetInfo.name || 'asset';
        },
      },
    },
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@crystalflow/core': resolve(__dirname, '../core/src'),
      '@crystalflow/types': resolve(__dirname, '../types/src'),
    },
  },
});
