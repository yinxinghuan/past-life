import { useEffect, useState } from 'react';
import { t } from '../i18n';
import { startBuzz, stopBuzz } from '../utils/audio';
import type { Stage } from '../hooks/usePastLife';
import type { PastLifeReading } from '../types';

interface Props {
  stage: Stage;
  recordNumber: string;
  /** LLM reading — available from the end of `reading` onward. While null,
   *  we show a holding line. Once present, we stream the life's facts +
   *  meaning so the user has something to read during the long paint wait. */
  reading: PastLifeReading | null;
  /** Selfie ref URL — the face being drawn back into the past. */
  selfieUrl: string | null;
}

const STAGE_KEY: Record<Stage, string> = {
  '': 'summon_sourcing',
  sourcing: 'summon_sourcing',
  reading: 'summon_reading',
  painting: 'summon_painting',
  framing: 'summon_framing',
};

const STAGE_STEP: Record<Stage, number> = {
  '': 0,
  sourcing: 0,
  reading: 1,
  painting: 2,
  framing: 3,
};
const TOTAL_STEPS = 4;

export default function SummoningScreen({ stage, recordNumber, reading, selfieUrl }: Props) {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 420);
    return () => clearInterval(id);
  }, []);

  // Low summoning drone for the whole phase except 'framing' (the sudden
  // hush underscores the "There you are" beat).
  useEffect(() => {
    startBuzz();
    return () => stopBuzz();
  }, []);
  useEffect(() => {
    if (stage === 'framing') stopBuzz();
  }, [stage]);

  // Stream the meaning as a typewriter once the reading resolves.
  const [typed, setTyped] = useState('');
  useEffect(() => {
    if (!reading) {
      setTyped('');
      return;
    }
    let i = 0;
    setTyped('');
    const id = setInterval(() => {
      i++;
      setTyped(reading.meaning.slice(0, i));
      if (i >= reading.meaning.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [reading]);

  const key = STAGE_KEY[stage] || 'summon_sourcing';
  const step = STAGE_STEP[stage] ?? 0;
  const fillPct = ((step + 0.5) / TOTAL_STEPS) * 100;
  const aging = step >= 2; // during/after painting, the oval ages over

  return (
    <div className="pl-summon">
      <div className="pl-summon__candle" aria-hidden />

      <div className="pl-summon__stage-label">
        {t(key)}
        {dots}
      </div>

      {/* The scrying oval — the selfie sits inside a gilt oval frame; as the
          life is "drawn back," a sepia veil + craquelure wash creeps over it
          and embers rise. */}
      <div className="pl-summon__oval-stage">
        <div className={'pl-summon__oval ' + (aging ? 'pl-summon__oval--aging' : '')}>
          {selfieUrl ? (
            <img src={selfieUrl} alt="" className="pl-summon__face" />
          ) : (
            <div className="pl-summon__face pl-summon__face--default" />
          )}
          <div className="pl-summon__veil" aria-hidden />
          <div className="pl-summon__embers" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="pl-summon__ember"
                style={{
                  left: `${8 + (i * 37) % 84}%`,
                  animationDelay: `${(i * 0.31) % 4}s`,
                }}
              />
            ))}
          </div>
          {reading && (
            <div className="pl-summon__year-tag">{reading.year}</div>
          )}
        </div>
      </div>

      {/* Reading panel — fills the wait. Name + lifespan, then the meaning. */}
      <div className="pl-summon__panel">
        {reading ? (
          <>
            <div className="pl-summon__name">{reading.name}</div>
            <div className="pl-summon__sub">
              {reading.place} · {reading.occupation}
            </div>
            <div className="pl-summon__meaning">{typed || ' '}</div>
          </>
        ) : (
          <div className="pl-summon__pretext">{t('summon_reading_long')}</div>
        )}
      </div>

      <div className="pl-summon__footer">
        <div
          className="pl-summon__progress"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
        >
          <div className="pl-summon__progress-fill" style={{ width: `${fillPct}%` }} />
        </div>
        <div className="pl-summon__record">
          {t('summon_record')} <strong>{recordNumber}</strong>
          <span className="pl-summon__step">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>
      </div>
    </div>
  );
}
