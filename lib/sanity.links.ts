// @todo - consider renaming / moving elsewhere

export function resolveHref(
  documentType?: string,
  slug?: string
): string | undefined {
  switch (documentType) {
    case 'home':
      return '/'
    case 'page':
      return slug ? '/page/' + slug : undefined
    case 'project':
      return slug ? '/project/' + slug : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}
