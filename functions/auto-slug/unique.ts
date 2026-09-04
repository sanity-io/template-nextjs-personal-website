import {randomInt} from 'node:crypto'

/** Numbered candidates (`base`, `base-2`, ...) tried before falling back to a random suffix. */
export const SLUG_CANDIDATES = 20

export const slugCandidates = (base: string, count: number): string[] =>
  Array.from({length: count}, (_, index) => (index === 0 ? base : `${base}-${index + 1}`))

const randomSuffix = () =>
  randomInt(36 ** 4)
    .toString(36)
    .padStart(4, '0')

export function uniqueSlug(
  base: string,
  taken: Iterable<string>,
  random: () => string = randomSuffix,
): string {
  const used = new Set(taken)
  return (
    slugCandidates(base, SLUG_CANDIDATES).find((slug) => !used.has(slug)) ?? `${base}-${random()}`
  )
}
