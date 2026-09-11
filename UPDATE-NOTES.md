# DesignCraft classroom enhancement

The original React/Vite architecture, four guided lesson journeys and editors are retained. No sign-in, cloud database or public deployment was added.

## What is new

- My Projects: named mind maps, flowcharts, visualisation diagrams, wireframes and mood boards, with independent records, thumbnails, dates, rename, duplicate, confirmed deletion and editable JSON download/import.
- Mood-board editor: draggable/resizable image, colour, keyword and typography cards, undo/redo, automatic arrangement and existing PNG/SVG export tools. Upload your own/licensed PNG, JPEG, WebP or GIF images, under 800 KB each.
- Original labelled mind-map diagrams for three types, a three-screen wireframe, visualisation-plan/finished-flyer comparison, leaflet and poster examples, and mood-board colour/type inspiration. Existing flowchart diagrams retained. Teaching visuals are SVG/HTML, not copied textbook photographs.
- Searchable glossary, with hover/focus/tap definitions in learning prose and feedback. Student-authored designs and assessment answer options are not rewritten.
- Expandable Read more notes on purpose, components, suitability, software, advantages and limitations.
- 25 new non-scenario MCQs: five per tool. These are original adaptations of assessed skills, not verbatim OCR questions; individual source notes distinguish paper-informed from supplementary questions.
- Separate ten-question final assessment, saved unfinished answers, first/latest results and complete attempt history. The existing guided lesson knowledge checks and their saved scores remain separate and unchanged.
- Original quick-check selections and knowledge-check drafts now survive refresh.

## Storage and safe updating

The previous software uses localStorage keys `designcraft.v1.mindmap`, `designcraft.v1.flowchart`, `designcraft.v1.visualisation` and `designcraft.v1.wireframe`, with schemaVersion 1. These keys, field meanings and journey step indexes are retained. New optional fields do not invalidate old records.

My Projects uses `designcraft.projects.v1`. On its first visit, each recognised existing lesson record is copied once into a separately editable project. The original lesson is untouched; a copy does not subsequently track the lesson. New practice results use `designcraft.practice.v1.*`; reading-tab completion uses `designcraft.read.v1.*`.

Updating the same Netlify origin normally preserves localStorage. A different hostname, protocol, browser/profile or computer does not share it. Clearing browser data or private-browsing cleanup can remove it. Shared browser profiles are NOT private student accounts. This version cannot remotely retrieve pupils' browser data.

Use **My Projects → Download full backup** before changing devices or updating the site. It contains projects and raw DesignCraft progress records. **Import project / backup** always adds project copies with new IDs. The optional checkbox restores valid missing lesson/reading/assessment records only; existing progress is never overwritten. Unknown raw recovery keys are preserved in the exported file for manual recovery, not blindly executed or restored.

Recognised corrupt/future-format project collections are not reset. Unsupported legacy lesson bytes are copied to a recovery key before any replacement. Failed lesson writes retain an in-memory copy and show a recovery-download warning. Failed project writes retain the open design for download. No software can guarantee recovery after closing an unsaved tab: heed the warning. Storage capacity is limited, particularly with embedded images.

Avoid editing one project in two tabs: stale project writes are rejected to protect the saved version. Download the open copy, then reopen to reconcile it.

## Deploying the update yourself

1. Keep a copy of the original ZIP and ask pupils to download backups on the browsers they use.
2. For GitHub-connected Netlify: replace the repository's project files with these updated files. Do not upload node_modules. The root contains package.json, package-lock.json, index.html, src and netlify.toml.
3. Netlify build command: `npm run build`. Publish directory: `dist`. Keep the same Netlify site/address.
4. For manual deployment: upload the contents of this package's rebuilt `dist` folder through your existing site's deployment page, not a newly created site.
5. Test one existing browser profile with saved work before the next whole-class session.

Local development: `npm ci`, then `npm run dev`. Production check: `npm run build`. Automated regression checks: `npm test`.

## Question source coverage

- OCR R050 sample question paper: Q1 flowchart components and the later mind-map construction task.
- OCR R050 January 2025: Q1 wireframe component and the later mind-map construction task.
- OCR R050 January 2024: Q1 mind-map components and the later visualisation-diagram/DTP tasks.
- Mood-board questions and uncovered concept questions: original supplementary practice.

Teaching explanations are paraphrased from the supplied textbook topics with original examples. This is a GCSE-level Cambridge National R050 learning resource, not an official OCR assessment or grade predictor.
