import {FlatCompat} from '@eslint/eslintrc'
import reactCompiler from 'eslint-plugin-react-compiler'
import {defineConfig} from 'eslint/config'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

export default defineConfig([
  ...compat.config({
    ignorePatterns: ['.next/', 'next-env.d.ts', 'public/', 'node_modules/'],
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      // A bit too strict
      '@typescript-eslint/no-explicit-any': 'off',
      // Should always error on deps issues
      'react-hooks/exhaustive-deps': 'error',
      // Temporarily disable the rule that isn't using react compiler as next.js is still using v5 of eslint-plugin-react-hooks
      'react-hooks/rules-of-hooks': 'off',
    },
  }),
  {
    // Setup react compiler using the react-hooks plugin RC
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/rules-of-hooks': 'error',
      'react-compiler/no-unused-directives': 'error',
      'react-compiler/static-components': 'error',
      'react-compiler/use-memo': 'error',
      'react-compiler/component-hook-factories': 'error',
      'react-compiler/preserve-manual-memoization': 'error',
      'react-compiler/immutability': 'error',
      'react-compiler/globals': 'error',
      'react-compiler/refs': 'error',
      'react-compiler/set-state-in-effect': 'error',
      'react-compiler/error-boundaries': 'error',
      'react-compiler/purity': 'error',
      'react-compiler/set-state-in-render': 'error',
      'react-compiler/unsupported-syntax': 'error',
      'react-compiler/config': 'error',
      'react-compiler/gating': 'error',
    },
  },
])
