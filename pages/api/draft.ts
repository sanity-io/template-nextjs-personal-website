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
import { isValidSecret } from 'sanity-plugin-iframe-pane/is-valid-secret'

function redirectToPreview(
  res: NextApiResponse<string | void>,
  Location: string,
): void {
  // Enable Draft Mode by setting the cookies
  res.setDraftMode({ enable: true })
  res.writeHead(307, { Location })
  res.end()
}

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse<string | void>,
) {
  const token = readToken
  if (!token) {
    throw new Error(
      'A secret is provided but there is no `SANITY_API_READ_TOKEN` environment variable setup.',
    )
  }

  if (!req.query.secret) {
    return res.status(401).send('Invalid secret')
  }

  const client = createClient({ projectId, dataset, apiVersion, useCdn, token })
  const validSecret = await isValidSecret(
    client,
    previewSecretId,
    Array.isArray(req.query.secret) ? req.query.secret[0] : req.query.secret,
  )
  if (!validSecret) {
    return res.status(401).send('Invalid secret')
  }

  const href = resolveHref(req.query.type as string, req.query.slug as string)

  if (!href) {
    return res
      .status(400)
      .send(
        'Unable to resolve preview URL based on the current document type and slug',
      )
  }

  return redirectToPreview(res, href)
}
