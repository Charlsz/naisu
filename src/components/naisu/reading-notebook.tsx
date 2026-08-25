"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type ReadingNotebookProps = {
  title?: string
  kicker?: string
  paragraphs?: string[]
  scrollerRef?: React.RefObject<HTMLDivElement | null>
  onScroll?: () => void
  className?: string
  children?: React.ReactNode
}

/** Long classic placeholder copy for scroll demos. */
export const LOREM_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Curabitur aliquet quam id dui posuere blandit.",
  "Nulla quis lorem ut libero malesuada feugiat. Nulla porttitor accumsan tincidunt. Proin eget tortor risus. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.",
  "Donec sollicitudin molestie malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Pellentesque in ipsum id orci porta dapibus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
  "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Donec rutrum congue leo eget malesuada. Vivamus suscipit tortor eget felis porttitor volutpat.",
  "Cras ultricies ligula sed magna dictum porta. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Sed porttitor lectus nibh. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
  "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Donec rutrum congue leo eget malesuada. Nulla porttitor accumsan tincidunt. Vestibulum ac diam sit amet quam vehicula elementum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
  "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque.",
  "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.",
  "Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
  "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
]

/** Lightweight fake-site chrome with a scrollable article body. */
export function ReadingNotebook({
  title = "Lorem ipsum notebook",
  kicker = "Demo · Ipsum",
  paragraphs = LOREM_PARAGRAPHS,
  scrollerRef,
  onScroll,
  className,
  children,
}: ReadingNotebookProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl bg-[#FDFDFC] shadow-[0_6px_20px_rgba(16,24,40,0.08)] ring-1 ring-[#101828]/8",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-[#ECECEC] bg-[#F8FAFD] px-2.5 py-1.5">
        <span className="flex gap-1" aria-hidden>
          <span className="size-1.5 rounded-full bg-[#E9564A]/70" />
          <span className="size-1.5 rounded-full bg-[#B86E00]/70" />
          <span className="size-1.5 rounded-full bg-[#128A55]/70" />
        </span>
        <div className="ml-1 flex h-5 min-w-0 flex-1 items-center rounded-md bg-[#EEF2F7] px-2 text-[9px] text-[#667085]">
          <span className="truncate">naisu.app / lorem / ipsum</span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="naisu-demo-scroll absolute inset-0 overflow-y-auto px-4 py-3 pr-9 sm:px-5"
        >
          <p className="text-[8px] font-medium tracking-wide text-[#315FEA] uppercase">
            {kicker}
          </p>
          <h3 className="mt-0.5 text-[13px] font-medium tracking-tight text-[#111111]">
            {title}
          </h3>
          <div className="mt-2.5 space-y-2.5 text-[10px] leading-relaxed text-[#344054]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
