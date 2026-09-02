# naisu

Draw UI by hand. Polish the strokes so they feel finished and still human. Copy the result.

## Architecture

Ports & adapters — product code does not depend on one drawing library.

```
src/
  domain/           # Sketch, polish math, component types (pure)
  application/      # Ports + use-cases
  infrastructure/   # Adapters (Drawesome canvas, polish, export)
  presentation/     # React UI — use-cases + adapters only
```

| Concern | Port | Default |
| --- | --- | --- |
| Draw input | `DrawingSurfacePort` | Drawesome (all pens + eraser) |
| Polish strokes | `StrokePolisherPort` | Naisu polish (domain) |
| Copy output | `ComponentExporterPort` | React SVG clipboard |

Swap tools in `src/infrastructure/composition/container.ts`.

## Run

```bash
npm install
npm run dev
```
