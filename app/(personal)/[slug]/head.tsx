import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'

import WebsiteMeta from '../components/seo/WebsiteMeta'
import { getProjectBySlug } from './queries'

export default async function SlugHead({
  params,
}: {
  params: { slug: string }
}) {
  const project = await getProjectBySlug(params.slug)

  return (
    <>
      <title>{project.title}</title>
      <WebsiteMeta />
      {project.coverImage?.asset?._ref && (
        <meta
          property="og:image"
          content={urlForImage(project.coverImage)
            .width(1200)
            .height(627)
            .fit('crop')
            .url()}
        />
      )}
    </>
  )
}
