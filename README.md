# Tina's Study Room — NACE & NCLEX

A personal nursing-exam study app (PWA) with two study tracks:

- **NACE I** — Foundations of Nursing practice questions (186-question bank)
- **NCLEX-RN** — practice questions organized by the eight NCLEX-RN test-plan
  categories, including select-all-that-apply, ordered-response, and case-study
  questions

Switch tracks with the toggle at the top of the home screen. Progress, streaks,
missed-question review, and per-topic stats are tracked separately per track and
saved on the device (with a copyable backup code in Settings).

## Study modes

- **Quick drill** — 10 questions on one topic, rationale after each
- **Timed mock exam** — 50 questions / 60 minutes, blueprint-weighted per track
- **Voice study** — the app reads each question and its choices out loud and
  listens for a spoken answer ("B", "option C", or the words of the choice).
  Say *repeat*, *choices*, *skip*, or *stop* at any time; tapping always works
  as a fallback. Uses the browser's Web Speech API (speech synthesis +
  recognition); in browsers without speech recognition it still reads aloud and
  you tap your answer.
- **Flashcards, Dosage lab, Lab Lightning, Fix my misses, Study plan,
  Report card, Rewards, Cheat sheets**

## Tech

Plain HTML/CSS/JS — no build step, no dependencies. Everything is served
statically:

| File | Purpose |
| --- | --- |
| `index.html` | markup for every screen |
| `styles.css` | styling, light/dark themes |
| `bank.js` | NACE question bank (`NACE_BANK`) |
| `nclex-bank.js` | NCLEX question bank (`NCLEX_BANK`) |
| `tracks.js` | picks the active track's bank before the app boots |
| `app.js` | core quiz engine, flashcards, dosage lab, game |
| `features.js` | study plan, report card, rewards, cheat sheets, SATA/order questions |
| `track-ui.js` | NACE/NCLEX switcher and track-aware mock blueprints |
| `voice.js` | voice study (text-to-speech + speech recognition) |
| `sw.js` | service worker for offline use |
| `manifest.json` | PWA install metadata |

## Run locally

Any static server works:

```sh
npx serve .
```

## Deploy

Hosted on Vercel as a static site — no configuration needed. Pushes to the
production branch deploy automatically once the repo is linked to the Vercel
project.
