import MetaDescription from '../components/seo/MetaDescription'
import WebsiteMeta from '../components/seo/WebsiteMeta'
import { getPageBySlug } from './queries'

export default async function AboutPageHead() {
  const { overview } = await getPageBySlug('about')

  return (
    <>
      <title>About</title>
      <WebsiteMeta />
      <MetaDescription value={overview} />
    </>
  )
}
