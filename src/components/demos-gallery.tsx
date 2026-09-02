"use client"

import * as React from "react"

import { Attachment } from "@/components/naisu/attachment"
import { CodeBlock } from "@/components/naisu/code-block"
import { ContextCards } from "@/components/naisu/context-cards"
import { Conversation } from "@/components/naisu/conversation"
import { EmptyState } from "@/components/naisu/empty-state"
import { LoadingState } from "@/components/naisu/loading-state"
import { Markdown } from "@/components/naisu/markdown"
import { Message, MessageGroup } from "@/components/naisu/message"
import { MotionButton } from "@/components/naisu/motion-button"
import {
  MotionTabs,
  MotionTabsContent,
  MotionTabsList,
  MotionTabsTrigger,
} from "@/components/naisu/motion-tabs"
import { OptionSelector } from "@/components/naisu/option-selector"
import { PermissionRequest } from "@/components/naisu/permission-request"
import { Progress } from "@/components/naisu/progress"
import { PromptInput } from "@/components/naisu/prompt-input"
import { Recommendation } from "@/components/naisu/recommendation"
import { SelectionActions } from "@/components/naisu/selection-actions"
import {
  SettingsPanel,
  SettingsToggle,
} from "@/components/naisu/settings-panel"
import { Status } from "@/components/naisu/status"
import { StreamingText } from "@/components/naisu/streaming-text"
import { SystemDialog } from "@/components/naisu/system-dialog"
import { TaskRows } from "@/components/naisu/task-rows"
import {
  ThinkingIndicator,
  type ThinkingVariant,
} from "@/components/naisu/thinking-indicator"
import { Toast } from "@/components/naisu/toast"
import {
  ToolCall,
  ToolCallChips,
  ToolCallGroup,
} from "@/components/naisu/tool-call"

const stage = "flex size-full items-center justify-center p-4"

export function ConversationDemo() {
  return (
    <div className={stage}>
      <div className="h-full max-h-[320px] w-full max-w-[380px]">
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

export function MessageSingleDemo() {
  return (
    <div className={stage}>
      <div className="flex w-full max-w-[300px] flex-col gap-3">
        <Message role="user">Can we ship the canary tonight?</Message>
        <Message role="assistant">Yes. Error budget is still green.</Message>
      </div>
    </div>
  )
}

export function MessageGroupDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[280px]">
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

export function PromptInputDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[320px]">
        <PromptInput />
      </div>
    </div>
  )
}

export function MarkdownDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[300px] rounded-xl bg-background p-3 ring-1 ring-border">
        <Markdown
          content={`**Summary**\n- Added \`PromptInput\`\n- Updated tests`}
        />
      </div>
    </div>
  )
}

export function CodeBlockDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[280px]">
        <CodeBlock language="ts" code={'const ok = await run()'} />
      </div>
    </div>
  )
}

export function AttachmentDemo() {
  return (
    <div className={stage}>
      <Attachment name="schema.sql" size="12 KB" />
    </div>
  )
}

function ThinkingPanel({ variant }: { variant: ThinkingVariant }) {
  return (
    <div className={stage}>
      <div className="w-full max-w-[300px]">
        <ThinkingIndicator variant={variant} />
      </div>
    </div>
  )
}

export function ThinkingStepsDemo() {
  return <ThinkingPanel variant="Steps" />
}

export function ThinkingReasoningDemo() {
  return <ThinkingPanel variant="Reasoning" />
}

export function StreamingTextDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[300px]">
        <StreamingText />
      </div>
    </div>
  )
}

export function ToolCallSingleDemo() {
  return (
    <div className={stage}>
      <ToolCall name="read_file" status="running" />
    </div>
  )
}

export function ToolCallGroupDemo() {
  return (
    <div className={stage}>
      <ToolCallGroup
        calls={[
          { name: "grep", status: "done" },
          { name: "edit", status: "running" },
          { name: "test", status: "pending" },
        ]}
      />
    </div>
  )
}

export function ToolCallChipsDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[300px]">
        <ToolCallChips autoplay />
      </div>
    </div>
  )
}

export function PermissionRequestDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[300px]">
        <PermissionRequest
          title="Allow shell command?"
          description="npm test -- --runInBand"
        />
      </div>
    </div>
  )
}

export function TasksDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[280px]">
        <TaskRows autoplay />
      </div>
    </div>
  )
}

export function RecommendationDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[320px]">
        <Recommendation />
      </div>
    </div>
  )
}

export function ContextCardsDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[300px]">
        <ContextCards />
      </div>
    </div>
  )
}

export function SelectionActionsDemo() {
  return (
    <div className={stage}>
      <SelectionActions />
    </div>
  )
}

export function ToastDemo() {
  return (
    <div className={stage}>
      <Toast message="Patch applied to model.ts" />
    </div>
  )
}

export function DialogDemo() {
  const [open, setOpen] = React.useState(true)
  return (
    <div className={stage}>
      <div className="relative h-[200px] w-full max-w-[280px]">
        <SystemDialog
          open={open}
          onOpenChange={setOpen}
          title="Discard draft?"
          description="Unsaved changes in the composer will be lost."
          contained
        />
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Open dialog
          </button>
        )}
      </div>
    </div>
  )
}

export function EmptyStateDemo() {
  return (
    <div className={stage}>
      <EmptyState
        title="No messages yet"
        description="Start a thread or pick a template to begin."
        action={
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            New thread
          </button>
        }
      />
    </div>
  )
}

export function SettingsPanelDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[320px]">
        <SettingsPanel
          rows={[
            {
              id: "model",
              label: "Model",
              control: (
                <OptionSelector
                  autoplay
                  options={[
                    { id: "fast", label: "Fast" },
                    { id: "balanced", label: "Balanced" },
                    { id: "deep", label: "Deep" },
                  ]}
                />
              ),
            },
            {
              id: "tools",
              label: "Tools",
              control: <SettingsToggle autoplay defaultOn />,
            },
            {
              id: "permissions",
              label: "Permissions",
              control: (
                <OptionSelector
                  appearance="field"
                  menu="stretch"
                  options={[
                    { id: "ask", label: "Ask" },
                    { id: "auto", label: "Auto" },
                    { id: "off", label: "Off" },
                  ]}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}

export function StatusDemo() {
  return (
    <div className={stage}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Status label="Idle" tone="neutral" />
        <Status label="Running" tone="active" />
        <Status label="Failed" tone="error" />
      </div>
    </div>
  )
}

function LoadingPanel({ variant }: { variant: "Dots" | "Ring" | "Bars" }) {
  return (
    <div className={stage}>
      <LoadingState variant={variant} />
    </div>
  )
}

export function LoadingDotsDemo() {
  return <LoadingPanel variant="Dots" />
}

export function LoadingRingDemo() {
  return <LoadingPanel variant="Ring" />
}

export function LoadingBarsDemo() {
  return <LoadingPanel variant="Bars" />
}

export function ProgressDemo() {
  return (
    <div className={stage}>
      <div className="w-full max-w-[280px]">
        <Progress value={62} />
      </div>
    </div>
  )
}

export function MotionButtonDemo() {
  return (
    <div className={stage}>
      <MotionButton>Send message</MotionButton>
    </div>
  )
}

export function MotionTabsDemo() {
  return (
    <div className={stage}>
      <MotionTabs defaultValue="chat" className="w-full max-w-[280px]">
        <MotionTabsList>
          <MotionTabsTrigger value="chat">Chat</MotionTabsTrigger>
          <MotionTabsTrigger value="plan">Plan</MotionTabsTrigger>
          <MotionTabsTrigger value="logs">Logs</MotionTabsTrigger>
        </MotionTabsList>
        <MotionTabsContent value="chat" className="pt-3 text-sm text-muted-foreground">
          Thread view
        </MotionTabsContent>
        <MotionTabsContent value="plan" className="pt-3 text-sm text-muted-foreground">
          Task plan
        </MotionTabsContent>
        <MotionTabsContent value="logs" className="pt-3 text-sm text-muted-foreground">
          Run logs
        </MotionTabsContent>
      </MotionTabs>
    </div>
  )
}

export const galleryDemos: Record<string, React.ComponentType> = {
  conversation: ConversationDemo,
  "message-single": MessageSingleDemo,
  "message-group": MessageGroupDemo,
  "prompt-input": PromptInputDemo,
  markdown: MarkdownDemo,
  "code-block": CodeBlockDemo,
  attachment: AttachmentDemo,
  "thinking-steps": ThinkingStepsDemo,
  "thinking-reasoning": ThinkingReasoningDemo,
  "streaming-text": StreamingTextDemo,
  "tool-call-single": ToolCallSingleDemo,
  "tool-call-group": ToolCallGroupDemo,
  "tool-call-chips": ToolCallChipsDemo,
  "permission-request": PermissionRequestDemo,
  tasks: TasksDemo,
  recommendation: RecommendationDemo,
  "context-cards": ContextCardsDemo,
  "selection-actions": SelectionActionsDemo,
  toast: ToastDemo,
  dialog: DialogDemo,
  "empty-state": EmptyStateDemo,
  "settings-panel": SettingsPanelDemo,
  status: StatusDemo,
  "loading-dots": LoadingDotsDemo,
  "loading-ring": LoadingRingDemo,
  "loading-bars": LoadingBarsDemo,
  progress: ProgressDemo,
  "motion-button": MotionButtonDemo,
  "motion-tabs": MotionTabsDemo,
}
