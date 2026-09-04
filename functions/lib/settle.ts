import {setTimeout as sleep} from 'node:timers/promises'

import type {SanityClient} from '@sanity/client'

export const SETTLE_MS = {title: 2000, prompt: 4000, body: 4000} as const

/**
 * Waits for the editor to stop typing, then re-reads the document so the handler acts on the
 * current state instead of the keystroke that triggered the event. Resolves null when the
 * document has been deleted meanwhile.
 */
export async function settled<T>(
  client: SanityClient,
  id: string,
  projection: `{${string}}`,
  ms: number,
): Promise<T | null> {
  await sleep(ms)
  return client.fetch<T | null>(`*[_id == $id][0]${projection}`, {id})
}
