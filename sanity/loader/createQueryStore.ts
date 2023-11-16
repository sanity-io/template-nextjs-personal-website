import { createQueryStore } from '@sanity/react-loader/rsc'

/**
 * The queryStore instance is shared in RSC and client components, and thus this file must be kept tiny
 * otherwise it will be included in the client bundle.
 * The API meant to be used from RSC components are exported from `./loadQuery.ts` and
 * client components should import from `./useQuery.ts`
 */
export const queryStore = createQueryStore({
  client: false,
  ssr: true,
})
