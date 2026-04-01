import React, { useState } from 'react';

const Navbar = ({ goHome, openApp, goSignIn }) => {
  const [lang, setLang] = useState({ code: 'EN', label: 'English' });
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const toggleLangMenu = (e) => {
    e.stopPropagation();
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  const handleSetLang = (code, label) => {
    setLang({ code, label });
    setIsLangMenuOpen(false);
  };

  const languages = [
    { code: 'EN', label: 'English', flag: '🇺🇸' },
    { code: 'AR', label: 'العربية', flag: '🇸🇦' },
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' },
    { code: 'PT', label: 'Português', flag: '🇧🇷' },
    { code: 'ZH', label: '中文', flag: '🇨🇳' },
    { code: 'JA', label: '日本語', flag: '🇯🇵' },
    { code: 'KO', label: '한국어', flag: '🇰🇷' },
    { code: 'HI', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'UR', label: 'اردو', flag: '🇵🇰' },
    { code: 'TR', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'RU', label: 'Русский', flag: '🇷🇺' },
    { code: 'IT', label: 'Italiano', flag: '🇮🇹' },
    { code: 'NL', label: 'Nederlands', flag: '🇳🇱' },
  ];

  return (
    <nav>
      <div className="logo" onClick={goHome}>
        <div className="logo-mark">
          <svg viewBox="0 0 14 14">
            <path d="M7 1 L13 7 L7 13 L1 7 Z" />
          </svg>
        </div>
        NexusAI
      </div>
      <ul className="nav-links">
        <li><a onClick={() => openApp('chat')}>Chat Hub</a></li>
        <li><a onClick={() => openApp('marketplace')}>Marketplace</a></li>
        <li><a onClick={() => openApp('research')}>Discover New</a></li>
        <li><a onClick={() => openApp('agents')}>Agents</a></li>
      </ul>
      <div className="nav-actions">
        <div className="lang-selector-wrap">
          <button className="lang-btn" onClick={toggleLangMenu} title="Change language">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>{lang.code}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '10px', height: '10px', flexShrink: 0 }}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {isLangMenuOpen && (
            <div className="lang-menu open">
              <div className="lang-menu-head">App Language</div>
              {languages.map((l) => (
                <button 
                  key={l.code} 
                  className={`lang-opt ${lang.code === l.code ? 'active' : ''}`}
                  onClick={() => handleSetLang(l.code, l.label)}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="btn btn-ghost" onClick={goSignIn}>Sign in</button>
        <button className="btn btn-primary" onClick={() => openApp('chat')}>Get Started →</button>
      </div>
    </nav>
  );
};

export default Navbar;
