export type ComponentVariant = {
  id: string
  hint?: string
}

export type ComponentEntry = {
  id: string
  label: string
  index: string
  variants?: ComponentVariant[]
}

export const components: ComponentEntry[] = [
  { id: "magnetic-button", label: "Magnetic button", index: "01" },
  { id: "hover-reveal", label: "Hover reveal", index: "02" },
  { id: "continuous-slider", label: "Continuous slider", index: "03" },
  { id: "cursor-spotlight", label: "Cursor spotlight", index: "04" },
  { id: "number-counter", label: "Number counter", index: "05" },
  { id: "toggle", label: "Toggle", index: "06" },
  {
    id: "animated-checkbox",
    label: "Animated checkbox",
    index: "07",
    variants: [
      { id: "checkbox-ink", hint: "Ink" },
      { id: "checkbox-seal", hint: "Seal" },
      { id: "checkbox-bloom", hint: "Bloom" },
    ],
  },
  { id: "loading-indicator", label: "Loading indicator", index: "08" },
  { id: "card-tilt", label: "Morph carousel", index: "09" },
  {
    id: "animated-tabs",
    label: "Animated tabs",
    index: "10",
    variants: [
      { id: "tabs-pill", hint: "Pill" },
      { id: "tabs-underline", hint: "Underline" },
    ],
  },
  { id: "compare-reveal", label: "Compare reveal", index: "11" },
  { id: "circular-progress", label: "Circular progress", index: "12" },
  { id: "hover-border", label: "Hover border", index: "13" },
  { id: "cool-scrollbar", label: "Cool scrollbar", index: "14" },
  { id: "click-shockwave", label: "Click shockwave", index: "15" },
]
