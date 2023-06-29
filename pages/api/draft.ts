import {
  apiVersion,
  dataset,
  previewSecretId,
  projectId,
  readToken,
  useCdn,
} from 'lib/sanity.api'
import { resolveHref } from 'lib/sanity.links'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from 'next-sanity'
import { getSecret } from 'plugins/productionUrl/utils'

function redirectToPreview(
  res: NextApiResponse<string | void>,
  Location: string
): void {
  // Enable Draft Mode by setting the cookies
  res.setDraftMode({ enable: true })
  res.writeHead(307, { Location })
  res.end()
}

const _client = createClient({ projectId, dataset, apiVersion, useCdn })

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse<string | void>
) {
  if (!req.query.secret) {
    return res.status(401).send('Invalid secret')
  }

  const token = readToken
  if (!token) {
    throw new Error(
      'A secret is provided but there is no `SANITY_API_READ_TOKEN` environment variable setup.'
    )
  }
  const client = _client.withConfig({ useCdn: false, token })
  const secret = await getSecret(client, previewSecretId)
  if (req.query.secret !== secret) {
    return res.status(401).send('Invalid secret')
  }

  const href = resolveHref(
    req.query.documentType as string,
    req.query.slug as string
  )

  if (!href) {
    return res
      .status(400)
      .send(
        'Unable to resolve preview URL based on the current document type and slug'
      )
  }

  return redirectToPreview(res, href)
}
