import { Footer } from '../../components/Footer'
import { Navbar } from '../../components/Navbar'
import { getSettings } from '../../lib/sanity.client'

export default async function IndexRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { menuItems, footer } = await getSettings()
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Navbar menuItems={menuItems} />
      <div className="mt-12 flex-grow px-32">{children}</div>
      <Footer footer={footer} />
    </div>
  )
}
