import React from 'react';

const MarketplaceFilters = ({ 
  filters, 
  toggleFilter, 
  priceRange, 
  setPriceRange, 
  setFilters,
  openApp 
}) => {
  return (
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
          <QuickGuideButton text="📐 Prompt engineering tips" />
          <QuickGuideButton text="💰 Compare pricing" />
          <QuickGuideButton text="🤖 Build an agent" />
        </div>
      </div>
    </aside>
  );
};

const QuickGuideButton = ({ text }) => (
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
    {text}
  </button>
);

export default MarketplaceFilters;
