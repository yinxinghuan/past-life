import { useEffect, useState } from 'react';
import { isInAigram, openAigramProfile } from '@shared/runtime';
import {
  threadFor,
  timeAgo,
  cleanText,
  MAX_LEN,
  type GuestMessage,
} from '@shared/social/guestbook';
import { t, getLocale, mediumLabel, toneLabel } from '../i18n';
import { lifespanLabel } from '../utils/prompts';
import { useTranslate } from '../utils/translate';
import type { PastLife } from '../types';

interface Author {
  userId: string;
  userName?: string;
  userAvatarUrl?: string;
}

interface Props {
  life: PastLife;
  viewMode: 'recall' | 'gallery';
  shareLabel?: string;
  shareDisabled?: boolean;
  onNew: () => void;
  onWall: () => void;
  onShare?: () => void;
  author?: Author;
  /** Best-effort guestbook notes grouped by life id (from the wall fetch). */
  messagesByTarget?: Map<string, GuestMessage[]>;
  /** The viewer's own outgoing notes (local mirror) for instant echo. */
  myMessages?: GuestMessage[];
  /** The viewer's telegram id (to render self notes as "you"). */
  myUserId?: string;
  /** Send a note on this life. */
  onSendNote?: (artifactId: string, text: string) => void;
}

export default function PortraitScreen({
  life,
  viewMode,
  shareLabel,
  shareDisabled,
  onNew,
  onWall,
  onShare,
  author,
  messagesByTarget,
  myMessages,
  myUserId,
  onSendNote,
}: Props) {
  const { reading } = life;
  // Canonical content is English; translate the dynamic fields for display in
  // the viewer's locale (proper nouns stay as authored). No-op when locale=en.
  const tx = useTranslate([
    reading.occupation,
    reading.cause_of_death,
    reading.headline,
    reading.epitaph,
    reading.meaning,
  ]);
  const occupation = tx[0] ?? reading.occupation;
  const causeOfDeath = tx[1] ?? reading.cause_of_death;
  const headline = tx[2] ?? reading.headline;
  const epitaph = tx[3] ?? reading.epitaph;
  const meaning = tx[4] ?? reading.meaning;

  const [typed, setTyped] = useState('');
  const [skipped, setSkipped] = useState(false);
  const [showNow, setShowNow] = useState(false);
  const [readingOpen, setReadingOpen] = useState(false);
  const [readingTouched, setReadingTouched] = useState(false);
  const [draft, setDraft] = useState('');

  const lang = getLocale();
  const thread =
    viewMode === 'gallery'
      ? threadFor(life.id, messagesByTarget ?? new Map(), myMessages, myUserId)
      : [];

  const submitNote = () => {
    const clean = cleanText(draft);
    if (!clean || !onSendNote) return;
    onSendNote(life.id, clean);
    setDraft('');
  };

  useEffect(() => {
    setTyped('');
    setSkipped(false);
    setShowNow(false);
    setReadingOpen(false);
    setReadingTouched(false);
    setDraft('');
  }, [meaning]);

  useEffect(() => {
    if (!readingOpen || !readingTouched) return;
    if (typed.length >= meaning.length) return;
    const target = meaning;
    let i = typed.length;
    const id = setInterval(() => {
      i++;
      setTyped(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [readingOpen, readingTouched, meaning, typed.length]);

  const readingText = skipped ? meaning : typed;
  const skipTypewriter = () => {
    if (typed.length < meaning.length) setSkipped(true);
  };
  const toggleReading = () => {
    setReadingTouched(true);
    setReadingOpen((o) => !o);
  };

  // Hero = the past-life portrait ("then"); tap shows the modern selfie ("now").
  const mainUrl = showNow ? life.selfieUrl : life.imageUrl;
  const insetUrl = showNow ? life.imageUrl : life.selfieUrl;
  const mainLabel = showNow ? t('portrait_now') : t('portrait_then');
  const insetLabel = showNow ? t('portrait_then') : t('portrait_now');

  const swap = () => setShowNow((b) => !b);

  return (
    <div className="pl-portrait">
      {/* ───── Hero portrait + then/now swap ───── */}
      <div className="pl-portrait__hero">
        <div
          className="pl-portrait__photo"
          onClick={swap}
          role="button"
          tabIndex={-1}
        >
          <img src={mainUrl} alt={reading.portrait_description} />
          <div className="pl-portrait__photo-frame" aria-hidden />
          <div className="pl-portrait__photo-plate">
            {reading.name} · {reading.year}
          </div>
          <div className="pl-portrait__photo-tag">{mainLabel}</div>
          <div className="pl-portrait__attachment" aria-hidden>
            <img src={insetUrl} alt="" />
            <div className="pl-portrait__attachment-label">{insetLabel}</div>
          </div>
          <div className="pl-portrait__swap-hint">{t('portrait_tap_to_swap')}</div>
        </div>
      </div>

      {/* ───── Title block ───── */}
      <div className="pl-portrait__title-block">
        <div className="pl-portrait__record-line">
          {life.recordNumber} · {t('portrait_recalled')} {life.recalledDate}
        </div>
        {author && viewMode === 'gallery' && (
          <button
            type="button"
            className="pl-portrait__author-chip"
            onClick={(ev) => {
              ev.stopPropagation();
              if (isInAigram) openAigramProfile(author.userId);
            }}
            disabled={!isInAigram}
            aria-label={`Open ${author.userName || 'user'}'s profile`}
          >
            <span className="pl-portrait__author-label">— recalled by</span>
            <span className="pl-portrait__author-avatar" aria-hidden>
              {author.userAvatarUrl ? (
                <img src={author.userAvatarUrl} alt="" draggable={false} />
              ) : (
                <span className="pl-portrait__author-letter">
                  {(author.userName || '?')[0]?.toUpperCase()}
                </span>
              )}
            </span>
            <span className="pl-portrait__author-name">{author.userName || '·'}</span>
          </button>
        )}
        <h1 className="pl-portrait__headline">{headline}</h1>
        <div className="pl-portrait__meta-chips">
          <span className="pl-meta-chip">{lifespanLabel(reading)}</span>
          <span className="pl-meta-chip">{mediumLabel(reading.medium)}</span>
          <span className="pl-meta-chip pl-meta-chip--accent">
            {toneLabel(reading.tone)}
          </span>
        </div>
      </div>

      {/* ───── Card 01 — the life: trade, death, epitaph ───── */}
      <div className="pl-portrait__card pl-portrait__card--life">
        <div className="pl-portrait__life-row">
          <span className="pl-portrait__life-key">{t('portrait_occupation')}</span>
          <span className="pl-portrait__life-val">{occupation}</span>
        </div>
        <div className="pl-portrait__life-row">
          <span className="pl-portrait__life-key">{t('portrait_death')}</span>
          <span className="pl-portrait__life-val">{causeOfDeath}</span>
        </div>
        <div className="pl-portrait__epitaph">
          <span className="pl-portrait__epitaph-mark" aria-hidden>
            ✣
          </span>
          <span className="pl-portrait__epitaph-text">“{epitaph}”</span>
        </div>
      </div>

      {/* ───── Card 02 — the long reading, collapsed by default ───── */}
      <div
        className={
          'pl-portrait__card pl-portrait__card--toggle ' +
          (readingOpen ? 'pl-portrait__card--open' : '')
        }
      >
        <button
          type="button"
          className="pl-portrait__card-head pl-portrait__card-head--toggle"
          onPointerDown={toggleReading}
        >
          <span className="pl-portrait__card-num">✷</span>
          <span className="pl-portrait__card-title">{t('portrait_reading')}</span>
          <span className="pl-portrait__card-state">
            {readingOpen ? t('portrait_collapse') : t('portrait_read_more')}
          </span>
          <span className="pl-portrait__card-chevron" aria-hidden>
            {readingOpen ? '▾' : '▸'}
          </span>
        </button>
        {readingOpen && (
          <div
            className="pl-portrait__reading"
            onClick={skipTypewriter}
            role="button"
            tabIndex={-1}
          >
            {readingText || ' '}
          </div>
        )}
      </div>

      {/* ───── Guestbook — public notes (gallery only) ───── */}
      {viewMode === 'gallery' && (
        <div className="pl-portrait__card pl-notes">
          <div className="pl-portrait__card-head">
            <span className="pl-portrait__card-num">✦</span>
            <span className="pl-portrait__card-title">{t('notes_title')}</span>
            {thread.length > 0 && <span className="pl-notes__count">{thread.length}</span>}
          </div>

          {thread.length === 0 ? (
            <div className="pl-notes__empty">{t('notes_empty')}</div>
          ) : (
            <ul className="pl-notes__list">
              {thread.map((m) => {
                const isMine =
                  (!!myUserId && m.fromUserId === myUserId) ||
                  (!m.fromUserId && !!myMessages?.some((x) => x.id === m.id));
                const name = isMine ? t('notes_you') : m.userName || '·';
                return (
                  <li key={m.id} className="pl-notes__item">
                    {isMine ? (
                      <span className="pl-notes__who pl-notes__who--me" aria-hidden>
                        <span className="pl-notes__avatar pl-notes__avatar--me">
                          {name[0]?.toUpperCase()}
                        </span>
                        <span className="pl-notes__name pl-notes__name--me">{name}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="pl-notes__who"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          if (isInAigram && m.fromUserId) openAigramProfile(m.fromUserId);
                        }}
                        disabled={!isInAigram || !m.fromUserId}
                        aria-label={`Open ${m.userName || 'user'}'s profile`}
                      >
                        <span className="pl-notes__avatar" aria-hidden>
                          {m.userAvatarUrl ? (
                            <img src={m.userAvatarUrl} alt="" draggable={false} />
                          ) : (
                            (m.userName || '?')[0]?.toUpperCase()
                          )}
                        </span>
                        <span className="pl-notes__name">{name}</span>
                      </button>
                    )}
                    <span className="pl-notes__text">{m.text}</span>
                    <span className="pl-notes__time">{timeAgo(m.ts, lang)}</span>
                  </li>
                );
              })}
            </ul>
          )}

          {isInAigram ? (
            <div className="pl-notes__compose">
              <input
                className="pl-notes__input"
                type="text"
                value={draft}
                maxLength={MAX_LEN}
                placeholder={t('notes_placeholder')}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitNote();
                }}
              />
              <button
                type="button"
                className="pl-notes__send"
                onPointerDown={submitNote}
                disabled={!cleanText(draft)}
              >
                {t('notes_send')}
              </button>
            </div>
          ) : (
            <div className="pl-notes__hint">{t('notes_open_in_app')}</div>
          )}
        </div>
      )}

      {/* ───── CTAs ───── */}
      <div className="pl-portrait__ctas">
        <button
          type="button"
          className="pl-portrait__cta pl-portrait__cta--primary"
          onPointerDown={onWall}
        >
          {t('portrait_cta_wall')}
        </button>
        <div className="pl-portrait__ctas-row">
          <button
            type="button"
            className="pl-portrait__cta pl-portrait__cta--secondary"
            onPointerDown={onNew}
          >
            {viewMode === 'gallery' ? t('portrait_back_to_seance') : t('portrait_cta_again')}
          </button>
          {onShare && (
            <button
              type="button"
              className="pl-portrait__cta pl-portrait__cta--secondary"
              onPointerDown={onShare}
              disabled={shareDisabled}
            >
              {shareLabel || t('portrait_cta_share')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
