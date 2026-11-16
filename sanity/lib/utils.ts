import {createImageUrlBuilder, isImageWithAsset, type SanityImageLike} from '@sanity/image-url'

import {dataset, projectId} from '@/sanity/lib/api'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export function urlForOpenGraphImage(image: SanityImageLike | null | undefined) {
  // Open Graph metadata needs a URL. Rendered images go through `next-sanity/image`.
  if (!isImageWithAsset(image)) return undefined

  return imageBuilder
    .image(image)
    .auto('format')
    .fit('max')
    .width(1200)
    .height(627)
    .fit('crop')
    .url()
}

export function resolveHref(documentType?: string, slug?: string | null): string | undefined {
  switch (documentType) {
    case 'home':
      return '/'
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'project':
      return slug ? `/projects/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}
