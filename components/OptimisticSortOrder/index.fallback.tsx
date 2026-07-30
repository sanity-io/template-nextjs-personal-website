import {useIsPresentationTool} from 'next-sanity/hooks'
import {lazy, Suspense} from 'react'
import type {OptimisticSortOrderProps} from './index.client'

const LazyOptimisticSortOrder = lazy(() => import('./index.client'))

/**
 * This component is normally not imported by client components, if it is then we use useIsPresentationTool instead of draftMode to determine what to od
 */
export function OptimisticSortOrder(
  props: Omit<OptimisticSortOrderProps, 'id'> & {id?: string | null},
) {
  const {children, id, path} = props
  const isPresentationTool = useIsPresentationTool()

  if (!id || !isPresentationTool) {
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
