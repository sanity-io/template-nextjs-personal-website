import { HomePage } from '../../components/HomePage'
import { getHome } from '../../lib/sanity.client'

export default async function IndexRoute() {
  const home = await getHome()
  return <HomePage home={home} />
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
