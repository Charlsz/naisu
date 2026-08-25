"use client"

import {
  OptionSelector,
  type OptionSelectorProps,
  type SelectorOption,
} from "./option-selector"

export type ProviderOption = SelectorOption

export type ProviderSelectorProps = Omit<
  OptionSelectorProps,
  "options" | "appearance" | "menu" | "showDot"
> & {
  providers: ProviderOption[]
}

export function ProviderSelector({
  providers,
  ...props
}: ProviderSelectorProps) {
  return (
    <OptionSelector
      options={providers}
      appearance="field"
      menu="stretch"
      {...props}
    />
  )
}
