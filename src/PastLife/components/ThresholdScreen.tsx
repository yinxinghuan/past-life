import { t } from '../i18n';

interface Props {
  recalledTotal: number;
  hasFirstTouched: boolean;
  onStepIn: () => void;
  onWall: () => void;
}

export default function ThresholdScreen({
  recalledTotal,
  hasFirstTouched,
  onStepIn,
  onWall,
}: Props) {
  return (
    <div className="pl-threshold">
      {/* ─── Image zone (top) — TAP TO ENTER, no text overlay ── */}
      <div
        className="pl-threshold__imagewrap"
        onPointerDown={onStepIn}
        role="button"
        aria-label={t('threshold_step_in')}
      >
        <div className="pl-scene-bg pl-scene-bg--breathe" aria-hidden>
          <img src={import.meta.env.BASE_URL + 'hero.jpg'} alt="" />
          <div className="pl-scene-bg__vignette" />
          <div className="pl-scene-bg__dust" />
        </div>

        {/* candle glow that pulses */}
        <div className="pl-threshold__candleglow" aria-hidden />

        {!hasFirstTouched && (
          <div className="pl-threshold__tap-hint" aria-hidden>
            <span className="pl-threshold__tap-hint-arrow" />
            <span>{t('tip_first_touch')}</span>
            <span className="pl-threshold__tap-hint-arrow" />
          </div>
        )}
      </div>

      {/* ─── Illustrated wordmark — overlaps the seam, focal point ─── */}
      <Wordmark />

      {/* ─── Dock — pitch + CTAs ─── */}
      <div className="pl-threshold__dock">
        <div className="pl-threshold__pitch">{t('threshold_pitch_top')}</div>

        <div className="pl-threshold__ctas">
          <button
            className="pl-threshold__cta pl-threshold__cta--primary"
            onPointerDown={(ev) => {
              ev.stopPropagation();
              onStepIn();
            }}
            type="button"
          >
            <span className="pl-threshold__cta-label">{t('threshold_step_in')}</span>
          </button>
          <button
            className="pl-threshold__cta pl-threshold__cta--secondary"
            onPointerDown={(ev) => {
              ev.stopPropagation();
              onWall();
            }}
            type="button"
          >
            <span className="pl-threshold__cta-label">{t('wall_title')}</span>
            <span className="pl-threshold__cta-sub">
              {recalledTotal > 0
                ? t('threshold_recalled_today', { n: recalledTotal })
                : t('wall_sub')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Wordmark ─────────────────────────────────────────────────────────────
// PAST / LIFE stacked in a high-contrast display serif, flanked by a small
// engraved ornament so it reads as a designed mark, not "just a font".
function Wordmark() {
  return (
    <div className="pl-mark" aria-label="Past Life">
      <div className="pl-mark__rows">
        <Ornament className="pl-mark__orn pl-mark__orn--left" />
        <div className="pl-mark__words">
          <div className="pl-mark__title">PAST</div>
          <div className="pl-mark__title pl-mark__title--life">LIFE</div>
        </div>
        <Ornament className="pl-mark__orn pl-mark__orn--right" />
      </div>
      <div className="pl-mark__banner" aria-hidden>
        <span className="pl-mark__banner-rule" />
        <span className="pl-mark__banner-text">{t('sign_sub')}</span>
        <span className="pl-mark__banner-rule" />
      </div>
    </div>
  );
}

function Ornament({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 48" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* a slender candle / taper motif */}
      <rect x="10.6" y="14" width="2.8" height="28" rx="1.4" fill="currentColor" opacity="0.9" />
      <path
        d="M12 4 C 9.5 8, 9.5 11.5, 12 13.5 C 14.5 11.5, 14.5 8, 12 4 Z"
        fill="currentColor"
      />
      <circle cx="12" cy="9.5" r="1.4" fill="rgba(0,0,0,0.45)" />
      <line x1="12" y1="13.5" x2="12" y2="15" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}
