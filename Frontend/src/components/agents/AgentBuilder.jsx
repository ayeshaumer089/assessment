import React, { useState } from 'react';

const AgentBuilder = () => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');

  const goals = [
    { id: 'writer', label: 'Content Writer', icon: '✍️', desc: 'Expert in blog posts, emails, and social media.' },
    { id: 'coder', label: 'Code Assistant', icon: '💻', desc: 'Specialized in debugging, refactoring, and logic.' },
    { id: 'analyst', label: 'Data Analyst', icon: '📊', desc: 'Skilled at extracting insights from complex data.' },
    { id: 'creative', label: 'Creative Partner', icon: '🎨', desc: 'Brainstorming, ideation, and visual concepts.' },
  ];

  const handleContinue = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div id="agents-view" style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'var(--bg)' }}>
      <div className="sec-hd" style={{ maxWidth: '800px', margin: '0 auto 1.5rem' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 700 }}>Agent Builder</h2>
        <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>Create custom AI agents tailored to your specific workflows.</p>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="agent-wiz-card">
          <div className="aw-header">
            <div className="aw-title">New AI Agent Wizard</div>
            <div className="aw-step-count">Step {step} of 4</div>
          </div>

          <div className="aw-steps">
            <div className={`aw-step ${step === 1 ? 'aw-active' : ''}`}>
              <div className="aw-num">1</div>
              <div className="aw-step-body">
                <h5>Agent Definition</h5>
                <p>Define what your agent will do and how it should behave.</p>
                {step === 1 && (
                  <div className="aw-q" style={{ marginTop: '1.5rem' }}>
                    <div className="aw-q-title">What's the primary goal?</div>
                    <div className="aw-opts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {goals.map(g => (
                        <button 
                          key={g.id} 
                          className={`aw-opt ${goal === g.id ? 'active' : ''}`}
                          onClick={() => setGoal(g.id)}
                          style={{ textAlign: 'left', padding: '1rem', border: '1.5px solid var(--border)', borderRadius: '0.75rem', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{g.icon}</div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{g.label}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text2)', marginTop: '0.25rem', lineHeight: 1.3 }}>{g.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`aw-step ${step === 2 ? 'aw-active' : ''}`}>
              <div className="aw-num">2</div>
              <div className="aw-step-body">
                <h5>Model & Tools</h5>
                <p>Choose the AI model and give it the tools it needs.</p>
                {step === 2 && (
                  <div className="aw-q" style={{ marginTop: '1.5rem' }}>
                    <div className="aw-q-title">Select the base model</div>
                    <select style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1.5px solid var(--border)', background: 'white', fontSize: '0.85rem' }}>
                      <option>GPT-4o (Most capable for writing)</option>
                      <option>Claude 3.5 Sonnet (Best for coding)</option>
                      <option>Llama 3.1 405B (Open source powerhouse)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className={`aw-step ${step === 3 ? 'aw-active' : ''}`}>
              <div className="aw-num">3</div>
              <div className="aw-step-body">
                <h5>Knowledge Base</h5>
                <p>Upload files or link websites for the agent to learn from.</p>
              </div>
            </div>

            <div className={`aw-step ${step === 4 ? 'aw-active' : ''}`}>
              <div className="aw-num">4</div>
              <div className="aw-step-body">
                <h5>Deployment</h5>
                <p>Set up API access, Slack integration, or web widgets.</p>
              </div>
            </div>
          </div>

          <div className="aw-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={handleBack} disabled={step === 1}>Back</button>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary">Save Draft</button>
              <button className="btn btn-primary" onClick={handleContinue}>
                {step === 4 ? 'Finish & Create Agent' : `Continue to Step ${step + 1} →`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;
