# Naisu Design System

BeautifulUI-inspired craft applied to the three-color Naisu brand.

## Brand Lock

Naisu uses a minimal three-color palette derived from paper, ink, and pencil:

```css
--page: #FDFDFC        /* paper white background */
--ink: #1A1A1A         /* primary text / dark actions */
--ink-2: #6B6B6A       /* secondary text */
--ink-3: #9C9C9B       /* tertiary / muted text */
```

**Do NOT introduce:**
- BeautifulUI's accent blue (`oklch(0.626 0.205 254.947)`)
- Cool OKLCH neutrals with chroma
- 45° stripe page background as a permanent feature
- Any additional brand colors beyond destructive red (`#C41E3A`)

## Foundation Tokens

### Surfaces

```css
--page: #FDFDFC         /* root canvas */
--canvas: #FAFAF9       /* inset panels */
--surface: #FDFDFC      /* cards, modals, overlays */
--inset: #F7F7F6        /* recessed fields */
--hover: #F2F2F1        /* hover state background */
--hover-2: #ECECEB      /* pressed / deeper hover */
```

### Borders

Crisp 1px borders, not alpha-muddy:

```css
--line: rgba(156, 156, 155, 0.3)       /* default hairline */
--line-strong: rgba(156, 156, 155, 0.5) /* emphasis borders */
--line-soft: rgba(156, 156, 155, 0.15)  /* subtle dividers */
```

### Shadows (BeautifulUI Elevation)

Every raised surface = **crisp 1px ring + layered soft shadow**:

```css
--shadow-hairline: 0 0 0 1px var(--line);
--shadow-btn: 0 0 0 1px var(--line-strong), 0 1px 2px rgba(26, 26, 26, 0.04);
--shadow-card: 0 0 0 1px var(--line), 0 1px 2px rgba(26, 26, 26, 0.03), 0 4px 12px rgba(26, 26, 26, 0.04);
--shadow-raised: 0 0 0 1px var(--line), 0 2px 8px rgba(26, 26, 26, 0.06);
--shadow-overlay: 0 0 0 1px var(--line), 0 8px 28px rgba(26, 26, 26, 0.12);
```

**Edges never muddy.** Avoid `box-shadow: 0 2px 8px rgba(0,0,0,0.15)` alone — always pair with a ring.

### Radii (BeautifulUI Scale)

```css
--radius-chip: 6px       /* small pills, tags */
--radius-control: 8px    /* buttons, inputs, nav items */
--radius-card: 10px      /* component cards */
--radius-window: 14px    /* modals, popovers */
```

Chips stay small (6px), windows stay generous (14px). Do not flatten everything to 8px.

### Easing (Strong Curves)

BeautifulUI rejects weak built-ins. Use these:

```css
--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);
--ease-link: cubic-bezier(0.16, 1, 0.3, 1);
```

Apply to `transition`, `motion/react` transitions, or keyframe `animation-timing-function`.

## Primitive Spacing

Shared optical offsets for demo cards (from BeautifulUI):

```css
.primitive-card-pad { padding: 12px; }
.primitive-card-bar { padding: 10px 12px; }
.primitive-card-footer { padding: 10px; }
.primitive-icon-button {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-control);
}
```

Use these classes instead of hand-tuning `p-3` / `px-4` per component.

## Typography

- **Font:** Inter only (already loaded via `next/font/google`).
- **Message body:** 15–16px.
- **Meta / secondary:** 13–14px.
- **Code:** 13px mono.
- **Feature settings:** `"cv11", "ss01"` (set in `body`).
- **Letter spacing:** `-0.01em` body-wide.

**Headings balance; descriptions avoid orphans:**

```css
h1, h2, h3, h4 { text-wrap: balance; }
p { text-wrap: pretty; }
```

## Motion Standards

1. **Transform + opacity only** — no layout thrash.
2. **Short differentiated durations** — 150–280ms for micro-interactions, 350–420ms for panel reveals.
3. **`prefers-reduced-motion`** — all animations collapse to 0.01ms or freeze.
4. **Settled demos** — streaming carets blink after done; loaders stop; thinking collapses. No endless empty states in the gallery.

Example:

```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
>
```

## Component Patterns

### Cards

```tsx
<div className="rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)]">
```

### Buttons

```tsx
<button className="h-[32px] px-4 text-[13px] rounded-[var(--radius-control)] bg-surface shadow-[var(--shadow-btn)] hover:shadow-[var(--shadow-raised)] transition-all">
```

### Icon Buttons

```tsx
<button className="primitive-icon-button text-ink-2 hover:bg-hover hover:text-ink">
```

### Streaming Text Caret

Use the `.stream-caret` utility (defined in `globals.css`):

```tsx
<span className="stream-caret is-streaming" />
```

Omit `.is-streaming` when done; it will blink via `naisu-caret-blink`.

### Tool Chips / Tags

```tsx
<span className="rounded-[var(--radius-chip)] bg-hover px-2 py-1 text-[12px] shadow-[var(--shadow-hairline)]">
```

## Anti-Patterns

❌ **Flat alpha fills** — `bg-black/5` without a ring looks muddy. Use `shadow-[var(--shadow-card)]`.

❌ **Uniform radii** — Don't set everything to 8px. Chips are 6px, windows are 14px.

❌ **Weak easings** — `ease-out` is too gentle. Use `--ease-out-strong`.

❌ **Empty streaming states** — Demos must settle. Add `complete` or `settled` props.

❌ **Introducing new colors** — The system is #FDFDFC + #1A1A1A + #9C9C9B. Don't add accent blue, green success tints, or custom hues unless explicitly user-requested.

❌ **Hardcoded hex in components** — Always reference tokens: `text-ink`, `bg-surface`, `shadow-[var(--shadow-card)]`.

## Dark Mode (Out of Scope)

BeautifulUI ships light + dark. Naisu currently targets **light only**. If dark mode is added later, reuse BeautifulUI's inversion approach (surfaces darken, rings flip to low-alpha white, shadows deepen). For now, all demos assume light.

## Files Changed

- `src/app/globals.css` — Foundation tokens, primitive spacing, keyframes
- `src/components/component-card.tsx` — Stage chrome with `shadow-card`, proper buttons
- `src/components/side-nav.tsx` — Nav pills with `shadow-btn`, hover states
- `src/app/page.tsx` — Header typography
- `src/components/naisu/*.tsx` — Component demos remapped to new tokens

## References

- BeautifulUI foundation: https://www.beautifului.dev/r/foundation.json
- Primitive spacing conventions (card-pad, card-bar, icon-button)
- Layered shadow philosophy (ring + soft stacks)

---

**Future agents:** Keep Naisu minimal. When in doubt, reference this file and the BeautifulUI registry source (MIT-licensed, ported structure/behavior, never branding).
