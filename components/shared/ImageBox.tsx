import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'

interface ImageBoxProps {
  image?: { asset?: any }
  alt?: string
  width?: number
  height?: number
}

export default function ImageBox({
  image,
  alt = 'Cover image',
  width = 3500,
  height = 2000,
}: ImageBoxProps) {
  const imageUrl =
    image && urlForImage(image)?.height(height).width(width).fit('fill').url()

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[3px] bg-gray-50">
      {imageUrl && (
        <Image
          className="absolute h-full w-full"
          alt={alt}
          width={width}
          height={height}
          sizes="100vw"
          src={imageUrl}
        />
      )}
    </div>
  )
}
