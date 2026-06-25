import { useRef, useState } from 'react';
import { t } from '../i18n';
import type { PlayerProfile } from '../hooks/usePlayerProfile';
import type { SelfieSource } from '../hooks/usePastLife';

interface Props {
  profile: PlayerProfile | null;
  onBack: () => void;
  onSubmit: (source: SelfieSource, question: string) => void;
  errorLabel: string;
}

type Step = 'face' | 'ask';
type PickedSource =
  | { kind: 'avatar'; url: string }
  | { kind: 'file'; file: File; previewUrl: string };

export default function SeanceScreen({ profile, onBack, onSubmit, errorLabel }: Props) {
  // Step-by-step: pick face first, then the optional question + recall.
  const [step, setStep] = useState<Step>('face');
  const [question, setQuestion] = useState('');
  const [picked, setPicked] = useState<PickedSource | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const advanceAfter = (next: PickedSource) => {
    setPicked(next);
    setTimeout(() => setStep('ask'), 320);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const previewUrl = URL.createObjectURL(f);
    advanceAfter({ kind: 'file', file: f, previewUrl });
  };

  const handleUseAvatar = () => {
    if (!profile?.avatarUrl) return;
    advanceAfter({ kind: 'avatar', url: profile.avatarUrl });
  };

  const handleChangeFace = () => setStep('face');

  const handleSubmit = () => {
    if (!picked) return;
    const source: SelfieSource =
      picked.kind === 'avatar'
        ? { kind: 'avatar-url', url: picked.url }
        : { kind: 'file', file: picked.file };
    onSubmit(source, question.trim());
  };

  const previewSrc =
    picked?.kind === 'avatar' ? picked.url : picked?.kind === 'file' ? picked.previewUrl : null;

  return (
    <div className="pl-seance">
      <div className="pl-scene-bg pl-scene-bg--dim" aria-hidden>
        <img src={import.meta.env.BASE_URL + 'hero.jpg'} alt="" />
        <div className="pl-scene-bg__vignette pl-scene-bg__vignette--deep" />
      </div>

      <button className="pl-seance__back" type="button" onPointerDown={onBack}>
        ← {t('seance_back')}
      </button>

      <p className="pl-seance__intro">{t('seance_intro')}</p>

      {step === 'face' && (
        <div className="pl-seance__sheet pl-seance__sheet--enter">
          <div className="pl-seance__step-head">
            <span className="pl-seance__step-num">I</span>
            <span className="pl-seance__step-label">{t('seance_step_face')}</span>
          </div>

          <div className="pl-seance__face-stack">
            {profile?.avatarUrl && (
              <button
                type="button"
                className="pl-cta pl-cta--big pl-seance__face-cta"
                onPointerDown={handleUseAvatar}
              >
                {t('seance_use_my_avatar')}
              </button>
            )}
            <label className="pl-cta pl-cta--secondary pl-seance__face-cta">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
              {t('seance_upload')}
            </label>
          </div>
        </div>
      )}

      {step === 'ask' && (
        <div className="pl-seance__ask-stage pl-seance__sheet--enter">
          <button
            type="button"
            className="pl-seance__preview"
            onPointerDown={handleChangeFace}
            aria-label={t('seance_change')}
          >
            {previewSrc ? (
              <img src={previewSrc} alt="" className="pl-seance__preview-img" />
            ) : (
              <div className="pl-seance__preview-placeholder">?</div>
            )}
            <span className="pl-seance__change-badge">↻ {t('seance_change')}</span>
          </button>

          <div className="pl-seance__sheet pl-seance__sheet--enter">
            <div className="pl-seance__step-head">
              <span className="pl-seance__step-num">II</span>
              <span className="pl-seance__step-label">{t('seance_step_q')}</span>
            </div>
            <input
              className="pl-seance__question"
              placeholder={t('seance_question')}
              value={question}
              maxLength={80}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <button
              type="button"
              className="pl-cta pl-cta--big pl-cta--primary pl-seance__recall-cta"
              onPointerDown={handleSubmit}
            >
              {t('seance_cta')}
            </button>
            {errorLabel && <div className="pl-seance__error">{errorLabel}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
