import React, { useState, useEffect } from 'react';

const RightPanel = ({ activeModel, onboardingAnswers }) => {
  const [sparkBars, setSparkBars] = useState(Array.from({ length: 24 }, () => 10 + Math.random() * 36));
  const [kpis, setKpis] = useState({
    req: 1284,
    lat: 1.2,
    cost: 2.40
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkBars(prev => {
        const next = [...prev.slice(1), 10 + Math.random() * 36];
        return next;
      });
      setKpis(prev => ({
        req: prev.req + Math.floor(Math.random() * 3),
        lat: parseFloat((1.0 + Math.random() * 0.6).toFixed(1)),
        cost: Math.max(0, prev.cost + (Math.random() - 0.5) * 0.05)
      }));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  if (!activeModel) return null;

  const profileSteps = [
    { key: 'goal', label: 'Goal' },
    { key: 'audience', label: 'Audience' },
    { key: 'level', label: 'Experience' },
    { key: 'budget', label: 'Budget' },
  ];

  const filledCount = profileSteps.filter(s => onboardingAnswers[s.key]).length;

  return (
    <aside className="rpanel" id="rpanel">
      {onboardingAnswers && Object.keys(onboardingAnswers).length > 0 && (
        <div className="rp-sec">
          <div className="rp-lbl">Your Profile</div>
          {profileSteps.map((s, i) => {
            const val = onboardingAnswers[s.key];
            return (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '0.45rem 0.6rem', 
                  borderRadius: '8px', 
                  marginBottom: '4px', 
                  background: val ? 'var(--accent-lt)' : 'var(--bg)', 
                  border: `1px solid ${val ? 'var(--accent-border)' : 'var(--border)'}` 
                }}
              >
                <span style={{ fontSize: '0.85rem' }}>{val ? '✅' : '⬜'}</span>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: val ? 'var(--accent)' : 'var(--text2)' }}>{s.label}</div>
                  {val && <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: '1px' }}>{val}</div>}
                </div>
              </div>
            );
          })}
          {filledCount > 0 && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textAlign: 'center', marginTop: '0.5rem' }}>
              {filledCount}/4 answered
            </div>
          )}
        </div>
      )}

      <div className="rp-sec">
        <div className="rp-lbl">Active Model</div>
        <div className="active-mcard">
          <div className="am-hd">
            <div className="sb-mi" style={{ background: activeModel.bg, width: '32px', height: '32px', fontSize: '1rem' }}>{activeModel.icon}</div>
            <div>
              <h4>{activeModel.name}</h4>
              <small>by {activeModel.org}</small>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text2)', lineHeight: 1.4, marginTop: '0.5rem' }}>{activeModel.desc}</p>
          <div className="am-stats">
            <div className="am-stat"><strong>{activeModel.rating}⭐</strong><span>Rating</span></div>
            <div className="am-stat"><strong>128K</strong><span>Context</span></div>
            <div className="am-stat"><strong>{activeModel.price.split('/')[0]}</strong><span>Price</span></div>
          </div>
          <div className="am-btns">
            <button className="am-btn out">Details</button>
            <button className="am-btn fill">Switch</button>
          </div>
        </div>
      </div>

      <div className="rp-sec">
        <div className="rp-lbl">Usage Overview</div>
        <div className="kpi-grid">
          <div className="kpi-card">
            <small>Requests</small>
            <strong id="kpi-req">{kpis.req.toLocaleString()}</strong>
          </div>
          <div className="kpi-card">
            <small>Latency</small>
            <strong id="kpi-lat">{kpis.lat}s</strong>
          </div>
          <div className="kpi-card">
            <small>Cost</small>
            <strong id="kpi-cost">${kpis.cost.toFixed(2)}</strong>
          </div>
        </div>
        <div className="spark-wrap">
          <div className="spark-bars" id="usage-spark">
            {sparkBars.map((h, i) => (
              <div key={i} className="spark-bar" style={{ height: `${h}px` }}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="rp-sec">
        <div className="rp-lbl">Refine & Optimise</div>
        <div className="refine-item">
          <span className="ri-icon">🪄</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>Auto-optimise prompt</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>Improve clarity and detail</div>
          </div>
        </div>
        <div className="refine-item">
          <span className="ri-icon">🛡️</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>Safety check</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>Scan for biases and errors</div>
          </div>
        </div>
      </div>

      <div className="rp-sec" style={{ borderBottom: 'none' }}>
        <div className="rp-lbl">Research Updates</div>
        {[
          { date: '2h ago', text: 'GPT-5 computer-use benchmarks released' },
          { date: '5h ago', text: 'Claude 3.7 Opus context window expanded' },
        ].map((u, i) => (
          <div key={i} className="update-item">
            <div className="update-meta">
              <span className="live-dot" style={{ width: '4px', height: '4px' }}></span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>{u.date}</span>
            </div>
            <div className="update-text">{u.text}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default RightPanel;
