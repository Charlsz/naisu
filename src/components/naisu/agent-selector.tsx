"use client"

import {
  OptionSelector,
  type OptionSelectorProps,
  type SelectorOption,
} from "./option-selector"

export type AgentOption = SelectorOption

export type AgentSelectorProps = Omit<
  OptionSelectorProps,
  "options" | "appearance" | "menu" | "showDot"
> & {
  agents: AgentOption[]
}

export function AgentSelector({ agents, ...props }: AgentSelectorProps) {
  return (
    <OptionSelector
      options={agents}
      appearance="ring"
      menu="start"
      showDot
      {...props}
    />
  )
}
