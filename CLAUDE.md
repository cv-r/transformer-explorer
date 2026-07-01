# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Type-check (vue-tsc) then build for production
npm run preview      # Preview production build locally
```

No test suite or linter is configured yet.

## Project overview

**Transformer Explorer** is an educational Vue 3 app that walks through the 11 steps of the Transformer architecture (Tokenizer → Embedding → Position → QKV → Attention → Attention Matrix → Multi-Head → Feed Forward → LayerNorm → Residual → Output). All math is implemented from scratch with zero AI library dependencies — it's a teaching tool, not a real ML pipeline.

## Architecture

### State management (single Pinia store)

`src/stores/transformer.ts` (`useTransformerStore`) owns ALL application state:
- `inputText` (default: "苹果发布了新手机"), `currentStep`, `tokens`, `embeddings`, `positionEncoded`, `qkv`, `attentionMatrix`, `multiHeadResults`, `feedForwardResults`, `predictions`, `animation`
- `goToStep(n)` is the main entry point: it executes all steps from 0..n sequentially before setting `currentStep`, guaranteeing upstream data is always available
- Each step's computation is a dedicated function (`runTokenizer`, `runEmbedding`, etc.) called by `executeStep(step)` via a switch-case
- Steps 8 (LayerNorm) and 9 (Residual) are conceptual-only — they do nothing because their effects are already embedded in earlier calculations

### Utility modules (`src/utils/`)

Pure computation modules, no side effects except for QKV/FFN which use module-level lazy-initialized weights (reset via `resetWeights()` / `resetFFNWeights()`):

| File | Exports |
|------|---------|
| `math.ts` | `dotProduct`, `softmax`, `matMul`, `vecAdd`, `relu`, `layerNorm`, `positionalEncoding`, `scaledDotProductAttention`, `cosineSimilarity`, `transpose`, `randomMatrix` |
| `tokenizer.ts` | `tokenize(text)` — greedy longest-match Chinese tokenizer against a hardcoded vocabulary |
| `embedding.ts` | `getEmbedding(tokenId)` — returns 8-dim vectors from a hardcoded lookup (`EMBEDDING_DIM = 8`) |
| `qkv.ts` | `computeQKV(embeddings)` — applies random-but-stable weight matrices (8→4 dim) |
| `feedforward.ts` | `feedForward(input)` — 8→16→8 MLP with ReLU, returns all intermediate states for visualization |
| `prediction.ts` | `predictNextToken(vector, topK)` — returns hardcoded "reasonable" predictions for demo purposes |

### Component layout

```
App.vue (flexbox column, h-screen, overflow hidden)
├── Header (title + reset button)
├── StepperNav (horizontal scrollable step buttons, 11 steps)
├── Main (flex-1, three-column)
│   ├── InputPanel (w-[260px]) — textarea + example quick-fill buttons
│   ├── VisualizationPanel (flex-1) — <component :is> dynamic render of step component
│   └── ExplanationPanel (w-[280px]) — teaching content keyed by step ID
└── StepControls (fixed bottom) — prev/next buttons + progress dots
```

The step component mapping lives in `VisualizationPanel.vue` (`stepComponents` record mapping step index → component). Step components live in `src/components/steps/Step*.vue`.

### Styling

UnoCSS with `presetUno`, `presetAttributify`, `presetIcons`. Custom theme colors (`primary`, `secondary`, `surface-50`..`surface-900`) defined in `uno.config.ts`. Shortcuts: `btn`, `btn-primary`, `card`, `step-title`, `step-desc`. Icons use Lucide via `i-lucide-*` classes.

### Path aliases

`@` maps to `src/` (configured in both `vite.config.ts` and `tsconfig`).

## Teaching content model

`src/types/index.ts` defines `TeachingContent` with fields: `title`, `whyExists`, `solvesProblem`, `withoutIt`, `analogy?`. The `ExplanationPanel.vue` component holds a hardcoded `teachingContent` record keyed by step ID (`'tokenizer'`, `'embedding'`, etc.) that maps to Chinese-language explanations.
