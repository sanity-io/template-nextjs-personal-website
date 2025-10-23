import {defineConfig} from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'

export default defineConfig([
  {ignores: ['.next/', 'next-env.d.ts', 'public/', 'node_modules/']},
  reactHooks.configs.flat.recommended,
])
