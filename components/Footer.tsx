import { PortableText } from '@portabletext/react'

import type { HomePagePayload } from '../types'

export function Footer({ footer }: HomePagePayload) {
  return (
    <footer className="bottom-0 w-screen border-t bg-white py-4 text-center dark:bg-black">
      <PortableText value={footer} />
    </footer>
  )
}
