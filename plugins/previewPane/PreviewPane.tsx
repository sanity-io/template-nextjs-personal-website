import { Card, Text } from '@sanity/ui'
import { ComponentProps } from 'react'
import { UserViewComponent } from 'sanity/desk'
export type PreviewProps = ComponentProps<UserViewComponent>

export function PreviewPane(props: PreviewProps) {
  const { document } = props
  const { displayed } = document

  if (!(displayed?.slug as any)?.current) {
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
      <iframe
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
        }}
        src={`/${(displayed?.slug as any)?.current}/preview`}
      />
    </Card>
  )
}
