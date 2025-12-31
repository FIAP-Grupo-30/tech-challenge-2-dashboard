import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const devPlugins: any[] = [];
if (process.env.NODE_ENV !== 'production') devPlugins.push(vitePluginExposeEntry());

export default defineConfig({
  plugins: [react(), ...devPlugins],
  build: {
    rollupOptions: {
      input: 'src/bytebank-dashboard.tsx',
      output: {
        format: 'es',
        entryFileNames: 'bytebank-dashboard.js',
      },
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'single-spa', 'single-spa-react', 'scheduler'],
      preserveEntrySignatures: 'strict',
    },
    outDir: 'dist',
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
export function vitePluginExposeEntry() {
  return {
    name: 'vite-plugin-expose-bytebank-dashboard',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (url === '/bytebank-dashboard.js') {
          const content = `export * from '/src/bytebank-dashboard.tsx';`;
          res.setHeader('Content-Type', 'application/javascript');
          res.end(content);
          return;
        }
        next();
      });
    },
  };
}
