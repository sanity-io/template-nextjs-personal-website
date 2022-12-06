import * as demo from 'lib/demo.data'

import MetaDescription from './components/seo/MetaDescription'
import WebsiteMeta from './components/seo/WebsiteMeta'
import { getHome } from './queries'

export default async function HomePageHead() {
  const { title = demo.title, overview } = await getHome()
  return (
    <>
      <title>{title}</title>
      <WebsiteMeta />
      <MetaDescription value={overview} />
    </>
  )
}
