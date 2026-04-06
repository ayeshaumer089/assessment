import React from 'react';

const AuthShell = ({ activeTab, onSwitchTab, onClose, children }) => {
  return (
    <section className="signin-wrap">
      <div className="nexusai-login-card">
        <div className="nexusai-login-left">
          <div className="nll-logo">
            <div className="nll-logo-mark">
              <svg viewBox="0 0 14 14">
                <path d="M7 1 L13 7 L7 13 L1 7 Z" />
              </svg>
            </div>
            <div className="nll-logo-text">NexusAI</div>
          </div>
          <div className="nll-illustration">
            <div className="nll-illustration-circle">🤖</div>
          </div>
          <div className="nll-headline">Build Smarter<br />with AI Agents</div>
          <div className="nll-sub">Access 525+ models, create custom agents, and automate your workflow — all in one platform.</div>
          <div className="nll-features">
            <div className="nll-feature"><div className="nll-feature-icon">🧠</div><span>525+ AI models from 30+ labs</span></div>
            <div className="nll-feature"><div className="nll-feature-icon">⚡</div><span>Custom agent builder with any model</span></div>
            <div className="nll-feature"><div className="nll-feature-icon">🔗</div><span>Connect tools, memory & APIs</span></div>
            <div className="nll-feature"><div className="nll-feature-icon">📊</div><span>Real-time analytics & monitoring</span></div>
          </div>
        </div>

        <div className="nexusai-login-right" style={{ position: 'relative' }}>
          <button className="nlr-close" onClick={onClose} aria-label="Close">✕</button>

          <div className="nlr-tabs">
            <button className={`nlr-tab ${activeTab === 'signin' ? 'active' : ''}`} onClick={() => onSwitchTab('signin')}>Sign In</button>
            <button className={`nlr-tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => onSwitchTab('signup')}>Create Account</button>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthShell;

