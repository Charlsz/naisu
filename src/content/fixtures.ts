/** Shared fictional product story for gallery demos. */

export const story = {
  repo: "payments-api",
  branch: "fix/parse-null-id",
  files: {
    model: "model.ts",
    parser: "parser.ts",
    test: "model.test.ts",
    schema: "schema.sql",
  },
}

export const user = {
  askFix:
    "parse() drops null ids in model.ts. Can you patch it and run the suite?",
  askShip: "Ship the patch on fix/parse-null-id once CI is green?",
}

export const assistant = {
  summary:
    "Moved the null guard before parse() branches in model.ts. All 12 tests pass.",
  offerPatch: "Want me to open a PR with the diff and test output?",
  group: [
    "Reading model.ts and model.test.ts",
    "Found the guard after the early return on line 18",
    "Drafting a patch that keeps the public signature stable",
  ],
  stream:
    "Patched model.ts and re-ran the suite. 12 tests pass. The null guard now runs before parse() branches.",
}

export const markdown = {
  content: `**Patch summary**
- Guard \`parse()\` before branch on line 18
- Updated \`model.test.ts\` fixture
- 12 tests passing in payments-api`,
}

export const code = {
  snippet: `if (input.id == null) {
  return null
}
return parseModel(input)`,
  language: "ts",
}

export const tools = {
  single: { name: "read_file", status: "running" as const },
  group: [
    { name: "grep", status: "done" as const },
    { name: "edit_file", status: "running" as const },
    { name: "run_tests", status: "pending" as const },
  ],
  chips: [
    {
      name: "grep",
      arg: "parseModel",
      status: "done" as const,
      output: ["12 matches in 4 files", "model.ts L18"],
    },
    {
      name: "edit_file",
      arg: "model.ts",
      status: "done" as const,
      diffs: [
        { file: "model.ts", added: 12, removed: 3 },
        { file: "parser.ts", added: 4, removed: 0 },
      ],
    },
    {
      name: "run_tests",
      arg: "npm test",
      status: "done" as const,
      output: ["12 passing", "0 failed"],
    },
  ],
}

export const thinking = {
  steps: [
    "Scan payments-api repo",
    "Open model.ts at line 18",
    "Draft patch for parse() guard",
    "Run model.test.ts",
  ],
  reasoning: [
    "parse() drops null ids when input is partial",
    "The guard runs after an early return",
    "Move the check before branch logic",
    "Keep the exported signature unchanged",
  ],
}

export const tasks = {
  rows: [
    { title: "Read model.ts", meta: "42 lines" },
    { title: "Apply patch", meta: "+12 -3" },
    { title: "Run npm test", meta: "12 passing" },
  ],
}

export const context = {
  chunks: [
    {
      title: "parse()",
      body: "The null guard runs after the early branch on line 18.",
      source: "model.ts L18",
    },
    {
      title: "Model type",
      body: "id is optional in the schema definition.",
      source: "types.ts L4",
    },
    {
      title: "Failing test",
      body: "Throws when id is missing from the payload.",
      source: "model.test.ts L31",
    },
  ],
}

export const permission = {
  title: "Allow shell command?",
  description: "npm test -- --runInBand",
}

export const system = {
  toast: "Patch applied to model.ts",
  dialog: {
    title: "Discard composer draft?",
    description: "Unsaved prompt text and attachments will be lost.",
  },
  empty: {
    title: "No threads yet",
    description: "Start a run on payments-api or paste a repo URL.",
    action: "New thread",
  },
  status: {
    idle: "Idle",
    running: "Running tools",
    failed: "Tests failed",
  },
  loading: "Reading model.ts...",
  progress: 72,
  models: [
    { id: "fast", label: "Fast" },
    { id: "balanced", label: "Balanced" },
    { id: "deep", label: "Deep" },
  ],
  permissions: [
    { id: "ask", label: "Ask" },
    { id: "auto", label: "Auto" },
    { id: "off", label: "Off" },
  ],
}

export const selection = {
  lead: "Release note: ",
  picked: "hold canary at 5% until errors cool.",
  rewrite: "keep canary at 5% until errors stay under 0.2%.",
}

export const streaming = {
  cite: "model.ts",
  sources: [
    { label: "model.ts", meta: "L18-42" },
    { label: "parser.ts", meta: "L7" },
  ],
  followUps: ["Show the diff", "Open PR"],
}
