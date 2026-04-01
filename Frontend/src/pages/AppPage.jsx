import React, { useState } from 'react';
import AppNavbar from '../components/layout/AppNavbar';
import ChatHub from '../components/chat/ChatHub';
import Marketplace from '../components/marketplace/Marketplace';
import ResearchFeed from '../components/research/ResearchFeed';
import AgentBuilder from '../components/agents/AgentBuilder';
import { MODELS } from '../constants';
import ModelDetailModal from '../components/ui/ModelDetailModal';

const AppPage = ({ activeTab, setActiveTab, goHome, currentModelId, setCurrentModelId, searchQuery, setSearchQuery, isObDone, onboardingAnswers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

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
        openModal={openModal}
        currentModelId={currentModelId}
      />
      
      <div className="app-body">
        {activeTab === 'chat' && (
          <ChatHub 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
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
