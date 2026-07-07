# 💫 Halo

**A private, on-device personal finance tracker. No account. No cloud. No tracking.**

Every transaction, goal, and receipt lives in your phone's browser storage and nowhere else. Halo is a single-file progressive web app: one HTML file, installable from the browser, working fully offline.

## 🌱 Why Halo

Most finance apps want your bank credentials, your email, and a subscription. Halo takes the opposite position: your money data is yours, and the safest server is no server. Everything is computed and stored locally. The only network requests the app ever makes are fetching fonts, the OCR engine on first use, and optional live exchange rates.

## ✨ Features

### 📒 Tracking

- 💸 Income, expenses, and transfers across multiple accounts (cash, bank, anything)
- ⚓ Account balances with a "balance as of" date anchor, so importing old history never corrupts your current balance
- 📈 Net worth total with a trend line built from daily snapshots
- 💱 Multi-currency entries with manual or live exchange rates, converted into your base currency everywhere
- 🍕 Split expenses: log only your share of a shared bill
- 🧠 Category auto-suggestions learned from your own past notes

### 📸 Thai bank slip OCR

- 🧾 Scan a single transfer slip and the amount, date, and recipient fill themselves in
- 🗂️ Bulk import: multi-select a batch of slip photos, clear reads save automatically, unclear reads and likely duplicates wait in a review queue
- 📎 The slip photo attaches to the transaction as a receipt, compressed on-device
- 🔒 All OCR runs locally via Tesseract.js with Thai and English models

### 🎯 Budgets and goals

- 📊 Per-category monthly budgets with optional rollover of unused amounts
- 🏁 Four goal types: monthly target, target by date with pace tracking, income split buckets (like 50/30/20), and debt payoff
- 🔁 Recurring transactions (rent, salary, subscriptions) that either auto-post or ask for confirmation

### 🔍 Insight

- 💡 Stats tab with month-over-month insights, category momentum, weekday patterns, and savings rate
- 🔀 Spending breakdowns sliceable by category, account, currency, or weekday
- 🗓️ GitHub-style calendar heatmap of daily spending
- 👆 Nearly everything drills down: tap a bar, a category, or a heatmap day to jump to those exact transactions

### 🪞 Experience

- 🧊 Glassmorphism design system with four palettes: Aurora, Nebula, Ocean, Ember
- ✍️ A custom-drawn SVG letterform engine renders every tab title in bespoke monoline lettering, with the O as the glowing halo ring
- 🖼️ Freeform vision board: photos, stickers, and notes you can drag, resize, rotate, and link to goals
- 🎓 Interactive spotlight tutorial for first-time users, replayable anytime
- ❓ Per-tab quick guide behind the ? button
- 🔐 Four-digit PIN lock (SHA-256 hashed, never stored in plain text)
- 🛟 Backup nudges after 14 days without an export
- ⚡ Home screen shortcuts for one-tap expense or income entry

### 💾 Data

- 📦 Full JSON backup and restore covering every store, receipts included
- 📄 CSV export for spreadsheets
- 🧹 One-tap full erase

## 🛠️ Tech stack

- 🧩 App: single index.html, vanilla JavaScript, zero frameworks
- 🗄️ Storage: IndexedDB (transactions, categories, accounts, goals, recurring rules, board items, net worth snapshots, meta)
- 📡 Offline: service worker, network-first for the app shell, cache-first for assets
- 👁️ OCR: Tesseract.js 5, eng + tha models, loaded lazily and cached for offline reuse
- 💹 FX rates: Frankfurter API, optional, cached locally
- 🔤 Typography: Sora (display), Manrope (body), JetBrains Mono (numerals), plus a hand-built SVG glyph set for brand lettering
- 🎨 Icons and imagery: inline SVG throughout, PWA icons generated programmatically

## 🏗️ Architecture notes

- 📄 **Single-file by design.** The entire app is one HTML file containing all markup, styles, and logic. Deployment is trivial (any static host works), the whole codebase is greppable, and the app shell is one cache entry.
- 🏠 **Local-first data model.** IndexedDB holds eight object stores. All monetary math runs on a normalized base amount per transaction, so multi-currency entries aggregate correctly in every view. Account balances derive from a starting balance plus the transaction log, filtered by the account's balance-as-of anchor date.
- 🖌️ **Rendering.** Views are template-literal renderers per tab with a single delegated event layer. No virtual DOM, no build step. Staggered entrance animations and springy micro-interactions are pure CSS, gated behind prefers-reduced-motion.
- 🔡 **The brand lettering engine.** Tab titles are not set in a font. A small glyph map defines twelve monoline letterforms as SVG path data sharing one geometry (consistent stroke, cap height, and optical overshoot), composed into words at render time. Every O renders as the mint halo ring.
- 🧊 **Blur budget.** Glassmorphism on Android taught a hard lesson: nested backdrop filters crash the GPU compositor. Blur is applied only to top-level surfaces (bars, sheets, cards); interactive elements inside them are translucent without their own filters.
- 🔄 **Service worker discipline.** The cache name is versioned manually and bumped on every release. The app shell uses network-first so updates land as soon as the user fully reopens the app.

## 🛡️ Privacy stance

- 🚫 No account, no sign-up, no analytics, no telemetry, nothing phones home
- 📵 Data never leaves the device unless the user explicitly exports a backup
- 🖼️ Receipt photos are compressed and stored locally alongside the transaction
- 🔑 The PIN is stored only as a SHA-256 hash, and there is deliberately no recovery path: forgetting the PIN means erasing the device's data
- 🗑️ Deleting the app data in the browser (or the Erase all data button) removes everything permanently

## 🚀 Running it

Halo is a static site. Any of these work:

1. 🌐 **GitHub Pages:** Settings, Pages, deploy from branch, main, root. Done.
2. 📤 **Any static host:** upload index.html, manifest.json, service-worker.js, and the icons folder.
3. 💻 **Locally:** serve the folder with any static server (for example `npx serve`). Opening the file directly also works, minus service worker features.

📲 To install on Android: open the deployed URL in Chrome, then Add to Home Screen. On iOS: Safari, Share, Add to Home Screen.

🔖 **Releasing an update:** bump `CACHE_NAME` in service-worker.js, push, then fully close and reopen the installed app.

## 🗺️ Roadmap

- [ ] 💾 Persistent storage request so the OS never evicts app data under pressure
- [ ] 📦 Bundle the OCR engine locally instead of loading from a CDN
- [ ] 🌍 Custom domain
- [ ] 🤖 Trusted Web Activity build and Google Play release
- [ ] 🏷️ Venture and project tags with per-venture profit and loss
- [ ] ✈️ Trip mode for travel budgets across currencies
- [ ] ↩️ Undo delete and a trash bin
- [ ] 🔎 Full-history search across all months
