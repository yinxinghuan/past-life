// ─── Domain types ────────────────────────────────────────────────────────

import type { GuestMessage } from '@shared/social/guestbook';

/** The medium your past-life portrait was rendered in. The LLM picks one to
 *  fit the era it lands on; it drives the image-prompt visual recipe. */
export type Medium =
  | 'oil-painting'
  | 'daguerreotype'
  | 'tintype'
  | 'fresco'
  | 'illuminated-manuscript'
  | 'woodblock'
  | 'charcoal-sketch'
  | 'funerary-portrait';

/** The mood of the life that surfaced. Drives the accent chip + a small
 *  iconographic flourish. */
export type LifeTone = 'tragic' | 'absurd' | 'noble' | 'humble' | 'haunted';

export interface PastLifeReading {
  /** The name you went by, e.g. "Tomás Avelar". */
  name: string;
  /** The year you were last alive, e.g. "1743". Free-form string. */
  year: string;
  /** Where you lived/died, e.g. "Lisbon, Portugal". */
  place: string;
  /** What you did, e.g. "a tallow candlemaker". */
  occupation: string;
  /** How you died — short, specific, darkly funny or quietly sad. */
  cause_of_death: string;
  /** Short evocative title for this life, Title Case, ≤6 words. */
  headline: string;
  /** One-line gravestone inscription. */
  epitaph: string;
  /** 3-5 sentences tying that life to who you are now. */
  meaning: string;
  /** Short visual description used downstream in the portrait image prompt
   *  (dress, setting, what you're holding). */
  portrait_description: string;
  medium: Medium;
  tone: LifeTone;
}

export interface PastLife {
  id: string;
  /** The generated past-life portrait. */
  imageUrl: string;
  /** The reference selfie (the "now" face for the before/after swap). */
  selfieUrl: string;
  reading: PastLifeReading;
  /** Archive accession number, e.g. "MS. 03142". */
  recordNumber: string;
  recalledDate: string;
  createdAt: number;
}

export interface PastLifeSave {
  lives: PastLife[];
  /** Guestbook notes this user has left on others' (or own) portraits. Stored
   *  in the sender's own blob; aggregated cross-user at read time. */
  messages?: GuestMessage[];
  _lastActive?: number;
}

export interface WallEntry {
  userId: string;
  userName?: string;
  userAvatarUrl?: string;
  life: PastLife;
}

export type Phase = 'threshold' | 'seance' | 'summoning' | 'portrait' | 'hall';
