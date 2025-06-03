import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://192.168.195.23:8080',
        changeOrigin: true,
        secure: false,
      },
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }


    }
  }
});