import React, { useMemo, useState } from 'react';
import { MODELS } from '../../constants';
import { getModelPriceDisplay } from '../../utils/helpers';

const Marketplace = ({ openModal, openApp, models = [] }) => {
  const [search, setSearch] = useState('');
  const [selectedLab, setSelectedLab] = useState('all');
  const [filters, setFilters] = useState({
    providers: { OpenAI: true, Anthropic: true, Google: true, Meta: true, Cohere: true },
    capabilities: { Language: false, Vision: false, Code: false, Audio: false, Video: false },
    pricingModel: { payPerUse: true, subscription: true, freeTier: false, enterprise: false },
    license: { commercial: true, openSource: true, researchOnly: false },
    minRating: 'any'
  });
  const [priceRange, setPriceRange] = useState(100);
  const modelsData = Array.isArray(models) && models.length > 0 ? models : MODELS;
  const labTabs = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(
        modelsData
          .map((m) => (m.org || '').trim())
          .filter(Boolean),
      ),
    );
    return uniqueNames.sort((a, b) => a.localeCompare(b));
  }, [modelsData]);

  const filteredLabs = labTabs.filter((labName) =>
    search.trim() === '' ? true : labName.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleFilter = (category, key) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const filteredModels = modelsData.filter(m => {
    const matchesSearch = search === '' || 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.org.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase()) ||
      (m.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    const matchesLab = selectedLab === 'all' || m.org === selectedLab;
    
    return matchesSearch && matchesLab;
  });

  return (
    <div id="marketplace-view" style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'column' }}>
      <div className="mkt-header">
        <span className="mkt-title">Model Marketplace</span>
        <div className="mkt-search-wrap">
          <div className="mkt-search-inner">
            <div className="mkt-si-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input 
              className="mkt-search" 
              type="text" 
              placeholder="Search models, capabilities…" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="labs-bar">
        <div className="labs-lbl">Filter by Lab:</div>
        <button
          className={`lab-pill ${selectedLab === 'all' ? 'on' : ''}`}
          onClick={() => setSelectedLab('all')}
          title="Show all labs"
        >
          <span className="lab-logo">✦</span>
          All Labs
        </button>
        {filteredLabs.map((labName) => (
          <button 
            key={labName}
            className={`lab-pill ${selectedLab === labName ? 'on' : ''}`}
            onClick={() => setSelectedLab(labName)}
          >
            <span className="lab-logo">●</span>
            {labName}
          </button>
        ))}
      </div>

      <div className="mkt-body">
        <aside className="mkt-sidebar">
          {/* Need help choosing banner */}
          <div 
            style={{
              background: 'var(--accent-lt)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius)',
              padding: '0.875rem',
              marginBottom: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => openApp && openApp('chat')}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '2px' }}>
              ✦ Need help choosing?
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text2)', lineHeight: 1.4 }}>
              Chat with our AI guide for a personalised recommendation in 60 seconds.
            </div>
          </div>

          {/* Provider Filter */}
          <div className="mkt-filter-sec">
            <div className="mkt-filter-title">Provider</div>
            {Object.keys(filters.providers).map(provider => (
              <label key={provider} className="mkt-check">
                <input 
                  type="checkbox" 
                  checked={filters.providers[provider]}
                  onChange={() => toggleFilter('providers', provider)}
                />
                {provider}
              </label>
            ))}
          </div>

          {/* Capabilities Filter */}
          <div className="mkt-filter-sec">
            <div className="mkt-filter-title">Capabilities</div>
            {Object.keys(filters.capabilities).map(cap => (
              <label key={cap} className="mkt-check">
                <input 
                  type="checkbox" 
                  checked={filters.capabilities[cap]}
                  onChange={() => toggleFilter('capabilities', cap)}
                />
                {cap}
              </label>
            ))}
          </div>

          {/* Pricing Model Filter */}
          <div className="mkt-filter-sec">
            <div className="mkt-filter-title">Pricing Model</div>
            <label className="mkt-check">
              <input 
                type="checkbox" 
                checked={filters.pricingModel.payPerUse}
                onChange={() => toggleFilter('pricingModel', 'payPerUse')}
              />
              Pay-per-use
            </label>
            <label className="mkt-check">
              <input 
                type="checkbox" 
                checked={filters.pricingModel.subscription}
                onChange={() => toggleFilter('pricingModel', 'subscription')}
              />
              Subscription
            </label>
            <label className="mkt-check">
              <input 
                type="checkbox" 
                checked={filters.pricingModel.freeTier}
                onChange={() => toggleFilter('pricingModel', 'freeTier')}
              />
              Free tier
            </label>
            <label className="mkt-check">
              <input 
                type="checkbox" 
                checked={filters.pricingModel.enterprise}
                onChange={() => toggleFilter('pricingModel', 'enterprise')}
              />
              Enterprise
            </label>
          </div>

          {/* Price Range Filter */}
          <div className="mkt-filter-sec">
            <div className="mkt-filter-title">Max Price /1M tokens</div>
            <input 
              type="range" 
              className="price-range" 
              min="0" 
              max="100" 
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginTop: '4px' }}>
              Up to ${priceRange}
            </div>
          </div>

          {/* Min Rating Filter */}
          <div className="mkt-filter-sec">
            <div className="mkt-filter-title">Min Rating</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button 
                className={`fopt ${filters.minRating === 'any' ? 'on' : ''}`}
                style={{ fontSize: '0.7rem' }}
                onClick={() => setFilters(prev => ({ ...prev, minRating: 'any' }))}
              >
                Any
              </button>
              <button 
                className={`fopt ${filters.minRating === '4+' ? 'on' : ''}`}
                style={{ fontSize: '0.7rem' }}
                onClick={() => setFilters(prev => ({ ...prev, minRating: '4+' }))}
              >
                4+ ⭐
              </button>
              <button 
                className={`fopt ${filters.minRating === '4.5+' ? 'on' : ''}`}
                style={{ fontSize: '0.7rem' }}
                onClick={() => setFilters(prev => ({ ...prev, minRating: '4.5+' }))}
              >
                4.5+ ⭐
              </button>
            </div>
          </div>

          {/* License Filter */}
          <div className="mkt-filter-sec">
            <div className="mkt-filter-title">Licence</div>
            <label className="mkt-check">
              <input 
                type="checkbox" 
                checked={filters.license.commercial}
                onChange={() => toggleFilter('license', 'commercial')}
              />
              Commercial
            </label>
            <label className="mkt-check">
              <input 
                type="checkbox" 
                checked={filters.license.openSource}
                onChange={() => toggleFilter('license', 'openSource')}
              />
              Open source
            </label>
            <label className="mkt-check">
              <input 
                type="checkbox" 
                checked={filters.license.researchOnly}
                onChange={() => toggleFilter('license', 'researchOnly')}
              />
              Research only
            </label>
          </div>

          {/* Quick Guides */}
          <div className="mkt-filter-sec">
            <div className="mkt-filter-title">Quick Guides</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button 
                style={{
                  textAlign: 'left',
                  padding: '0.45rem 0.65rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontFamily: 'inherit',
                  color: 'var(--text2)',
                  transition: 'all 0.15s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--text2)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                📐 Prompt engineering tips
              </button>
              <button 
                style={{
                  textAlign: 'left',
                  padding: '0.45rem 0.65rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontFamily: 'inherit',
                  color: 'var(--text2)',
                  transition: 'all 0.15s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--text2)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                💰 Compare pricing
              </button>
              <button 
                style={{
                  textAlign: 'left',
                  padding: '0.45rem 0.65rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontFamily: 'inherit',
                  color: 'var(--text2)',
                  transition: 'all 0.15s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--text2)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                🤖 Build an agent
              </button>
            </div>
          </div>
        </aside>

        <main className="mkt-grid">
          {filteredModels.map(m => (
            <div key={m.id} className="mcard" onClick={() => openModal(m.id)}>
              <div className="mcard-top">
                <div className="mcard-icon-wrap">
                  <div className="mcard-icon" style={{ background: m.bg }}>{m.icon}</div>
                  <div>
                    <div className="mcard-name">{m.name}</div>
                    <div className="mcard-org">{m.org}</div>
                  </div>
                </div>
                {m.badge && <span className={`mcard-badge ${m.badgeClass}`}>{m.badge.charAt(0).toUpperCase() + m.badge.slice(1)}</span>}
              </div>
              <div className="mcard-desc">{m.desc}</div>
              <div className="mcard-tags">
                {m.tags.map((tag, idx) => (
                  <span key={idx} className="tag t-blue">{tag}</span>
                ))}
              </div>
              <div className="mcard-footer">
                <div className="mcard-rating">
                  <span className="stars">★★★★★</span>
                  {m.rating} ({m.reviews?.toLocaleString() || '0'})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="mcard-price">{m.price || getModelPriceDisplay(m)}</span>
                  <button 
                    className="mcard-cta" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(m.id, 'guide');
                    }}
                  >
                    How to Use →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Marketplace;
