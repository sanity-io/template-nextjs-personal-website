'use client'

import {createContext, useContext, type ReactNode} from 'react'

const DraftModeContext = createContext(false)

/**
 * Exposes the server-resolved draft-mode flag to Client Components. Used by
 * {@link AppLink} to disable prefetching in draft (see the TODO there).
 */
export function DraftModeProvider({
  isDraftMode,
  children,
}: {
  isDraftMode: boolean
  children: ReactNode
}) {
  return <DraftModeContext.Provider value={isDraftMode}>{children}</DraftModeContext.Provider>
}

export function useIsDraftMode() {
  return useContext(DraftModeContext)
}
