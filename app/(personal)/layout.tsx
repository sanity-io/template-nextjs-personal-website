import 'tailwindcss/tailwind.css'

import { IBM_Plex_Mono, Inter, PT_Serif } from '@next/font/google'

import { Footer, Navbar } from './components'
import { Providers } from './providers'
import { getHome, getMenuItems, getPages } from './queries'

const serif = PT_Serif({
  variable: '--font-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})
const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['500', '700', '800'],
})
const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getHome()
  const menu = await getMenuItems()

  return (
    <html
      lang="en"
      className={`${mono.variable} ${sans.variable} ${serif.variable}`}
    >
      <head />
      <body className="flex min-h-screen flex-col bg-white text-black dark:bg-black dark:text-white">
        <Providers>
          <Navbar menu={menu} />
          <div className="mt-12 flex-grow px-32">{children}</div>

          <Footer footer={settings?.footer} />
        </Providers>
      </body>
    </html>
  )
}
