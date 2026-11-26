import 'server-only'
import {getIntegrationToken, IntegrationTokenError} from '@vercel/integrations'
import {getContext} from '@vercel/oidc'

const integrationSlug = 'sanity'

const MINT_RETRY_AFTER_FAILURE_MS = 5 * 60_000

let skipMintingUntil = 0

function hasOidcToken(): boolean {
  return Boolean(getContext().headers?.['x-vercel-oidc-token'] ?? process.env.VERCEL_OIDC_TOKEN)
}

async function mintViewerToken(): Promise<string | undefined> {
  const readToken = process.env.SANITY_API_READ_TOKEN
  if (readToken && Date.now() < skipMintingUntil) {
    return undefined
  }
  try {
    return await getIntegrationToken(integrationSlug, {role: 'viewer'})
  } catch (error) {
    console.error('[sanity] minting a viewer token through Vercel OIDC failed', {
      ...(error instanceof IntegrationTokenError && {status: error.status, code: error.code}),
      fallback: readToken ? 'SANITY_API_READ_TOKEN for the next 5 minutes' : 'none',
      error: String(error),
    })
    if (!readToken) {
      throw error
    }
    skipMintingUntil = Date.now() + MINT_RETRY_AFTER_FAILURE_MS
    return undefined
  }
}

export async function getViewerToken(): Promise<string> {
  const token =
    (hasOidcToken() ? await mintViewerToken() : undefined) ?? process.env.SANITY_API_READ_TOKEN
  if (!token) {
    throw new Error('Missing VERCEL_OIDC_TOKEN or SANITY_API_READ_TOKEN')
  }
  return token
}
