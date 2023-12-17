import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      name: 'ainconv',
      formats: ['es', 'umd', 'cjs'],
    },
    rollupOptions: {
      external: [],
      output: {},
    },
  },
});
