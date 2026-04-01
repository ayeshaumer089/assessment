import React from 'react';
import { BUDGET_TIERS } from '../../constants';

const BudgetSection = ({ openApp }) => {
  return (
    <section className="section alt">
      <div className="sec-hd">
        <div>
          <h2>Find Models by Budget</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Options for every scale, from research to enterprise.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {BUDGET_TIERS.map((tier, i) => (
          <div key={i} className="mcard" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => openApp('chat')}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{tier.icon}</div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '1rem' }}>{tier.title}</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '1rem' }}>{tier.desc}</p>
            <div className="mcard-tags">
              {tier.tags.map((tag, j) => (
                <span key={j} className="tag t-blue" style={{ fontSize: '0.65rem' }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BudgetSection;
