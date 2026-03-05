import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '.preview.emergentagent.com',
      '.preview.emergentcf.cloud',
      '.cluster-0.preview.emergentcf.cloud'
    ],
    proxy: {
      '/api': 'http://localhost:8001'
    }
  }
});
