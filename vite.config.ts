import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'src/bytebank-dashboard.tsx',
      output: {
        format: 'system',
        entryFileNames: 'bytebank-dashboard.js',
      },
      external: ['react', 'react-dom', 'single-spa'],
      preserveEntrySignatures: 'strict',
    },
    outDir: 'dist',
    lib: {
      entry: 'src/bytebank-dashboard.tsx',
      name: 'bytebank-dashboard',
      formats: ['system'],
      fileName: () => 'bytebank-dashboard.js',
    },
  },
  server: {
    port: 9003,
    cors: true,
  },
  preview: {
    port: 9003,
    cors: true,
  },
});
