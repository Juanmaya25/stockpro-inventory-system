# 📦 StockPro — Inventory & POS for small businesses

> A complete inventory management system: products, sales, suppliers, clients and reporting with real‑time stock control. Built as a single‑page React app and deployed continuously to GitHub Pages.

[![CI](https://github.com/Juanmaya25/stockpro-inventory-system/actions/workflows/ci.yml/badge.svg)](https://github.com/Juanmaya25/stockpro-inventory-system/actions/workflows/ci.yml)
[![Deploy](https://github.com/Juanmaya25/stockpro-inventory-system/actions/workflows/deploy.yml/badge.svg)](https://github.com/Juanmaya25/stockpro-inventory-system/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-42%20passing-00d4aa.svg)](#testing)

**🔗 Live demo: [juanmaya25.github.io/stockpro-inventory-system](https://juanmaya25.github.io/stockpro-inventory-system)**

> The UI is in Spanish (the target market is Latin‑American SMBs). This README is in English for an international audience.

---

## What it does

| Module | Highlights |
| --- | --- |
| **Dashboard** | KPI cards (product count, inventory value, monthly sales, critical stock), inventory‑movement bar chart, category pie chart, quick actions |
| **Inventory** | SKU + barcode, stock progress bar, auto‑computed margin, live search, column sorting (name/SKU/stock/price), category filter, CSV export |
| **Point of sale** | Validates available stock, decrements inventory in real time, computes the live total |
| **Suppliers** | Star rating, active/inactive status, contact details |
| **Clients** | Purchase history and lifetime spend |
| **Reports** | Sales trend (area), inbound vs outbound (line), top‑5 products by revenue, CSV export |
| **Cross‑cutting** | Light/dark theme, automatic low/out‑of‑stock notifications, toast feedback, confirm dialogs, fully keyboard‑navigable sidebar |

## Tech stack

- **React 18** — function components, hooks, Context API
- **Vite 5** — dev server with HMR, production bundling with manual vendor chunking
- **Recharts** — bar / line / pie / area charts
- **Vitest + Testing Library + jsdom** — unit and component tests
- **GitHub Actions → GitHub Pages** — CI on every push/PR, automatic deploy on `main`

## Architecture

StockPro started life as a single 1,000‑line `App.jsx`. It was refactored into a layered architecture so that **business rules, state and presentation are independently testable and replaceable**. The golden rule: *domain logic never imports React; components never embed business rules.*

```
src/
├── App.jsx                 # composition root: <ThemeProvider><AppShell/>
├── app/
│   └── AppShell.jsx        # wires hooks → pages, owns cross‑cutting view state
├── data/
│   └── seeds.js            # demo dataset (stands in for the API layer)
├── utils/                  # ── PURE domain logic — zero React, 100% unit‑tested ──
│   ├── inventory.js        #   margins, stock status, filtering, sorting, metrics
│   └── csv.js              #   CSV serialization (pure) + download (side effect)
├── hooks/                  # ── stateful logic ──
│   ├── useInventory.js     #   entities + CRUD + derived metrics
│   ├── useProductFilters.js#   search / filter / sort state
│   ├── useModalForm.js     #   add/edit modal + controlled form state
│   ├── useToast.js         #   transient notifications
│   └── useTheme.js         #   theme consumer
├── context/
│   └── ThemeContext.jsx    # palette, derived styles and focus handlers via context
├── styles/theme.js         # design tokens + style primitives (makeStyles)
├── icons/index.jsx         # inline SVG icon set (no icon dependency)
└── components/             # ── presentational ──
    ├── Dashboard · Products · Sales · Suppliers · Clients · Reports
    ├── layout/             #   Header, Sidebar
    ├── forms/              #   Product/Sale/Supplier/Client modal bodies
    └── common/             #   Modal, ConfirmDialog, Toast, StockBadge, Stars, Th
```

### Key decisions

- **Pure domain layer (`utils/inventory.js`).** Every business rule — margin, stock thresholds, filtering, sorting, revenue ranking — is a pure function. This is what makes the app trustworthy: the rules are tested in isolation, with no DOM and no mocks.
- **Theme via Context, not prop‑drilling.** The original code threaded the palette (`C`) and style objects (`S`) through every component as props. `ThemeProvider` now exposes them through context, so a component pulls exactly what it needs.
- **Side effects isolated.** `toCsv()` is pure and tested; `downloadCsv()` wraps it with the Blob/anchor side effect. Same split for stock math vs. the React state that stores it.
- **`AppShell` as the orchestrator.** Pages are dumb and receive callbacks; `AppShell` translates those callbacks into domain actions and owns the view‑only state (active page, notification panel, delete confirmation).
- **Swapping the demo data for a real backend** means changing the initial state in `useInventory.js` — nothing in the UI layer needs to move.

## Testing

42 tests across the layers that carry the risk:

```bash
npm test          # run once
npm run test:watch
```

- `utils/inventory.test.js` — margins, stock status, filtering, sorting (incl. immutability), revenue ranking, edge cases (zero price, empty inventory).
- `utils/csv.test.js` — header generation, quote escaping, null/undefined handling.
- `hooks/useInventory.test.jsx` — CRUD, numeric coercion, validation failures, stock decrement on sale, over‑sell guard.
- `components/common/StockBadge.test.jsx` — renders the correct label per stock status, through the real `ThemeProvider`.
- `components/Sales.test.jsx` — renders the transaction list and derives the average ticket from the data.

CI (`.github/workflows/ci.yml`) runs the suite and a production build on every push and pull request; the deploy workflow re‑runs the tests before publishing, so a red test never reaches production.

## Run locally

```bash
git clone https://github.com/Juanmaya25/stockpro-inventory-system.git
cd stockpro-inventory-system
npm install
npm run dev      # http://localhost:5173/stockpro-inventory-system/
```

```bash
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

## Author

**Juan José Maya** — Full‑Stack Developer · Colombia

- 🌐 Portfolio: [juanmaya25.github.io](https://juanmaya25.github.io)
- 💼 GitHub: [@Juanmaya25](https://github.com/Juanmaya25)
- ✉️ [juanjosemaya2510@gmail.com](mailto:juanjosemaya2510@gmail.com)

## License

MIT © Juan José Maya
