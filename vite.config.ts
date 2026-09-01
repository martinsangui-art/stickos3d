import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Sitio en GitHub Pages con dominio propio (CNAME) → base "/" (raíz), no
// "/stickos3d/". Si en algún momento se saca el dominio propio y se vuelve a
// servir desde github.io/stickos3d, esto tiene que pasar a "/stickos3d/".
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
