'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ToggleButton() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        aria-label="Light and Dark Mode Toggle Button"
        className="inline-flex items-center rounded bg-white px-3 py-2 text-xs font-medium shadow-sm duration-500 hover:scale-110"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'light' ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
