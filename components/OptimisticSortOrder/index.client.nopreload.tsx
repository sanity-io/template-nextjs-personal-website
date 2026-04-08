'use client'

import { lazy } from 'react'
import type { OptimisticSortOrderProps } from './index.client'

const LazyOptimisticSortOrder = lazy(() => import('./index.client'))

function OptimisticSortOrder(props: OptimisticSortOrderProps) {
  return <LazyOptimisticSortOrder {...props} />
}

export default OptimisticSortOrder