import './globals.css'
import {IBM_Plex_Mono, Inter, PT_Serif} from 'next/font/google'

// The Tailwind `font-*` utilities map onto these variables in app/globals.css (`@theme inline`).
const serif = PT_Serif({
  variable: '--font-pt-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})
const sans = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  // @todo: understand why extrabold (800) isn't being respected when explicitly specified in this weight array
  // weight: ['500', '700', '800'],
})
const mono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
