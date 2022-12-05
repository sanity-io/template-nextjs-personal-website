import { HomePage } from './HomePage'
import { getHome } from './queries'

export default async function Home() {
  const home = await getHome()

  return <HomePage home={home} />
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
