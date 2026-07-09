# Visual UI Studio & Live Preview — Full Feature Documentation

This document describes the complete visual editing system built into the portfolio's admin panel. It covers three connected tools — the **Theme Studio**, the **Visual Canvas Editor**, and the **Live Preview Panel** — plus the runtime and data layers that power them.

---

## 1. Overview

The admin panel turns the public portfolio site into a live, editable canvas. Instead of editing code, the admin edits the real rendered site inside an iframe. Every change is reflected instantly, tracked in undo/redo history, persisted locally, and published to Supabase (`site_settings` table) when the admin clicks **Publish**.

The system has three surfaces:

| Surface | Route/Component | Purpose |
|---|---|---|
| Theme Studio | `src/pages/admin/Studio.tsx` | Global theming — colors, fonts, sizes, presets |
| Visual Canvas Editor | `src/pages/admin/Canvas.tsx` | Per-element styling + inline text editing on the live page |
| Live Preview Panel | `src/components/admin/preview/PreviewPanel.jsx` | Real-time preview beside admin settings forms |

All three load the public site at `/?preview=1` in an iframe and talk to it over `window.postMessage`.

---

## 2. Theme Studio (`Studio.tsx`)

A split-screen editor: control sidebar on the left, a full live preview of the site on the right, framed in a browser-window mockup (traffic-light dots + address bar reading "Live Preview").

### Features

- **Theme presets** — one-click presets from `src/theme/presets.ts`, applied via `applyPreset()` and instantly reflected in the preview.
- **Typography controls**
  - Body font family and Heading font family (Space Grotesk, Inter, Archivo, Orbitron, Playfair Display, Roboto Mono)
  - Body size and Heading size (px number inputs)
  - Body weight (300–700) and Heading weight (400–900)
- **Color controls** — every key in `theme.colors` gets a row with its hex value and a native color picker; edits stream live.
- **Publish** — saves the whole theme object to Supabase through `useSiteSettings('theme')`, with a saving state on the button.

### Live sync mechanics

- Theme changes push `{ type: 'SYNC_THEME', theme }` to the iframe on every edit.
- The iframe announces `THEME_STUDIO_READY` when its React tree mounts; the Studio replies with the current theme, so the first message is never lost to a startup race.
- The theme is also re-pushed on iframe `onLoad` as a fallback.
- Latest theme is held in a ref so the handshake listener never needs re-binding.

---

## 3. Visual Canvas Editor (`Canvas.tsx`) — the "Visual UI Studio"

A Webflow/Framer-style editor over the real site. Layout: top toolbar, breadcrumb bar, centered device-framed canvas, and a right-hand Inspector panel.

### 3.1 Toolbar features

- **Edit mode toggle** — "Editing" / "Enable editing" button. Edit mode auto-enables when the editor opens and cleans up (disables + clears selection) on exit. Hint text: *"Click an element · double-click text to edit."*
- **Responsive device preview** — Desktop (full width), Laptop (1280px), Tablet (834px), Mobile (390px), and **Custom width** with a numeric input (ruler icon). The iframe canvas resizes to the chosen width.
- **Undo / Redo** — buttons plus `Ctrl+Z` / `Ctrl+Shift+Z` / `Ctrl+Y`. Disabled states reflect history availability.
- **Command palette trigger** — "Search" button with `Ctrl K` kbd hint.
- **Publish** — persists everything to Supabase (see §7), with spinner and "Publishing…" state.

### 3.2 Breadcrumb bar

Shows the selected element's ancestor chain (`Page › Hero › Headline`). Each crumb is clickable and programmatically selects that ancestor in the iframe (scrolls it into view and highlights it). The active crumb is bolded blue.

### 3.3 Selection & inline editing (runtime behavior)

Provided by `CanvasRuntime` (§5): hover outlines, click-to-select with a name label, and double-click for inline `contenteditable` text editing committed on Enter/Escape/blur.

### 3.4 Inspector panel (`canvas/Inspector.tsx`)

A 288px side panel that appears in edit mode. Header shows the element name, kind, content path, and a **Reset** button that clears all style overrides for that element. Empty state prompts: *"Select an element on the canvas to edit it."*

Five tabs:

| Tab | Controls |
|---|---|
| **Content** | Textarea for the element's text (or an Image URL input for images), bound to its `data-edit-path`. Falls back to a hint to double-click on canvas if the element has no editable path. |
| **Type** | Font family (100+ Google Fonts grouped by category, see §6), size (px), weight (300–900), letter spacing, line height, text align, text transform, text color (hex field + picker). |
| **Layout** | Width, height; padding top/right/bottom/left; margin top/right/bottom/left; display (block, flex, inline-flex, grid, inline-block, none). |
| **Style** | Background color; border width, color, radius; opacity; box-shadow presets (none → 5 elevation levels). |
| **Effects** | Roadmap placeholder — hover/active/focus states and scroll/hover animations planned; base styles apply to the default state. |

Inputs show the element's **live computed CSS** as the baseline, overlaid with any override — so numbers reflect what's actually on screen. Empty input = remove the override.

### 3.5 Command palette (`canvas/CommandPalette.tsx`)

- Opened with `Ctrl+K` (or toolbar button); closes on `Esc` or backdrop click.
- Fuzzy-filters a static catalog of ~24 editable components (Navbar, Hero headline/badge/CTAs, About, Projects, Writing, Footer — see `editor/catalog.ts`).
- Full keyboard navigation (arrows + Enter). Choosing an item scroll-selects that element inside the iframe.

---

## 4. Live Preview Panel (`admin/preview/`)

A dockable live-preview pane used beside the admin settings forms (Hero, About, Skills, Contact, SEO, Theme settings pages).

### Features

- **"Live preview" status indicator** with a pulsing radio icon.
- **Device toggle** — Desktop (browser card) or Mobile (390px phone frame with rounded bezel).
- **Reload** button (re-mounts the iframe via a key bump), **Open live site in new tab**, and **Close panel** buttons.
- **Form → preview streaming** (`usePreviewSync.js`): plugs into any react-hook-form instance, pushes current values immediately on mount, then streams every keystroke/change (including `form.reset()`) as a `PREVIEW_OVERRIDE` payload shaped like ContentProvider data (`{ settings, projects, blogs, experiences }`).
- **Section anchoring** — each settings page registers an anchor (e.g. `#hero`); the preview auto-scrolls to the relevant section (`PREVIEW_SCROLL` message), including after reloads.
- **Ready handshake** — the iframe posts `PREVIEW_READY` once ContentProvider mounts; the panel responds with the current draft so no edit is lost to a startup race.

---

## 5. Canvas Runtime (`editor/CanvasRuntime.tsx`)

Runs **inside** the preview iframe (on the public site) and turns the page into an editable canvas. It renders nothing; it works with plain DOM overlays so it never interferes with React.

### Editable element contract

Elements opt in with data attributes:
- `data-edit-id` — unique id (matches catalog ids)
- `data-edit-name` — display name for labels/breadcrumbs
- `data-edit-kind` — `text | heading | button | link | image | container | section`
- `data-edit-path` — content path, e.g. `hero.subtitle` (enables text/URL editing)

### Behaviors

- **Hover highlight** — a light blue 1.5px outline follows the hovered editable element.
- **Selection** — click outlines the element in solid blue (2px + white halo) with a floating name label above it; clicks are intercepted (`preventDefault`/`stopPropagation`) so links and buttons don't fire while editing.
- **Overlay tracking** — a `requestAnimationFrame` loop keeps outlines glued to elements through scrolling, animation, and layout changes; overlay layer sits at max z-index with `pointer-events: none`.
- **Computed style capture** — on selection, ~25 CSS properties (color, background, full font metrics, all paddings/margins, border, radius, opacity, shadow, size, display) are read from `getComputedStyle` and sent to the admin as the Inspector baseline.
- **Breadcrumb building** — walks ancestors collecting `data-edit-id` nodes.
- **Inline text editing** — double-click on text/heading/button/link kinds sets `contenteditable="plaintext-only"`, focuses, selects all text; commit on Enter, Escape, or blur emits `EDITOR_CONTENT { path, value }`.
- **Live style injection** — receives override CSS from the admin and writes it into a `<style id="canvas-live-overrides">` tag; auto-loads any Google Fonts referenced in that CSS.
- **Programmatic selection** — `EDITOR_SELECT { id }` scrolls the element into view (smooth, centered) and selects it.
- **Section scrolling** — handles `PREVIEW_SCROLL { anchor }` for the settings preview panel.
- **Ready announcement** — posts `EDITOR_RUNTIME_READY` on mount so the admin re-sends mode, styles, and content.

### postMessage protocol summary

Admin → iframe: `EDITOR_MODE`, `EDITOR_STYLE`, `EDITOR_SELECT`, `PREVIEW_OVERRIDE`, `PREVIEW_SCROLL`, `SYNC_THEME`
Iframe → admin: `EDITOR_RUNTIME_READY`, `PREVIEW_READY`, `THEME_STUDIO_READY`, `EDITOR_SELECTED`, `EDITOR_CONTENT`, `EDITOR_CLEARED`

---

## 6. Font system (`editor/fonts.ts`)

- **100+ Google Fonts** in five categories: 40 Sans, 25 Serif, 22 Display, 12 Handwriting, 11 Mono.
- **On-demand loading** — fonts are injected as `<link>` stylesheets only when actually applied; no npm dependency, no upfront cost, idempotent per family.
- **Weight-aware requests** — multi-weight families request 400/500/600/700; single-weight display faces request the default only (avoids Google Fonts 400 errors).
- **System-font guard** — generic families (`sans-serif`, `system-ui`, etc.) are never fetched.
- `ensureFontsFromCss()` scans override CSS for `font-family` declarations and loads each one — so fonts appear the moment they're picked in the Inspector.

---

## 7. State, history & persistence (`editor/editorStore.ts`)

A Zustand store with `persist` middleware (localStorage key `canvas-editor`).

- **Style overrides** — `{ [editId]: { 'css-prop': 'value' } }`, compiled to CSS as `[data-edit-id="…"] { prop: value !important; }` by `overridesToCss()`.
- **Content drafts** — deep-merged partial objects keyed by `site_settings` key (e.g. `{ hero: { subtitle: '…' } }`), built with an immutable `deepSet`.
- **Undo/redo history** — snapshot-based past/future stacks, capped at **100 entries**; every style or content mutation commits a snapshot and clears the redo stack.
- **Persisted across sessions** — overrides, content drafts, device mode, custom width, and guide preference survive reloads; unsaved work is never lost.
- **Reset options** — per-element style reset (Inspector) and full `resetEdits()`.

### Publish flow

On Publish, the Canvas editor:
1. Upserts the full override map to `site_settings` under key `editorOverrides`.
2. Deep-merges each content draft over the currently saved settings and upserts per key (`hero`, `about`, …).
3. Toasts success ("Canvas changes published") or failure; a missing Supabase config is caught with a clear error.

On the public site, `editor/StyleOverrides.tsx` reads the saved `editorOverrides` and applies the same CSS — so published edits render for every visitor.

---

## 8. Theme engine (`theme/`)

- `ThemeProvider.tsx` applies the theme (colors, typography) to the public site and listens for `SYNC_THEME` in preview mode.
- `presets.ts` ships named theme presets for one-click restyling.
- `store.ts` (Zustand) holds the working theme with `updateColors`, `updateTypography`, and `applyPreset` actions.
- Published themes persist through `useSiteSettings('theme')` to Supabase.

---

## 9. Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + K` | Open command palette |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y` | Redo |
| `↑ / ↓ / Enter / Esc` | Navigate / choose / close in palette |
| `Enter` (while inline-editing) | Commit text edit |
| `Esc` (while inline-editing) | Commit and exit editing |
| Double-click text | Enter inline edit mode |

---

## 10. Architecture at a glance

```
Admin panel (parent window)                    Public site (iframe /?preview=1)
┌─────────────────────────────┐               ┌─────────────────────────────┐
│ Studio.tsx (theme controls) │──SYNC_THEME──▶│ ThemeProvider               │
│ Canvas.tsx (toolbar/device) │──EDITOR_*────▶│ CanvasRuntime (overlays,    │
│  ├─ Inspector.tsx (5 tabs)  │◀─SELECTED/────│  inline edit, style tag,    │
│  └─ CommandPalette (Ctrl+K) │   CONTENT     │  font loader)               │
│ PreviewPanel + usePreviewSync│─PREVIEW_*───▶│ ContentProvider (draft data)│
│ editorStore (zustand,       │               │ StyleOverrides (published   │
│  undo/redo, localStorage)   │               │  CSS for visitors)          │
└──────────┬──────────────────┘               └─────────────────────────────┘
           │ Publish
           ▼
   Supabase `site_settings`
   (editorOverrides + hero/about/… keys + theme)
```

### Design highlights

- Edits happen against the **real rendered site**, not a mock — WYSIWYG is exact.
- **Race-proof messaging**: every iframe surface announces readiness and the parent replays state, plus `onLoad` fallbacks.
- **Non-destructive**: overrides layer over the base design via `!important` CSS; anything can be reset per element or wholesale.
- **Offline-safe drafting**: all edits live in localStorage until explicitly published.
