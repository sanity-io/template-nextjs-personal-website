'use client'

import {useRouter} from 'next/navigation'
import {startTransition, useEffect} from 'react'

const MIN_REFRESH_DELAY_MS = 5_000

export function RefreshBeforeTokenExpiry({refreshInMs}: {refreshInMs: number}) {
  const router = useRouter()

  useEffect(() => {
    const refreshAt = Date.now() + Math.max(refreshInMs, MIN_REFRESH_DELAY_MS)
    const refresh = () => startTransition(() => router.refresh())
    const timer = setTimeout(refresh, refreshAt - Date.now())
    const refreshIfDue = () => {
      if (document.visibilityState === 'visible' && Date.now() >= refreshAt) {
        refresh()
      }
    }
    document.addEventListener('visibilitychange', refreshIfDue)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', refreshIfDue)
    }
  }, [refreshInMs, router])

  return null
}
