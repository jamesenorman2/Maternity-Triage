# Maternity Triage Aide-Memoire

A personal, offline-first Progressive Web App that walks a registered midwife through structured, symptom-specific
maternity triage — telephone or face-to-face — and returns an urgency category, recommended actions, and the
guideline citation behind them.

> This tool is a personal reference aide-memoire for use by a registered midwife alongside her own clinical
> judgement and her employer's local guidelines. It does not diagnose, does not store patient information, and does
> not replace local policy, senior review, or emergency protocols. Content is derived from published NICE guidance
> (versions and dates listed per pathway) and must be checked against current guidance before reliance.

## What it is not

No patient records, no logins, no accounts, no backend, no analytics, no cookies, no network calls after first load.
Everything typed in lives in memory for the current triage only and is discarded on **New triage** or on closing the
app. This is not a medical device.

## Running it locally

```bash
npm install
npm run dev
```

## Building / previewing the production PWA

```bash
npm run build
npm run preview
```

Open the preview URL, install it to your home screen, then switch the device/browser to airplane mode and confirm a
full triage still completes — that's the acceptance bar for this app.

## Deploying

The app is a static site — no server required. A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and
publishes `dist/` to GitHub Pages on every push to `main`. To use it:

1. In the repo settings, set **Pages → Source** to "GitHub Actions".
2. Push to `main`.

To deploy elsewhere (Vercel, Netlify, Cloudflare Pages, a custom domain), just point the host at `npm run build` and
serve the `dist/` folder — omit the `GITHUB_PAGES=true` env var so the app builds with `base: '/'` instead of
`/maternity-triage/` (see `vite.config.ts`).

## Content architecture — the important bit

All clinical content lives in structured JSON files under `src/content/`, completely separate from the app/engine
code in `src/engine`, `src/components`, and `src/state`. The engine is a generic decision-tree renderer: it has no
clinical logic of its own, it just renders whatever a pathway file describes. This means:

- A clinician can review and correct content by editing JSON, without touching any code.
- New pathways are added by dropping a new file into `src/content/pathways/<section>/` and registering it in
  `src/content/index.ts` — no engine changes needed.

### File layout

```
src/content/
  schema.ts                    TypeScript shape every pathway file must match
  index.ts                     registry — every pathway is imported and listed here
  verifyList.ts                walks all pathways and collects VERIFY-flagged citations
  pathways/antenatal/*.json    antenatal presenting complaints
  pathways/intrapartum/*.json  intrapartum presenting complaints (none yet — see below)
  pathways/postnatal/*.json    postnatal presenting complaints (none yet — see below)
  emergencies/*.json           one-tap emergency drills (always RED, single outcome node)
```

### Node shape

```jsonc
{
  "id": "rfm-03",
  "type": "question",
  "text": "Has she felt any movements in the last 2 hours?",
  "phoneText": "Ask: have you felt the baby move at all in the last 2 hours?",
  "redFlag": false,
  "answers": [
    { "label": "No movements", "next": "rfm-outcome-orange" },
    { "label": "Some, but reduced", "next": "rfm-04" }
  ],
  "citation": { "guideline": "NG201", "section": "…", "checked": "2026-07-22", "verify": true }
}
```

Outcome nodes (`"type": "outcome"`) instead carry `category`, `target`, `actions[]`, `phoneScript`,
`safetyNetting[]`, `documentationPrompts[]`, and `citations[]`. Full shape is in `src/content/schema.ts`.

### The VERIFY flag

Every clinical number, threshold, or exact guideline section reference in this repo was compiled from training
knowledge and a handful of live searches — **not** a full independent re-check of every source. Anything not
independently confirmed against the current published guideline is marked `"verify": true` on its citation. The app
surfaces these:

- Inline, on every question and outcome screen, as an orange **VERIFY before relying on this** badge.
- Collected in one place under **📋 Content** in the toolbar — the full review list a clinician (or a second pass of
  content work) should work through before this is relied on in practice.

**Do not treat this app as clinically validated out of the box.** Section numbers in particular are often
descriptive placeholders ("Antenatal care — recommendations on fetal movements") rather than the exact NICE numbered
subsection, precisely so nothing looks more precise than it is.

### Content validation

```bash
npm run validate
```

Checks every `next` resolves to a real node, every outcome has a category and at least one citation, every node is
reachable from its pathway's `startNode`, and prints the full VERIFY list. This runs in CI on every push/PR
(`.github/workflows/ci.yml`) and again before every deploy.

## What's built vs. what's next

**Built (phase 1 + emergencies):**

- Full decision-tree engine: channel selection, universal opening questions (gestation, parity, risk factors),
  red-flag short-circuiting, outcome screen with actions/phone script/safety-netting/documentation prompts/citations.
- Three antenatal pathways: reduced fetal movements, vaginal bleeding (early pregnancy + antepartum haemorrhage),
  headache/visual disturbance/epigastric pain (pre-eclampsia screen).
- Six one-tap emergency drills: maternal collapse, eclampsia, cord prolapse, shoulder dystocia, major obstetric
  haemorrhage, suspected sepsis.
- Offline-first PWA shell (installable, full service-worker precache — verified working with the network fully
  disabled), dark mode default with light toggle, intended-use statement on every screen, content validation script.

**Not yet built** (the brief's phases 2–4 — remaining antenatal, all intrapartum, all postnatal pathways): the
presenting-complaint list in the brief (§4.3) names roughly 20 more pathways. Adding each is a content-only exercise
against the schema above — no engine work required. Given the clinical-accuracy bar this app sets for itself (every
number cited or flagged VERIFY), each new pathway is worth doing carefully rather than quickly; treat the three
built pathways as the template for structure, tone, and citation discipline.

## Acceptance checklist (from the brief)

- [x] Installs to a phone home screen and completes a full triage in airplane mode — verified with the service
      worker active and network disabled.
- [x] No network request after initial load; no data persisted anywhere — no `localStorage`, no cookies, no
      analytics; verify in devtools on your device.
- [x] Any pathway from entry to outcome in a handful of taps.
- [x] Every outcome shows category, actions, safety-netting (phone), documentation prompts, and citation.
- [x] Every clinical threshold traces to a cited source or is flagged VERIFY.
- [x] Intended-use statement shown on launch and accessible from every screen (ⓘ **About**, top toolbar).
- [x] Content files editable without touching engine code; validation script passes.
- [ ] Full presenting-complaint list from §4.3 — partially built (see above).
