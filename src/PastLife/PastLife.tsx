import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameSave } from '@shared/save';
import { isInAigram, telegramId, useGameEvent } from '@shared/runtime';
import {
  appendMessage,
  guestbookNotifyConfig,
  newMessage,
} from '@shared/social/guestbook';
import ThresholdScreen from './components/ThresholdScreen';
import SeanceScreen from './components/SeanceScreen';
import SummoningScreen from './components/SummoningScreen';
import PortraitScreen from './components/PortraitScreen';
import HallWall from './components/HallWall';
import { usePastLife, type SelfieSource } from './hooks/usePastLife';
import { useGallery } from './hooks/useGallery';
import { usePlayerProfile } from './hooks/usePlayerProfile';
import { prependLife, recordNumber as makeRecord } from './utils/booking';
import { startAmbient, stopAmbient, playClick } from './utils/audio';
import { t } from './i18n';
import type { PastLifeSave, Phase, PastLife as PastLifeT, WallEntry } from './types';
import './PastLife.less';

const DEMO_PHOTO = import.meta.env.BASE_URL + 'demo_portrait.jpg';

const DEMO_LIFE: PastLifeT = {
  id: 'demo',
  imageUrl: DEMO_PHOTO,
  selfieUrl: DEMO_PHOTO,
  reading: {
    name: 'Tomás Avelar',
    year: '1743',
    place: 'Lisbon, Portugal',
    occupation: 'a tallow candlemaker',
    cause_of_death: 'Tripped over your own cat on the workshop stairs and never woke up.',
    portrait_description:
      'plain linen shirt, soot on one cheek, holding a half-dipped candle, a dark workshop behind',
    headline: 'The Candlemaker Of Lisbon',
    epitaph: 'He kept the dark away for others, and walked into it himself.',
    meaning:
      "You have always needed a little light left on. You give warmth away faster than you can make it, " +
      "and you are clumsiest exactly when you are most tired. The smell of something burning still " +
      "makes you feel, strangely, at home. You were good at a small quiet trade, and you still are.",
    medium: 'oil-painting',
    tone: 'humble',
  },
  recordNumber: 'MS. 03142',
  recalledDate: '2026-06-26',
  createdAt: Date.now(),
};

const DEMO_WALL: Array<{ name: string; l: PastLifeT }> = [
  { name: 'Algram', l: { ...DEMO_LIFE, id: 'a', recordNumber: 'MS. 03141', reading: { ...DEMO_LIFE.reading, headline: 'The Lighthouse Keeper', year: '1881', place: 'Hokkaido, Japan', medium: 'tintype' } } },
  { name: 'Jenny',  l: { ...DEMO_LIFE, id: 'b', recordNumber: 'MS. 03140', reading: { ...DEMO_LIFE.reading, headline: 'The Court Rat-Catcher', year: '1612', place: 'Prague', medium: 'oil-painting' } } },
  { name: 'JM·F',   l: { ...DEMO_LIFE, id: 'c', recordNumber: 'MS. 03139', reading: { ...DEMO_LIFE.reading, headline: 'The Salt Smuggler', year: '1788', place: 'Marseille', medium: 'charcoal-sketch' } } },
  { name: 'Isaya',  l: { ...DEMO_LIFE, id: 'd', recordNumber: 'MS. 03138', reading: { ...DEMO_LIFE.reading, headline: 'A Scribe Of Constantinople', year: '1140', place: 'Constantinople', medium: 'illuminated-manuscript' } } },
  { name: 'Isabel', l: { ...DEMO_LIFE, id: 'e', recordNumber: 'MS. 03137', reading: { ...DEMO_LIFE.reading, headline: 'The Switchboard Girl', year: '1939', place: 'Chicago', medium: 'daguerreotype' } } },
  { name: 'ghostpixel', l: { ...DEMO_LIFE, id: 'f', recordNumber: 'MS. 03136', reading: { ...DEMO_LIFE.reading, headline: 'A Weaver Of Cuzco', year: '1520', place: 'Cuzco', medium: 'fresco' } } },
];

export default function PastLife() {
  const demo = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('demo');
  }, []);

  const profile = usePlayerProfile();
  const { savedData, persist } = useGameSave<PastLifeSave>('past-life');
  const lifeGen = usePastLife();
  const gallery = useGallery();
  const gameEvent = useGameEvent();
  const notifiedRef = useRef<Set<string>>(new Set());

  const [phase, setPhase] = useState<Phase>('threshold');
  const [current, setCurrent] = useState<PastLifeT | null>(null);
  const [pendingRecord, setPendingRecord] = useState<string | null>(null);
  const [shareLabel, setShareLabel] = useState('');
  const [errorLabel, setErrorLabel] = useState('');
  const [hasFirstTouched, setHasFirstTouched] = useState(false);
  const [cameFromWall, setCameFromWall] = useState(false);
  const [authorOfCurrent, setAuthorOfCurrent] = useState<
    { userId: string; userName?: string; userAvatarUrl?: string } | undefined
  >();

  // Local mirror of the save — useGameSave.savedData does NOT update after
  // persist(). Seed ONCE from savedData, then treat mirror as source of truth.
  const [mirror, setMirror] = useState<PastLifeSave | undefined>(undefined);
  useEffect(() => {
    if (mirror === undefined && savedData !== undefined) {
      setMirror(savedData ?? { lives: [] });
    }
  }, [savedData, mirror]);

  // ─── Demo overrides ──────────────────────────────────────────
  useEffect(() => {
    if (!demo) return;
    if (demo === 'threshold') setPhase('threshold');
    else if (demo === 'seance') setPhase('seance');
    else if (demo === 'summoning' || demo === 'loading') {
      setPendingRecord('MS. 03142');
      setPhase('summoning');
    } else if (demo === 'result' || demo === 'poster') {
      setCurrent(DEMO_LIFE);
      setPhase('portrait');
    } else if (demo === 'wall') {
      setPhase('hall');
    }
  }, [demo]);

  // First-touch unlock
  const firstTouchRef = useRef(false);
  useEffect(() => {
    function onPointer() {
      if (firstTouchRef.current) return;
      firstTouchRef.current = true;
      setHasFirstTouched(true);
      startAmbient();
    }
    window.addEventListener('pointerdown', onPointer, { once: true });
    return () => window.removeEventListener('pointerdown', onPointer);
  }, []);

  useEffect(() => {
    if (phase === 'summoning' || phase === 'portrait') {
      stopAmbient();
    } else if (hasFirstTouched) {
      startAmbient();
    }
  }, [phase, hasFirstTouched]);

  // ─── Global tap feedback ──
  useEffect(() => {
    function onTap(e: Event) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const hit = target.closest('button, [role="button"], a[href], label.pl-cta');
      if (!hit) return;
      if (hit.closest('[data-no-feedback]')) return;
      playClick();
    }
    document.addEventListener('pointerdown', onTap, true);
    return () => document.removeEventListener('pointerdown', onTap, true);
  }, []);

  const ownLives: PastLifeT[] = mirror?.lives ?? [];
  const recalledCount = ownLives.length;

  const handleStepIn = () => {
    setErrorLabel('');
    setPhase('seance');
  };
  const handleBackFromSeance = () => setPhase('threshold');

  const handleSubmit = async (source: SelfieSource, question: string) => {
    const record = makeRecord(recalledCount);
    setPendingRecord(record);
    setErrorLabel('');
    setPhase('summoning');
    try {
      const life = await lifeGen.generate({ source, question, recordNumber: record });
      setCurrent(life);
      setAuthorOfCurrent(undefined);
      setPhase('portrait');
      // Write to local mirror first (source of truth), then persist().
      // Full read-modify-write so existing guestbook `messages` survive.
      const nextSave: PastLifeSave = {
        ...(mirror ?? { lives: [] }),
        lives: prependLife(mirror?.lives, life),
      };
      setMirror(nextSave);
      persist(nextSave);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorLabel(`${t('err_processing')} (${msg.slice(0, 100)})`);
      setPhase('seance');
    } finally {
      setPendingRecord(null);
    }
  };

  const handleNew = () => {
    setShareLabel('');
    setCameFromWall(false);
    setPhase('seance');
  };
  const handleWall = () => {
    gallery.refresh();
    setPhase('hall');
  };
  const handleBackFromWall = () => {
    setPhase(current ? 'portrait' : 'threshold');
  };
  const handleViewFromWall = (entry: WallEntry) => {
    setCurrent(entry.life);
    setAuthorOfCurrent({
      userId: entry.userId,
      userName: entry.userName,
      userAvatarUrl: entry.userAvatarUrl,
    });
    setCameFromWall(true);
    setPhase('portrait');
  };

  // Leave a guestbook note on a life. Stores in MY own blob (read-modify-write
  // through the mirror), then pings the author once per session. Skips self +
  // authorless targets.
  const sendMessage = useCallback(
    (artifactId: string, text: string) => {
      const author = authorOfCurrent;
      const toUserId = author?.userId;
      const isSelf =
        !toUserId ||
        toUserId === 'me' ||
        (!!telegramId && String(toUserId) === String(telegramId));

      const msg = newMessage(artifactId, isSelf ? undefined : toUserId, text);
      if (!msg) return;

      setMirror((prev) => {
        const base = prev ?? { lives: [] };
        const next = appendMessage(base, msg);
        persist(next);
        return next;
      });

      if (!isSelf && toUserId && !notifiedRef.current.has(artifactId)) {
        notifiedRef.current.add(artifactId);
        const refUrl =
          current && current.id === artifactId ? current.imageUrl : undefined;
        gameEvent.trigger(
          'pastlife_note',
          guestbookNotifyConfig({
            toUserId,
            refUrl,
            note: text,
            template: '{sender_name} left a note on your past life',
            imagePrompt: 'Someone left a note on the past life you were recalled into.',
          }),
        );
      }
    },
    [authorOfCurrent, current, persist, gameEvent],
  );

  const handleShare = () => {
    if (!current) return;
    const r = current.reading;
    const text = `${r.headline} — ${r.name}, ${r.year} · ${r.place} · Past Life`;
    try { navigator.clipboard?.writeText(text); } catch { /* ignore */ }
    setShareLabel(t('portrait_cta_share_done'));
    setTimeout(() => setShareLabel(''), 1600);
  };

  const wallEntries: WallEntry[] =
    demo === 'wall' || demo === 'poster'
      ? DEMO_WALL.map((d, i) => ({
          userId: `demo-${i}`,
          userName: d.name,
          userAvatarUrl: undefined,
          life: d.l,
        }))
      : gallery.entries;
  const demoMine: PastLifeT[] =
    demo === 'wall' || demo === 'poster' ? [DEMO_LIFE] : ownLives;
  const wallLoaded = demo === 'wall' || demo === 'poster' ? true : gallery.loaded;

  return (
    <div className="pl-root">
      <div className="pl-grain" aria-hidden />
      {phase === 'threshold' && (
        <ThresholdScreen
          recalledTotal={recalledCount}
          hasFirstTouched={hasFirstTouched}
          onStepIn={handleStepIn}
          onWall={handleWall}
        />
      )}
      {phase === 'seance' && (
        <SeanceScreen
          profile={profile}
          onBack={handleBackFromSeance}
          onSubmit={handleSubmit}
          errorLabel={errorLabel}
        />
      )}
      {phase === 'summoning' && pendingRecord && (
        <SummoningScreen
          stage={demo === 'summoning' ? 'painting' : lifeGen.stage}
          recordNumber={pendingRecord}
          reading={
            demo === 'summoning' ? DEMO_LIFE.reading : lifeGen.partialReading
          }
          selfieUrl={
            demo === 'summoning' ? DEMO_LIFE.selfieUrl : lifeGen.partialSelfieUrl
          }
        />
      )}
      {phase === 'portrait' && current && (
        <PortraitScreen
          life={current}
          viewMode={cameFromWall ? 'gallery' : 'recall'}
          onNew={handleNew}
          onWall={handleWall}
          onShare={isInAigram ? undefined : handleShare}
          shareLabel={shareLabel || undefined}
          shareDisabled={!!shareLabel}
          author={authorOfCurrent}
          messagesByTarget={gallery.messagesByTarget}
          myMessages={mirror?.messages}
          myUserId={telegramId ?? undefined}
          onSendNote={sendMessage}
        />
      )}
      {phase === 'hall' && (
        <HallWall
          entries={wallEntries}
          mine={demoMine}
          loaded={wallLoaded}
          onBack={handleBackFromWall}
          onView={handleViewFromWall}
          onNew={() => {
            setCameFromWall(false);
            setPhase('seance');
          }}
        />
      )}
      <div className="pl-own-counter" aria-hidden>
        {ownLives.length > 0 && phase !== 'hall' ? `${ownLives.length} recalled` : null}
      </div>
    </div>
  );
}
