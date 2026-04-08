'use server'

import { sanityFetch } from "@/sanity/lib/live";
import type { QueryParams } from "next-sanity";
import type { LivePerspective,  } from "next-sanity/live";

export async function sanityFetchDrafts({query, params, perspective, stega}: {query: string; params?: QueryParams; perspective: LivePerspective, stega: boolean}) {
  const {data} = await sanityFetch({query, params, perspective, stega})
  return data
}