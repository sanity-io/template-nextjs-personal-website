import 'tailwindcss/tailwind.css'

import { Providers } from './(personal)/providers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
