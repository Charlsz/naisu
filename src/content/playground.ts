export type PlaygroundProject = {
  id: string
  title: string
  blurb: string
  /** Path under src/components for copy guidance */
  componentPath: string
}

/** Cool drops we host for try-and-copy. */
export const playgroundProjects: PlaygroundProject[] = [
  {
    id: "vintage-keyboard",
    title: "Vintage keyboard",
    blurb: "Wooden case, PBT keycaps, and thocky audio. Click or type.",
    componentPath: "src/components/ui/vintage-keyboard.tsx",
  },
]
