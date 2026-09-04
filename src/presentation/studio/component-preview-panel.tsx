"use client"

import { useMemo, useState } from "react"

import { FlowButton } from "@/components/ui/flow-button"
import { parseExportedComponent } from "@/presentation/studio/parse-exported-component"

/**
 * Paste code from Copy component / Copy animation component
 * and preview how it will look — animations only play here, not on the board.
 */
export function ComponentPreviewPanel() {
  const [source, setSource] = useState("")
  const [replay, setReplay] = useState(0)

  const parsed = useMemo(() => parseExportedComponent(source), [source])

  return (
    <section className="flex flex-col gap-4 border-t border-foreground/10 pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium tracking-tight text-foreground">
          Component preview
        </h2>
        <p className="text-sm text-muted">
          Paste code from Copy component or Copy animation component to see how
          it renders. Draw-self animation only plays in this preview.
        </p>
      </div>

      <textarea
        value={source}
        onChange={(e) => setSource(e.target.value)}
        spellCheck={false}
        placeholder={`export function NaisuSketch(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    <svg ...>\n      ...\n    </svg>\n  )\n}`}
        className="min-h-[160px] w-full resize-y rounded-xl border border-foreground/10 bg-white/60 px-4 py-3 font-mono text-xs leading-relaxed text-foreground outline-none placeholder:text-muted/70 focus:border-foreground/25"
      />

      <div className="flex flex-wrap items-center gap-3">
        <FlowButton
          type="button"
          size="sm"
          borderColor="#111111"
          disabled={!source.trim()}
          onClick={() => setReplay((n) => n + 1)}
        >
          Replay animation
        </FlowButton>
        <FlowButton
          type="button"
          size="sm"
          borderColor="#111111"
          disabled={!source.trim()}
          onClick={() => setSource("")}
        >
          Clear
        </FlowButton>
        {parsed ? (
          <span className="text-xs text-muted">
            {parsed.kind === "react-svg-animated"
              ? "Animated component"
              : parsed.kind === "react-svg"
                ? "Static component"
                : "SVG"}
          </span>
        ) : source.trim() ? (
          <span className="text-xs text-muted">Couldn’t parse that paste yet</span>
        ) : null}
      </div>

      <div
        className="relative h-[min(50vh,360px)] overflow-hidden rounded-xl border border-foreground/10"
        style={{
          backgroundImage:
            "linear-gradient(#ecece8 1px, transparent 1px), linear-gradient(90deg, #ecece8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundColor: "#f7f7f4",
        }}
      >
        {parsed ? (
          <div
            key={replay}
            className="absolute inset-0 flex items-center justify-center p-4 [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: parsed.svg }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
            Preview appears here
          </div>
        )}
      </div>
    </section>
  )
}
