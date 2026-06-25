# Past Life — Dev Notes

React + TypeScript + Less + Vite. Forked from `ink-of-fate` (same social/wall/
guestbook/notify skeleton). Theme: candlelit soul-archive. English is the
product face; zh is opt-in fallback only.

- CSS prefix: `.pl-`
- Game flow: threshold → seance → summoning → portrait → hall
- selfie → LLM recalls a past life (name/era/trade/death) → img2img transforms
  the selfie into a period portrait of that life → before/after (now ↔ then).
- `meta.json` + UUID via `scripts/sync-game-ids.py` required before publish.
- Build must pass `npm run build`. Assets relative `./`. ref_url must be a
  public absolute URL.
