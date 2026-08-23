type ClickTone = "nav" | "rest"

const SRC: Record<ClickTone, string> = {
  // Left side nav only
  nav: "/floraphonic-casual-click-pop-ui-10-262126.mp3",
  // Everywhere else
  rest: "/floraphonic-casual-click-pop-ui-9-262123.mp3",
}

const VOLUME = 0.3

let muted = false
let unlocked = false
let unlockPromise: Promise<void> | null = null

export function setClickSoundMuted(next: boolean) {
  muted = next
}

export function isClickSoundMuted() {
  return muted
}

/**
 * Warm the audio pipeline on the first user gesture so the first
 * audible click doesn't hit the browser at full gain.
 */
function unlockAudio() {
  if (typeof window === "undefined" || unlocked) {
    return unlockPromise ?? Promise.resolve()
  }
  if (unlockPromise) return unlockPromise

  unlockPromise = (async () => {
    await Promise.all(
      (Object.keys(SRC) as ClickTone[]).map(async (tone) => {
        try {
          const a = new Audio(SRC[tone])
          a.preload = "auto"
          a.volume = 0
          a.muted = true
          await a.play()
          a.pause()
          a.currentTime = 0
        } catch {
          // Ignored — a later play() still works after a gesture.
        }
      })
    )
    unlocked = true
  })()

  return unlockPromise
}

function playAtVolume(src: string) {
  const a = new Audio(src)
  a.preload = "auto"
  // Start silent, then raise volume only once media is ready.
  // Prevents the classic first-play full-blast glitch.
  a.volume = 0
  a.muted = true

  let started = false
  const start = () => {
    if (started) return
    started = true
    a.muted = false
    a.volume = VOLUME
    void a.play().catch(() => {})
  }

  a.addEventListener("canplaythrough", start, { once: true })
  // Fallback if canplaythrough is slow / already buffered
  window.setTimeout(start, 80)
  a.load()
}

export function playClick(tone: ClickTone) {
  if (typeof window === "undefined" || muted) return

  void (async () => {
    await unlockAudio()
    if (muted) return
    playAtVolume(SRC[tone])
  })()
}

export function clickToneFromTarget(
  target: EventTarget | null
): ClickTone | null {
  if (!(target instanceof Element)) return null
  const clickable = target.closest(
    "button, a, [role='button'], [role='switch'], [data-clickable]"
  )
  if (!clickable) return null
  if (clickable.closest("[data-no-click-sound]")) return null
  return clickable.closest("[data-side-nav]") ? "nav" : "rest"
}

export type { ClickTone }
