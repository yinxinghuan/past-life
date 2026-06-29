// ============================================================================
//  cartridge/types.ts — IdentityCartridge interface for identity-transformation
//  toys. Engine = shared/ (upload, LLM, img2img, save, wall, guestbook).
//  Cartridge = the world the player steps into (prompts, media, theme, copy).
// ============================================================================

import type { PastLifeReading } from '../types';

export interface CartridgeCopy {
  [locale: string]: Record<string, string>;
}

export interface CartridgeTheme {
  ink: string;
  parch: string;
  gold: string;
  oxblood: string;
  ember: string;
  line: string;
  serif: string;
  sc: string;
  mono: string;
}

export interface CartridgePrompt {
  system: string;
  /** Returns the user prompt for the LLM call */
  buildUserPrompt: (opts: { question?: string; seed: string }) => string;
  /** Parse and validate the raw LLM response into a reading */
  parseReading: (raw: string) => PastLifeReading;
  /** JSON schema string for the LLM system prompt */
  schema: string;
}

export interface CartridgeMedia {
  kinds: string[];
  visuals: Record<string, string>;
}

export interface CartridgeBooking {
  prefix: string;
  base: number;
}

export interface CartridgeAudio {
  ambient: 'candle-hum' | 'digital-drone';
}

export interface CartridgeScreens {
  /** Loading stage labels (4 stages, in order) */
  phases: string[];
  title: string;
  subtitle: string;
}

export interface IdentityCartridge {
  id: string;
  copy: CartridgeCopy;
  theme: CartridgeTheme;
  prompt: CartridgePrompt;
  media: CartridgeMedia;
  tones: string[];
  booking: CartridgeBooking;
  audio: CartridgeAudio;
  screens: CartridgeScreens;
  /** URL to the hero/background image */
  heroImage: string;
}
