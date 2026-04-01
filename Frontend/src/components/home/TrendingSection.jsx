import React from 'react';
import { MODELS } from '../../constants';

const TrendingSection = ({ openModal }) => {
  const trendingModels = MODELS.filter(m => m.badge === 'hot').slice(0, 4);

  return (
    <section className="section">
      <div className="sec-hd">
        <div>
          <h2>🔥 Trending This Week</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Most active and highly rated models across the marketplace.</p>
        </div>
        <button className="btn btn-ghost">View current trends →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {trendingModels.map(m => (
          <div key={m.id} className="mcard" onClick={() => openModal(m.id)}>
            <div className="mcard-top">
              <div className="mcard-icon" style={{ background: m.bg }}>{m.icon}</div>
              <span className={`mcard-badge ${m.badgeClass}`}>{m.badge.toUpperCase()}</span>
            </div>
            <h3 className="mcard-name">{m.name}</h3>
            <div className="mcard-org">by {m.org}</div>
            <p className="mcard-desc" style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.5 }}>{m.desc}</p>
            <div className="mcard-footer">
              <div className="mcard-rating">{m.rating}⭐ <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>({m.reviews.toLocaleString()})</span></div>
              <div className="mcard-price">{m.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
