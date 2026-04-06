import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingOverlay from './components/ui/OnboardingOverlay';
import { clearAuthToken, getOnboardingDone, isAuthenticated, setOnboardingDone } from './services/session';

function App() {
  const [activePage, setActivePage] = useState('landing');
  const [activeTab, setActiveTab] = useState('chat');
  const [pendingPostAuthTab, setPendingPostAuthTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [currentModelId, setCurrentModelId] = useState('gpt5');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isObDone, setIsObDone] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState({});
  const authenticated = isAuthenticated();

  useEffect(() => {
    // Show onboarding for new users if not done
    const done = getOnboardingDone();
    if (!done) {
      // setIsOnboardingOpen(true); // Uncomment to enable on load
    }
  }, []);

  const openApp = (tab = 'chat', query = '', attachments = []) => {
    setActivePage('app');
    setActiveTab(tab);
    setPendingPostAuthTab('chat');
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

  const goSignIn = () => {
    setActivePage('signin');
  };

  const goSignUp = () => {
    setActivePage('signup');
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
        <SignInPage goHome={goHome} goSignUp={goSignUp} openApp={openApp} postAuthTab={pendingPostAuthTab} />
      ) : activePage === 'signup' ? (
        <SignUpPage goHome={goHome} goSignIn={goSignIn} openApp={openApp} postAuthTab={pendingPostAuthTab} />
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
