import { Card, Text } from '@sanity/ui'
import { ComponentProps, Suspense } from 'react'
import { UserViewComponent } from 'sanity/desk'
export type PreviewProps = ComponentProps<UserViewComponent>

/**
 * This component is responsible for rendering a preview of a post inside the Studio.
 */
import { getSecret } from 'plugins/productionUrl/utils'
import React, { memo, startTransition, useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { suspend } from 'suspend-react'

interface IframeProps {
  slug?: string
  previewSecretId: `${string}.${string}`
  apiVersion: string
}

export function PreviewPane(
  props: PreviewProps & {
    previewSecretId: `${string}.${string}`
    apiVersion: string
  }
) {
  const { document, previewSecretId, apiVersion } = props
  const { displayed } = document
  const slug = (displayed?.slug as any)?.current

  if (!slug) {
    return (
      <Card tone="primary" margin={5} padding={6}>
        <Text align="center">
          Please add a slug to the post to see the preview!
        </Text>
      </Card>
    )
  }

  return (
    <Card
      scheme="light"
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <Suspense fallback={null}>
        <Iframe
          apiVersion={apiVersion}
          previewSecretId={previewSecretId}
          slug={slug}
        />
      </Suspense>
    </Card>
  )
}

// Used as a cache key that doesn't risk collision or getting affected by other components that might be using `suspend-react`
const fetchSecret = Symbol('preview.secret')
const Iframe = memo(function Iframe(
  props: Omit<IframeProps, 'slug'> & Required<Pick<IframeProps, 'slug'>>
) {
  const { apiVersion, previewSecretId, slug } = props
  const client = useClient({ apiVersion })

  const secret = suspend(
    () => getSecret(client, previewSecretId, true),
    ['getSecret', previewSecretId, fetchSecret],
    // The secret fetch has a TTL of 1 minute, just to check if it's necessary to recreate the secret which has a TTL of 60 minutes
    { lifespan: 60000 }
  )

  const url = new URL('/api/preview', location.origin)
  url.searchParams.set('slug', slug)
  if (secret) {
    url.searchParams.set('secret', secret)
  }

  return (
    <iframe
      style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
      src={url.toString()}
    />
  )
})
