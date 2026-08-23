"use client"

import * as React from "react"

import { setClickSoundMuted } from "@/lib/click-sound"

const STORAGE_KEY = "naisu-sound-muted"

type SoundContextValue = {
  muted: boolean
  setMuted: (muted: boolean) => void
  toggle: () => void
}

const SoundContext = React.createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = React.useState(false)

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) === "1"
      setMutedState(stored)
      setClickSoundMuted(stored)
    } catch {
      // ignore
    }
  }, [])

  const setMuted = React.useCallback((next: boolean) => {
    setMutedState(next)
    setClickSoundMuted(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    } catch {
      // ignore
    }
  }, [])

  const toggle = React.useCallback(() => {
    setMutedState((prev) => {
      const next = !prev
      setClickSoundMuted(next)
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const value = React.useMemo(
    () => ({ muted, setMuted, toggle }),
    [muted, setMuted, toggle]
  )

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  )
}

export function useSound() {
  const ctx = React.useContext(SoundContext)
  if (!ctx) {
    throw new Error("useSound must be used within SoundProvider")
  }
  return ctx
}

export function useSoundMuted() {
  const ctx = React.useContext(SoundContext)
  return ctx?.muted ?? false
}
