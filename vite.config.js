import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Adjust the path according to your project structure
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'access-control-allow-origin': '*',
    },
    proxy: {
      '/api': {
        target: 'https://mashupsbackand.vercel.app/', // Your API target for local dev
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Removes /api prefix
      }
    }
  },
  plugins: [react()],
});
