import React, { useState, useEffect, useRef } from 'react';
import { nxToast } from '../../utils/helpers';
import Stats from './Stats';

const Hero = ({ openApp }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState('input'); // 'input', 'welcome', 'questions', 'building'
  const [currentQ, setCurrentQ] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const questions = [
    {
      id: 'goal',
      title: "What's your primary goal today?",
      hint: "Select the option that best describes what you're looking for.",
      options: [
        { label: 'Content Creation', icon: '✍️', sub: 'Writing, blogging, or creative copy' },
        { label: 'Visual Design', icon: '🎨', sub: 'Generating images, logos, or art' },
        { label: 'Technical Tasks', icon: '💻', sub: 'Coding, data analysis, or logic' },
        { label: 'Learning & Research', icon: '📚', sub: 'Summaries, study aids, or explanations' },
      ]
    },
    {
      id: 'experience',
      title: "How familiar are you with AI?",
      hint: "This helps us adjust the language and tools we show you.",
      options: [
        { label: 'Brand New', icon: '🌱', sub: "I've never used AI before" },
        { label: 'Curious', icon: '🔍', sub: "I've tried it once or twice" },
        { label: 'Experienced', icon: '🚀', sub: "I use AI tools regularly" },
        { label: 'Expert', icon: '🧠', sub: "I'm a power user or developer" },
      ]
    }
  ];

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setQuery(transcript);
        
        if (Array.from(event.results).at(-1).isFinal) {
          setIsRecording(false);
        }
      };
      
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        nxToast('Voice recognition error. Please try again.');
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      nxToast('Voice recognition not supported in this browser');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles(prev => [...prev, ...files]);
    nxToast(`${files.length} file(s) attached`);
  };

  const removeAttachment = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (phase === 'input') setPhase('welcome');
  };

  const startQuestions = () => {
    setPhase('questions');
    setCurrentQ(0);
  };

  const handleOption = (opt) => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase('building');
      setTimeout(() => {
        openApp('chat', query || opt.label);
      }, 1500);
    }
  };

  const launchWithQuery = () => {
    openApp('chat', query);
  };

  useEffect(() => {
    if (phase === 'welcome') {
      let p = 0;
      const t = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 100) clearInterval(t);
      }, 30);
      return () => clearInterval(t);
    }
  }, [phase]);

  return (
    <section className="hero">
      <div className="hero-eyebrow"><span className="live-dot"></span>347 models live · Updated daily</div>
      <h1>Find your perfect <span className="accent">AI model</span><br />with guided discovery</h1>
      <p>You don't need to know anything about AI to get started. Just click the box below — we'll do the rest together. ✨</p>
      
      <div className="hero-search-root">
        <div className={`hero-search-card ${isFocused ? 'focused' : ''}`}>
          {phase === 'input' || phase === 'welcome' ? (
            <div className="hsb-row">
              <input 
                className="hsb-input" 
                placeholder="Click here and type anything — or just say hi! 👋"
                onFocus={handleFocus}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && launchWithQuery()}
              />
              <div className="hsb-icons">
                <button 
                  className={`hsb-btn ${isRecording ? 'mic-active' : ''}`} 
                  title="Voice conversation"
                  onClick={toggleVoiceInput}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                </button>
                <button 
                  className="hsb-btn" 
                  title="Attach file"
                  onClick={triggerFileInput}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  style={{ display: 'none' }}
                  onChange={handleFileAttach}
                />
                <div className="hsb-sep"></div>
              </div>
              <button className="hsb-go-btn" onClick={launchWithQuery}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                Let's go
              </button>
            </div>
          ) : null}

          <div className={`hsb-body ${phase !== 'input' ? 'open' : ''}`}>
            {phase === 'welcome' && (
              <div className="hs-welcome-new">
                <div className="hs-orbs">
                  <div className="hs-orb hs-orb1"></div>
                  <div className="hs-orb hs-orb2"></div>
                </div>
                <div className="hs-wn-emoji-row">
                  <span className="hs-wn-wave hs-bounce">👋</span>
                </div>
                <div className="hs-wn-heading">Welcome! You're in the right place.</div>
                <div className="hs-wn-intro">We'll help you explore AI, one simple step at a time.</div>
                <div className="hs-wn-auto-bar">
                  <div className="hs-wn-auto-text">Preparing your questions<span>...</span></div>
                  <div className="hs-wn-progress-track">
                    <div className="hs-wn-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                <div className="hs-wn-btns">
                  <button className="hs-wn-start-btn" onClick={startQuestions}>Let's get started</button>
                  <button className="hs-wn-skip-btn" onClick={launchWithQuery}>Skip — search directly</button>
                </div>
              </div>
            )}

            {phase === 'questions' && (
              <div className="hsb-question">
                <div className="hsb-q-title">{questions[currentQ].title}</div>
                <div className="hsb-q-hint">{questions[currentQ].hint}</div>
                <div className="hsb-opts">
                  {questions[currentQ].options.map((opt, i) => (
                    <button key={i} className="hsb-opt" onClick={() => handleOption(opt)}>
                      <span className="hsb-opt-em">{opt.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{opt.label}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{opt.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="hsb-footer">
                  <div className="hsb-dots">
                    {questions.map((_, i) => (
                      <div key={i} className={`hsb-dot ${i === currentQ ? 'active' : ''} ${i < currentQ ? 'done' : ''}`}></div>
                    ))}
                  </div>
                  <button className="hsb-skip" onClick={() => handleOption({ label: 'Skipped' })}>Not sure, skip →</button>
                </div>
              </div>
            )}

            {phase === 'building' && (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="live-dot" style={{ width: '20px', height: '20px', margin: '0 auto 1rem' }}></div>
                <div style={{ fontWeight: 700 }}>Building your personalised query…</div>
              </div>
            )}
          </div>
        </div>

        {attachedFiles.length > 0 && (
          <div className="hero-attach-row">
            {attachedFiles.map((file, i) => (
              <div key={i} className="attach-chip">
                📎 {file.name}
                <button className="attach-chip-x" onClick={() => removeAttachment(i)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hero-action-grid">
        {[
          { label: 'Create image', icon: '🎨' },
          { label: 'Generate Audio', icon: '🎵' },
          { label: 'Create video', icon: '🎬' },
          { label: 'Create slides', icon: '📊' },
          { label: 'Analyze Data', icon: '📉' },
          { label: 'Code Generation', icon: '💻' },
          { label: 'Translate', icon: '🌐' },
        ].map((act, i) => (
          <button key={i} className="hac-btn" onClick={() => openApp('chat', act.label)}>
            <span className="hac-icon">{act.icon}</span>
            <span className="hac-label">{act.label}</span>
          </button>
        ))}
        <button className="hac-btn hac-explore" onClick={() => openApp('chat', 'Explore AI')}>
          <span className="hac-icon">🔭</span>
          <span className="hac-label">Just Exploring</span>
        </button>
      </div>

      <Stats />
    </section>
  );
};

export default Hero;
