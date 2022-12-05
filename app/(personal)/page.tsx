import { HomePage } from './HomePage'
import { getSettings } from './queries'

export default async function Home() {
  const settings = await getSettings()

  return <HomePage settings={settings} />
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
