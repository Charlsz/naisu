"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { useSoundMuted } from "@/components/sound-provider"
import { clickToneFromTarget, playClick } from "@/lib/click-sound"

/**
 * Global site click FX — compact press ring (not the demo shockwave).
 */
export function ClickFeedback() {
  const muted = useSoundMuted()
  const [ring, setRing] = React.useState<{
    id: number
    x: number
    y: number
  } | null>(null)

  React.useEffect(() => {
    function onDown(e: PointerEvent) {
      if (e.button !== 0) return
      const tone = clickToneFromTarget(e.target)
      if (!tone) return
      if (!muted) playClick(tone)
      setRing({ id: Date.now(), x: e.clientX, y: e.clientY })
    }
    window.addEventListener("pointerdown", onDown, true)
    return () => window.removeEventListener("pointerdown", onDown, true)
  }, [muted])

  return (
    <AnimatePresence>
      {ring && (
        <motion.span
          key={ring.id}
          className="pointer-events-none fixed z-[200] size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#111111]"
          style={{ left: ring.x, top: ring.y }}
          initial={{ opacity: 0.55, scale: 0.35 }}
          animate={{ opacity: 0, scale: 1.65 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setRing(null)}
        />
      )}
    </AnimatePresence>
  )
}
