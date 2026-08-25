"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimBounceProps = {
  /** Ball diameter in pixels. */
  size?: number
  /** Milliseconds between replays. */
  interval?: number
  className?: string
}

const CSS = `
.naisu-bounce {
  display: grid;
  place-content: center;
}

.naisu-bounce__ball {
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #111111;
  animation: naisu-bounce-popup 0.6s ease-in-out 0s both;
}

@keyframes naisu-bounce-popup {
  from {
    opacity: 0;
  }
  20%,
  to {
    opacity: 1;
  }

  from {
    transform: scale(0, 0);
  }
  50% {
    transform: scale(1.2, 1.25);
  }
  75% {
    transform: scale(0.9, 0.95);
  }
  to {
    transform: scale(1, 1);
  }
}
`

export function AnimBounce({
  size = 104,
  interval = 1800,
  className,
}: AnimBounceProps) {
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-bounce", className)}>
      <style>{CSS}</style>
      <span key={cycle} className="naisu-bounce__ball" style={{ width: size }} />
    </div>
  )
}
