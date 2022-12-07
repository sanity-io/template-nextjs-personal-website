import PersonalWebsiteMeta from 'components/PersonalWebsiteMeta'
import PersonalWebsiteMetaDescription from 'components/PersonalWebsiteMetaDescription'
import * as demo from 'lib/demo.data'
import { getProjectBySlug } from 'lib/sanity.client'
import { urlForImage } from 'lib/sanity.image'

export default async function SlugHead({
  params,
}: {
  params: { slug: string }
}) {
  const project = await getProjectBySlug(params.slug)

  return (
    <>
      <title>{project?.title}</title>
      <PersonalWebsiteMeta />
      <PersonalWebsiteMetaDescription value={project?.overview} />
      {project.coverImage.asset._ref && (
        <meta
          property="og:image"
          content={urlForImage(project?.coverImage)
            .width(1200)
            .height(627)
            .fit('crop')
            .url()}
        />
      )}
    </>
  )
}
