import { previewSecretId } from 'lib/sanity.api'
import { getClient } from 'lib/sanity.client'
import { resolveHref } from 'lib/sanity.links'
import type { NextApiRequest, NextApiResponse } from 'next'
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
  if (!req.query.secret) {
    return res.status(401).send('Invalid secret')
  }

  const validSecret = await isValidSecret(
    getClient(),
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
