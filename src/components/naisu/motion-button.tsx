"use client"

import { motion, useReducedMotion } from "motion/react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getSpring, type MotionPreset } from "@/lib/motion"

export type MotionButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    intensity?: number
    hoverScale?: number
    preset?: MotionPreset
  }

function MotionButton({
  className,
  variant = "default",
  size = "default",
  intensity = 0.96,
  hoverScale = 1.02,
  preset = "snappy",
  disabled,
  ...props
}: MotionButtonProps) {
  const reduce = useReducedMotion()
  const transition = getSpring(preset)

  return (
    <ButtonPrimitive
      data-slot="motion-button"
      disabled={disabled}
      className={cn(buttonVariants({ variant, size, className }))}
      render={
        <motion.button
          whileHover={
            reduce || disabled || hoverScale === 1
              ? undefined
              : { scale: hoverScale }
          }
          whileTap={reduce || disabled ? undefined : { scale: intensity }}
          transition={transition}
        />
      }
      {...props}
    />
  )
}

export { MotionButton }
