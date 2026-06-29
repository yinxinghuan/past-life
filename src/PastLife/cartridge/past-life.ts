// ============================================================================
//  cartridge/past-life.ts — canonical Past Life theme.
//  candlelit soul-archive: a medium reads your past life from your face,
//  then paints it in an antique medium.
// ============================================================================

import type { IdentityCartridge } from './types';
import type { Medium, LifeTone } from '../types';

// ─── Media & tones ────────────────────────────────────────────────────────

const MEDIA: Medium[] = [
  'oil-painting', 'daguerreotype', 'tintype', 'fresco',
  'illuminated-manuscript', 'woodblock', 'charcoal-sketch', 'funerary-portrait',
];

const TONES: LifeTone[] = ['tragic', 'absurd', 'noble', 'humble', 'haunted'];

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

// ─── System prompt ────────────────────────────────────────────────────────

const PAST_LIFE_SYSTEM = `
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
  • An OCCUPATION — concrete and often humble or strange.
  • A CAUSE OF DEATH — short, specific, and either quietly sad or darkly
    funny. ("Tripped over your own cat on the stairs and never woke up." /
    "Drowned saving a hat." / "A printing press, a loose sleeve, a Tuesday.")

VARY THE TONE across sitters — sometimes tragic, sometimes absurd, sometimes
noble, sometimes mundane. The randomness is the point. Pick one tone tag.

────────────────────────────────────────────────────────────────────────────
THE PORTRAIT — describe how this life should be PAINTED. The same face, but
dressed and set in that era: their clothing, what they hold, the setting
behind them. Short and concrete.

Pick a MEDIUM that fits the era. Match it sensibly but don't be rigid.

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

// ─── Helpers ──────────────────────────────────────────────────────────────

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + '…';
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

// ─── Cartridge export ─────────────────────────────────────────────────────

export const pastLifeCartridge: IdentityCartridge = {
  id: 'past-life',

  copy: {
    en: {
      sign_title: 'PAST LIFE',
      sign_sub: 'the portrait of who you were before',
      threshold_pitch_top: 'You have been here before.',
      threshold_step_in: 'Sit with the medium',
      threshold_open_since: 'the ledger of souls · since always',
      threshold_recalled_today: '{n} souls recalled here',
      seance_intro: "Don't tell me who you are. Let me see who you were.",
      seance_step_face: 'Show me your face.',
      seance_step_q: 'Anything feel older than it should? (or stay quiet)',
      seance_question: 'Something that feels older than you…',
      seance_use_my_avatar: 'Use my face',
      seance_upload: 'Use a different photo',
      seance_change: 'change',
      seance_cta: 'Recall my past life',
      seance_back: 'Leave',
      summon_sourcing: 'Looking into you',
      summon_reading: 'Finding the life',
      summon_painting: 'Drawing it back',
      summon_framing: 'There you are',
      summon_reading_long: 'The medium has gone quiet. Hold still…',
      summon_record: 'RECORD',
      portrait_record: 'RECORD',
      portrait_recalled: 'RECALLED',
      portrait_lifespan: 'LIFE',
      portrait_medium: 'RENDERED IN',
      portrait_occupation: 'You were',
      portrait_cause: 'You left because',
      portrait_headline: 'They called you',
      portrait_epitaph: 'Your stone reads',
      portrait_meaning: 'The reading',
      portrait_now: 'now',
      portrait_then: 'then',
      portrait_recall_another: 'Recall another',
      portrait_back_to_hall: 'Back to the Hall',
      portrait_open_hall: 'Hall of Past Lives',
      hall_title: 'Hall of Past Lives',
      hall_mine: 'My Past Lives',
      hall_all: 'All Souls',
      hall_empty: 'The hall is quiet. Be the first soul recalled here.',
      hall_back: 'Back',
      notes_title: 'Leave a note',
      notes_placeholder: 'Write a message to the soul who lived this life…',
      notes_send: 'Send',
      notes_empty: 'No notes yet.',
      notes_loading: 'Loading notes…',
      wall_by: 'by',
      wall_you: 'YOU',
      demo_badge: 'DEMO',
      error_title: 'The medium is resting',
      error_body: 'Come back in a moment.',
      error_retry: 'Try again',
    },
  },

  theme: {
    ink: '#1a1410',
    parch: '#f5efe0',
    gold: '#c8a84e',
    oxblood: '#5c1a1a',
    ember: '#d4753a',
    line: '#d9cbb8',
    serif: "'Cormorant Garamond', Georgia, serif",
    sc: "'Cormorant SC', Georgia, serif",
    mono: "'Cormorant Garamond', Georgia, serif",
  },

  prompt: {
    system: PAST_LIFE_SYSTEM,
    buildUserPrompt(opts) {
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
    },
    parseReading(raw) {
      const json = extractJson(raw);
      return {
        name: clean(json.name, 'A Soul Without A Name'),
        year: clean(json.year, '18—'),
        place: clean(json.place, 'a town now gone from the maps'),
        occupation: clean(json.occupation, 'a keeper of small forgotten things'),
        cause_of_death: clean(json.cause_of_death, 'You simply stopped, one grey afternoon.'),
        portrait_description: clean(json.portrait_description, 'plain dark clothing, hands folded, a shadowed room behind'),
        headline: clean(json.headline, 'The One Before This').slice(0, 80),
        epitaph: clean(json.epitaph, 'Here lies one who was here, and then was not.'),
        meaning: clean(json.meaning, 'You have always reached for things you can no longer name. Now you know why.'),
        medium: (MEDIA as string[]).includes(json.medium) ? json.medium as Medium : randomFrom(MEDIA),
        tone: (TONES as string[]).includes(json.tone) ? json.tone as LifeTone : randomFrom(TONES),
      };
    },
    schema: `{
  "name": "string", "year": "string", "place": "string",
  "occupation": "string", "cause_of_death": "string",
  "portrait_description": "string", "medium": "enum", "headline": "string",
  "epitaph": "string", "meaning": "string", "tone": "enum"
}`,
  },

  media: {
    kinds: MEDIA,
    visuals: MEDIUM_VISUAL,
  },

  tones: TONES,

  booking: { prefix: 'MS.', base: 3107 },

  audio: { ambient: 'candle-hum' },

  screens: {
    phases: ['Looking into you', 'Finding the life', 'Drawing it back', 'There you are'],
    title: 'PAST LIFE',
    subtitle: 'the portrait of who you were before',
  },

  heroImage: '/hero.jpg',
};
