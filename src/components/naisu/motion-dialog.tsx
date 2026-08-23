"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { motion, useReducedMotion } from "motion/react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  fadeOnly,
  getSpring,
  reducedOr,
  tweens,
  type MotionPreset,
} from "@/lib/motion"

function MotionDialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="motion-dialog" {...props} />
}

function MotionDialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="motion-dialog-trigger" {...props} />
}

function MotionDialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="motion-dialog-close" {...props} />
}

export type MotionDialogContentProps = DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  intensity?: number
  preset?: MotionPreset
  exitDuration?: number
}

function MotionDialogContent({
  className,
  children,
  showCloseButton = true,
  intensity = 1,
  preset = "snappy",
  exitDuration = 0.16,
  ...props
}: MotionDialogContentProps) {
  const reduce = useReducedMotion()
  const scaleFrom = 1 - 0.04 * intensity
  const panelTransition = reducedOr(reduce, getSpring(preset))
  const fadeTransition = reducedOr(reduce, tweens.entrance)
  const exitTransition = reducedOr(reduce, {
    ...tweens.exit,
    duration: exitDuration,
  })

  const variants = reduce
    ? fadeOnly
    : {
        hidden: { opacity: 0, scale: scaleFrom },
        visible: { opacity: 1, scale: 1 },
        exit: {
          opacity: 0,
          scale: 1 - 0.02 * intensity,
          transition: exitTransition,
        },
      }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        render={
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeOnly}
            transition={fadeTransition}
          />
        }
        data-slot="motion-dialog-overlay"
        className="fixed inset-0 z-50 bg-[#111111]/40"
      />
      <DialogPrimitive.Popup
        render={
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={panelTransition}
          />
        }
        data-slot="motion-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-3 rounded-md border border-[#111111] bg-[#FDFDFC] p-4 text-sm text-[#111111] outline-none sm:max-w-sm",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="motion-dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

function MotionDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="motion-dialog-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function MotionDialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="motion-dialog-title"
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  )
}

function MotionDialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="motion-dialog-description"
      className={cn("text-xs text-[#9C9C9B]", className)}
      {...props}
    />
  )
}

export {
  MotionDialog,
  MotionDialogTrigger,
  MotionDialogClose,
  MotionDialogContent,
  MotionDialogHeader,
  MotionDialogTitle,
  MotionDialogDescription,
}
