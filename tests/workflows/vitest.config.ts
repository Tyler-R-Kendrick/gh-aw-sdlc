import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    testTimeout: 60_000,
    root: resolve(__dirname, '../..'),
    include: ['tests/workflows/**/*.test.ts'],
  },
})
