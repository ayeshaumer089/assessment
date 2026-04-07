import React, { useState, useEffect, useRef } from 'react';

const QA_ITEMS = [
  {
    group: 'NAVIGATION & TOOLS',
    items: [
      { icon: '🛍', label: 'Browse Marketplace', color: '#E8F0FE', action: 'tab:marketplace' },
      { icon: '🤖', label: 'Build an Agent',      color: '#F3E8FF', action: 'modal:agent' },
      { icon: '📖', label: 'How to use Guide',    color: '#E8F5E9', action: 'modal:guide' },
      { icon: '📐', label: 'Prompt Engineering',  color: '#FFF3E0', action: 'modal:prompt' },
      { icon: '💰', label: 'View Pricing',         color: '#FFF8E1', action: 'modal:pricing' },
      { icon: '📊', label: 'AI Models Analysis',  color: '#E3F2FD', action: 'send:Give me a detailed analysis and comparison of the top AI models available today' },
    ],
  },
  {
    group: 'CREATE & GENERATE',
    items: [
      { icon: '🎨', label: 'Create image',      color: '#FCE4EC', action: 'send:Create an image for me' },
      { icon: '🎵', label: 'Generate Audio',    color: '#F3E5F5', action: 'send:Generate audio for me' },
      { icon: '🎬', label: 'Create video',      color: '#E8EAF6', action: 'send:Create a video for me' },
      { icon: '📋', label: 'Create slides',     color: '#E0F2F1', action: 'send:Create a presentation or slides for me' },
      { icon: '📈', label: 'Create Infographs', color: '#E8F5E9', action: 'send:Create an infographic for me' },
      { icon: '❓', label: 'Create quiz',        color: '#FFF3E0', action: 'send:Create a quiz for me' },
      { icon: '🗂️', label: 'Create Flashcards', color: '#FFF8E1', action: 'send:Create flashcards for me' },
      { icon: '🧠', label: 'Create Mind map',   color: '#FCE4EC', action: 'send:Create a mind map for me' },
    ],
  },
  {
    group: 'ANALYZE & WRITE',
    items: [
      { icon: '📉', label: 'Analyze Data',       color: '#E3F2FD', action: 'send:Help me analyze data' },
      { icon: '✍️', label: 'Write content',      color: '#FFF3E0', action: 'send:Help me write content' },
      { icon: '💻', label: 'Code Generation',    color: '#E8EAF6', action: 'send:Help me with code generation and debugging' },
      { icon: '📄', label: 'Document Analysis',  color: '#F3E8FF', action: 'send:Help me analyse documents and extract key information' },
      { icon: '🌐', label: 'Translate',           color: '#E0F7FA', action: 'send:Help me translate text to another language' },
    ],
  },
];

const RightPanel = ({ activeModel, onboardingAnswers, openModal, onSendMessage, onSwitchTab }) => {
  const [sparkBars, setSparkBars] = useState(Array.from({ length: 20 }, () => 20 + Math.random() * 60));
  const [kpis, setKpis] = useState({ req: 1284, lat: 1.2, cost: 2.40 });
  const animRef = useRef(null);

  useEffect(() => {
    animRef.current = setInterval(() => {
      setSparkBars(prev => [...prev.slice(1), 20 + Math.random() * 60]);
      setKpis(prev => ({
        req: prev.req + Math.floor(Math.random() * 3),
        lat: parseFloat((1.0 + Math.random() * 0.6).toFixed(1)),
        cost: Math.max(0, prev.cost + (Math.random() - 0.5) * 0.05),
      }));
    }, 1400);
    return () => clearInterval(animRef.current);
  }, []);

  const handleAction = (action) => {
    if (action.startsWith('tab:')) {
      onSwitchTab && onSwitchTab(action.slice(4));
    } else if (action.startsWith('modal:')) {
      openModal && openModal(activeModel?.id, action.slice(6));
    } else if (action.startsWith('send:')) {
      onSendMessage && onSendMessage(action.slice(5));
    }
  };

  return (
    <aside className="rpanel" id="rpanel">

      {/* ── Active Model Card ── */}
      <div className="rp-sec" id="rp-active-model">
        <div className="rp-lbl">ACTIVE MODEL</div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.875rem', marginTop: '0.5rem' }}>
          <div className="rp-am-head">
            <div className="rp-am-icon" style={{ background: activeModel?.bg || '#EEF2FD' }}>
              {activeModel?.icon || '🧠'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="rp-am-name">{activeModel?.name || 'GPT-5.4'}</div>
              <div className="rp-am-org">by {activeModel?.org || 'OpenAI'}</div>
            </div>
            <span className="rp-am-live">Live</span>
          </div>
          <div className="rp-am-desc">{activeModel?.desc || 'Select a model to see details.'}</div>
          <div className="rp-am-stats">
            <div className="rp-am-stat"><strong>1.05M</strong><span>Context</span></div>
            <div className="rp-am-stat"><strong>{activeModel?.price || '$2.50'}</strong><span>/1M tk</span></div>
            <div className="rp-am-stat"><strong>{activeModel?.rating ? `${activeModel.rating}⭐` : '4.8⭐'}</strong><span>Rating</span></div>
          </div>
          <div className="rp-am-btns">
            <button className="rp-am-btn outline" onClick={() => openModal && openModal(activeModel?.id)}>Details</button>
            <button className="rp-am-btn filled" onClick={() => openModal && openModal(activeModel?.id, 'pricing')}>Pricing</button>
          </div>
        </div>
      </div>

      {/* ── Usage Overview ── */}
      <div className="rp-usage show" id="rp-usage">
        <div className="rp-lbl">USAGE OVERVIEW</div>
        <div className="rp-usage-stats">
          <div className="rp-usage-stat">
            <div className="u-label">Requests</div>
            <div className="u-val">{kpis.req.toLocaleString()}</div>
          </div>
          <div className="rp-usage-stat">
            <div className="u-label">Avg Latency</div>
            <div className="u-val">{kpis.lat}s</div>
          </div>
          <div className="rp-usage-stat">
            <div className="u-label">Cost (today)</div>
            <div className="u-val">${kpis.cost.toFixed(2)}</div>
          </div>
        </div>
        <div className="rp-spark-wrap">
          <div className="rp-spark">
            {sparkBars.map((h, i) => (
              <div key={i} className="rp-spark-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="rp-sec rp-qa-sec">
        <div className="rp-lbl">QUICK ACTIONS</div>
        <div className="qa-grid">
          {QA_ITEMS.map((section, si) => (
            <React.Fragment key={si}>
              <div className="qa-group-label" style={si > 0 ? { marginTop: '10px' } : {}}>
                {section.group}
              </div>
              {section.items.map((item, ii) => (
                <button
                  key={ii}
                  className="qa-btn"
                  onClick={() => handleAction(item.action)}
                >
                  <span className="qa-icon-box" style={{ background: item.color }}>
                    {item.icon}
                  </span>
                  <span className="qa-text">{item.label}</span>
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default RightPanel;
