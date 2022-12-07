import PersonalWebsiteMeta from 'components/PersonalWebsiteMeta'
import PersonalWebsiteMetaDescription from 'components/PersonalWebsiteMetaDescription'
import { getPageBySlug } from 'lib/sanity.client'

export default async function AboutPageHead() {
  const { overview } = await getPageBySlug('about')

  return (
    <>
      <title>About</title>
      <PersonalWebsiteMeta />
      <PersonalWebsiteMetaDescription value={overview} />
    </>
  )
}
