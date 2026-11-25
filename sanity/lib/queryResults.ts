import type {QueryResponse as HomePageQueryResponse} from '#queries/homePage.groq'
import type {QueryResponse as LayoutMetadataQueryResponse} from '#queries/layoutMetadata.groq'
import type {QueryResponse as ProjectSlugPageQueryResponse} from '#queries/projectSlugPage.groq'
import type {QueryResponse as ProjectSlugPageMetadataQueryResponse} from '#queries/projectSlugPageMetadata.groq'
import type {QueryResponse as SettingsQueryResponse} from '#queries/settings.groq'
import type {QueryResponse as SlugPageQueryResponse} from '#queries/slugPage.groq'
import type {QueryResponse as SlugPageMetadataQueryResponse} from '#queries/slugPageMetadata.groq'
import type {QueryResponse as SlugsByTypeQueryResponse} from '#queries/slugsByType.groq'

/**
 * Every `.groq` result. `SanityQueries` stays empty because typegen only sees `defineQuery`,
 * so image and portable text props are inferred from these imports instead.
 */
// oxlint's type checker does not load the `.groq` content mapper, so each import is an error type here.
// `npm run type-check` is what types this union.
// oxlint-disable typescript/no-redundant-type-constituents
export type QueryResults =
  | HomePageQueryResponse
  | LayoutMetadataQueryResponse
  | ProjectSlugPageQueryResponse
  | ProjectSlugPageMetadataQueryResponse
  | SettingsQueryResponse
  | SlugPageQueryResponse
  | SlugPageMetadataQueryResponse
  | SlugsByTypeQueryResponse
// oxlint-enable typescript/no-redundant-type-constituents
