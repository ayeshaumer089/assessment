import React, { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'appLanguage';

const translations = {
  EN: {
    chatHub: 'Chat Hub',
    marketplace: 'Marketplace',
    agents: 'Agents',
    discoverNew: 'Discover New',
    signIn: 'Sign in',
    getStarted: 'Get Started →',
    logout: 'Logout',
    tryFree: 'Try free →',
    appLanguage: 'App Language',
  },
  FR: {
    chatHub: 'Hub Chat',
    marketplace: 'Marché',
    agents: 'Agents',
    discoverNew: 'Découvrir',
    signIn: 'Se connecter',
    getStarted: 'Commencer →',
    logout: 'Se déconnecter',
    tryFree: 'Essayer gratuitement →',
    appLanguage: "Langue de l'application",
  },
  AR: {
    chatHub: 'مركز الدردشة',
    marketplace: 'السوق',
    agents: 'الوكلاء',
    discoverNew: 'اكتشف الجديد',
    signIn: 'تسجيل الدخول',
    getStarted: 'ابدأ الآن ←',
    logout: 'تسجيل الخروج',
    tryFree: 'جرّب مجاناً ←',
    appLanguage: 'لغة التطبيق',
  },
  DE: {
    chatHub: 'Chat-Hub',
    marketplace: 'Marktplatz',
    agents: 'Agenten',
    discoverNew: 'Neu entdecken',
    signIn: 'Anmelden',
    getStarted: 'Loslegen →',
    logout: 'Abmelden',
    tryFree: 'Kostenlos testen →',
    appLanguage: 'App-Sprache',
  },
  ES: {
    chatHub: 'Centro de Chat',
    marketplace: 'Mercado',
    agents: 'Agentes',
    discoverNew: 'Descubrir nuevo',
    signIn: 'Iniciar sesión',
    getStarted: 'Comenzar →',
    logout: 'Cerrar sesión',
    tryFree: 'Probar gratis →',
    appLanguage: 'Idioma de la app',
  },
  PT: {
    chatHub: 'Central de Chat',
    marketplace: 'Marketplace',
    agents: 'Agentes',
    discoverNew: 'Descobrir novo',
    signIn: 'Entrar',
    getStarted: 'Começar →',
    logout: 'Sair',
    tryFree: 'Testar grátis →',
    appLanguage: 'Idioma do app',
  },
  ZH: {
    chatHub: '聊天中心',
    marketplace: '模型市场',
    agents: '智能体',
    discoverNew: '发现新内容',
    signIn: '登录',
    getStarted: '开始使用 →',
    logout: '退出登录',
    tryFree: '免费试用 →',
    appLanguage: '应用语言',
  },
  JA: {
    chatHub: 'チャットハブ',
    marketplace: 'マーケットプレイス',
    agents: 'エージェント',
    discoverNew: '新着を探す',
    signIn: 'サインイン',
    getStarted: 'はじめる →',
    logout: 'ログアウト',
    tryFree: '無料で試す →',
    appLanguage: 'アプリ言語',
  },
  KO: {
    chatHub: '채팅 허브',
    marketplace: '마켓플레이스',
    agents: '에이전트',
    discoverNew: '새 항목 발견',
    signIn: '로그인',
    getStarted: '시작하기 →',
    logout: '로그아웃',
    tryFree: '무료로 시작 →',
    appLanguage: '앱 언어',
  },
  HI: {
    chatHub: 'चैट हब',
    marketplace: 'मार्केटप्लेस',
    agents: 'एजेंट्स',
    discoverNew: 'नया खोजें',
    signIn: 'साइन इन',
    getStarted: 'शुरू करें →',
    logout: 'लॉग आउट',
    tryFree: 'मुफ्त आज़माएं →',
    appLanguage: 'ऐप भाषा',
  },
  UR: {
    chatHub: 'چیٹ ہب',
    marketplace: 'مارکیٹ پلیس',
    agents: 'ایجنٹس',
    discoverNew: 'نیا دریافت کریں',
    signIn: 'سائن اِن',
    getStarted: 'شروع کریں ←',
    logout: 'لاگ آؤٹ',
    tryFree: 'مفت آزمائیں ←',
    appLanguage: 'ایپ زبان',
  },
  TR: {
    chatHub: 'Sohbet Merkezi',
    marketplace: 'Pazar Yeri',
    agents: 'Ajanlar',
    discoverNew: 'Yenileri keşfet',
    signIn: 'Giriş yap',
    getStarted: 'Başla →',
    logout: 'Çıkış yap',
    tryFree: 'Ücretsiz dene →',
    appLanguage: 'Uygulama dili',
  },
  RU: {
    chatHub: 'Чат-центр',
    marketplace: 'Маркетплейс',
    agents: 'Агенты',
    discoverNew: 'Открыть новое',
    signIn: 'Войти',
    getStarted: 'Начать →',
    logout: 'Выйти',
    tryFree: 'Попробовать бесплатно →',
    appLanguage: 'Язык приложения',
  },
  IT: {
    chatHub: 'Hub Chat',
    marketplace: 'Marketplace',
    agents: 'Agenti',
    discoverNew: 'Scopri novità',
    signIn: 'Accedi',
    getStarted: 'Inizia →',
    logout: 'Esci',
    tryFree: 'Prova gratis →',
    appLanguage: 'Lingua app',
  },
  NL: {
    chatHub: 'Chat Hub',
    marketplace: 'Marktplaats',
    agents: 'Agenten',
    discoverNew: 'Ontdek nieuw',
    signIn: 'Inloggen',
    getStarted: 'Aan de slag →',
    logout: 'Uitloggen',
    tryFree: 'Probeer gratis →',
    appLanguage: 'App-taal',
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(localStorage.getItem(STORAGE_KEY) || 'EN');

  const setLanguage = (next) => {
    const code = (next || 'EN').toUpperCase();
    setLanguageState(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  const t = (key, fallback = '') => {
    const pack = translations[language] || translations.EN;
    return pack[key] || translations.EN[key] || fallback || key;
  };

  const value = useMemo(() => ({ language, setLanguage, t }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

