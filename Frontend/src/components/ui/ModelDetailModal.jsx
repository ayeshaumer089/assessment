import React, { useState } from 'react';
import Modal from './Modal';

const ModelDetailModal = ({ isOpen, onClose, model }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!model) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'guide', label: 'How to Use' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'prompt', label: 'Prompt Guide' },
    { id: 'agent', label: 'Agent Creation' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-header">
        <div className="modal-icon" style={{ background: model.bg }}>{model.icon}</div>
        <div className="modal-title-block">
          <h2>{model.name}</h2>
          <p>by {model.org} · {model.tags[0]} model</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {model.badge && (
            <span className={`mcard-badge ${model.badgeClass}`} style={{ fontSize: '0.72rem', padding: '0.25rem 0.7rem', borderRadius: '2rem' }}>
              {model.badge.charAt(0).toUpperCase() + model.badge.slice(1)}
            </span>
          )}
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="modal-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            className={`mtab ${activeTab === tab.id ? 'on' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="modal-body">
        {activeTab === 'overview' && (
          <div className="modal-panel on">
            <div className="detail-grid">
              <div className="detail-card">
                <h4>Description</h4>
                <p>{model.desc}</p>
              </div>
              <div className="detail-card">
                <h4>Input / Output</h4>
                <p>
                  <strong>Input:</strong> Text, images, audio, PDFs<br />
                  <strong>Output:</strong> Text, code, structured data<br />
                  <strong>Context:</strong> 128K tokens<br />
                  <strong>Latency:</strong> ~1.2s avg
                </p>
              </div>
            </div>
            <div className="detail-card" style={{ marginBottom: '1rem' }}>
              <h4>Use Cases</h4>
              <div className="use-case-grid">
                {['Content writing', 'Code generation', 'Analysis', 'Translation', 'Education', 'Data'].map((uc, i) => (
                  <div key={i} className="uc-item">
                    <div className="uc-icon">✨</div>
                    <div className="uc-label">{uc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="modal-panel on">
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>How to Use This Model</h4>
            <div className="agent-step">
              <div className="agent-step-num">1</div>
              <div className="agent-step-content">
                <h5>Get API Access</h5>
                <p>Sign up for a NexusAI account (free). Navigate to Settings → API Keys and create a new key.</p>
              </div>
            </div>
            {/* Add more steps as needed */}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="modal-panel on">
            <div className="pricing-grid">
              <div className="price-card">
                <div className="price-tier">Pay-per-use</div>
                <div className="price-amt">$5</div>
                <div className="price-unit">per 1M tokens</div>
              </div>
              <div className="price-card featured">
                <div className="price-tag-ft">Most Popular</div>
                <div className="price-tier">Pro</div>
                <div className="price-amt">$49</div>
                <div className="price-unit">per month</div>
              </div>
              <div className="price-card">
                <div className="price-tier">Enterprise</div>
                <div className="price-amt">Custom</div>
                <div className="price-unit">negotiated</div>
              </div>
            </div>
          </div>
        )}

        {/* Add other tabs content here... */}
      </div>
    </Modal>
  );
};

export default ModelDetailModal;
