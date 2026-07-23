# DesignCraft — Design Lab (Phase 1 MVP)

A classroom-ready web app for OCR Cambridge National in IT (J836), Unit R050, Topic Area 1.
Two complete Design Lab modules — **Mind Maps** and **Flowcharts** — each with the full lesson
journey: Read and Learn → Check Your Understanding → Worked example → (mind-map type selection) →
Support level → Build → Checklist review → Justification → 10-question knowledge check with one
retry → printable evidence.

Part of the wider Craft suite: DesignCraft (plan) → FormCraft (build) → SystemCraft (configure) → CyberCraft (secure).

## Run it

```bash
npm install
npm run dev        # development server
npm test           # 34 unit + smoke tests (Vitest)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

The production build in `dist/` is fully static — host it on any web server or open it through
`npm run preview`. Designed for school desktops/laptops in Chrome or Edge at 1366×768 and up.

## Architecture notes

- **React 18 + TypeScript + Vite**, canvases built on **React Flow** (`@xyflow/react`), flowchart
  auto-layout via dagre, mind-map auto-layout via a custom radial algorithm.
- **`src/data/dataService.ts`** is the storage abstraction: everything reads/writes `SavedRecord`
  objects (schemaVersion, studentId/classId/assignmentId placeholders, artifactData, checklist
  results, justification, first/retry scores, timestamps). Swap `LocalStorageDataService` for a
  database-backed implementation later without touching the editors. No personal data is collected.
- **`src/logic/`** holds pure, unit-tested validators (Library / Tunnel Timeline / Presentation /
  Flowchart), the quiz engine and layouts.
- **`src/content/`** holds all OCR-aligned teaching content and question banks.

## Not in this phase (by design)

Wireframes, Visualisation Diagrams and Mood Boards are shown as “Coming later” cards only.
No accounts, classes, homework or email invitations.
