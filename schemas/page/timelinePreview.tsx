import { Flex } from '@sanity/ui'

export const timelinePreview = (props) => {
  const { value } = props
  const { title, body } = value || {}

  return <Flex align="center">{title} timeline</Flex>
}
