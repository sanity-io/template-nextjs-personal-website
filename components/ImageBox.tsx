import {Image, isImageWithAsset, type InferImageValue} from 'next-sanity/image'

import {dataset, projectId} from '@/sanity/lib/api'
import type {QueryResults} from '@/sanity/lib/queryResults'

type ImageValue = InferImageValue<QueryResults>

interface ImageBoxProps {
  // oxlint-disable-next-line typescript/no-redundant-type-constituents -- ImageValue is inferred from `.groq` imports oxlint cannot see
  'image'?: ImageValue | null
  'alt'?: string | null
  'size'?: string
  'classesWrapper'?: string
  'data-sanity'?: string
}

function hasLqip(image: ImageValue): boolean {
  const asset = image.asset
  if (!asset || typeof asset !== 'object' || !('metadata' in asset)) return false
  const metadata = asset.metadata
  if (!metadata || typeof metadata !== 'object' || !('lqip' in metadata)) return false
  return typeof metadata.lqip === 'string' && metadata.lqip.length > 0
}

export default function ImageBox({
  image,
  alt = 'Cover image',
  size = '100vw',
  classesWrapper,
  'data-sanity': dataSanity,
}: ImageBoxProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[3px] bg-gray-50 ${classesWrapper ?? ''}`}
      data-sanity={dataSanity}
    >
      {isImageWithAsset(image) && (
        <Image
          alt={alt ?? ''}
          className="object-cover"
          dataset={dataset}
          fill
          placeholder={hasLqip(image) ? 'blur' : 'empty'}
          projectId={projectId}
          sizes={size}
          src={image}
        />
      )}
    </div>
  )
}
