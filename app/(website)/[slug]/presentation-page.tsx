'use client'

import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import type {SlugPageQueryResult} from '@/sanity.types'
import {defineQuery} from 'next-sanity'
import {usePresentationQuery} from 'next-sanity/hooks'

interface Props {
  slug: string
  id: string | null
  type: string | null
}

export function PresentationHeader({
  slug,
  ...props
}: Props & Pick<NonNullable<SlugPageQueryResult>, 'title' | 'overview'>) {
  const presentationHeaderQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    overview,
  }`)
  const {data: optimistic} = usePresentationQuery({query: presentationHeaderQuery, params: {slug}})
  const id = optimistic?._id ?? props.id
  const type = optimistic?._type ?? props.type
  const title = optimistic?.title ?? props.title
  const overview = optimistic?.overview ?? props.overview
  return (
    <Header
      id={id}
      type={type}
      path={['overview']}
      title={title || 'Untitled'}
      description={overview}
    />
  )
}

export function PresentationBody({
  slug,
  ...props
}: Props & Pick<NonNullable<SlugPageQueryResult>, 'body'>) {
  const presentationBodyQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    body,
  }`)
  const {data: optimistic} = usePresentationQuery({query: presentationBodyQuery, params: {slug}})
  const id = optimistic?._id ?? props.id
  const type = optimistic?._type ?? props.type
  const body = optimistic?.body ?? props.body
  return (
    <>
      {Array.isArray(body) && (
        <CustomPortableText
          id={id}
          type={type}
          path={['body']}
          paragraphClasses="font-serif max-w-3xl text-gray-600 text-xl"
          value={body}
        />
      )}
    </>
  )
}
