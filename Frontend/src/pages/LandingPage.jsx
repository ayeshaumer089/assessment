import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import FeaturedModels from '../components/home/FeaturedModels';
import LabList from '../components/home/LabList';
import ComparisonTable from '../components/home/ComparisonTable';
import TrendingSection from '../components/home/TrendingSection';
import UseCaseGrid from '../components/home/UseCaseGrid';
import BudgetSection from '../components/home/BudgetSection';
import QuickStartSection from '../components/home/QuickStartSection';
import Newsletter from '../components/home/Newsletter';
import FooterStrip from '../components/layout/FooterStrip';
import ModelDetailModal from '../components/ui/ModelDetailModal';
import { MODELS } from '../constants';

const LandingPage = ({ openApp, goSignIn, goAgentWithAuth }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const openModal = (id) => {
    const model = MODELS.find(m => m.id === id);
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  const goHome = () => window.scrollTo(0, 0);

  return (
    <div id="landing-page" className="page active">
      <Navbar goHome={goHome} openApp={openApp} goSignIn={goSignIn} />
      
      <Hero openApp={openApp} goAgentWithAuth={goAgentWithAuth} />

      <FeaturedModels openApp={openApp} openModal={openModal} />

      <LabList />

      <ComparisonTable />

      <TrendingSection openModal={openModal} />

      <UseCaseGrid openApp={openApp} />

      <BudgetSection openApp={openApp} />

      <QuickStartSection openApp={openApp} />

      <Newsletter />

      <FooterStrip />

      <ModelDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        model={selectedModel} 
      />
    </div>
  );
};

export default LandingPage;
