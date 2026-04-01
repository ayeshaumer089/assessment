import React from 'react';
import { MODELS } from '../../constants';
import { getModelPriceDisplay } from '../../utils/helpers';

const FeaturedModels = ({ openApp, openModal }) => {
  const featured = MODELS.filter(m => m.badge === 'hot' || m.badge === 'new').slice(0, 6);

  return (
    <section className="section alt">
      <div className="sec-hd">
        <h2>Featured Models</h2>
        <span className="sec-link" onClick={() => openApp('marketplace')}>Browse all 525 →</span>
      </div>
      <div className="models-grid">
        {featured.map((m) => (
          <div key={m.id} className="mcard" onClick={() => openModal(m.id)}>
            <div className="mcard-top">
              <div className="mcard-icon-wrap">
                <div className="mcard-icon" style={{ background: m.bg }}>{m.icon}</div>
                <div>
                  <div className="mcard-name">{m.name}</div>
                  <div className="mcard-org">{m.org}</div>
                </div>
              </div>
              {m.badge && <span className={`mcard-badge ${m.badgeClass}`}>{m.badge.toUpperCase()}</span>}
            </div>
            <div className="mcard-desc">{m.desc}</div>
            <div className="mcard-tags">
              {m.tags.slice(0, 3).map((t, i) => (
                <span key={i} className="tag t-blue">{t}</span>
              ))}
            </div>
            <div className="mcard-footer">
              <div className="mcard-rating">
                <span className="stars">★★★★★</span>
                <span>{m.rating}</span>
              </div>
              <div className="mcard-price">{getModelPriceDisplay(m)}</div>
              <button className="mcard-cta">Details</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedModels;
