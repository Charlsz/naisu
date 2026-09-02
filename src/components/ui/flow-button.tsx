"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

type SizeVariant = "sm" | "default" | "lg"

interface FlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  size?: SizeVariant
  borderColor?: string
  className?: string
  asChild?: boolean
}

const sizeMap: Record<SizeVariant, string> = {
  sm: "h-8 rounded-full gap-1.5 px-3 text-sm",
  default: "h-9 px-4 py-2 text-sm rounded-full",
  lg: "h-10 rounded-full px-6 text-sm",
}

const borderRadiusMap: Record<SizeVariant, number> = {
  sm: 16,
  default: 18,
  lg: 20,
}

const FlowButton = React.forwardRef<HTMLButtonElement, FlowButtonProps>(
  (
    {
      children,
      size = "default",
      borderColor = "currentColor",
      className,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })

    React.useImperativeHandle(ref, () => buttonRef.current!)

    const Comp = asChild ? Slot : "button"

    React.useEffect(() => {
      const el = buttonRef.current
      if (!el) return

      const measure = () => {
        setDimensions({
          width: el.offsetWidth,
          height: el.offsetHeight,
        })
      }

      measure()
      const observer = new ResizeObserver(measure)
      observer.observe(el)
      return () => observer.disconnect()
    }, [children, size, className])

    const buttonSize = sizeMap[size]
    const radius = borderRadiusMap[size]

    const createRoundedRectPath = (w: number, h: number, r: number) => {
      return `M${r},0.5 H${w - r} A${r},${r} 0 0 1 ${w - 0.5},${r} V${
        h - r
      } A${r},${r} 0 0 1 ${w - r},${h - 0.5} H${r} A${r},${r} 0 0 1 0.5,${
        h - r
      } V${r} A${r},${r} 0 0 1 ${r},0.5 Z`
    }

    return (
      <>
        <style>
          {`
            @keyframes dash-flow {
              to {
                stroke-dashoffset: -10;
              }
            }
          `}
        </style>
        <div className="group pointer-events-none relative inline-block">
          <div
            className="pointer-events-none absolute inset-[2px] z-10 opacity-0 transition-all duration-200 ease-out group-hover:inset-0 group-hover:opacity-100"
            style={{ borderRadius: `${radius}px` }}
          >
            <svg
              width={dimensions.width}
              height={dimensions.height}
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              aria-hidden="true"
              preserveAspectRatio="none"
              className="pointer-events-none absolute top-0 left-0 h-full w-full"
            >
              <path
                d={createRoundedRectPath(
                  dimensions.width,
                  dimensions.height,
                  radius
                )}
                fill="none"
                stroke={borderColor}
                strokeWidth="1"
                strokeDasharray="6,4"
                strokeDashoffset="0"
                className="group-hover:animate-[dash-flow_1s_linear_infinite]"
              />
            </svg>
          </div>
          <Comp
            ref={buttonRef}
            className={cn(
              "relative z-0 inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-[550] pointer-events-auto",
              "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20",
              "disabled:pointer-events-none disabled:opacity-40",
              "bg-neutral-100 text-foreground hover:bg-transparent",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              buttonSize,
              className
            )}
            {...props}
          >
            {children}
          </Comp>
        </div>
      </>
    )
  }
)

FlowButton.displayName = "FlowButton"

export { FlowButton }
export type { FlowButtonProps }
