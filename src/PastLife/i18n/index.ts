// Lightweight i18n — en / zh / es / pt, no external library. English is the
// default and the product face; the others are opt-in fallbacks that follow
// the device language. The AI-generated reading is translated separately at
// display time (see utils/translate.ts); these are the static UI strings +
// the medium/tone enum labels.

type Locale = 'en' | 'zh' | 'es' | 'pt';

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
    notes_open_in_app: 'Open in AlterU to leave a note.',
    download_alteru: 'Get AlterU on the App Store',

    'medium_oil-painting': 'Oil Painting',
    medium_daguerreotype: 'Daguerreotype',
    medium_tintype: 'Tintype',
    medium_fresco: 'Fresco',
    'medium_illuminated-manuscript': 'Illuminated Manuscript',
    medium_woodblock: 'Woodblock Print',
    'medium_charcoal-sketch': 'Charcoal Sketch',
    'medium_funerary-portrait': 'Funerary Portrait',

    tone_tragic: 'TRAGIC',
    tone_absurd: 'ABSURD',
    tone_noble: 'NOBLE',
    tone_humble: 'HUMBLE',
    tone_haunted: 'HAUNTED',
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
    notes_open_in_app: '在 AlterU 中打开才能留言。',
    download_alteru: '下载 AlterU',

    'medium_oil-painting': '油画',
    medium_daguerreotype: '银版照相',
    medium_tintype: '锡版照相',
    medium_fresco: '湿壁画',
    'medium_illuminated-manuscript': '泥金手抄本',
    medium_woodblock: '木刻版画',
    'medium_charcoal-sketch': '炭笔素描',
    'medium_funerary-portrait': '殡葬肖像',

    tone_tragic: '悲剧',
    tone_absurd: '荒诞',
    tone_noble: '高贵',
    tone_humble: '卑微',
    tone_haunted: '阴郁',
  },
  es: {
    sign_title: 'PAST LIFE',
    sign_sub: 'el retrato de quien fuiste antes',

    threshold_pitch_top: 'Ya has estado aquí. Hace mucho.',
    threshold_step_in: 'Siéntate con la médium',
    threshold_open_since: 'el registro de las almas · desde siempre',
    threshold_recalled_today: '{n} almas evocadas aquí',

    seance_intro: 'No me digas quién eres. Déjame ver quién fuiste.',
    seance_step_face: 'Muéstrame tu rostro.',
    seance_step_q: '¿Algo se siente más antiguo de lo que debería? (o calla)',
    seance_question: 'Algo que se siente más viejo que tú…',
    seance_use_my_avatar: 'Usar mi rostro',
    seance_upload: 'Usar otra foto',
    seance_change: 'cambiar',
    seance_cta: 'Evocar mi vida pasada',
    seance_back: 'Salir',

    summon_sourcing: 'Mirando dentro de ti',
    summon_reading: 'Buscando la vida',
    summon_painting: 'Trayéndola de vuelta',
    summon_framing: 'Ahí estás',
    summon_reading_long: 'La médium ha callado. No te muevas…',
    summon_record: 'REGISTRO',

    portrait_record: 'REGISTRO',
    portrait_recalled: 'EVOCADA EL',
    portrait_lifespan: 'VIDA',
    portrait_medium: 'HECHO EN',
    portrait_occupation: 'Fuiste',
    portrait_death: 'Moriste',
    portrait_epitaph: 'En la lápida',
    portrait_reading: 'La lectura',
    portrait_tap_to_swap: 'toca para ver el ahora',
    portrait_now: 'ahora',
    portrait_then: 'entonces',
    portrait_read_more: 'Leer a la médium',
    portrait_collapse: 'Ocultar',
    portrait_cta_again: 'Evocar otra vida',
    portrait_cta_wall: 'Salón de Vidas Pasadas',
    portrait_cta_share: 'Compartir',
    portrait_cta_share_done: 'Copiado',
    portrait_back_to_seance: 'Sentarse otra vez',

    wall_title: 'Salón de Vidas Pasadas',
    wall_sub: 'Todos los que la médium ha evocado',
    wall_back: 'Atrás',
    wall_fab: 'Evoca la tuya',
    wall_tab_all: 'Todas las almas',
    wall_tab_mine: 'Las mías',
    wall_count_all: 'vidas evocadas',
    wall_count_mine: 'tuyas',
    wall_loading: 'Abriendo el registro…',
    wall_empty_all: 'Aún no han evocado a nadie. Sé el primero.',
    wall_empty_mine: 'Aún no te han evocado.',

    err_processing: 'La vela se apagó. Inténtalo de nuevo.',
    err_offline: 'La sala está a oscuras ahora. Inténtalo en un momento.',

    tip_first_touch: 'toca para entrar',

    notes_title: 'Notas',
    notes_empty: 'Aún no hay notas. Deja la primera.',
    notes_placeholder: 'Deja una nota…',
    notes_send: 'Enviar',
    notes_you: 'tú',
    notes_open_in_app: 'Abre en AlterU para dejar una nota.',
    download_alteru: 'Obtén AlterU en App Store',

    'medium_oil-painting': 'Pintura al óleo',
    medium_daguerreotype: 'Daguerrotipo',
    medium_tintype: 'Ferrotipo',
    medium_fresco: 'Fresco',
    'medium_illuminated-manuscript': 'Manuscrito iluminado',
    medium_woodblock: 'Grabado en madera',
    'medium_charcoal-sketch': 'Boceto al carbón',
    'medium_funerary-portrait': 'Retrato funerario',

    tone_tragic: 'TRÁGICA',
    tone_absurd: 'ABSURDA',
    tone_noble: 'NOBLE',
    tone_humble: 'HUMILDE',
    tone_haunted: 'SOMBRÍA',
  },
  pt: {
    sign_title: 'PAST LIFE',
    sign_sub: 'o retrato de quem você foi antes',

    threshold_pitch_top: 'Você já esteve aqui. Há muito tempo.',
    threshold_step_in: 'Sente-se com a médium',
    threshold_open_since: 'o registro das almas · desde sempre',
    threshold_recalled_today: '{n} almas evocadas aqui',

    seance_intro: 'Não me diga quem você é. Deixe-me ver quem você foi.',
    seance_step_face: 'Mostre-me seu rosto.',
    seance_step_q: 'Algo parece mais antigo do que deveria? (ou fique em silêncio)',
    seance_question: 'Algo que parece mais velho que você…',
    seance_use_my_avatar: 'Usar meu rosto',
    seance_upload: 'Usar outra foto',
    seance_change: 'trocar',
    seance_cta: 'Evocar minha vida passada',
    seance_back: 'Sair',

    summon_sourcing: 'Olhando dentro de você',
    summon_reading: 'Encontrando a vida',
    summon_painting: 'Trazendo-a de volta',
    summon_framing: 'Aí está você',
    summon_reading_long: 'A médium ficou em silêncio. Não se mexa…',
    summon_record: 'REGISTRO',

    portrait_record: 'REGISTRO',
    portrait_recalled: 'EVOCADA EM',
    portrait_lifespan: 'VIDA',
    portrait_medium: 'FEITO EM',
    portrait_occupation: 'Você foi',
    portrait_death: 'Você morreu',
    portrait_epitaph: 'Na lápide',
    portrait_reading: 'A leitura',
    portrait_tap_to_swap: 'toque para ver o agora',
    portrait_now: 'agora',
    portrait_then: 'antes',
    portrait_read_more: 'Ler a médium',
    portrait_collapse: 'Ocultar',
    portrait_cta_again: 'Evocar outra vida',
    portrait_cta_wall: 'Salão das Vidas Passadas',
    portrait_cta_share: 'Compartilhar',
    portrait_cta_share_done: 'Copiado',
    portrait_back_to_seance: 'Sentar de novo',

    wall_title: 'Salão das Vidas Passadas',
    wall_sub: 'Todos que a médium evocou',
    wall_back: 'Voltar',
    wall_fab: 'Evoque a sua',
    wall_tab_all: 'Todas as almas',
    wall_tab_mine: 'Minhas',
    wall_count_all: 'vidas evocadas',
    wall_count_mine: 'suas',
    wall_loading: 'Abrindo o registro…',
    wall_empty_all: 'Ninguém foi evocado ainda. Seja o primeiro.',
    wall_empty_mine: 'Você ainda não foi evocado.',

    err_processing: 'A vela se apagou. Tente novamente.',
    err_offline: 'A sala está escura agora. Tente daqui a pouco.',

    tip_first_touch: 'toque para entrar',

    notes_title: 'Notas',
    notes_empty: 'Nenhuma nota ainda. Deixe a primeira.',
    notes_placeholder: 'Deixe uma nota…',
    notes_send: 'Enviar',
    notes_you: 'você',
    notes_open_in_app: 'Abra no AlterU para deixar uma nota.',
    download_alteru: 'Baixe o AlterU na App Store',

    'medium_oil-painting': 'Pintura a óleo',
    medium_daguerreotype: 'Daguerreótipo',
    medium_tintype: 'Ferrótipo',
    medium_fresco: 'Afresco',
    'medium_illuminated-manuscript': 'Manuscrito iluminado',
    medium_woodblock: 'Xilogravura',
    'medium_charcoal-sketch': 'Esboço a carvão',
    'medium_funerary-portrait': 'Retrato funerário',

    tone_tragic: 'TRÁGICA',
    tone_absurd: 'ABSURDA',
    tone_noble: 'NOBRE',
    tone_humble: 'HUMILDE',
    tone_haunted: 'SOMBRIA',
  },
};

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const override = localStorage.getItem('game_locale');
    if (override === 'en' || override === 'zh' || override === 'es' || override === 'pt')
      return override;
  } catch {
    /* ignore */
  }
  const lang =
    typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('pt')) return 'pt';
  return 'en';
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

/** Localized label for an art medium enum value. */
export function mediumLabel(medium: string): string {
  return t(`medium_${medium}`);
}

/** Localized (upper-case) label for a life-tone enum value. */
export function toneLabel(tone: string): string {
  return t(`tone_${tone}`);
}

// ── Merge cartridge copy over the built-in dict (cartridge wins for 'en') ──
import { CARTRIDGE } from '../cartridge/index';
for (const [locale, strings] of Object.entries(CARTRIDGE.copy)) {
  if (!dict[locale as Locale]) dict[locale as Locale] = {};
  Object.assign(dict[locale as Locale], strings);
}
