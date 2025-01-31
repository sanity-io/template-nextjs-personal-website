const preset = require('@sanity/prettier-config')

module.exports = {
  ...preset,
  plugins: [
    ...preset.plugins,
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports',
  ],
}
