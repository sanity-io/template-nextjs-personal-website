/**
 * Tailwind CSS is configured in `app/globals.css`. This file only exists because the
 * `@tailwindcss/typography` plugin reads its `typography` theme through the JavaScript config
 * API, so it is loaded from the stylesheet with `@config`.
 * https://github.com/tailwindlabs/tailwindcss-typography#customizing-the-css
 *
 * The values are a vendored copy of the `typography` key of `@sanity/demo/tailwind`
 * (package version 2.0.0, MIT, github.com/sanity-io/demo).
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  theme: {
    extend: {
      typography: {
        'DEFAULT': {
          css: {
            '--tw-prose-body': '#0d0e12',
            '--tw-prose-headings': '#0d0e12',
            '--tw-prose-lead': '#0d0e12',
            '--tw-prose-links': '#0d0e12',
            '--tw-prose-bold': '#0d0e12',
            '--tw-prose-counters': '#0d0e12',
            '--tw-prose-bullets': '#0d0e12',
            '--tw-prose-hr': '#0d0e12',
            '--tw-prose-quotes': '#0d0e12',
            '--tw-prose-quote-borders': '#0d0e12',
            '--tw-prose-captions': '#0d0e12',
            '--tw-prose-code': '#0d0e12',
            '--tw-prose-pre-code': '#ffffff',
            '--tw-prose-pre-bg': '#0d0e12',
            '--tw-prose-th-borders': '#0d0e12',
            '--tw-prose-td-borders': '#0d0e12',
            '--tw-prose-invert-body': '#ffffff',
            '--tw-prose-invert-headings': '#ffffff',
            '--tw-prose-invert-lead': '#ffffff',
            '--tw-prose-invert-links': '#ffffff',
            '--tw-prose-invert-bold': '#ffffff',
            '--tw-prose-invert-counters': '#ffffff',
            '--tw-prose-invert-bullets': '#ffffff',
            '--tw-prose-invert-hr': '#ffffff',
            '--tw-prose-invert-quotes': '#ffffff',
            '--tw-prose-invert-quote-borders': '#ffffff',
            '--tw-prose-invert-captions': '#ffffff',
            '--tw-prose-invert-code': '#ffffff',
            '--tw-prose-invert-pre-code': '#0d0e12',
            '--tw-prose-invert-pre-bg': '#ffffff',
            '--tw-prose-invert-th-borders': '#ffffff',
            '--tw-prose-invert-td-borders': '#ffffff',
            'blockquote': {
              fontWeight: 'inherit',
              fontStyle: 'normal',
            },
          },
        },
        'sm': {
          css: {
            pre: {
              borderRadius: '0.1875rem',
            },
          },
        },
        'base': {
          css: {
            pre: {
              borderRadius: '0.1875rem',
            },
          },
        },
        'lg': {
          css: {
            pre: {
              borderRadius: '0.1875rem',
            },
          },
        },
        'xl': {
          css: {
            pre: {
              borderRadius: '0.1875rem',
            },
          },
        },
        '2xl': {
          css: {
            pre: {
              borderRadius: '0.1875rem',
            },
          },
        },
      },
    },
  },
}
