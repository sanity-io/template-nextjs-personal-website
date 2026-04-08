import {lazy, Suspense} from 'react'
import type {OptimisticSortOrderProps} from './index.client'
import type { DynamicFetchOptions } from '@/sanity/lib/live'


const LazyOptimisticSortOrder = lazy(() => import('./index.client.nopreload'))

/**
 * Optimistic sort ordering is only used when editing the website from Sanity Studio, so it's only actually loaded in Draft Mode.
 */

export  function OptimisticSortOrder(
  props: Omit<OptimisticSortOrderProps, 'id'> & {id?: string | null} & Pick<DynamicFetchOptions, 'isDraftMode'>,
) {
  const {children, id, path, isDraftMode} = props

  if (!id) {
    return children
  }

  if (!isDraftMode) {
    return children
  }

  return (
    <Suspense fallback={children}>
      <LazyOptimisticSortOrder id={id} path={path}>
        {children}
      </LazyOptimisticSortOrder>
    </Suspense>
  )
}
