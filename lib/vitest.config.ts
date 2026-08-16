import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['report/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@ngwave/migrate': resolve(__dirname, '../projects/ngwave-migrate/src/index.ts'),
    },
  },
});
