import { Card, Text } from '@sanity/ui'
import { ComponentProps } from 'react'
import { UserViewComponent } from 'sanity/desk'
export type PreviewProps = ComponentProps<UserViewComponent>

export function PreviewPane(props: PreviewProps) {
  const { document } = props
  const { displayed } = document

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
