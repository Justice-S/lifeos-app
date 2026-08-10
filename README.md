# LifeOS — the app

An installable web app for a personal Obsidian vault. Money, fitness, and life,
logged from an iPhone in a few taps and written as plain markdown into your own
private GitHub repo.

No server, no account, no subscription. Hosted free on GitHub Pages.

This repo is public because free GitHub Pages hosting requires it — it holds only
code and icons, no personal data. It's one half of a two-repo system; the other
half is a private vault repo holding the actual data, which (being private) isn't
visible from here. **The setup guide, `SETUP.md`, lives in that private vault
repo** — if you've found this page without already having access to it, this app
is the frontend for one person's private data store, not a general-purpose tool
you can point at your own vault by just cloning this.

## Files

| File | What it is |
|---|---|
| `index.html` | The entire app — UI, GitHub client, offline queue, voice parsing, paystub upload |
| `sw.js` | Service worker: offline cache and push handling |
| `manifest.webmanifest` | Makes it installable |
| `icon-*.png` | Home screen icons |

One file, no build step, no bundler, no dependencies. Deploy by pushing to a public
repo with Pages enabled.
