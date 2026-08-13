import reactHooks from 'eslint-plugin-react-hooks'
import {defineConfig} from 'eslint/config'

export default defineConfig([
  {
    ignores: [
      '.next/',
      'next-env.d.ts',
      'public/',
      'node_modules/',
      'test-results/',
      'playwright-report/',
    ],
  },
  reactHooks.configs.flat.recommended,
])
