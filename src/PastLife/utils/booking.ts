// Archive accession numbering + dates for the ledger of souls.

import type { PastLife } from '../types';

const RECORD_BASE = 3107;

export function recordNumber(prior: number): string {
  const n = RECORD_BASE + prior + 1;
  return `MS. ${String(n).padStart(5, '0')}`;
}

export function recalledDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function newLifeId(): string {
  return 'pl_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

const MAX_PER_USER = 20;

export function prependLife(prior: PastLife[] | undefined, next: PastLife): PastLife[] {
  const arr = prior ? [next, ...prior] : [next];
  return arr.slice(0, MAX_PER_USER);
}

export function newSeed(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
}
