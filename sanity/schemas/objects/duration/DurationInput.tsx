import {ArrowRightIcon} from '@sanity/icons/ArrowRight'
import {Box, Flex, Text} from '@sanity/ui'
import {useCallback, useMemo} from 'react'
import type {FieldMember, ObjectInputProps, RenderFieldCallback} from 'sanity'
import {MemberField} from 'sanity/_dangerously_use_private_internals_that_do_not_follow_semver-2'

export function DurationInput(props: ObjectInputProps) {
  const {members, renderInput, renderItem, renderPreview} = props

  const fieldMembers = members.filter((mem): mem is FieldMember => mem.kind === 'field')
  const start = fieldMembers.find((mem) => mem.name === 'start')
  const end = fieldMembers.find((mem) => mem.name === 'end')

  const renderField: RenderFieldCallback = useCallback((field) => field.children, [])

  const renderProps = useMemo(
    () => ({renderField, renderInput, renderItem, renderPreview}),
    [renderField, renderInput, renderItem, renderPreview],
  )

  return (
    <Flex align="center" gap={3}>
      <Box flex={1}>{start && <MemberField {...renderProps} member={start} />}</Box>
      <Box>
        <Text muted>
          <ArrowRightIcon />
        </Text>
      </Box>
      <Box flex={1}>{end && <MemberField {...renderProps} member={end} />}</Box>
    </Flex>
  )
}
