// Orchestrates: optional upload (or use the player's Aigram avatar URL
// directly) + LLM single-call JSON reading + img2img period-portrait render.
//
// The LLM recalls the past life (name / era / trade / death + portrait
// description), then we transform the selfie into a period portrait of it.

import { useCallback, useRef, useState } from 'react';
import { useGenImage, useUpload } from '@shared/runtime';
import { prepareSelfie } from '../utils/selfie';
import {
  PAST_LIFE_SYSTEM,
  buildUserPrompt,
  buildPortraitPrompt,
  parseReading,
} from '../utils/prompts';
import { newSeed, newLifeId, recalledDate } from '../utils/booking';
import type { PastLifeReading, PastLife } from '../types';

const CHAT_URL = 'https://chat.aiwaves.tech/aigram/api/game-chat';

async function chatOnce(system: string, user: string): Promise<string> {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`chat failed: HTTP ${res.status}`);
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return json.choices?.[0]?.message?.content ?? '';
}

export type Stage = '' | 'sourcing' | 'reading' | 'painting' | 'framing';

export type SelfieSource =
  | { kind: 'file'; file: File }
  | { kind: 'avatar-url'; url: string };

interface GenInput {
  source: SelfieSource;
  question?: string;
  recordNumber: string;
}

export interface UsePastLife {
  generate: (input: GenInput) => Promise<PastLife>;
  loading: boolean;
  stage: Stage;
  /** Populated once the LLM call returns (end of `reading`). Lets the
   *  summoning screen show the recalled life while the portrait is still
   *  being painted (`painting`) so the user has something to read. */
  partialReading: PastLifeReading | null;
  /** The selfie URL used as ref. Available from the end of `sourcing`. */
  partialSelfieUrl: string | null;
  error: Error | null;
}

export function usePastLife(): UsePastLife {
  const { generate: genImg } = useGenImage();
  const { upload } = useUpload();

  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>('');
  const [error, setError] = useState<Error | null>(null);
  const [partialReading, setPartialReading] = useState<PastLifeReading | null>(null);
  const [partialSelfieUrl, setPartialSelfieUrl] = useState<string | null>(null);
  const inFlight = useRef(false);

  const generate = useCallback(
    async ({ source, question, recordNumber }: GenInput): Promise<PastLife> => {
      if (inFlight.current) throw new Error('past-life: already in flight');
      inFlight.current = true;
      setLoading(true);
      setError(null);
      setPartialReading(null);
      setPartialSelfieUrl(null);

      try {
        // 1) Source the selfie URL.
        setStage('sourcing');
        const selfieUrl = await sourceSelfieUrl(source, upload);
        setPartialSelfieUrl(selfieUrl);

        // 2) Chat — single call returns JSON.
        setStage('reading');
        const seed = newSeed();
        const userTurn = buildUserPrompt({ question, seed });
        const raw = await chatOnce(PAST_LIFE_SYSTEM, userTurn);
        const reading: PastLifeReading = parseReading(raw);
        setPartialReading(reading);

        // 3) Image — img2img transform with the selfie ref.
        setStage('painting');
        const prompt = buildPortraitPrompt(reading);
        const imageUrl = await genImg({ prompt, ref_url: selfieUrl });

        // 4) Pre-warm + settle.
        await preloadImage(imageUrl);
        setStage('framing');
        await new Promise((r) => setTimeout(r, 380));

        const life: PastLife = {
          id: newLifeId(),
          imageUrl,
          selfieUrl,
          reading,
          recordNumber,
          recalledDate: recalledDate(),
          createdAt: Date.now(),
        };
        return life;
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        inFlight.current = false;
        setLoading(false);
        setStage('');
      }
    },
    [genImg, upload],
  );

  return { generate, loading, stage, partialReading, partialSelfieUrl, error };
}

async function sourceSelfieUrl(
  source: SelfieSource,
  upload: (file: Blob, name?: string) => Promise<{ url: string }>,
): Promise<string> {
  if (source.kind === 'avatar-url') {
    return source.url;
  }
  const prepared = await prepareSelfie(source.file);
  const up = await upload(prepared, 'selfie.jpg');
  return up.url;
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}
