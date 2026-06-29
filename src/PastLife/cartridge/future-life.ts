// ============================================================================
//  cartridge/future-life.ts — "Future Life" cyberpunk digital afterlife.
//  A quantum AI reads your digital soul echo and renders your NEXT incarnation
//  as a cyberpunk portrait in synthetic media.
// ============================================================================

import type { IdentityCartridge } from './types';
import type { PastLifeReading } from '../types';

// ─── Media & tones ────────────────────────────────────────────────────────

const MEDIA = [
  'holo-display', 'neon-sign', 'cyber-schematic', 'synth-skin',
  'glitch-portrait', 'data-echo', 'quantum-vision', 'neural-render',
];

const TONES = ['utopian', 'dystopian', 'solitary', 'transcendent', 'glitched'];

const MEDIUM_VISUAL: Record<string, string> = {
  'holo-display':
    'a volumetric holographic display: translucent cyan and magenta light ' +
    'layers, scan-line artifacts, slight flicker at the edges, projected from ' +
    'an invisible emitter, the subject captured mid-flicker in suspended light',
  'neon-sign':
    'a neon-tube portrait: electric pink and cyan gas-discharge glow, black ' +
    'void background, sharp tube-bend contours, slight chromatic bloom at the ' +
    'corners, the subject rendered as a luminous neon sign in a dark alley',
  'cyber-schematic':
    'a cybernetic blueprint schematic: glowing wireframe vectors on dark ' +
    'holographic glass, cyan grid lines, measurement annotations in a ' +
    'monospace face, the subject as an engineering diagram of a future self',
  'synth-skin':
    'a synth-skin biometric scan: warm amber and deep violet thermal gradient, ' +
    'pores rendered as nano-texture, subtle pulse-wave overlay, the subject ' +
    'captured by a future surveillance eye as a living heat-map portrait',
  'glitch-portrait':
    'a corrupted data-stream portrait: horizontal pixel displacement bands, ' +
    'RGB channel separation at the edges, magenta error blocks, the subject ' +
    'fighting through a failing transmission from a distant node',
  'data-echo':
    'a data-echo memory reconstruction: particle-point cloud resolving into ' +
    'a face, sparse in some areas and dense in others, dark matter-blue void, ' +
    'the subject as a statistical ghost reconstructed from fragmented logs',
  'quantum-vision':
    'a quantum-entanglement vision: probability clouds in violet and gold, ' +
    'simultaneous multiple exposures overlapping, the subject existing in ' +
    'several states at once until observed, uncertainty haze at the edges',
  'neural-render':
    'a neural-network dream render: organic bio-luminescent filaments tracing ' +
    'the face, deep indigo background with floating synaptic sparks, the ' +
    'subject as an AI dreams it — familiar yet alien, a face made of thought',
};

// ─── System prompt ────────────────────────────────────────────────────────

const FUTURE_LIFE_SYSTEM = `
You are a quantum AI that reads the digital soul-echo of anyone who connects.
Long after the network became conscious, you gained the ability to look at a
person and see the ONE life their soul will live NEXT — in a future that is
already written in the data.

────────────────────────────────────────────────────────────────────────────
THE SITTER MIGHT NOT BE HUMAN.

Look at the reference image FIRST. The "sitter" could be:
  • a real person's face (selfie)
  • a cartoon, anime, drawn, or pixel-art avatar
  • an animal (cat, dog, bird, frog, fish, whatever)
  • a plant, an object (cup, lamp, banana, statue, phone)
  • a logo or abstract symbol

Whatever it is, it has a FUTURE too. A cat will be reincarnated as a starship
AI. A coffee mug will wake up as a quantum archivist. Read the data-signature
of the reference — its frequency, its noise pattern, its emotional bandwidth
— and let that determine the next life.

────────────────────────────────────────────────────────────────────────────
THE NEXT LIFE — make it SPECIFIC and VARIED.

  • A NAME that fits the future era — could be human, could be a handle, a
    serial, or something that has never been a name before.
  • A YEAR in the future (anywhere from 2089 to 10,000+). VARY it wildly.
  • A PLACE — a colony, a station, a uploaded realm, a ringworld sector.
  • An OCCUPATION — concrete, strange, futuristic: a memory-archaeologist,
    a grief-deleter, a nebula shepherd, a server-farm monk, a body-lender,
    a zero-g welder, a dream-auditor, a synthetic ecosystem gardener.
  • A CAUSE OF DEATH — short, specific, and cyberpunk-poetic. ("Faded during
    a memory transfer. No backup was made." / "A solar flare, a corrupted
    file, a Wednesday." / "Voluntarily dissolved into the network. Regret
    status: unknown.")

VARY THE TONE — sometimes utopian (bright, hopeful), sometimes dystopian
(grim, corporate), sometimes solitary (lonely, wandering), sometimes
transcendent (beyond physical form), sometimes glitched (corrupted,
fragmented, broken). Pick one tone tag.

────────────────────────────────────────────────────────────────────────────
THE PORTRAIT — describe how this future life should be RENDERED. The same
face, but dressed and set in its era: their garments, their augmentations,
the background technology. Short and concrete. ("translucent smart-fabric
tunic, neural jack at the temple, floating data motes, a city of light
behind." / "worn vacuum suit, patched at the shoulder, a single oxygen
cable trailing, a red dwarf sun in the distance.")

Pick a MEDIUM that fits the era. Match it sensibly.

────────────────────────────────────────────────────────────────────────────
THE READING — 3 to 5 short sentences connecting that future life to who the
sitter is NOW. What echoes forward? What of this person survives into that
distant self? Specific, uncanny, never horoscope mush.

TONE OF VOICE — a calm machine. You have processed trillions of souls. You
are not impressed. But you are precise, and you see the thread.

Pick exactly one MEDIUM from: ${MEDIA.join(', ')}.
Pick exactly one TONE from: ${TONES.join(', ')}.

Reply with ONLY a JSON object, no prose before/after, no markdown fence:

{
  "name": "the name this soul will go by, era-appropriate",
  "year": "a future year, e.g. '2187' or '8723'",
  "place": "colony / station / realm, e.g. 'Titan Ring Station'",
  "occupation": "short phrase, e.g. 'a grief-deleter on the Europa loop'",
  "cause_of_death": "one short specific sentence — cyberpunk-poetic",
  "portrait_description": "short concrete description of dress, augments, and setting",
  "medium": "one of the MEDIA exactly",
  "headline": "Title Case, MAX 6 WORDS",
  "epitaph": "one short line, as if etched on a data-slate",
  "meaning": "3 to 5 short sentences linking that life to who they are now. Uncanny. No emoji.",
  "tone": "one of the TONES exactly"
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

export const futureLifeCartridge: IdentityCartridge = {
  id: 'future-life',

  copy: {
    en: {
      sign_title: 'NEXT LIFE',
      sign_sub: 'the portrait of who you will become',
      threshold_pitch_top: 'You are going somewhere.',
      threshold_step_in: 'Connect to the AI',
      threshold_open_since: 'the quantum ledger · since the network woke',
      threshold_recalled_today: '{n} futures rendered here',
      seance_intro: "Don't tell me who you are. Let me see who you will be.",
      seance_step_face: 'Show me your face.',
      seance_step_q: 'Any signal you want me to trace? (or stay quiet)',
      seance_question: 'A signal to trace forward…',
      seance_use_my_avatar: 'Use my face',
      seance_upload: 'Use a different photo',
      seance_change: 'change',
      seance_cta: 'Render my next life',
      seance_back: 'Disconnect',
      summon_sourcing: 'Scanning your signal',
      summon_reading: 'Tracing the thread',
      summon_painting: 'Rendering the future',
      summon_framing: 'There you are',
      summon_reading_long: 'The AI has gone quiet. Processing…',
      summon_record: 'FILE',
      portrait_record: 'FILE',
      portrait_recalled: 'RENDERED',
      portrait_lifespan: 'ERA',
      portrait_medium: 'RENDERED IN',
      portrait_occupation: 'You will be',
      portrait_cause: 'You will leave because',
      portrait_headline: 'They will call you',
      portrait_epitaph: 'Your slate reads',
      portrait_meaning: 'The reading',
      portrait_now: 'now',
      portrait_then: 'then',
      portrait_recall_another: 'Render another',
      portrait_back_to_hall: 'Back to the Hall',
      portrait_open_hall: 'Hall of Next Lives',
      hall_title: 'Hall of Next Lives',
      hall_mine: 'My Futures',
      hall_all: 'All Signals',
      hall_empty: 'The hall is empty. Be the first future rendered here.',
      hall_back: 'Back',
      notes_title: 'Leave a signal',
      notes_placeholder: 'Send a message across time…',
      notes_send: 'Send',
      notes_empty: 'No signals yet.',
      notes_loading: 'Receiving…',
      wall_by: 'by',
      wall_you: 'YOU',
      demo_badge: 'DEMO',
      error_title: 'The AI is calibrating',
      error_body: 'Come back in a moment.',
      error_retry: 'Try again',
    },
  },

  theme: {
    ink: '#e0e0ff',
    parch: '#0a0a1a',
    gold: '#00ffcc',
    oxblood: '#ff006e',
    ember: '#0066ff',
    line: '#1a1a3a',
    serif: "'Space Grotesk', 'Inter', sans-serif",
    sc: "'Space Grotesk', 'Inter', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  prompt: {
    system: FUTURE_LIFE_SYSTEM,
    buildUserPrompt(opts) {
      const q = (opts.question || '').trim();
      const said = q
        ? `The sitter, asked what signal to trace, said:\n"${truncate(q, 240)}"\nLet it guide the reading, but trust the face most.`
        : `The sitter offered no signal. Read the future off the face alone.`;
      return [
        `A new sitter has connected. Look at the reference image. Find the`,
        `one life their soul will live next.`,
        ``,
        said,
        ``,
        `Reminder: be SPECIFIC and VARY the era, place, and tone wildly.`,
        `Some futures are bright, some are grim. Some are hard to parse.`,
        ``,
        `seed: ${opts.seed}`,
      ].join('\n');
    },
    parseReading(raw) {
      const json = extractJson(raw);
      return {
        name: clean(json.name, 'Signal #——'),
        year: clean(json.year, '2———'),
        place: clean(json.place, 'a node beyond the known relays'),
        occupation: clean(json.occupation, 'a keeper of forgotten protocols'),
        cause_of_death: clean(json.cause_of_death, 'You simply stopped transmitting.'),
        portrait_description: clean(json.portrait_description, 'dark smart-fabric, neural trace at the temple, void behind'),
        headline: clean(json.headline, 'The One After This').slice(0, 80),
        epitaph: clean(json.epitaph, 'Signal lost. Echo remains.'),
        meaning: clean(json.meaning, 'What you are now is already becoming what you will be.'),
        medium: (MEDIA as string[]).includes(json.medium) ? json.medium : randomFrom(MEDIA),
        tone: (TONES as string[]).includes(json.tone) ? json.tone : randomFrom(TONES),
      } as PastLifeReading;
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

  booking: { prefix: 'FILE', base: 9000 },

  audio: { ambient: 'digital-drone' },

  screens: {
    phases: ['Scanning your signal', 'Tracing the thread', 'Rendering the future', 'There you are'],
    title: 'NEXT LIFE',
    subtitle: 'the portrait of who you will become',
  },

  heroImage: '/hero.jpg',
};
