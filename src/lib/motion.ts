import type { Transition, Variants } from "motion/react"

export const springs = {
  snappy: { type: "spring", stiffness: 520, damping: 32, mass: 0.8 },
  smooth: { type: "spring", stiffness: 280, damping: 28, mass: 0.9 },
  soft: { type: "spring", stiffness: 180, damping: 24, mass: 1 },
} as const satisfies Record<string, Transition>

export const tweens = {
  entrance: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  exit: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  crossfade: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
} as const satisfies Record<string, Transition>

export type MotionPreset = keyof typeof springs

export function getSpring(preset: MotionPreset = "snappy"): Transition {
  return springs[preset]
}

export function reducedOr<T extends Transition>(
  reduce: boolean | null,
  transition: T,
  fallback: Transition = { duration: 0.01 }
): Transition {
  return reduce ? fallback : transition
}

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}
