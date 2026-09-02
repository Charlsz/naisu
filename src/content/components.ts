export type ComponentVariant = {
  id: string
  label: string
  description: string
}

export type ComponentEntry = {
  id: string
  label: string
  description: string
  variants?: ComponentVariant[]
}

export type ComponentCategory = {
  id: string
  label: string
  description: string
  hero?: boolean
  escape?: boolean
  items: ComponentEntry[]
}

/** Naisu gallery: Conversation, Agent, System */
export const categories: ComponentCategory[] = [
  {
    id: "conversation",
    label: "Conversation",
    description: "Thread layout, messages, composer, and rich content blocks.",
    hero: true,
    items: [
      {
        id: "conversation",
        label: "Conversation",
        description:
          "Full thread shell with tabs, scrollable messages, and inline reply.",
      },
      {
        id: "message",
        label: "Message",
        description: "User and assistant bubbles for single turns or grouped replies.",
        variants: [
          {
            id: "message-single",
            label: "Single",
            description: "One user turn and one assistant reply in a thread.",
          },
          {
            id: "message-group",
            label: "Group",
            description: "Stacked assistant messages from one agent run.",
          },
        ],
      },
      {
        id: "prompt-input",
        label: "Prompt input",
        description: "Composer with model picker, attachments, and send.",
      },
      {
        id: "markdown",
        label: "Markdown",
        description: "Rendered summary blocks inside assistant replies.",
      },
      {
        id: "code-block",
        label: "Code block",
        description: "Syntax-highlighted snippet with copy affordance.",
      },
      {
        id: "attachment",
        label: "Attachment",
        description: "File chip with size meta and remove control.",
      },
    ],
  },
  {
    id: "agent",
    label: "Agent",
    description: "Tool execution, reasoning, permissions, and agent-side affordances.",
    escape: true,
    items: [
      {
        id: "tool-call",
        label: "Tool call",
        description: "Surface tool invocations as a row, group, or expandable chips.",
        variants: [
          {
            id: "tool-call-single",
            label: "Single",
            description: "One running tool with a compact status pill.",
          },
          {
            id: "tool-call-group",
            label: "Group",
            description: "Multiple tools in a run with mixed statuses.",
          },
          {
            id: "tool-call-chips",
            label: "Chips",
            description: "Expandable tool output with file diffs.",
          },
        ],
      },
      {
        id: "thinking-indicator",
        label: "Thinking",
        description: "Collapsible trace while the agent plans or reasons.",
        variants: [
          {
            id: "thinking-steps",
            label: "Steps",
            description: "Step list that settles into a completed thought summary.",
          },
          {
            id: "thinking-reasoning",
            label: "Reasoning",
            description: "Reasoning trace expanded after the run finishes.",
          },
        ],
      },
      {
        id: "streaming-text",
        label: "Streaming text",
        description: "Completed assistant reply with sources and follow-ups.",
      },
      {
        id: "permission-request",
        label: "Permission request",
        description: "Human-in-the-loop allow or deny for a shell command.",
      },
      {
        id: "tasks",
        label: "Tasks",
        description: "Checklist rows for an agent plan with mixed completion.",
      },
      {
        id: "recommendation",
        label: "Recommendation",
        description: "Suggested fix with confidence and alternate options.",
      },
      {
        id: "context-cards",
        label: "Context cards",
        description: "Retrieved repo chunks the agent used for the patch.",
      },
      {
        id: "selection-actions",
        label: "Selection actions",
        description: "Inline rewrite actions anchored to highlighted text.",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    description: "Feedback, settings, loading, and structural UI primitives.",
    escape: true,
    items: [
      {
        id: "toast",
        label: "Toast",
        description: "Transient confirmation after a successful agent action.",
      },
      {
        id: "dialog",
        label: "Dialog",
        description: "Modal confirmation for destructive or blocking choices.",
      },
      {
        id: "empty-state",
        label: "Empty state",
        description: "Zero-data placeholder with a primary next step.",
      },
      {
        id: "settings-panel",
        label: "Settings panel",
        description: "Grouped settings rows with selectors and toggles.",
      },
      {
        id: "status",
        label: "Status",
        description: "Compact agent run state with a tone dot.",
      },
      {
        id: "loading",
        label: "Loading",
        description: "Compact loading marks for in-flight agent work.",
        variants: [
          {
            id: "loading-dots",
            label: "Dots",
            description: "Pixel dot grid for lightweight fetches.",
          },
          {
            id: "loading-ring",
            label: "Ring",
            description: "Orbiting ring for longer-running steps.",
          },
          {
            id: "loading-bars",
            label: "Bars",
            description: "Vertical bars for test or build progress.",
          },
        ],
      },
      {
        id: "progress",
        label: "Progress",
        description: "Determinate bar for multi-step agent workflows.",
      },
      {
        id: "motion-button",
        label: "Motion button",
        description: "Primary action with subtle press and hover motion.",
      },
      {
        id: "motion-tabs",
        label: "Motion tabs",
        description: "Pill tabs for switching thread, plan, and logs views.",
      },
    ],
  },
]

export type GalleryPanel = {
  id: string
  title: string
  description: string
  categoryId: string
  categoryLabel: string
  index: string
  escape?: boolean
  hero?: boolean
}

export function categoryIds(): string[] {
  return categories.map((c) => c.id)
}

export function allPanels(): GalleryPanel[] {
  const panels: GalleryPanel[] = []
  let n = 0

  for (const cat of categories) {
    for (const item of cat.items) {
      if (item.variants?.length) {
        for (const v of item.variants) {
          n += 1
          panels.push({
            id: v.id,
            title: `${item.label} / ${v.label}`,
            description: v.description,
            categoryId: cat.id,
            categoryLabel: cat.label,
            index: String(n).padStart(2, "0"),
            escape: cat.escape,
            hero: cat.hero && panels.length === 0,
          })
        }
      } else {
        n += 1
        panels.push({
          id: item.id,
          title: item.label,
          description: item.description,
          categoryId: cat.id,
          categoryLabel: cat.label,
          index: String(n).padStart(2, "0"),
          escape: cat.escape,
          hero: cat.hero && item.id === "conversation",
        })
      }
    }
  }

  return panels
}

export function allPanelIds(): string[] {
  return allPanels().map((p) => p.id)
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
