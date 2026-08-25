export type ComponentVariant = {
  id: string
  hint?: string
}

export type ComponentEntry = {
  id: string
  label: string
  variants?: ComponentVariant[]
}

export type ComponentCategory = {
  id: string
  label: string
  /** Smaller stage height for sparse sections */
  dense?: boolean
  /** Stage shape: square suits CSS tip animations; wide spans content */
  stage?: "default" | "square" | "dense" | "tall" | "wide"
  /** Allow dropdowns / menus to escape the stage */
  escape?: boolean
  /** Single full-width column for demos that need horizontal room */
  fullWidth?: boolean
  items: ComponentEntry[]
}

/**
 * Naisu gallery sections. Nav shows these only (numbered).
 * Leaf ids must be unique across categories.
 */
export const categories: ComponentCategory[] = [
  {
    id: "motion",
    label: "Motion",
    items: [
      { id: "magnetic-button", label: "Magnetic button" },
      { id: "click-shockwave", label: "Click shockwave" },
      { id: "hover-reveal", label: "Hover reveal" },
      { id: "hover-border", label: "Hover border" },
      { id: "cursor-spotlight", label: "Cursor spotlight" },
      { id: "card-tilt", label: "Morph carousel" },
      { id: "number-counter", label: "Number counter" },
      { id: "compare-reveal", label: "Compare reveal" },
    ],
  },
  {
    id: "controls",
    label: "Controls",
    escape: true,
    items: [
      { id: "toggle", label: "Toggle" },
      {
        id: "animated-checkbox",
        label: "Animated checkbox",
        variants: [
          { id: "checkbox-ink", hint: "Ink" },
          { id: "checkbox-seal", hint: "Seal" },
          { id: "checkbox-bloom", hint: "Bloom" },
        ],
      },
      {
        id: "animated-tabs",
        label: "Animated tabs",
        variants: [
          { id: "tabs-pill", hint: "Pill" },
          { id: "tabs-underline", hint: "Underline" },
        ],
      },
      { id: "key-input", label: "Key input" },
    ],
  },
  {
    id: "loaders",
    label: "Loaders",
    items: [
      {
        id: "loading-state",
        label: "Loading state",
        variants: [
          { id: "loading-drive", hint: "Drive" },
          { id: "loading-dots", hint: "Dots" },
          { id: "loading-orbit", hint: "Orbit" },
          { id: "loading-bars", hint: "Bars" },
          { id: "loading-ring", hint: "Ring" },
          { id: "loading-pulse", hint: "Pulse" },
          { id: "loading-wave", hint: "Wave" },
          { id: "loading-bloom", hint: "Bloom" },
          { id: "loading-flower", hint: "Flower" },
          { id: "loading-jar", hint: "Jar" },
          { id: "loading-pointer", hint: "Pointer" },
        ],
      },
      { id: "loading-indicator", label: "Loading indicator" },
      { id: "circular-progress", label: "Circular progress" },
      { id: "spinner", label: "Spinner" },
      { id: "progress", label: "Progress" },
      {
        id: "thinking-indicator",
        label: "Thinking",
        variants: [
          { id: "thinking-steps", hint: "Steps" },
          { id: "thinking-reasoning", hint: "Reasoning" },
          { id: "thinking-search", hint: "Search" },
          { id: "thinking-coding", hint: "Coding" },
        ],
      },
      { id: "streaming-text", label: "Streaming text" },
    ],
  },
  {
    id: "conversation",
    label: "Conversation",
    stage: "tall",
    items: [
      { id: "conversation", label: "Conversation" },
      { id: "message", label: "Message" },
      { id: "message-group", label: "Message group" },
      { id: "chat-input", label: "Chat input" },
      { id: "prompt-input", label: "Prompt input" },
      { id: "markdown", label: "Markdown" },
      { id: "code-block", label: "Code block" },
      { id: "attachment", label: "Attachment" },
    ],
  },
  {
    id: "agent",
    label: "Agent",
    stage: "tall",
    escape: true,
    items: [
      { id: "tool-call", label: "Tool call" },
      { id: "tool-call-group", label: "Tool call group" },
      { id: "tool-chips", label: "Tool chips" },
      { id: "execution-step", label: "Execution step" },
      { id: "execution-timeline", label: "Execution timeline" },
      { id: "execution-output", label: "Execution output" },
      { id: "task", label: "Task" },
      { id: "task-list", label: "Task list" },
      { id: "task-status", label: "Task status" },
      { id: "agent-status", label: "Agent status" },
      { id: "permission-request", label: "Permission request" },
      { id: "approval", label: "Approval" },
      { id: "recommendation", label: "Recommendation" },
      { id: "context-cards", label: "Context cards" },
      { id: "selection-actions", label: "Selection actions" },
    ],
  },
  {
    id: "system",
    label: "System",
    escape: true,
    items: [
      { id: "toast", label: "Toast" },
      { id: "dialog", label: "Dialog" },
      { id: "popover", label: "Popover" },
      { id: "tooltip", label: "Tooltip" },
      { id: "badge", label: "Badge" },
      { id: "status", label: "Status" },
      { id: "empty-state", label: "Empty state" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    stage: "tall",
    escape: true,
    items: [
      { id: "settings-panel", label: "Settings panel" },
      { id: "model-selector", label: "Model selector" },
      { id: "agent-selector", label: "Agent selector" },
      { id: "tool-selector", label: "Tool selector" },
      { id: "permission-selector", label: "Permission selector" },
      { id: "provider-selector", label: "Provider selector" },
    ],
  },
  {
    id: "rails",
    label: "Rails",
    stage: "tall",
    items: [
      { id: "reading-notebook", label: "Reading notebook" },
      { id: "cool-scrollbar", label: "Cool scrollbar" },
      { id: "image-carousel", label: "Image carousel" },
      { id: "continuous-slider", label: "Continuous slider" },
    ],
  },
  {
    id: "animations",
    label: "Animations",
    stage: "square",
    items: [
      { id: "anim-bounce", label: "Bounce" },
      { id: "anim-paper", label: "Paper" },
      { id: "anim-stretch", label: "Stretch" },
      { id: "anim-twist", label: "Twist" },
      { id: "anim-blocks", label: "Blocks" },
      { id: "anim-domino", label: "Domino" },
      { id: "anim-panel", label: "Panel" },
      { id: "anim-stack", label: "Stack" },
      { id: "anim-shutter", label: "Shutter" },
      { id: "anim-curtain", label: "Curtain" },
      { id: "anim-lines", label: "Lines" },
      { id: "anim-yarns", label: "Yarns" },
      { id: "anim-scroll", label: "Scroll roll" },
      { id: "anim-bricks", label: "Bricks" },
      { id: "anim-plus-minus", label: "Plus minus" },
      { id: "anim-ripple", label: "Ripple" },
      { id: "anim-strike", label: "Strike" },
      { id: "anim-frame", label: "Frame" },
      { id: "anim-corner", label: "Corner" },
      { id: "anim-dots", label: "Dots" },
      { id: "anim-expand", label: "Expand" },
      { id: "anim-compress", label: "Compress" },
      { id: "anim-balance", label: "Balance" },
      { id: "anim-download", label: "Download" },
      { id: "anim-clothes", label: "Clothes" },
      { id: "anim-split", label: "Split" },
      {
        id: "anim-headphone",
        label: "Headphone",
        variants: [
          { id: "anim-headphone-circle", hint: "Circle" },
          { id: "anim-headphone-naisu", hint: "Naisu" },
        ],
      },
      { id: "anim-pulse", label: "Pulse" },
      { id: "anim-heart-burst", label: "Heart burst" },
      { id: "anim-heart-fill", label: "Heart fill" },
      { id: "anim-star-pulse", label: "Star pulse" },
      { id: "anim-star-burst", label: "Star burst" },
      { id: "anim-star-fill", label: "Star fill" },
      { id: "anim-zap-burst", label: "Zap burst" },
      { id: "anim-bell-fill", label: "Bell fill" },
      { id: "anim-thumb-pulse", label: "Thumb pulse" },
      { id: "anim-bookmark", label: "Bookmark" },
      { id: "anim-stamp-star", label: "Stamp star" },
      { id: "anim-stamp-heart", label: "Stamp heart" },
      { id: "anim-stamp-flag", label: "Stamp flag" },
      { id: "anim-stamp-pin", label: "Stamp pin" },
      { id: "anim-stamp-bell", label: "Stamp bell" },
      { id: "anim-flip", label: "Flip" },
      { id: "anim-snap", label: "Snap" },
      { id: "anim-glow", label: "Glow" },
      { id: "anim-walk", label: "Walk" },
      { id: "anim-sway", label: "Sway" },
      { id: "anim-transitions", label: "Transitions" },
    ],
  },
]

/** Category section ids for scroll-spy (left nav). */
export function categoryIds(): string[] {
  return categories.map((c) => c.id)
}

/** Flat list of leaf panel ids (variants expanded). */
export function allPanelIds(): string[] {
  const ids: string[] = []
  for (const cat of categories) {
    for (const item of cat.items) {
      if (item.variants?.length) {
        for (const v of item.variants) ids.push(v.id)
      } else {
        ids.push(item.id)
      }
    }
  }
  return ids
}

/** Map panel/item id → category id */
export function categoryIdFor(activeId: string): string | undefined {
  for (const cat of categories) {
    if (cat.id === activeId) return cat.id
    for (const item of cat.items) {
      if (item.id === activeId) return cat.id
      if (item.variants?.some((v) => v.id === activeId)) return cat.id
    }
  }
  return undefined
}

/** @deprecated use categories */
export const components = categories.flatMap((c) =>
  c.items.map((item, i) => ({
    ...item,
    index: String(i + 1).padStart(2, "0"),
  }))
)
