import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OnboardingOverlay from './components/ui/OnboardingOverlay';
import { clearAuthToken, getOnboardingDone, isAuthenticated, setOnboardingDone } from './services/session';
import { useLanguage } from './context/LanguageContext';

function App() {
  const { language } = useLanguage();
  const VALID_TABS = new Set(['chat', 'marketplace', 'agents', 'research']);
  const [activePage, setActivePage] = useState('landing');
  const [activeTab, setActiveTab] = useState('chat');
  const [pendingPostAuthTab, setPendingPostAuthTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [currentModelId, setCurrentModelId] = useState('gpt5');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isObDone, setIsObDone] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState({});
  const [resetToken, setResetToken] = useState('');
  const authenticated = isAuthenticated();

  useEffect(() => {
    // Show onboarding for new users if not done
    const done = getOnboardingDone();
    if (!done) {
      // setIsOnboardingOpen(true); // Uncomment to enable on load
    }
  }, []); 

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    const rtlLanguages = new Set(['AR', 'UR']);
    document.documentElement.dir = rtlLanguages.has(language) ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const token = params.get('token') || '';
    if (page === 'reset-password') {
      setResetToken(token);
      setActivePage('reset-password');
    }
  }, []);

  const resolveTab = (tab) => (VALID_TABS.has(tab) ? tab : 'chat');

  const openApp = (tab = 'chat', query = '', attachments = []) => {
    const nextTab = resolveTab(tab);
    setActivePage('app');
    setActiveTab(nextTab);
    setPendingPostAuthTab(nextTab);
    if (query) setSearchQuery(query);
    if (attachments.length > 0) setAttachedFiles(attachments);
  };

  const goAgentWithAuth = () => {
    if (isAuthenticated()) {
      openApp('agents');
      return;
    }
    setPendingPostAuthTab('agents');
    setActivePage('signin');
  };

  const goHome = () => {
    setActivePage('landing');
  };

  const goSignIn = (postAuthTab = 'chat') => {
    setPendingPostAuthTab(resolveTab(postAuthTab));
    setActivePage('signin');
  };

  const goSignUp = () => {
    setActivePage('signup');
  };

  const goForgotPassword = () => {
    setActivePage('forgot-password');
  };

  const logout = () => {
    clearAuthToken();
    setActivePage('landing');
  };

  const handleOnboardingComplete = (answers) => {
    setIsObDone(true);
    setOnboardingAnswers(answers);
    setOnboardingDone();
    openApp('chat');
  };

  return (
    <div className="app-container">
      {activePage === 'landing' ? (
        <LandingPage openApp={openApp} goSignIn={goSignIn} goAgentWithAuth={goAgentWithAuth} />
      ) : activePage === 'signin' ? (
        <SignInPage goHome={goHome} goSignUp={goSignUp} goForgotPassword={goForgotPassword} openApp={openApp} postAuthTab={pendingPostAuthTab} />
      ) : activePage === 'signup' ? (
        <SignUpPage goHome={goHome} goSignIn={goSignIn} openApp={openApp} postAuthTab={pendingPostAuthTab} />
      ) : activePage === 'forgot-password' ? (
        <ForgotPasswordPage goHome={goHome} goSignIn={goSignIn} goSignUp={goSignUp} />
      ) : activePage === 'reset-password' ? (
        <ResetPasswordPage goHome={goHome} goSignIn={goSignIn} goSignUp={goSignUp} token={resetToken} />
      ) : (
        <AppPage 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          goHome={goHome}
          goSignIn={goSignIn}
          isAuthenticated={authenticated}
          onLogout={logout}
          currentModelId={currentModelId}
          setCurrentModelId={setCurrentModelId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          attachedFiles={attachedFiles}
          setAttachedFiles={setAttachedFiles}
          isObDone={isObDone}
          onboardingAnswers={onboardingAnswers}
        />
      )}
      <OnboardingOverlay 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />
      <div id="nx-toast"></div>
    </div>
  );
}

export default App;
