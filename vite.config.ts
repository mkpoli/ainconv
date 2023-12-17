import { defineConfig } from 'vite';

import typescript from '@rollup/plugin-typescript';

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
      plugins: [
        typescript({
          declaration: true,
          outDir: 'dist',
          rootDir: 'src',
        }),
      ],
    },
  },
});
