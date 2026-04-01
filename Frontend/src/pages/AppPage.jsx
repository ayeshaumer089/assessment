import React, { useEffect, useState } from 'react';
import AppNavbar from '../components/layout/AppNavbar';
import ChatHub from '../components/chat/ChatHub';
import Marketplace from '../components/marketplace/Marketplace';
import ResearchFeed from '../components/research/ResearchFeed';
import AgentBuilder from '../components/agents/AgentBuilder';
import { MODELS } from '../constants';
import ModelDetailModal from '../components/ui/ModelDetailModal';
import { fetchModels } from '../services/models';

const AppPage = ({ activeTab, setActiveTab, goHome, goSignIn, isAuthenticated, onLogout, currentModelId, setCurrentModelId, searchQuery, setSearchQuery, isObDone, onboardingAnswers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [chatModels, setChatModels] = useState(MODELS);

  useEffect(() => {
    let isMounted = true;
    fetchModels()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setChatModels(data);
        }
      })
      .catch(() => {
        // Keep fallback models from constants to avoid breaking UI if backend is unreachable.
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (id) => {
    const model = MODELS.find(m => m.id === id);
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  return (
    <div id="app-page" className="active">
      <AppNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        goHome={goHome} 
        goSignIn={goSignIn}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        openModal={openModal}
        currentModelId={currentModelId}
      />
      
      <div className="app-body">
        {activeTab === 'chat' && (
          <ChatHub 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            models={chatModels}
            currentModelId={currentModelId} 
            setCurrentModelId={setCurrentModelId} 
            isObDone={isObDone}
            onboardingAnswers={onboardingAnswers}
          />
        )}
        
        {activeTab === 'marketplace' && (
          <Marketplace openModal={openModal} />
        )}
        
        {activeTab === 'agents' && (
          <AgentBuilder />
        )}
        
        {activeTab === 'research' && (
          <ResearchFeed />
        )}
      </div>

      <ModelDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        model={selectedModel} 
      />
    </div>
  );
};

export default AppPage;
