import React from 'react';
import { RESEARCH } from '../../constants';

const ResearchFeed = () => {
  return (
    <div id="research-view" style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'var(--bg)' }}>
      <div className="sec-hd">
        <h2>Latest in AI Research</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {RESEARCH.map((item, i) => (
          <div key={i} className="mcard" style={{ padding: '1.5rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <div style={{ background: 'var(--blue-lt)', color: 'var(--blue)', fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>{item.date}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{item.org}</div>
            </div>
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{item.title}</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.55 }}>{item.summary}</p>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 600 }}>Read paper →</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Research Study</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchFeed;
