import React from 'react';
import { QUICK_USE_CASES } from '../../constants';

const QuickStartSection = ({ openApp }) => {
  return (
    <section className="section">
      <div className="sec-hd">
        <div>
          <h2>Quick-Start by Use Case</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Select your primary goal to get a tailored prompt and model selection.</p>
        </div>
        <button className="btn btn-ghost">Browse use cases →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {QUICK_USE_CASES.map((uc, i) => (
          <div key={i} className="mcard" style={{ padding: '1.5rem', cursor: 'pointer', borderLeft: `4px solid ${uc.color}` }} onClick={() => openApp('chat', uc.title)}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{uc.icon}</div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '1rem' }}>{uc.title}</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.5 }}>{uc.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickStartSection;
