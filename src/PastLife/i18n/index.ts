// Lightweight i18n — en / zh, no external library. English is the default and
// the product face; zh is an opt-in fallback only.

type Locale = 'zh' | 'en';

const dict: Record<Locale, Record<string, string>> = {
  en: {
    sign_title: 'PAST LIFE',
    sign_sub: 'the portrait of who you were before',

    threshold_pitch_top: 'You have been here before.',
    threshold_step_in: 'Sit with the medium',
    threshold_open_since: 'the ledger of souls · since always',
    threshold_recalled_today: '{n} souls recalled here',

    seance_intro: "Don't tell me who you are. Let me see who you were.",
    seance_step_face: 'Show me your face.',
    seance_step_q: 'Anything feel older than it should? (or stay quiet)',
    seance_question: 'Something that feels older than you…',
    seance_use_my_avatar: 'Use my face',
    seance_upload: 'Use a different photo',
    seance_change: 'change',
    seance_cta: 'Recall my past life',
    seance_back: 'Leave',

    summon_sourcing: 'Looking into you',
    summon_reading: 'Finding the life',
    summon_painting: 'Drawing it back',
    summon_framing: 'There you are',
    summon_reading_long: 'The medium has gone quiet. Hold still…',
    summon_record: 'RECORD',

    portrait_record: 'RECORD',
    portrait_recalled: 'RECALLED',
    portrait_lifespan: 'LIFE',
    portrait_medium: 'RENDERED IN',
    portrait_occupation: 'You were',
    portrait_death: 'You died',
    portrait_epitaph: 'On the stone',
    portrait_reading: 'The reading',
    portrait_tap_to_swap: 'tap to see now',
    portrait_now: 'now',
    portrait_then: 'then',
    portrait_read_more: 'Read the medium',
    portrait_collapse: 'Hide',
    portrait_cta_again: 'Recall another life',
    portrait_cta_wall: 'Hall of Past Lives',
    portrait_cta_share: 'Share',
    portrait_cta_share_done: 'Copied',
    portrait_back_to_seance: 'Sit again',

    wall_title: 'Hall of Past Lives',
    wall_sub: 'Everyone the medium has recalled',
    wall_back: 'Back',
    wall_fab: 'Recall yours',
    wall_tab_all: 'All souls',
    wall_tab_mine: 'Mine',
    wall_count_all: 'lives recalled',
    wall_count_mine: 'of yours',
    wall_loading: 'Opening the ledger…',
    wall_empty_all: 'No one has been recalled yet. Be the first.',
    wall_empty_mine: 'You have not been recalled yet.',

    err_processing: 'The candle guttered. Try again.',
    err_offline: 'The room is dark right now. Try again in a moment.',

    tip_first_touch: 'tap to enter',

    notes_title: 'Notes',
    notes_empty: 'No notes yet. Leave the first.',
    notes_placeholder: 'Leave a note…',
    notes_send: 'Send',
    notes_you: 'you',
    notes_open_in_app: 'Open in Aigram to leave a note.',
  },
  zh: {
    sign_title: 'PAST LIFE',
    sign_sub: '你上辈子的那张脸',

    threshold_pitch_top: '你来过这里。很久以前。',
    threshold_step_in: '坐到通灵人对面',
    threshold_open_since: '魂灵名册 · 自始至终',
    threshold_recalled_today: '已唤回 {n} 个魂',

    seance_intro: '别告诉我你是谁。让我看看你曾是谁。',
    seance_step_face: '把脸给我看。',
    seance_step_q: '有什么东西，感觉比你本人还老？（或者别说话）',
    seance_question: '一件比你还古老的东西……',
    seance_use_my_avatar: '用我现在的脸',
    seance_upload: '换一张照片',
    seance_change: '换',
    seance_cta: '唤回我的前世',
    seance_back: '离开',

    summon_sourcing: '看进你的眼里',
    summon_reading: '寻你那一世',
    summon_painting: '把它画回来',
    summon_framing: '你在这儿',
    summon_reading_long: '通灵人沉默了。别动……',
    summon_record: '编号',

    portrait_record: '编号',
    portrait_recalled: '唤回于',
    portrait_lifespan: '那一世',
    portrait_medium: '所用之法',
    portrait_occupation: '你曾是',
    portrait_death: '你死于',
    portrait_epitaph: '碑上刻着',
    portrait_reading: '通灵人说',
    portrait_tap_to_swap: '点一下看现在的你',
    portrait_now: '此生',
    portrait_then: '前世',
    portrait_read_more: '听通灵人怎么说',
    portrait_collapse: '收起',
    portrait_cta_again: '再唤一世',
    portrait_cta_wall: '前世陈列馆',
    portrait_cta_share: '分享',
    portrait_cta_share_done: '已复制',
    portrait_back_to_seance: '再坐一次',

    wall_title: '前世陈列馆',
    wall_sub: '通灵人唤回过的所有人',
    wall_back: '返回',
    wall_fab: '唤回你的',
    wall_tab_all: '所有魂',
    wall_tab_mine: '我的',
    wall_count_all: '世被唤回',
    wall_count_mine: '世属于你',
    wall_loading: '翻开名册……',
    wall_empty_all: '还没人被唤回。你来做第一个。',
    wall_empty_mine: '你还没被唤回过。',

    err_processing: '蜡烛灭了。再试一次。',
    err_offline: '屋里现在没有光。等会儿再来。',

    tip_first_touch: '点屏幕进门',

    notes_title: '留言',
    notes_empty: '还没有留言。来留第一条。',
    notes_placeholder: '留句话……',
    notes_send: '发送',
    notes_you: '你',
    notes_open_in_app: '在 Aigram 里打开才能留言。',
  },
};

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const override = localStorage.getItem('game_locale');
    if (override === 'en' || override === 'zh') return override;
  } catch {
    /* ignore */
  }
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')
    ? 'zh'
    : 'en';
}

const LOCALE: Locale = detectLocale();

export function t(key: string, vars?: { n?: number | string }): string {
  const raw = dict[LOCALE][key] ?? dict.en[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{n\}/g, String(vars.n ?? ''));
}

export function getLocale(): Locale {
  return LOCALE;
}
