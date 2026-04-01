import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingOverlay from './components/ui/OnboardingOverlay';

function App() {
  const [activePage, setActivePage] = useState('landing');
  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentModelId, setCurrentModelId] = useState('gpt5');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isObDone, setIsObDone] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState({});
  const isAuthenticated = Boolean(localStorage.getItem('authToken'));

  useEffect(() => {
    // Show onboarding for new users if not done
    const done = localStorage.getItem('_obDone');
    if (!done) {
      // setIsOnboardingOpen(true); // Uncomment to enable on load
    }
  }, []);

  const openApp = (tab = 'chat', query = '') => {
    setActivePage('app');
    setActiveTab(tab);
    if (query) setSearchQuery(query);
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
    localStorage.removeItem('authToken');
    setActivePage('landing');
  };

  const handleOnboardingComplete = (answers) => {
    setIsObDone(true);
    setOnboardingAnswers(answers);
    localStorage.setItem('_obDone', 'true');
    openApp('chat');
  };

  return (
    <div className="app-container">
      {activePage === 'landing' ? (
        <LandingPage openApp={openApp} goSignIn={goSignIn} />
      ) : activePage === 'signin' ? (
        <SignInPage goHome={goHome} goSignUp={goSignUp} openApp={openApp} />
      ) : activePage === 'signup' ? (
        <SignUpPage goHome={goHome} goSignIn={goSignIn} openApp={openApp} />
      ) : (
        <AppPage 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          goHome={goHome}
          goSignIn={goSignIn}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
          currentModelId={currentModelId}
          setCurrentModelId={setCurrentModelId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
