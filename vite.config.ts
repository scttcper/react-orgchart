import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true,
  },
});
