import PersonalWebsiteMeta from 'components/PersonalWebsiteMeta'
import PersonalWebsiteMetaDescription from 'components/PersonalWebsiteMetaDescription'
import * as demo from 'lib/demo.data'
import { getHome } from 'lib/sanity.client'

export default async function HomePageHead() {
  const { title = demo.title, overview } = await getHome()
  return (
    <>
      <title>{title}</title>
      <PersonalWebsiteMeta />
      <PersonalWebsiteMetaDescription value={overview} />
    </>
  )
}
