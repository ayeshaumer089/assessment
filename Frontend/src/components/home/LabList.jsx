import React from 'react';
import { AI_LABS } from '../../constants';

const LabList = () => {
  return (
    <section className="section">
      <div className="sec-hd">
        <div>
          <h2>Browse by AI Lab</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '0.25rem' }}>The world's leading research institutions and their model counts.</p>
        </div>
        <button className="btn btn-ghost">View all labs →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {AI_LABS.map(lab => (
          <div key={lab.id} className="mcard" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: lab.bg, display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.2rem' }}>{lab.icon}</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{lab.name}</h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{lab.count} models available</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.5 }}>{lab.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LabList;
