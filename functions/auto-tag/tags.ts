export const MAX_TAGS = 5

/** Reduces whatever Generate returned to the tags the schema stores: lowercase, unique, at most five. */
export function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const tags = value
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag !== '')
  return [...new Set(tags)].slice(0, MAX_TAGS)
}
