import {evaluate, parse} from 'groq-js'

export interface DocumentChange {
  before?: Record<string, unknown> | null
  after?: Record<string, unknown> | null
}

export interface EventRule {
  filter?: string
  projection?: string
}

/**
 * Mirrors how Sanity evaluates a document function's `event.filter` and `event.projection`: the
 * changed document is the only document in the dataset, and delta functions see `before`/`after`.
 * `undefined` means the filter did not match and the function would not be invoked.
 */
export async function evaluateEvent<T = unknown>(
  {filter, projection}: EventRule,
  {before = null, after = null}: DocumentChange,
): Promise<T | undefined> {
  const tree = parse(`*[${filter ?? ''}]${projection ?? ''}`, {mode: 'delta'})
  const current = after ?? before
  const value = await evaluate(tree, {dataset: current ? [current] : [], before, after})
  const [result] = (await value.get()) as T[]
  return result
}
