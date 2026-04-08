'use client'

import { sanityFetchDrafts } from "@/app/(personal)/server-actions";
import type { QueryParams } from "next-sanity";
import { usePresentationQuery } from "next-sanity/hooks";
import type { LivePerspective } from "next-sanity/live";
import { Suspense, use, useState } from "react";

interface SharedProps {
  query: string; 
  params?: QueryParams; 
  perspective: LivePerspective
  stega: boolean
}

export function PresentationQuery({query, params, perspective, stega}: SharedProps) {
  const [initialData] = useState(() => sanityFetchDrafts({query, params, perspective, stega}))

  return <Suspense fallback={<PresentationQueryFallback />}><PresentationQueryResolver query={query} params={params} perspective={perspective} stega={stega} initialDataPromise={initialData} /></Suspense>
}

function PresentationQueryResolver({query, params, perspective, stega, initialDataPromise}: SharedProps & {initialDataPromise: Promise<any>}) {
  // before or after?
  const initialData = use(initialDataPromise)
  const {data} = usePresentationQuery({query, params, stega})
  console.log({data, initialData})

  return null
}

function PresentationQueryFallback() {
  console.log('PresentationQueryFallback')
  return null
}