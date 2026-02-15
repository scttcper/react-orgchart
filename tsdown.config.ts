import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  unbundle: true,
  platform: 'browser',
  target: 'es2025',
  external: ['react', 'react-dom'],
});
