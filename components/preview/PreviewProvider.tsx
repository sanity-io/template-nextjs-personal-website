import { GroqStoreProvider } from '@sanity/preview-kit/groq-store'
import { dataset, projectId } from 'lib/sanity.api'

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode
  token: string | null
}) {
  return (
    <GroqStoreProvider
      projectId={projectId}
      dataset={dataset}
      token={token}
      // As your dataset grows you might hit the default limit of 3000.
      // However you can increase this limit however you like and audit how it performs.
      // Or even set it to `Infinity` if you want to disable the limit.
      // documentLimit={10000}

      // Another way to get around the `documentLimit` is to set `includeTypes` to just the document types that are used in preview mode.
      // You can run the `array::unique(*._type)` GROQ query in `Vision` in your Studio to see how many types are in your dataset.
      // Just be careful that you don't forget the document types you might be using in strong references, such as `project` or `sanity.imageAsset`
      // includeTypes={['settings', 'project', 'page', 'sanity.imageAsset']}

      // If you have a lot of people in your Studio that are editing the content you're previewing
      // you could end up with a very high number of React rerenders. Normally this isn't a problem,
      // but should you hit a problem at scale you can adjust `subscriptionThrottleMs` to a higher value than the default `10` milliseconds.
      // Or if you're daring you could set it to `1` to have the lowest possible latency between edits and the live-preview.
      // subscriptionThrottleMs={60}
    >
      {children}
    </GroqStoreProvider>
  )
}
