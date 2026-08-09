# LifeOS — the app

An installable web app for a personal Obsidian vault. Money, fitness, and life,
logged from an iPhone in a few taps and written as plain markdown into your own
private GitHub repo.

No server, no account, no subscription. Hosted free on GitHub Pages.

**Setup lives in one place: `SETUP.md` in the vault repo.** Everything from an empty
machine to a working system, including deploying this app, is there. Don't follow
instructions from anywhere else — there isn't anywhere else.

## Files

| File | What it is |
|---|---|
| `index.html` | The entire app — UI, GitHub client, offline queue, voice parsing, paystub upload |
| `sw.js` | Service worker: offline cache and push handling |
| `manifest.webmanifest` | Makes it installable |
| `icon-*.png` | Home screen icons |

One file, no build step, no bundler, no dependencies. Deploy by pushing to a public
repo with Pages enabled.
