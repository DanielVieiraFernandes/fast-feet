import swc from 'unplugin-swc';
import tsConfig from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
  plugins: [tsConfig(), swc.vite()],
});
