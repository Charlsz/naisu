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
import * as fx from "@/content/fixtures"

function Frame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}

export function ConversationDemo() {
  return (
    <Frame className="h-[400px] w-full">
      <Conversation placeholder="Reply to the agent...">
        <Message role="user">{fx.user.askFix}</Message>
        <Message role="assistant">{fx.assistant.summary}</Message>
        <Message role="assistant">{fx.assistant.offerPatch}</Message>
      </Conversation>
    </Frame>
  )
}

export function MessageSingleDemo() {
  return (
    <Frame className="flex w-full flex-col gap-3">
      <Message role="user">{fx.user.askShip}</Message>
      <Message role="assistant">
        CI is green on fix/parse-null-id. I can open the PR when you are ready.
      </Message>
    </Frame>
  )
}

export function MessageGroupDemo() {
  return (
    <Frame className="w-full">
      <MessageGroup role="assistant" messages={[...fx.assistant.group]} />
    </Frame>
  )
}

export function PromptInputDemo() {
  return (
    <Frame className="w-full">
      <PromptInput
        placeholder="Ask the agent to patch model.ts..."
        models={[...fx.system.models]}
      />
    </Frame>
  )
}

export function MarkdownDemo() {
  return (
    <Frame className="w-full rounded-xl bg-background p-4 ring-1 ring-border">
      <Markdown content={fx.markdown.content} />
    </Frame>
  )
}

export function CodeBlockDemo() {
  return (
    <Frame className="w-full">
      <CodeBlock language={fx.code.language} code={fx.code.snippet} />
    </Frame>
  )
}

export function AttachmentDemo() {
  return (
    <Frame>
      <Attachment name={fx.story.files.schema} size="12 KB" />
    </Frame>
  )
}

function ThinkingPanel({
  variant,
  trace,
}: {
  variant: ThinkingVariant
  trace: string[]
}) {
  return (
    <Frame className="w-full">
      <ThinkingIndicator
        variant={variant}
        loop={false}
        settled
        steps={trace.map((label) => ({ label, done: true }))}
      />
    </Frame>
  )
}

export function ThinkingStepsDemo() {
  return <ThinkingPanel variant="Steps" trace={[...fx.thinking.steps]} />
}

export function ThinkingReasoningDemo() {
  return <ThinkingPanel variant="Reasoning" trace={[...fx.thinking.reasoning]} />
}

export function StreamingTextDemo() {
  return (
    <Frame className="w-full">
      <StreamingText
        text={fx.assistant.stream}
        cite={fx.streaming.cite}
        sources={[...fx.streaming.sources]}
        followUps={[...fx.streaming.followUps]}
        complete
        loop={false}
      />
    </Frame>
  )
}

export function ToolCallSingleDemo() {
  return (
    <Frame>
      <ToolCall name={fx.tools.single.name} status={fx.tools.single.status} />
    </Frame>
  )
}

export function ToolCallGroupDemo() {
  return (
    <Frame className="w-full">
      <ToolCallGroup calls={[...fx.tools.group]} />
    </Frame>
  )
}

export function ToolCallChipsDemo() {
  return (
    <Frame className="w-full">
      <ToolCallChips tools={fx.tools.chips} autoplay={false} />
    </Frame>
  )
}

export function PermissionRequestDemo() {
  return (
    <Frame className="w-full">
      <PermissionRequest
        title={fx.permission.title}
        description={fx.permission.description}
      />
    </Frame>
  )
}

export function TasksDemo() {
  return (
    <Frame className="w-full">
      <TaskRows tasks={[...fx.tasks.rows]} autoplay={false} activeIndex={2} />
    </Frame>
  )
}

export function RecommendationDemo() {
  return (
    <Frame className="w-full">
      <Recommendation />
    </Frame>
  )
}

export function ContextCardsDemo() {
  return (
    <Frame className="w-full">
      <ContextCards chunks={[...fx.context.chunks]} />
    </Frame>
  )
}

export function SelectionActionsDemo() {
  return (
    <Frame className="w-full">
      <SelectionActions />
    </Frame>
  )
}

export function ToastDemo() {
  return (
    <Frame>
      <Toast message={fx.system.toast} />
    </Frame>
  )
}

export function DialogDemo() {
  const [open, setOpen] = React.useState(true)
  return (
    <Frame className="relative min-h-[220px] w-full">
      <SystemDialog
        open={open}
        onOpenChange={setOpen}
        title={fx.system.dialog.title}
        description={fx.system.dialog.description}
        contained
      />
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary px-4 py-2.5 text-[15px] text-primary-foreground"
        >
          Open dialog
        </button>
      )}
    </Frame>
  )
}

export function EmptyStateDemo() {
  return (
    <Frame className="w-full">
      <EmptyState
        title={fx.system.empty.title}
        description={fx.system.empty.description}
        action={
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2.5 text-[15px] text-primary-foreground"
          >
            {fx.system.empty.action}
          </button>
        }
      />
    </Frame>
  )
}

export function SettingsPanelDemo() {
  return (
    <Frame className="w-full">
      <SettingsPanel
        rows={[
          {
            id: "model",
            label: "Model",
            control: (
              <OptionSelector
                options={[...fx.system.models]}
                value="balanced"
              />
            ),
          },
          {
            id: "tools",
            label: "Tools",
            control: <SettingsToggle defaultOn />,
          },
          {
            id: "permissions",
            label: "Permissions",
            control: (
              <OptionSelector
                appearance="field"
                menu="stretch"
                options={[...fx.system.permissions]}
                value="ask"
              />
            ),
          },
        ]}
      />
    </Frame>
  )
}

export function StatusDemo() {
  return (
    <Frame className="flex flex-wrap gap-3">
      <Status label={fx.system.status.idle} tone="neutral" />
      <Status label={fx.system.status.running} tone="active" />
      <Status label={fx.system.status.failed} tone="error" />
    </Frame>
  )
}

function LoadingPanel({ variant }: { variant: "Dots" | "Ring" | "Bars" }) {
  return (
    <Frame>
      <LoadingState variant={variant} label={fx.system.loading} />
    </Frame>
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
    <Frame className="w-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-muted-foreground">Agent run</span>
          <span className="font-medium text-foreground">{fx.system.progress}%</span>
        </div>
        <Progress value={fx.system.progress} />
      </div>
    </Frame>
  )
}

export function MotionButtonDemo() {
  return (
    <Frame>
      <MotionButton>Send to agent</MotionButton>
    </Frame>
  )
}

export function MotionTabsDemo() {
  return (
    <Frame className="w-full">
      <MotionTabs defaultValue="chat" className="w-full">
        <MotionTabsList>
          <MotionTabsTrigger value="chat">Chat</MotionTabsTrigger>
          <MotionTabsTrigger value="plan">Plan</MotionTabsTrigger>
          <MotionTabsTrigger value="logs">Logs</MotionTabsTrigger>
        </MotionTabsList>
        <MotionTabsContent value="chat" className="pt-4 text-[15px] text-foreground">
          Thread with model.ts patch and test output.
        </MotionTabsContent>
        <MotionTabsContent value="plan" className="pt-4 text-[15px] text-foreground">
          Read, patch, and verify the payments-api suite.
        </MotionTabsContent>
        <MotionTabsContent value="logs" className="pt-4 text-[15px] text-foreground">
          npm test finished with 12 passing tests.
        </MotionTabsContent>
      </MotionTabs>
    </Frame>
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
