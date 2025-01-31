'use client'

import type {AllSanitySchemaTypes} from '@/sanity.types'
import type {SanityDocument} from '@sanity/client'
import {type StudioPathLike} from '@sanity/client/csm'
import {get} from '@sanity/util/paths'
import {useOptimistic} from 'next-sanity/hooks'
import {Children, isValidElement} from 'react'

export interface OptimisticSortOrderProps {
  children: React.ReactNode
  /**
   * The id is needed to enable the optimistic state reducer to know if the document being mutated is relevant to the action
   */
  id: string
  /**
   * Where from the source document we're applying optimistic state
   */
  path: StudioPathLike
}

/**
 * This component is used to apply optimistic state to a list of children. It is used to
 * provide a smooth user experience when reordering items in a list. The component
 * expects the children to have a unique key prop, and will reorder the children based
 * on the optimistic state.
 */

export default function OptimisticSortOrder(props: OptimisticSortOrderProps) {
  const {children, id, path} = props
  const childrenLength = Children.count(children)

  const optimistic = useOptimistic<null | string[], SanityDocument<AllSanitySchemaTypes>>(
    null,
    (state, action) => {
      if (action.id !== id) return state
      const value = get(action.document, path) as {_key: string}[]
      if (!value) {
        console.error('No value found for path', path, 'in document', action.document)
        return state
      }
      return value.map(({_key}) => _key)
    },
  )

  if (optimistic) {
    if (optimistic.length < childrenLength) {
      // If the optimistic state is shorter than children, then we don't have enough data to accurately reorder the children so we bail
      return children
    }

    const cache = new Map<string, React.ReactNode>()
    Children.forEach(children, (child) => {
      if (!isValidElement(child) || !child.key) return
      cache.set(child.key, child)
    })
    return optimistic.map((key) => cache.get(key))
  }

  return children
}
