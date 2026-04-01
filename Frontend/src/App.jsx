import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import OnboardingOverlay from './components/ui/OnboardingOverlay';
import { MODELS } from './constants';

function App() {
  const [activePage, setActivePage] = useState('landing');
  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentModelId, setCurrentModelId] = useState('gpt5');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isObDone, setIsObDone] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState({});

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

  const handleOnboardingComplete = (answers) => {
    setIsObDone(true);
    setOnboardingAnswers(answers);
    localStorage.setItem('_obDone', 'true');
    openApp('chat');
  };

  return (
    <div className="app-container">
      {activePage === 'landing' ? (
        <LandingPage openApp={openApp} />
      ) : (
        <AppPage 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          goHome={goHome}
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
