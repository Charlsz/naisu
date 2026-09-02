"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { getSpring, reducedOr, tweens, type MotionPreset } from "@/lib/motion"

type Ctx = {
  value: string | undefined
  layoutId: string
  preset: MotionPreset
  contentDuration: number
}

const MotionTabsContext = React.createContext<Ctx | null>(null)

function useMotionTabs() {
  const ctx = React.useContext(MotionTabsContext)
  if (!ctx) throw new Error("MotionTabs parts need MotionTabs")
  return ctx
}

export type MotionTabsProps = TabsPrimitive.Root.Props & {
  layoutId?: string
  preset?: MotionPreset
  contentDuration?: number
}

function MotionTabs({
  className,
  orientation = "horizontal",
  layoutId = "naisu-tabs",
  preset = "snappy",
  contentDuration = 0.2,
  value,
  defaultValue,
  onValueChange,
  ...props
}: MotionTabsProps) {
  const [internal, setInternal] = React.useState(
    value ?? defaultValue ?? undefined
  )
  const active = value ?? internal

  return (
    <MotionTabsContext.Provider
      value={{
        value: active != null ? String(active) : undefined,
        layoutId,
        preset,
        contentDuration,
      }}
    >
      <TabsPrimitive.Root
        data-slot="motion-tabs"
        data-orientation={orientation}
        className={cn(
          "group/tabs flex gap-2 data-horizontal:flex-col",
          className
        )}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next, details) => {
          setInternal(next)
          onValueChange?.(next, details)
        }}
        {...props}
      />
    </MotionTabsContext.Provider>
  )
}

const listVariants = cva(
  "relative inline-flex w-fit items-center rounded-lg border border-border p-0.5 text-muted-foreground group-data-horizontal/tabs:h-10",
  {
    variants: {
      variant: {
        default: "bg-background",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function MotionTabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof listVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="motion-tabs-list"
      className={cn(listVariants({ variant }), className)}
      {...props}
    />
  )
}

function MotionTabsTrigger({
  className,
  children,
  value,
  ...props
}: TabsPrimitive.Tab.Props) {
  const { value: active, layoutId, preset } = useMotionTabs()
  const reduce = useReducedMotion()
  const isActive = active === String(value)

  return (
    <TabsPrimitive.Tab
      data-slot="motion-tabs-trigger"
      value={value}
      className={cn(
        "relative z-10 inline-flex h-[calc(100%-2px)] min-h-9 flex-1 items-center justify-center rounded-md px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-active:text-foreground",
        className
      )}
      {...props}
    >
      {isActive && !reduce && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 -z-10 rounded-md bg-muted"
          transition={getSpring(preset)}
        />
      )}
      {isActive && reduce && (
        <span className="absolute inset-0 -z-10 rounded-sm bg-muted" />
      )}
      <span className="relative z-10">{children}</span>
    </TabsPrimitive.Tab>
  )
}

function MotionTabsContent({
  className,
  children,
  value,
  ...props
}: TabsPrimitive.Panel.Props) {
  const { value: active, contentDuration } = useMotionTabs()
  const reduce = useReducedMotion()
  const isActive = active === String(value)
  const transition = reducedOr(reduce, {
    ...tweens.crossfade,
    duration: contentDuration,
  })

  return (
    <TabsPrimitive.Panel
      data-slot="motion-tabs-content"
      value={value}
      className={cn("flex-1 text-xs outline-none", className)}
      keepMounted
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isActive && (
          <motion.div
            key={String(value)}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -2 }}
            transition={transition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TabsPrimitive.Panel>
  )
}

export {
  MotionTabs,
  MotionTabsList,
  MotionTabsTrigger,
  MotionTabsContent,
}
