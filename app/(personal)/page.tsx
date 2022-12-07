import { HomePage } from '../../components/HomePage'
import { getHome } from '../../lib/sanity.client'

export default async function IndexRoute() {
  return <HomePage home={await getHome()} />
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
