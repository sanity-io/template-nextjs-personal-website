import {evaluate, parse} from 'groq-js'

export interface DocumentChange {
  before?: Record<string, unknown> | null
  after?: Record<string, unknown> | null
}

export interface EventRule {
  filter?: string
  projection?: string
}

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
