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
        <div className="rp-lbl" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '0.75rem' }}>Active Model</div>
        <div className="active-mcard" style={{ 
          background: 'var(--white)', 
          border: '1.5px solid var(--border)', 
          borderRadius: '20px', 
          padding: '1.25rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div className="am-hd" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
            <div className="sb-mi" style={{ 
              background: activeModel.bg, 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>{activeModel.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, margin: 0 }}>{activeModel.name}</h4>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  color: 'var(--green)', 
                  background: 'rgba(46,158,91,0.1)', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '2rem',
                  border: '1px solid rgba(46,158,91,0.2)'
                }}>Live</span>
              </div>
              <small style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>by {activeModel.org}</small>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.5, margin: '0.75rem 0' }}>{activeModel.desc}</p>
          <div className="am-stats" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '8px', 
            margin: '1rem 0',
            borderTop: '1px solid var(--border)',
            paddingTop: '1rem'
          }}>
            <div className="am-stat" style={{ textAlign: 'center' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>1.05M</strong>
              <span style={{ fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Context</span>
            </div>
            <div className="am-stat" style={{ textAlign: 'center' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>$7.50</strong>
              <span style={{ fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>/1M TK</span>
            </div>
            <div className="am-stat" style={{ textAlign: 'center' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>4.9 ⭐</strong>
              <span style={{ fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Rating</span>
            </div>
          </div>
          <div className="am-btns" style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
            <button className="am-btn out" style={{ 
              flex: 1, 
              padding: '0.5rem', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              borderRadius: '8px', 
              border: '1.5px solid var(--border2)', 
              background: 'none',
              color: 'var(--text2)',
              cursor: 'pointer'
            }}>Details</button>
            <button className="am-btn fill" style={{ 
              flex: 1, 
              padding: '0.5rem', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              borderRadius: '8px', 
              border: '1.5px solid var(--accent-border)', 
              background: 'var(--accent-lt)',
              color: 'var(--accent)',
              cursor: 'pointer'
            }}>Pricing</button>
          </div>
        </div>
      </div>

      <div className="rp-sec">
        <div className="rp-lbl" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '0.75rem' }}>Usage Overview</div>
        <div className="kpi-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '12px',
          marginBottom: '1rem'
        }}>
          <div className="kpi-card" style={{ textAlign: 'center' }}>
            <small style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Requests</small>
            <strong style={{ fontSize: '0.95rem', fontWeight: 700 }}>1,426</strong>
          </div>
          <div className="kpi-card" style={{ textAlign: 'center' }}>
            <small style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Avg Latency</small>
            <strong style={{ fontSize: '0.95rem', fontWeight: 700 }}>1.3s</strong>
          </div>
          <div className="kpi-card" style={{ textAlign: 'center' }}>
            <small style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Cost (Today)</small>
            <strong style={{ fontSize: '0.95rem', fontWeight: 700 }}>$2.59</strong>
          </div>
        </div>
        <div className="spark-wrap" style={{ 
          background: 'var(--bg)', 
          borderRadius: '12px', 
          padding: '1rem 0.5rem',
          height: '80px',
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          <div className="spark-bars" style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '100%', width: '100%' }}>
            {sparkBars.map((h, i) => (
              <div key={i} className="spark-bar" style={{ 
                flex: 1, 
                background: 'linear-gradient(to top, var(--blue), #6ea8ff)', 
                height: `${h}%`,
                borderRadius: '2px',
                opacity: 0.8
              }}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="rp-sec">
        <div className="rp-lbl" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '0.75rem' }}>Quick Actions</div>
        <div className="refine-item" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          padding: '0.6rem 0.75rem', 
          border: '1px solid var(--border)', 
          borderRadius: '10px', 
          cursor: 'pointer',
          marginBottom: '6px',
          transition: 'all 0.2s'
        }}>
          <span className="ri-icon">🪄</span>
          <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>Auto-optimise prompt</div>
        </div>
        <div className="refine-item" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          padding: '0.6rem 0.75rem', 
          border: '1px solid var(--border)', 
          borderRadius: '10px', 
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          <span className="ri-icon">🛡️</span>
          <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>Safety check</div>
        </div>
      </div>

      <div className="rp-sec" style={{ borderBottom: 'none' }}>
        <div className="rp-lbl" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '0.75rem' }}>Navigation & Tools</div>
        {[
          { icon: '📁', text: 'Project Files' },
          { icon: '⚙️', text: 'Model Settings' },
          { icon: '📊', text: 'Analytics' },
        ].map((u, i) => (
          <div key={i} className="update-item" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '0.6rem 0.75rem', 
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'background 0.2s'
          }}>
            <span style={{ fontSize: '1rem' }}>{u.icon}</span>
            <div className="update-text" style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text2)' }}>{u.text}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default RightPanel;
