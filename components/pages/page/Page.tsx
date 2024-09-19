import { CustomPortableText } from '@/components/shared/CustomPortableText'
import { Header } from '@/components/shared/Header'
import type { PagesBySlugQueryResult } from '@/sanity.types'

export interface PageProps {
  data: PagesBySlugQueryResult | null
}

export function Page({ data }: PageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { body, overview, title } = data ?? {}

  return (
    <div>
      <div className="mb-14">
        {/* Header */}
        <Header title={title} description={overview} />

        {/* Body */}
        {body && (
          <CustomPortableText
            paragraphClasses="font-serif max-w-3xl text-gray-600 text-xl"
            value={body as unknown as any}
          />
        )}
      </div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}

export default Page
