import { settingsQuery } from 'lib/sanity.queries'
import { useListeningQuery } from 'next-sanity/preview'
import type { SettingsPayload } from 'types'

import { Navbar } from './Navbar'

export default function PreviewNavbar({
  settings: initialSettings,
}: {
  settings: SettingsPayload
}) {
  const settings = useListeningQuery<SettingsPayload>(
    initialSettings,
    settingsQuery,
    {},
    { isEqual: (a, b) => a?.menuItems === b?.menuItems }
  )

  return <Navbar menuItems={settings?.menuItems} />
}
