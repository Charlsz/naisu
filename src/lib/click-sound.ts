type ClickTone = "ui" | "grid"

const SRC: Record<ClickTone, string> = {
  ui: "/floraphonic-casual-click-pop-ui-10-262126.mp3",
  grid: "/floraphonic-casual-click-pop-ui-9-262123.mp3",
}

const pools: Record<ClickTone, HTMLAudioElement[]> = {
  ui: [],
  grid: [],
}

let muted = false

export function setClickSoundMuted(next: boolean) {
  muted = next
}

export function isClickSoundMuted() {
  return muted
}

function unlock(tone: ClickTone) {
  if (typeof window === "undefined") return
  if (pools[tone].length) return
  const a = new Audio(SRC[tone])
  a.volume = 0.45
  a.preload = "auto"
  pools[tone].push(a)
}

export function playClick(tone: ClickTone) {
  if (typeof window === "undefined" || muted) return
  unlock(tone)
  const base = pools[tone][0]
  if (!base) return
  const a = base.cloneNode(true) as HTMLAudioElement
  a.volume = 0.45
  void a.play().catch(() => {})
}

export function clickToneFromTarget(target: EventTarget | null): ClickTone | null {
  if (!(target instanceof Element)) return null
  const clickable = target.closest(
    "button, a, [role='button'], [role='switch'], [data-clickable]"
  )
  if (!clickable) return null
  if (clickable.closest("[data-no-click-sound]")) return null
  // Left nav uses the sharper pop; everything else uses the softer one
  return clickable.closest("[data-side-nav]") ? "ui" : "grid"
}
