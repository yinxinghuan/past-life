import { useState } from 'react';
import { isInAigram, openAigramProfile } from '@shared/runtime';
import { t } from '../i18n';
import { mediumLabel, lifespanLabel } from '../utils/prompts';
import type { PastLife, WallEntry } from '../types';

interface Props {
  entries: WallEntry[];
  mine: PastLife[];
  loaded: boolean;
  onBack: () => void;
  onView: (entry: WallEntry) => void;
  onNew: () => void;
}

type Scope = 'all' | 'mine';

export default function HallWall({ entries, mine, loaded, onBack, onView, onNew }: Props) {
  const [scope, setScope] = useState<Scope>('all');

  const mineEntries: WallEntry[] = mine.map((l) => ({
    userId: 'me',
    userName: undefined,
    userAvatarUrl: undefined,
    life: l,
  }));

  // Optimistic merge for ALL view — persist() is debounced + cloud RTT, so a
  // just-recalled life lives in `mine` for 1-3s before `entries` returns it.
  // Dedupe by life.id so it doesn't double-render once sync catches up.
  const allEntries: WallEntry[] = (() => {
    const seen = new Set(mineEntries.map((m) => m.life.id));
    return [...mineEntries, ...entries.filter((e) => !seen.has(e.life.id))].sort(
      (a, b) => (b.life.createdAt ?? 0) - (a.life.createdAt ?? 0),
    );
  })();

  const list = scope === 'all' ? allEntries : mineEntries;
  const count = list.length;
  const visibleEmpty =
    loaded && list.length === 0
      ? scope === 'mine'
        ? t('wall_empty_mine')
        : t('wall_empty_all')
      : null;

  return (
    <div className="pl-wall">
      <header className="pl-wall__head">
        <button type="button" className="pl-wall__back" onPointerDown={onBack}>
          ← {t('wall_back')}
        </button>
        <div className="pl-wall__title">{t('wall_title')}</div>
        <div className="pl-wall__head-spacer" />
      </header>

      <div className="pl-wall__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={scope === 'all'}
          className={'pl-wall__tab ' + (scope === 'all' ? 'pl-wall__tab--active' : '')}
          onPointerDown={() => setScope('all')}
        >
          {t('wall_tab_all')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={scope === 'mine'}
          className={'pl-wall__tab ' + (scope === 'mine' ? 'pl-wall__tab--active' : '')}
          onPointerDown={() => setScope('mine')}
        >
          {t('wall_tab_mine')}
          {mine.length > 0 && <span className="pl-wall__tab-badge">{mine.length}</span>}
        </button>
      </div>

      {loaded && count > 0 && (
        <div className="pl-wall__count">
          {count} {scope === 'mine' ? t('wall_count_mine') : t('wall_count_all')}
        </div>
      )}

      {!loaded && <div className="pl-wall__loading">{t('wall_loading')}</div>}
      {visibleEmpty && <div className="pl-wall__empty">{visibleEmpty}</div>}

      <div className="pl-wall__grid">
        {list.map((e, i) => (
          <button
            key={`${e.userId}-${e.life.id}`}
            className="pl-wall__card"
            type="button"
            // onClick (not onPointerDown) — the hall scrolls vertically.
            onClick={() => onView(e)}
          >
            <div className="pl-wall__card-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="pl-wall__card-photo">
              <img src={e.life.imageUrl} alt={e.life.reading.portrait_description} />
              <div className="pl-wall__card-photo-frame" aria-hidden />
            </div>
            <div className="pl-wall__card-body">
              <div className="pl-wall__card-headline">{e.life.reading.headline}</div>
              <div className="pl-wall__card-tags">
                <span className="pl-meta-chip">{lifespanLabel(e.life.reading)}</span>
                <span className="pl-meta-chip">{mediumLabel(e.life.reading.medium)}</span>
              </div>
              <div className="pl-wall__card-foot">
                {e.userId === 'me' ? (
                  <span className="pl-wall__card-name pl-wall__card-name--me">YOU</span>
                ) : (
                  <button
                    type="button"
                    className="pl-wall__author-chip"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      if (isInAigram) openAigramProfile(e.userId);
                    }}
                    disabled={!isInAigram}
                    aria-label={`Open ${e.userName || 'user'}'s profile`}
                  >
                    <span className="pl-wall__card-avatar" aria-hidden>
                      {e.userAvatarUrl ? (
                        <img src={e.userAvatarUrl} alt="" draggable={false} />
                      ) : (
                        <span className="pl-wall__card-avatar-letter">
                          {(e.userName || '?')[0]?.toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="pl-wall__card-name">{e.userName || '·'}</span>
                  </button>
                )}
                <span className="pl-wall__card-record">{e.life.recordNumber}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button type="button" className="pl-wall__fab" onPointerDown={onNew}>
        + {t('wall_fab')}
      </button>
    </div>
  );
}
