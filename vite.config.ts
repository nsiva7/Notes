import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Notes/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
