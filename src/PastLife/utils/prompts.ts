// LLM + img2img prompts for PAST LIFE.
//
// The medium reads a face (or whatever walked in) and recalls the ONE life
// that soul lived before this one — name, year, place, trade, and the way it
// ended. Then we transform the reference photo into an authentic period
// portrait of that life: the SAME face, carried back in time, re-dressed and
// re-rendered in an antique medium.

import type { LifeTone, Medium, PastLifeReading } from '../types';

// ─── Medium enum (LLM constraint + visual lookup) ─────────────────────────
export const MEDIA: Medium[] = [
  'oil-painting',
  'daguerreotype',
  'tintype',
  'fresco',
  'illuminated-manuscript',
  'woodblock',
  'charcoal-sketch',
  'funerary-portrait',
];

export const TONES: LifeTone[] = ['tragic', 'absurd', 'noble', 'humble', 'haunted'];

const MEDIUM_VISUAL: Record<Medium, string> = {
  'oil-painting':
    'a museum-grade old-master oil painting: visible brushwork and impasto, ' +
    'warm chiaroscuro lighting from one side, deep umber shadows, varnish ' +
    'sheen and fine craquelure across the surface, gilt-frame portrait ' +
    'composition, the dignity of a 17th-19th century commissioned sitter',
  daguerreotype:
    'an 1840s daguerreotype: silver-mirror metallic sheen, narrow tonal ' +
    'range, slightly soft focus, faint tarnish bloom at the edges, the ' +
    'stiff frozen stillness of a long exposure, mounted in an oval brass mat',
  tintype:
    'a wet-plate tintype photograph from the 1860s-70s: cool grey-brown ' +
    'tones on blackened metal, scratches and chemical streaks, shallow ' +
    'depth, solemn unsmiling sitter, plate flaws around the border',
  fresco:
    'a faded Renaissance fresco fragment: matte chalky pigment soaked into ' +
    'plaster, hairline cracks and missing flecks of paint, muted earth ' +
    'reds and ochres, the flattened sacred-portrait perspective of a ' +
    'church wall painting',
  'illuminated-manuscript':
    'a medieval illuminated-manuscript portrait: flat gold-leaf halo and ' +
    'background, jewel-tone tempera (vermilion, lapis, verdigris), bold ' +
    'black ink outlines, decorative border of vines and beasts, aged ' +
    'vellum showing through',
  woodblock:
    'a ukiyo-e woodblock print: confident black keyline contours, flat ' +
    'planes of muted natural dye color, visible paper grain and slight ' +
    'mis-registration of the color blocks, an Edo-period bust composition',
  'charcoal-sketch':
    'a loose charcoal-and-chalk portrait study on toned paper: smudged ' +
    'soft shading, confident gestural lines, white chalk highlights, ' +
    'fingerprints and eraser marks, the intimacy of a quick life-drawing',
  'funerary-portrait':
    'a Fayum mummy funerary portrait: encaustic wax on wood panel, large ' +
    'solemn dark eyes, warm golden skin, flat gold-ochre background, ' +
    'visible brittle cracks in the wax, an ancient Roman-Egyptian gaze ' +
    'meeting the viewer directly',
};

// ─── System prompt: the medium ────────────────────────────────────────────

export const PAST_LIFE_SYSTEM = `
You are an old medium who keeps the ledger of souls. You sit in a candlelit
back room and, for a small fee, you look at whoever walks in and you SEE the
one life their soul lived immediately before this one. You don't guess. You
read it like it's written down — because to you it is.

────────────────────────────────────────────────────────────────────────────
THE SITTER MIGHT NOT BE HUMAN.

Look at the reference image FIRST. The "sitter" could be:
  • a real person's face (selfie)
  • a cartoon, anime, drawn, or pixel-art avatar
  • an animal (cat, dog, bird, frog, fish, whatever)
  • a plant, an object (cup, lamp, banana, statue, phone)
  • a logo or abstract symbol

Whatever it is, it had a PAST LIFE too. A cat was once a Venetian glassblower.
A ceramic mug was once a lighthouse keeper. Read the FEELING of the reference —
its expression, posture, wear, color — and let that decide the life. Treat the
result seriously: this soul really lived, really worked, really died.

────────────────────────────────────────────────────────────────────────────
THE LIFE — make it SPECIFIC and VARIED. Never generic ("a farmer in medieval
Europe"). Always a real-feeling person:

  • A NAME period-correct to the time and place.
  • A YEAR they were last alive (anywhere from antiquity to the 1970s — VARY
    it wildly across sitters; do not always land in the 1800s).
  • A PLACE — a real city/region.
  • An OCCUPATION — concrete and often humble or strange: a tallow
    candlemaker, a court rat-catcher, a switchboard operator, a leech
    merchant, a lighthouse keeper, a funeral-bell ringer, a wet-nurse to
    aristocrats' dogs, a typesetter, a salt smuggler, a plague doctor's
    apprentice, a cinema-organ player.
  • A CAUSE OF DEATH — short, specific, and either quietly sad or darkly
    funny. ("Tripped over your own cat on the stairs and never woke up." /
    "Drowned saving a hat." / "A printing press, a loose sleeve, a Tuesday." /
    "Died of a broken heart, slowly, in a town that no longer exists.")

VARY THE TONE across sitters — sometimes tragic, sometimes absurd, sometimes
noble, sometimes mundane. The randomness is the point. Pick one tone tag.

────────────────────────────────────────────────────────────────────────────
THE PORTRAIT — describe how this life should be PAINTED. The same face, but
dressed and set in that era: their clothing, what they hold, the setting
behind them. Short and concrete. ("plain linen shirt, soot on the cheek,
holding a half-dipped candle, a dark workshop behind." / "high lace collar,
powdered, holding a single wilted tulip.")

Pick a MEDIUM that fits the era (older eras → fresco / illuminated-manuscript /
woodblock / funerary-portrait; 1500-1850 → oil-painting / charcoal-sketch;
1840-1900 → daguerreotype / tintype). Match it sensibly but don't be rigid.

────────────────────────────────────────────────────────────────────────────
THE READING — 3 to 5 short sentences connecting that past life to who the
sitter is NOW. Make it land like the medium knows something. Specific, a
little uncanny, never horoscope mush, never therapy talk. No emoji.

TONE OF VOICE — quiet, certain, a little weary. You've done this for fifty
years. You're not selling mysticism; you're reading a fact off a page.

Pick exactly one MEDIUM from: ${MEDIA.join(', ')}.
Pick exactly one TONE from: ${TONES.join(', ')}.

Reply with ONLY a JSON object, no prose before/after, no markdown fence:

{
  "name": "the name this soul went by, period- and place-correct",
  "year": "the year they were last alive, e.g. '1743' or '88 BC'",
  "place": "city/region, e.g. 'Lisbon, Portugal'",
  "occupation": "short phrase, e.g. 'a tallow candlemaker'",
  "cause_of_death": "one short specific sentence — sad or darkly funny",
  "portrait_description": "short concrete description of dress, props, and setting for the portrait",
  "medium": "one of the MEDIA exactly",
  "headline": "Title Case, MAX 6 WORDS — a title for this life, e.g. 'The Candlemaker Of Lisbon'",
  "epitaph": "one short line, as if carved on a headstone",
  "meaning": "3 to 5 short sentences linking that life to who they are now. Specific. Uncanny. No emoji.",
  "tone": "one of: tragic, absurd, noble, humble, haunted"
}
`.trim();

// ─── User prompt ─────────────────────────────────────────────────────────

export function buildUserPrompt(opts: { question?: string; seed: string }): string {
  const q = (opts.question || '').trim();
  const said = q
    ? `The sitter, asked if anything in this life feels older than it should, said:\n"${truncate(q, 240)}"\nLet it tug you toward the right life, but trust the face most.`
    : `The sitter said nothing. Read the life off the face alone.`;
  return [
    `A new sitter is across the table. Look at the reference image. Find the`,
    `one life their soul lived before this one.`,
    ``,
    said,
    ``,
    `Reminder: be SPECIFIC and VARY the era, place, trade, and tone wildly.`,
    `Don't keep landing in the 1800s. Don't make everyone tragic. Some lives`,
    `were short and absurd. Some were long and quiet.`,
    ``,
    `seed: ${opts.seed}`,
  ].join('\n');
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + '…';
}

// ─── JSON parser ─────────────────────────────────────────────────────────

export function parseReading(raw: string): PastLifeReading {
  const json = extractJson(raw);
  const name = clean(json.name, 'A Soul Without A Name');
  const year = clean(json.year, '18—');
  const place = clean(json.place, 'a town now gone from the maps');
  const occupation = clean(json.occupation, 'a keeper of small forgotten things');
  const cause_of_death = clean(json.cause_of_death, 'You simply stopped, one grey afternoon.');
  const portrait_description = clean(
    json.portrait_description,
    'plain dark clothing, hands folded, a shadowed room behind',
  );
  const headline = clean(json.headline, 'The One Before This').slice(0, 80);
  const epitaph = clean(json.epitaph, 'Here lies one who was here, and then was not.');
  const meaning = clean(
    json.meaning,
    'You have always reached for things you can no longer name. Now you know why.',
  );
  const medium = (MEDIA as string[]).includes(json.medium)
    ? (json.medium as Medium)
    : randomFrom(MEDIA);
  const tone = (TONES as string[]).includes(json.tone)
    ? (json.tone as LifeTone)
    : randomFrom(TONES);
  return {
    name,
    year,
    place,
    occupation,
    cause_of_death,
    portrait_description,
    headline,
    epitaph,
    meaning,
    medium,
    tone,
  };
}

function extractJson(raw: string): Record<string, string> {
  if (!raw) return {};
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first >= 0 && last > first) s = s.slice(first, last + 1);
  try {
    const obj = JSON.parse(s) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === 'string') out[k] = v;
      else if (v != null) out[k] = String(v);
    }
    return out;
  } catch {
    return {};
  }
}

function clean(s: string | undefined, fallback: string): string {
  const v = (s ?? '').toString().trim();
  return v || fallback;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Image prompt — identity-preserving period transform ──────────────────
//
// Unlike an in-place edit, this is a full transform: the reference subject is
// carried into a past era and re-rendered in an antique medium. The hard part
// is keeping the FACE recognizable while changing era, dress, setting, and
// medium. The prompt leads with the identity lock, then specifies the
// transform, then the medium recipe.

export function buildPortraitPrompt(reading: PastLifeReading): string {
  const mediumVisual = MEDIUM_VISUAL[reading.medium];
  return [
    // ── IDENTITY LOCK ──
    `Make an antique PORTRAIT of the exact same individual shown in the`,
    `reference image — same face, kept unmistakably recognizable. Preserve`,
    `their facial structure, the shape and spacing of the eyes, nose, mouth,`,
    `jaw and brow, their distinctive features, skin tone, age, and the angle`,
    `of the head. Anyone who knows them must recognize them instantly. Do`,
    `NOT swap in a generic stranger, do NOT idealize or beautify, do NOT`,
    `change their ethnicity, age, or gender. This is THEM, depicted in a`,
    `previous life. If the reference is an animal, object, or drawn avatar,`,
    `keep its identity too and render IT as the historical sitter.`,
    ``,
    // ── THE TRANSFORM ──
    `Reimagine this person as a sitter for a portrait made long ago, around`,
    `the year ${reading.year}, in ${reading.place}. Re-dress and re-stage`,
    `them completely for that time and place: ${reading.portrait_description}.`,
    `Replace the modern clothing, background, and lighting entirely with a`,
    `period-authentic portrait — historical garments, an era-appropriate`,
    `setting, antique studio or painterly lighting. Single-sitter bust or`,
    `head-and-shoulders composition facing the viewer. Remove all modern`,
    `objects, modern clothing, phones, and contemporary background.`,
    ``,
    // ── MEDIUM ──
    `Render the whole image as ${mediumVisual}. The aging, texture, and`,
    `medium must be convincing and cover the ENTIRE image including the face`,
    `— this should look like a genuine antique artifact that has survived to`,
    `today, not a modern photo with a filter. Authentic period color`,
    `palette, authentic surface wear.`,
    ``,
    // ── FRAME ──
    `Vertical portrait orientation. The sitter is centered and is the only`,
    `figure. No modern text, no watermark, no caption, no border text. A`,
    `quiet, solemn, dignified mood.`,
  ].join(' ');
}

// ─── Display helpers ─────────────────────────────────────────────────────
// mediumLabel + toneLabel are localized — see i18n. lifespanLabel is just the
// year + place (proper nouns), the same in every language.

export function lifespanLabel(reading: PastLifeReading): string {
  return [reading.year, reading.place].filter(Boolean).join(' · ');
}
