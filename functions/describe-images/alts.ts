import type {AltPath} from '../lib/events'

/** The JSONMatch form of a payload path, which is how `patch()` addresses a keyed array item. */
export function toJsonMatch(path: AltPath): string {
  let match = ''
  for (const segment of path) {
    match +=
      typeof segment === 'string' ? (match ? `.${segment}` : segment) : `[_key=="${segment._key}"]`
  }
  return match
}

/**
 * The alt text Transform produced for each target, keyed by JSONMatch path so the result can be
 * handed to `setIfMissing()` as is. Targets Transform left empty or non-textual are dropped.
 */
export function readAlts(result: unknown, targets: AltPath[]): Record<string, string> {
  const alts: Record<string, string> = {}
  for (const path of targets) {
    const value = valueAt(result, path)
    if (typeof value !== 'string') continue
    const alt = value.trim()
    if (alt) alts[toJsonMatch(path)] = alt
  }
  return alts
}

function valueAt(root: unknown, path: AltPath): unknown {
  return path.reduce<unknown>((current, segment) => {
    if (typeof segment === 'string') return isRecord(current) ? current[segment] : undefined
    return Array.isArray(current)
      ? current.find((item) => isRecord(item) && item._key === segment._key)
      : undefined
  }, root)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
