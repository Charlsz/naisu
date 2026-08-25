"use client"

import {
  OptionSelector,
  type OptionSelectorProps,
  type SelectorOption,
} from "./option-selector"

export type ModelOption = SelectorOption

export type ModelSelectorProps = Omit<
  OptionSelectorProps,
  "options" | "appearance" | "menu" | "showDot"
> & {
  models: ModelOption[]
}

export function ModelSelector({ models, ...props }: ModelSelectorProps) {
  return (
    <OptionSelector
      options={models}
      appearance="soft"
      menu="end"
      {...props}
    />
  )
}
