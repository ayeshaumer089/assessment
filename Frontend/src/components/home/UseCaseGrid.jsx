import React from 'react';

const UseCaseGrid = ({ openApp }) => {
  const features = [
    { 
      icon: '🧭', 
      title: 'Guided Discovery Chat', 
      desc: "I'll greet you, ask about your goals, and have a genuine conversation before recommending models. No overwhelming lists." 
    },
    { 
      icon: '📐', 
      title: 'Prompt Engineering Guide', 
      desc: "Every model includes tailored prompt templates, principles, and examples so you get the best output from day one." 
    },
    { 
      icon: '🤖', 
      title: 'Agent Builder', 
      desc: "Step-by-step agent creation guides for every model — system prompts, tool configuration, memory setup, deployment." 
    },
    { 
      icon: '💰', 
      title: 'Flexible Pricing', 
      desc: "Free tiers, pay-per-use, subscriptions, and enterprise plans. Transparent pricing with no hidden fees." 
    },
  ];

  return (
    <section className="section">
      <div className="sec-hd"><h2>Built for every builder</h2></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
        {features.map((feat, i) => (
          <div key={i} className="mcard" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => openApp('chat')}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{feat.icon}</div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.95rem' }}>{feat.title}</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.5 }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UseCaseGrid;
