// LLM + img2img prompts — re-exported from the active cartridge.
// The cartridge owns the world (prompts, media, tones, copy); this file is
// the thin binding layer between the engine and the cartridge's config.
// ============================================================================

import type { PastLifeReading } from '../types';
import { CARTRIDGE } from '../cartridge/index';

// ─── Re-export cartridge values (backward-compatible with existing imports) ──

export const PAST_LIFE_SYSTEM = CARTRIDGE.prompt.system;
export const buildUserPrompt = CARTRIDGE.prompt.buildUserPrompt;
export const parseReading = CARTRIDGE.prompt.parseReading;
export const MEDIA = CARTRIDGE.media.kinds;
export const MEDIUM_VISUAL = CARTRIDGE.media.visuals;
export const TONES = CARTRIDGE.tones;

// ─── Image prompt — identity-preserving period transform ──────────────────

export function buildPortraitPrompt(reading: PastLifeReading): string {
  const mediumVisual = CARTRIDGE.media.visuals[reading.medium];
  return [
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
    `Reimagine this person as a sitter for a portrait made long ago, around`,
    `the year ${reading.year}, in ${reading.place}. Re-dress and re-stage`,
    `them completely for that time and place: ${reading.portrait_description}.`,
    `Replace the modern clothing, background, and lighting entirely with a`,
    `period-authentic portrait — historical garments, an era-appropriate`,
    `setting, antique studio or painterly lighting. Single-sitter bust or`,
    `head-and-shoulders composition facing the viewer. Remove all modern`,
    `objects, modern clothing, phones, and contemporary background.`,
    ``,
    `Render the whole image as ${mediumVisual}. The aging, texture, and`,
    `medium must be convincing and cover the ENTIRE image including the face`,
    `— this should look like a genuine antique artifact that has survived to`,
    `today, not a modern photo with a filter. Authentic period color`,
    `palette, authentic surface wear.`,
    ``,
    `Vertical portrait orientation. The sitter is centered and is the only`,
    `figure. No modern text, no watermark, no caption, no border text. A`,
    `quiet, solemn, dignified mood.`,
  ].join(' ');
}

// ─── Display helpers ──────────────────────────────────────────────────────

export function lifespanLabel(reading: PastLifeReading): string {
  return [reading.year, reading.place].filter(Boolean).join(' · ');
}
