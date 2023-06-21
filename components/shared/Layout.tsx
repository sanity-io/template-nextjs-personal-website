import { Footer } from 'components/global/Footer'
import { Navbar } from 'components/global/Navbar'
import { PreviewBanner } from 'components/preview/PreviewBanner'
import IntroTemplate from 'intro-template'
import { SettingsPayload } from 'types'

const fallbackSettings: SettingsPayload = {
  menuItems: [],
  footer: [],
}

export interface LayoutProps {
  children: React.ReactNode
  settings: SettingsPayload | undefined
  preview?: boolean
}

export default function Layout({
  children,
  settings = fallbackSettings,
  preview,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {preview && <PreviewBanner />}
      <Navbar menuItems={settings?.menuItems} />
      <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">{children}</div>
      <Footer footer={settings?.footer} />
      <IntroTemplate />
    </div>
  )
}
