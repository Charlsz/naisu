"use client"

import * as React from "react"

import { AgentSelector } from "@/components/naisu/agent-selector"
import { AgentStatus } from "@/components/naisu/agent-status"
import { AnimBookmark } from "@/components/naisu/anim-bookmark"
import { AnimBounce } from "@/components/naisu/anim-bounce"
import { AnimFlip } from "@/components/naisu/anim-flip"
import { AnimGlow } from "@/components/naisu/anim-glow"
import { AnimHeadphone } from "@/components/naisu/anim-headphone"
import { AnimHeartBurst } from "@/components/naisu/anim-heart-burst"
import { AnimMarquee } from "@/components/naisu/anim-marquee"
import { AnimPaper } from "@/components/naisu/anim-paper"
import { AnimPulse } from "@/components/naisu/anim-pulse"
import { AnimReact } from "@/components/naisu/anim-react"
import { AnimSnap } from "@/components/naisu/anim-snap"
import { AnimStamp } from "@/components/naisu/anim-stamp"
import { AnimStretch } from "@/components/naisu/anim-stretch"
import { AnimSway } from "@/components/naisu/anim-sway"
import { AnimTransitions } from "@/components/naisu/anim-transitions"
import { AnimTwist } from "@/components/naisu/anim-twist"
import { AnimWalk } from "@/components/naisu/anim-walk"
import { CssAnimHost } from "@/components/naisu/css-anim-host"
import { cssAnimTips } from "@/content/css-anim-tips"
import { Approval } from "@/components/naisu/approval"
import { Attachment } from "@/components/naisu/attachment"
import { Badge } from "@/components/naisu/badge"
import { ChatInput } from "@/components/naisu/chat-input"
import { CodeBlock } from "@/components/naisu/code-block"
import { ContextCards } from "@/components/naisu/context-cards"
import { Conversation } from "@/components/naisu/conversation"
import { EmptyState } from "@/components/naisu/empty-state"
import { ExecutionOutput } from "@/components/naisu/execution-output"
import { ExecutionStep } from "@/components/naisu/execution-step"
import { ExecutionTimeline } from "@/components/naisu/execution-timeline"
import { KeyInput } from "@/components/naisu/key-input"
import {
  LoadingState,
  type LoadingVariant,
} from "@/components/naisu/loading-state"
import { Markdown } from "@/components/naisu/markdown"
import { Message } from "@/components/naisu/message"
import { MessageGroup } from "@/components/naisu/message-group"
import { ModelSelector } from "@/components/naisu/model-selector"
import { PermissionRequest } from "@/components/naisu/permission-request"
import { PermissionSelector } from "@/components/naisu/permission-selector"
import { Popover } from "@/components/naisu/popover"
import { Progress } from "@/components/naisu/progress"
import { PromptInput } from "@/components/naisu/prompt-input"
import { ProviderSelector } from "@/components/naisu/provider-selector"
import { Recommendation } from "@/components/naisu/recommendation"
import { SelectionActions } from "@/components/naisu/selection-actions"
import {
  SettingsPanel,
  SettingsToggle,
} from "@/components/naisu/settings-panel"
import { Spinner } from "@/components/naisu/spinner"
import { Status } from "@/components/naisu/status"
import { StreamingText } from "@/components/naisu/streaming-text"
import { SystemDialog } from "@/components/naisu/system-dialog"
import { Task } from "@/components/naisu/task"
import { TaskList } from "@/components/naisu/task-list"
import { TaskRows } from "@/components/naisu/task-rows"
import { TaskStatus } from "@/components/naisu/task-status"
import {
  ThinkingIndicator,
  type ThinkingVariant,
} from "@/components/naisu/thinking-indicator"
import { Toast } from "@/components/naisu/toast"
import { ToolCall } from "@/components/naisu/tool-call"
import { ToolCallGroup } from "@/components/naisu/tool-call-group"
import { ToolChips } from "@/components/naisu/tool-chips"
import { ToolSelector } from "@/components/naisu/tool-selector"
import { Tooltip } from "@/components/naisu/tooltip"

export function ConversationDemo() {
  return (
    <div className="flex size-full items-center justify-center p-3">
      <div className="h-full max-h-[280px] w-full max-w-[340px]">
        <Conversation>
          <Message role="user">Why did checkout flake on CI?</Message>
          <Message role="assistant">
            Race in the cart total. Assert after settle, not on render.
          </Message>
          <Message role="assistant">Want a patch for checkout.spec.ts?</Message>
        </Conversation>
      </div>
    </div>
  )
}

export function MessageDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="flex w-full max-w-[260px] flex-col gap-2">
        <Message role="user">Can we ship the canary tonight?</Message>
        <Message role="assistant">Yes. Error budget is still green.</Message>
      </div>
    </div>
  )
}

export function MessageGroupDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <MessageGroup
          role="assistant"
          messages={[
            "Scanning payments-api…",
            "Found the stampede in cache warm-up",
            "Drafting a jittered backoff patch",
          ]}
        />
      </div>
    </div>
  )
}

export function ChatInputDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <ChatInput placeholder="Reply…" />
      </div>
    </div>
  )
}

export function PromptInputDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[280px]">
        <PromptInput />
      </div>
    </div>
  )
}

export function StreamingTextDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <StreamingText />
      </div>
    </div>
  )
}

export function MarkdownDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px] rounded-xl bg-[#FDFDFC] p-2 ring-1 ring-[#9C9C9B]/30">
        <Markdown
          content={`**Summary**\n- Added \`ChatInput\`\n- Updated tests`}
        />
      </div>
    </div>
  )
}

export function CodeBlockDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[220px]">
        <CodeBlock language="ts" code={'const ok = await run()'} />
      </div>
    </div>
  )
}

export function AttachmentDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <Attachment name="schema.sql" size="12 KB" />
    </div>
  )
}

function ThinkingPanel({ variant }: { variant: ThinkingVariant }) {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <ThinkingIndicator variant={variant} />
      </div>
    </div>
  )
}

export function ThinkingIndicatorDemo() {
  return <ThinkingPanel variant="Steps" />
}

export function ThinkingStepsDemo() {
  return <ThinkingPanel variant="Steps" />
}

export function ThinkingReasoningDemo() {
  return <ThinkingPanel variant="Reasoning" />
}

export function ThinkingSearchDemo() {
  return <ThinkingPanel variant="Search" />
}

export function ThinkingCodingDemo() {
  return <ThinkingPanel variant="Coding" />
}

function LoadingPanel({
  variant,
  label,
}: {
  variant: LoadingVariant
  label?: string
}) {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <LoadingState variant={variant} label={label} />
      </div>
    </div>
  )
}

export function LoadingDriveDemo() {
  return <LoadingPanel variant="Drive" />
}

export function LoadingDotsDemo() {
  return <LoadingPanel variant="Dots" />
}

export function LoadingOrbitDemo() {
  return <LoadingPanel variant="Orbit" />
}

export function LoadingBarsDemo() {
  return <LoadingPanel variant="Bars" />
}

export function LoadingRingDemo() {
  return <LoadingPanel variant="Ring" />
}

export function LoadingPulseDemo() {
  return <LoadingPanel variant="Pulse" />
}

export function LoadingWaveDemo() {
  return <LoadingPanel variant="Wave" />
}

export function LoadingBloomDemo() {
  return <LoadingPanel variant="Bloom" />
}

export function LoadingFlowerDemo() {
  return <LoadingPanel variant="Flower" label="Blooming…" />
}

export function LoadingJarDemo() {
  return <LoadingPanel variant="Jar" label="Filling…" />
}

export function LoadingPointerDemo() {
  return <LoadingPanel variant="Pointer" label="Aiming…" />
}

export function ToolChipsDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <ToolChips autoplay />
      </div>
    </div>
  )
}

export function RecommendationDemo() {
  return (
    <div className="flex size-full items-center justify-center p-3">
      <div className="w-full max-w-[300px]">
        <Recommendation />
      </div>
    </div>
  )
}

export function ContextCardsDemo() {
  return (
    <div className="flex size-full items-center justify-center p-3">
      <div className="w-full max-w-[240px]">
        <ContextCards />
      </div>
    </div>
  )
}

export function SelectionActionsDemo() {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden p-2">
      <div className="w-full max-w-[260px]">
        <SelectionActions />
      </div>
    </div>
  )
}

export function TaskRowsDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <TaskRows />
      </div>
    </div>
  )
}

export function AnimWalkDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimWalk />
    </div>
  )
}

export function AnimSwayDemo() {
  return (
    <div className="flex size-full items-end justify-center p-6">
      <AnimSway />
    </div>
  )
}

export function AnimBounceDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimBounce />
    </div>
  )
}

export function AnimPulseDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimPulse />
    </div>
  )
}

export function AnimBookmarkDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimBookmark />
    </div>
  )
}

export function AnimStampStarDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimStamp icon="star" />
    </div>
  )
}

export function AnimStampHeartDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimStamp icon="heart" />
    </div>
  )
}

export function AnimStampFlagDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimStamp icon="flag" />
    </div>
  )
}

export function AnimStampPinDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimStamp icon="pin" />
    </div>
  )
}

export function AnimStampBellDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimStamp icon="bell" />
    </div>
  )
}

export function AnimHeadphoneNaisuDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimHeadphone variant="naisu" />
    </div>
  )
}

export function AnimFlipDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimFlip />
    </div>
  )
}

export function AnimMarqueeDemo() {
  return (
    <div className="flex h-full w-full min-w-0 max-w-full items-center px-1 sm:px-3">
      <AnimMarquee className="w-full" />
    </div>
  )
}

export function AnimSnapDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimSnap />
    </div>
  )
}

export function AnimGlowDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AnimGlow />
    </div>
  )
}

export function AnimPaperDemo() {
  return <AnimPaper />
}

export function AnimStretchDemo() {
  return <AnimStretch />
}

export function AnimTwistDemo() {
  return <AnimTwist />
}

export function AnimTransitionsDemo() {
  return <AnimTransitions />
}

export function AnimStarPulseDemo() {
  return <AnimReact icon="star" motion="pulse" />
}

export function AnimStarBurstDemo() {
  return <AnimReact icon="star" motion="burst" />
}

export function AnimStarFillDemo() {
  return <AnimReact icon="star" motion="fill" />
}

export function AnimZapBurstDemo() {
  return <AnimReact icon="zap" motion="burst" />
}

export function AnimBellFillDemo() {
  return <AnimReact icon="bell" motion="fill" />
}

export function AnimThumbPulseDemo() {
  return <AnimReact icon="thumb" motion="pulse" />
}

export function AnimHeartBurstDemo() {
  return <AnimHeartBurst />
}

/** Tips still played via CssAnimHost (hand-crafted ones are overridden below). */
const HAND_CRAFTED_TIP_IDS = new Set([
  "anim-paper",
  "anim-stretch",
  "anim-twist",
  "anim-nest",
  "anim-heart-burst",
  "anim-transitions",
  "anim-star-pulse",
  "anim-star-burst",
  "anim-star-fill",
  "anim-zap-burst",
  "anim-bell-fill",
  "anim-thumb-pulse",
  "anim-walk",
  "anim-pulse",
  "anim-headphone-naisu",
])

const cssAnimDemos = Object.fromEntries(
  cssAnimTips
    .filter((tip) => !HAND_CRAFTED_TIP_IDS.has(tip.id))
    .map((tip) => [
      tip.id,
      function CssTipDemo() {
        return (
          <CssAnimHost
            css={tip.css}
            html={tip.html}
            interval={tip.interval}
          />
        )
      },
    ])
) as Record<string, React.ComponentType>

export function ToolCallDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <ToolCall name="read_file" status="running" />
    </div>
  )
}

export function ToolCallGroupDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <ToolCallGroup
        calls={[
          { name: "grep", status: "done" },
          { name: "edit", status: "running" },
        ]}
      />
    </div>
  )
}

export function ExecutionStepDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <ExecutionStep label="Install deps" detail="npm ci" autoplay />
      </div>
    </div>
  )
}

export function ExecutionTimelineDemo() {
  return (
    <div className="flex size-full items-center justify-center p-3">
      <ExecutionTimeline autoplay />
    </div>
  )
}

export function TaskDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <Task title="Fix CI" meta="2m ago" status="running" />
      </div>
    </div>
  )
}

export function TaskListDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <TaskList
          tasks={[
            { title: "Lint", status: "completed" },
            { title: "Test", meta: "2m ago", status: "running" },
          ]}
        />
      </div>
    </div>
  )
}

export function TaskStatusDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <TaskStatus autoplay />
    </div>
  )
}

export function AgentStatusDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <AgentStatus autoplay />
    </div>
  )
}

export function PermissionRequestDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <PermissionRequest
          title="Run shell command?"
          description="npm test. Allow once"
        />
      </div>
    </div>
  )
}

export function ApprovalDemo() {
  return (
    <div className="flex size-full items-center justify-center p-3">
      <div className="w-full max-w-[240px]">
        <Approval />
      </div>
    </div>
  )
}

export function ExecutionOutputDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[220px]">
        <ExecutionOutput
          stream
          output={
            "> npm test\nmodel.spec.ts ✓\nparser.spec.ts ✓\nPASS 12 tests\nDone in 1.4s"
          }
        />
      </div>
    </div>
  )
}

export function ToastDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <Toast message="Deploy promoted · payments-api" variant="success" />
    </div>
  )
}

export function PopoverDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <Popover
        trigger={
          <span className="rounded-lg bg-[#111111] px-2.5 py-1.5 text-[10px] font-medium text-[#FDFDFC] shadow-[0_1px_2px_rgba(16,24,40,0.2)]">
            Open
          </span>
        }
      >
        <p className="text-[10px] font-medium text-[#111111]">Quick actions</p>
        <p className="mt-1 text-[9px] leading-relaxed text-[#667085]">
          Pin, share, or archive this thread.
        </p>
      </Popover>
    </div>
  )
}

export function TooltipDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <Tooltip content="Open command palette">
        <button
          type="button"
          className="rounded-lg bg-[#FDFDFC] px-2.5 py-1.5 text-[10px] font-medium text-[#111111] shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-[#101828]/10"
        >
          Search
        </button>
      </Tooltip>
    </div>
  )
}

export function BadgeDemo() {
  return (
    <div className="flex size-full items-center justify-center gap-2 p-4">
      <Badge>Beta</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  )
}

export function StatusDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <Status label="Connected" tone="active" />
    </div>
  )
}

export function ProgressDemo() {
  const [value, setValue] = React.useState(35)
  React.useEffect(() => {
    const id = window.setInterval(() => setValue((v) => (v >= 95 ? 20 : v + 8)), 900)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[220px]">
        <Progress value={value} />
      </div>
    </div>
  )
}

export function SpinnerDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <Spinner />
    </div>
  )
}

export function EmptyStateDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <EmptyState
          title="Inbox zero"
          description="Nothing waiting. Enjoy the quiet until the next ping."
        />
      </div>
    </div>
  )
}

export function SystemDialogDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden p-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-[#111111] px-3 py-1.5 text-[10px] font-medium text-[#FDFDFC] shadow-[0_1px_2px_rgba(16,24,40,0.2)]"
      >
        Open
      </button>
      <SystemDialog
        contained
        open={open}
        onOpenChange={setOpen}
        title="Delete thread?"
        description="This cannot be undone."
      >
        <div className="flex justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2.5 py-1 text-[10px] text-[#667085] hover:bg-[#111111]/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-[#E9564A] px-2.5 py-1 text-[10px] font-medium text-white"
          >
            Delete
          </button>
        </div>
      </SystemDialog>
    </div>
  )
}

export function DialogDemo() {
  return <SystemDialogDemo />
}

const SETTINGS_MODELS = [
  { id: "fast", label: "Fast" },
  { id: "pro", label: "Pro" },
]

export function SettingsPanelDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[220px]">
        <SettingsPanel
          rows={[
            {
              id: "model",
              label: "Model",
              control: <ModelSelector models={SETTINGS_MODELS} />,
            },
            {
              id: "perm",
              label: "Tools",
              control: <PermissionSelector />,
            },
            {
              id: "stream",
              label: "Stream",
              control: <SettingsToggle defaultOn />,
            },
          ]}
        />
      </div>
    </div>
  )
}

const MODELS = [
  { id: "haiku", label: "Haiku" },
  { id: "sonnet", label: "Sonnet" },
  { id: "opus", label: "Opus" },
]

export function ModelSelectorDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4 pb-24">
      <ModelSelector models={MODELS} value="sonnet" />
    </div>
  )
}

const AGENTS = [
  { id: "code", label: "Code" },
  { id: "plan", label: "Plan" },
  { id: "review", label: "Review" },
]

export function AgentSelectorDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4 pb-24">
      <AgentSelector agents={AGENTS} value="code" />
    </div>
  )
}

const TOOLS = [
  { id: "grep", label: "Grep", enabled: true },
  { id: "bash", label: "Bash" },
  { id: "edit", label: "Edit", enabled: true },
]

export function ToolSelectorDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4 pb-24">
      <ToolSelector tools={TOOLS} />
    </div>
  )
}

export function PermissionSelectorDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <PermissionSelector />
    </div>
  )
}

const PROVIDERS = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google", label: "Google" },
  { id: "meta", label: "Meta" },
  { id: "xai", label: "xAI" },
]

export function ProviderSelectorDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4 pb-24">
      <div className="w-full max-w-[220px]">
        <ProviderSelector providers={PROVIDERS} value="anthropic" />
      </div>
    </div>
  )
}

export function KeyInputDemo() {
  const [key, setKey] = React.useState("sk-demo-key")
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <KeyInput value={key} onChange={setKey} />
      </div>
    </div>
  )
}

export const galleryDemos: Record<string, React.ComponentType> = {
  conversation: ConversationDemo,
  message: MessageDemo,
  "message-group": MessageGroupDemo,
  "chat-input": ChatInputDemo,
  "prompt-input": PromptInputDemo,
  "streaming-text": StreamingTextDemo,
  markdown: MarkdownDemo,
  "code-block": CodeBlockDemo,
  attachment: AttachmentDemo,
  "loading-drive": LoadingDriveDemo,
  "loading-dots": LoadingDotsDemo,
  "loading-orbit": LoadingOrbitDemo,
  "loading-bars": LoadingBarsDemo,
  "loading-ring": LoadingRingDemo,
  "loading-pulse": LoadingPulseDemo,
  "loading-wave": LoadingWaveDemo,
  "loading-bloom": LoadingBloomDemo,
  "loading-flower": LoadingFlowerDemo,
  "loading-jar": LoadingJarDemo,
  "loading-pointer": LoadingPointerDemo,
  "thinking-indicator": ThinkingIndicatorDemo,
  "thinking-steps": ThinkingStepsDemo,
  "thinking-reasoning": ThinkingReasoningDemo,
  "thinking-search": ThinkingSearchDemo,
  "thinking-coding": ThinkingCodingDemo,
  "tool-call": ToolCallDemo,
  "tool-call-group": ToolCallGroupDemo,
  "tool-chips": ToolChipsDemo,
  "execution-step": ExecutionStepDemo,
  "execution-timeline": ExecutionTimelineDemo,
  task: TaskDemo,
  "task-list": TaskListDemo,
  "task-rows": TaskRowsDemo,
  "task-status": TaskStatusDemo,
  "agent-status": AgentStatusDemo,
  "permission-request": PermissionRequestDemo,
  approval: ApprovalDemo,
  recommendation: RecommendationDemo,
  "context-cards": ContextCardsDemo,
  "selection-actions": SelectionActionsDemo,
  "execution-output": ExecutionOutputDemo,
  toast: ToastDemo,
  popover: PopoverDemo,
  tooltip: TooltipDemo,
  badge: BadgeDemo,
  status: StatusDemo,
  progress: ProgressDemo,
  spinner: SpinnerDemo,
  "empty-state": EmptyStateDemo,
  dialog: DialogDemo,
  "settings-panel": SettingsPanelDemo,
  "model-selector": ModelSelectorDemo,
  "agent-selector": AgentSelectorDemo,
  "tool-selector": ToolSelectorDemo,
  "permission-selector": PermissionSelectorDemo,
  "provider-selector": ProviderSelectorDemo,
  "key-input": KeyInputDemo,
  "anim-bounce": AnimBounceDemo,
  "anim-paper": AnimPaperDemo,
  "anim-stretch": AnimStretchDemo,
  "anim-twist": AnimTwistDemo,
  "anim-pulse": AnimPulseDemo,
  "anim-heart-burst": AnimHeartBurstDemo,
  "anim-star-pulse": AnimStarPulseDemo,
  "anim-star-burst": AnimStarBurstDemo,
  "anim-star-fill": AnimStarFillDemo,
  "anim-zap-burst": AnimZapBurstDemo,
  "anim-bell-fill": AnimBellFillDemo,
  "anim-thumb-pulse": AnimThumbPulseDemo,
  "anim-walk": AnimWalkDemo,
  "anim-sway": AnimSwayDemo,
  "anim-bookmark": AnimBookmarkDemo,
  "anim-stamp-star": AnimStampStarDemo,
  "anim-stamp-heart": AnimStampHeartDemo,
  "anim-stamp-flag": AnimStampFlagDemo,
  "anim-stamp-pin": AnimStampPinDemo,
  "anim-stamp-bell": AnimStampBellDemo,
  "anim-headphone-naisu": AnimHeadphoneNaisuDemo,
  "anim-flip": AnimFlipDemo,
  "anim-marquee": AnimMarqueeDemo,
  "anim-snap": AnimSnapDemo,
  "anim-glow": AnimGlowDemo,
  "anim-transitions": AnimTransitionsDemo,
  ...cssAnimDemos,
}
