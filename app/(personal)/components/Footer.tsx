import { PortableText } from '@portabletext/react'
import { Home } from 'app/(personal)/queries'

export function Footer({ footer }: Home) {
  return (
    <footer className="bottom-0 w-screen border-t bg-white py-4 text-center dark:bg-black">
      <PortableText value={footer} />
    </footer>
  )
}
