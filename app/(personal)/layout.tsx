import { previewData } from 'next/headers'

import { Footer } from '../../components/Footer'
import { Navbar } from '../../components/Navbar'
import { PreviewBanner } from '../../components/PreviewBanner'
import { getSettings } from '../../lib/sanity.client'

export default async function IndexRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { menuItems, footer } = await getSettings()

  const token = previewData().token

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {token && <PreviewBanner />}
      <Navbar menuItems={menuItems} />
      <div className="mt-12 flex-grow px-32">{children}</div>
      <Footer footer={footer} />
    </div>
  )
}
