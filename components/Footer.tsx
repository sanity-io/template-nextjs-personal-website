import { PortableText } from '@portabletext/react'
import { Block } from 'sanity'

export function Footer({ footer }: { footer: Block[] }) {
  return (
    <footer className="bottom-0 w-full bg-white py-20 text-center">
      {footer && <PortableText value={footer} />}
    </footer>
  )
}
