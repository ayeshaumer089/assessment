import React, { useState, useEffect } from 'react';

const OnboardingOverlay = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState('welcome'); // 'welcome', 'questions', 'done'
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsActive(true), 10);
    } else {
      setIsActive(false);
      setTimeout(() => setIsVisible(false), 400);
    }
  }, [isOpen]);

  const questions = [
    {
      k: 'goal',
      q: 'What would you like to do today?',
      opts: [
        { e: '✍️', l: 'Write content', sub: 'Emails, posts, stories' },
        { e: '🎨', l: 'Create images', sub: 'Art, photos, designs' },
        { e: '🛠️', l: 'Build something', sub: 'Apps, tools, websites' },
        { e: '⚡', l: 'Automate work', sub: 'Save hours every week' },
        { e: '📊', l: 'Analyse data', sub: 'PDFs, sheets, reports' },
        { e: '🔍', l: 'Just exploring', sub: 'Show me what\'s possible' },
      ]
    },
    {
      k: 'audience',
      q: 'Who will be using this AI?',
      opts: [
        { e: '🧑‍💼', l: 'Just me', sub: 'Personal use' },
        { e: '👥', l: 'My team', sub: 'Small group, work' },
        { e: '🏢', l: 'My company', sub: 'Business / enterprise' },
        { e: '👨‍💻', l: 'My customers', sub: 'Building for end-users' },
      ]
    }
  ];

  const handleStart = () => {
    setStep('questions');
    setCurrentQ(0);
  };

  const handlePick = (key, val) => {
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep('done');
      setTimeout(() => {
        onComplete(newAnswers);
        onClose();
      }, 2000);
    }
  };

  const handleSkip = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div id="ob-overlay" className={`${isVisible ? 'visible' : ''} ${isActive ? 'active' : ''}`}>
      {step === 'welcome' && (
        <div id="ob-welcome-screen">
          <div className="ob-avatar">
            <svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <div className="ob-welcome-title">Welcome to NexusAI 👋</div>
          <div className="ob-welcome-sub">
            Think of this as your personal guide to the world of AI.<br /><br />
            You don't need to be a tech expert — or even know what AI is. We'll walk you through everything, one simple step at a time, and help you find exactly what you need.<br /><br />
            <strong style={{ color: 'var(--text)' }}>Ready? It only takes a minute. 🚀</strong>
          </div>
          <button className="ob-start-btn" onClick={handleStart}>Let's get started →</button>
        </div>
      )}

      {step === 'questions' && (
        <div id="ob-q-screen" className="active">
          <div className="ob-q-inner">
            <div className="ob-q-label">Quick question</div>
            <div className="ob-q-heading">{questions[currentQ].q}</div>
            <div className="ob-opt-list">
              {questions[currentQ].opts.map((o, i) => (
                <button key={i} className="ob-pill" onClick={() => handlePick(questions[currentQ].k, o.l)}>
                  <span className="ob-pill-em">{o.e}</span> {o.l}
                </button>
              ))}
            </div>
            <div className="ob-q-footer">
              <div className="ob-dots-row">
                {questions.map((_, i) => (
                  <div key={i} className={`ob-dot ${i === currentQ ? 'active' : ''} ${i < currentQ ? 'done' : ''}`}></div>
                ))}
              </div>
              <button className="ob-skip-btn" onClick={handleSkip}>Skip this →</button>
            </div>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div id="ob-done-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <div className="ob-done-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>You're all set!</div>
          <div className="ob-done-sub" style={{ color: 'var(--text2)' }}>Taking you to your personalised hub…</div>
        </div>
      )}
    </div>
  );
};

export default OnboardingOverlay;
