import React from 'react';
import { logout } from '../../services/auth';
import { getAuthToken } from '../../services/session';
import { useLanguage } from '../../context/LanguageContext';

const AppNavbar = ({ activeTab, setActiveTab, goHome, goSignIn, isAuthenticated, onLogout, openModal, currentModelId }) => {
  const { t } = useLanguage();
  const handleLogout = async () => {
    const token = getAuthToken();
    try {
      if (token) {
        await logout(token);
      }
    } catch (_error) {
      // Frontend still signs out locally even if API call fails.
    } finally {
      onLogout();
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      handleLogout();
      return;
    }
    goSignIn();
  };

  return (
    <div className="app-nav">
      <div className="logo" style={{ fontSize: '1.1rem' }} onClick={goHome}>
        <div className="logo-mark" style={{ width: '22px', height: '22px', borderRadius: '5px' }}>
          <svg viewBox="0 0 14 14" style={{ width: '11px', height: '11px' }}>
            <path d="M7 1 L13 7 L7 13 L1 7 Z" />
          </svg>
        </div>
        NexusAI
      </div>
      <div className="app-tabs">
        <button 
          className={`app-tab ${activeTab === 'chat' ? 'active' : ''}`} 
          onClick={() => setActiveTab('chat')}
        >
          💬 {t('chatHub', 'Chat Hub')}
        </button>
        <button 
          className={`app-tab ${activeTab === 'marketplace' ? 'active' : ''}`} 
          onClick={() => setActiveTab('marketplace')}
        >
          🛍 {t('marketplace', 'Marketplace')}
        </button>
        <button 
          className={`app-tab ${activeTab === 'agents' ? 'active' : ''}`} 
          onClick={() => setActiveTab('agents')}
        >
          🤖 {t('agents', 'Agents')}
        </button>
        <button 
          className={`app-tab ${activeTab === 'research' ? 'active' : ''}`} 
          onClick={() => setActiveTab('research')}
        >
          🔬 {t('discoverNew', 'Discover New')}
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="btn btn-ghost" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={handleAuthAction}>
          {isAuthenticated ? t('logout', 'Logout') : t('signIn', 'Sign in')}
        </button>
        <button className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openModal(currentModelId)}>{t('tryFree', 'Try free →')}</button>
      </div>
    </div>
  );
};

export default AppNavbar;
