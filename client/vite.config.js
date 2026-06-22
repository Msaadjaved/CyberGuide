import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Forwards /api requests to the backend so you don't get CORS errors in dev
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
