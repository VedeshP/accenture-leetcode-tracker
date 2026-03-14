import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        accenture: resolve(__dirname, 'index.html'),
        jpmc: resolve(__dirname, 'jpmc.html'),
      },
    },
  },
});
