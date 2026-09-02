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
  dense?: boolean
  stage?: "default" | "square" | "dense" | "tall" | "wide"
  escape?: boolean
  fullWidth?: boolean
  items: ComponentEntry[]
}

/** Naisu gallery: Conversation · Agent · System */
export const categories: ComponentCategory[] = [
  {
    id: "conversation",
    label: "Conversation",
    stage: "tall",
    items: [
      { id: "conversation", label: "Conversation" },
      {
        id: "message",
        label: "Message",
        variants: [
          { id: "message-single", hint: "Single" },
          { id: "message-group", hint: "Group" },
        ],
      },
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
      {
        id: "tool-call",
        label: "Tool call",
        variants: [
          { id: "tool-call-single", hint: "Single" },
          { id: "tool-call-group", hint: "Group" },
          { id: "tool-call-chips", hint: "Chips" },
        ],
      },
      {
        id: "thinking-indicator",
        label: "Thinking",
        variants: [
          { id: "thinking-steps", hint: "Steps" },
          { id: "thinking-reasoning", hint: "Reasoning" },
        ],
      },
      { id: "streaming-text", label: "Streaming text" },
      { id: "permission-request", label: "Permission request" },
      { id: "tasks", label: "Tasks" },
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
      { id: "empty-state", label: "Empty state" },
      { id: "settings-panel", label: "Settings panel" },
      { id: "status", label: "Status" },
      {
        id: "loading",
        label: "Loading",
        variants: [
          { id: "loading-dots", hint: "Dots" },
          { id: "loading-ring", hint: "Ring" },
          { id: "loading-bars", hint: "Bars" },
        ],
      },
      { id: "progress", label: "Progress" },
      { id: "motion-button", label: "Motion button" },
      { id: "motion-tabs", label: "Motion tabs" },
    ],
  },
]

export function categoryIds(): string[] {
  return categories.map((c) => c.id)
}

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
