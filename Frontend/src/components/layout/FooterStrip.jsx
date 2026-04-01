import React from 'react';

const FooterStrip = () => {
  return (
    <div className="bg-strip">
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>NexusAI Model Marketplace</div>
      <div>
        <a href="#">Models</a>
        <a href="#">Research</a>
        <a href="#">API</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
    </div>
  );
};

export default FooterStrip;
