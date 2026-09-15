import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  css: { modules: { generateScopedName: 'lk-[name]__[local]__[hash:base64:5]' } },
  build: { outDir: 'demo-dist' },
});
