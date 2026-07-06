# Take 5

A lightweight web prototype for **Take 5** — a corporate-themed Sequence-style board game with a dual-interface model:

- **`/tv`** — big-screen board display (room code, players, turn indicator)
- **`/play`** — mobile phone controller (private hand, tap-to-play)

## Stack

- **HTML5 + Tailwind CSS** (CDN) — UI
- **Vanilla JavaScript** — client views + WebSocket sync
- **Node.js + Express + ws** — authoritative server state machine

## Quick start

```bash
cd take5
npm install
node scripts/generate-logos.js   # placeholder brand SVGs
npm start
```

Open:

- TV board: [http://localhost:3456/tv](http://localhost:3456/tv)
- Mobile: [http://localhost:3456/play](http://localhost:3456/play)

## Architecture

```
take5/
├── server/
│   ├── index.js           # HTTP + WebSocket gateway
│   ├── state-machine.js   # Game loop (lobby → playing → game over)
│   ├── validation.js      # Illegal move prevention
│   └── win-check.js       # 5-in-a-row sequence scanner
├── shared/
│   ├── cards.js           # Corporate brand dictionary + 10×10 board
│   └── constants.js
├── public/
│   ├── index.html         # SPA shell
│   ├── js/                # Router, TV view, play view, board render
│   └── assets/logos/      # Generated placeholder SVGs
└── scripts/
    └── generate-logos.js
```

## Game rules (implemented)

| Rule | Detail |
|------|--------|
| Board | 10×10 grid; corners are wild free spaces |
| Teams | Red, Blue, Green (2–3 teams) |
| Win | First team to **2 sequences** (5 chips H/V/diagonal) |
| Hand | 6 cards; play one, draw one |
| Coke (2-eyed Jacks) | Place on any open space |
| Pepsi (1-eyed Jacks) | Remove one opponent chip (not in a completed sequence) |

## WebSocket messages

| Client → Server | Purpose |
|-----------------|--------|
| `create_room` | TV creates a room |
| `subscribe_tv` | TV joins existing room by code |
| `join` | Player joins with name + team |
| `start_game` | Deal hands and begin |
| `select_card` | Highlight valid targets on TV |
| `play_place` / `play_remove` | Execute validated move |

Server broadcasts `state` snapshots (public on TV; includes private hand on `/play`).

## Brand logos

Placeholder dots are replaced with real brand artwork via `node scripts/generate-logos.js`:

1. **Local vendored SVGs** in `scripts/logo-svg/` (Walmart, Chipotle, Costco, T-Mobile, etc.)
2. **[simple-icons](https://simpleicons.org)** (CC0) for McDonald's, Nike, Starbucks, …
3. **Wikimedia Commons** fetches for Subway, Pepsi, Amazon, Microsoft, …

Re-run after adding sources: `npm run generate-logos`

Replace `public/assets/logos/*.svg` with licensed assets for production.
