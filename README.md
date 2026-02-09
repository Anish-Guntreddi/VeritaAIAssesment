# Figma Layers Panel — High-Fidelity Replica

A pixel-perfect replica of Figma's Layers Panel (left sidebar), built as a functional prototype with Next.js.

## Reference Component

**Figma — Layers Panel (left sidebar)** from the Figma desktop editor. This is the hierarchical tree view that displays all layers/objects in a design file with expand/collapse, visibility toggles, lock toggles, inline renaming, and multi-select.

## Quick Start

```bash
npm install
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Implemented Features

### Visual Fidelity
- Dark theme matching Figma's editor (#1E1E1E background)
- Inter font at 13px for layer names, 11px semibold for header
- Pixel-accurate row height (28px), icon sizing (16px), and indentation (20px/level)
- Custom SVG icons for each layer type (Frame, Group, Text, Rectangle, Ellipse, Component, Image)
- Custom scrollbar styling matching Figma's dark theme
- CSS transition on chevron rotation (150ms ease)

### Interactions
- **Single-click selection** with blue highlight (rgba(13, 153, 255, 0.2))
- **Multi-select**: Cmd/Ctrl+click to toggle, Shift+click for range selection
- **Expand/collapse** tree with animated chevron rotation
- **Hover states**: row highlight + lock/eye icons appear on hover
- **Visibility toggle**: eye icon toggles layer visibility, hidden layers grey out
- **Lock toggle**: padlock icon toggles layer lock state
- **Inline rename**: double-click or F2 to edit, Enter to save, Escape to cancel
- **Keyboard navigation**: Arrow Up/Down to move, Arrow Right to expand, Arrow Left to collapse

### Key Detail
Lock and eye icons appear on hover **except** when a layer is actively locked or hidden — then the relevant icon persists. This matches Figma's actual behavior and is the most commonly missed detail.

### Persistence
All toggle, rename, and expand/collapse actions persist to SQLite via Next.js Server Actions. Changes survive page refresh.

## Tools Used

### AI Tools
- **Claude Code** (Anthropic) — Used as a development co-pilot for:
  - Architecture planning and component decomposition
  - Rapid scaffolding of component structure and state management
  - SVG icon generation for 7 layer types (hand-tuned after generation)
  - Iterative debugging of Prisma setup and Tailwind v4 theme configuration

### External Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.1.6 | App Router, Server Components, Server Actions |
| React | 19.2.3 | UI rendering |
| Tailwind CSS | 4.x | Utility-first styling with `@theme` custom colors |
| Prisma | 5.x | Type-safe ORM for SQLite persistence |
| clsx | 2.x | Conditional class name composition |
| tailwind-merge | 3.x | Resolves Tailwind class conflicts |
| tsx | 4.x | TypeScript execution for seed script |

## Workflow Efficiency Report

Two specific methods that accelerated the replication process:

### 1. AI-Assisted SVG Icon Generation
Instead of sourcing icons from a library (which would require finding Figma-matching variants, installing dependencies, and configuring tree-shaking), I used Claude Code to generate custom inline SVGs for all 7 layer types (Frame, Group, Text, Rectangle, Ellipse, Component, Image) at exactly 16px with stroke-based rendering matching Figma's icon style. This eliminated icon library overhead and gave pixel-perfect control over every path, enabling rapid visual matching in a single pass.

### 2. Flat-List Database Architecture
Pre-computing `depth` and `sortOrder` in the Prisma schema enabled a flat-list rendering approach: one `ORDER BY sortOrder` query returns all layers, and a single `.filter()` computes visibility from the expansion state. This eliminated recursive tree traversal, simplified keyboard navigation to index arithmetic, and made range selection a simple array slice — reducing complexity across 4 separate features simultaneously.

## Architecture

```
src/
  app/
    layout.tsx         Root layout with Inter font
    page.tsx           Server component: fetches layers from DB
    actions.ts         Server Actions for persistence
    globals.css        Tailwind theme + custom scrollbar
  components/
    LayersPanel.tsx    Client component: all interaction state
    LayerRow.tsx       Single layer row with all visual states
    LayerIcon.tsx      SVG icons for each layer type
    PanelHeader.tsx    Panel header with collapse-all button
  lib/
    cn.ts             clsx + tailwind-merge utility
    db.ts             Prisma singleton
    layer-utils.ts    Pure functions for tree visibility
    types.ts          TypeScript types
prisma/
  schema.prisma       Layer model with self-referential relation
  seed.ts             Seeds ~16 sample layers
```

### Design Decisions

**Flat-list rendering** — Layers are stored with pre-computed `depth` and `sortOrder`. The entire panel renders via a single `.map()` over a flat array, filtered by expansion state. This avoids recursive tree components and simplifies keyboard navigation, range selection, and expand/collapse logic.

**Optimistic updates** — Toggle and rename actions update client state immediately, then fire Server Actions in the background. This ensures the UI feels instant.

**CSS group-hover** — Lock/eye icons use Tailwind's `group-hover:opacity-100` for zero-JS hover reveal, avoiding hover state flicker that plagues JS-based approaches.

**Single state owner** — All interactive state (selection, expansion, editing, focus) lives in `LayersPanel`. This keeps the component tree simple and avoids prop drilling or context overhead for a focused prototype.
