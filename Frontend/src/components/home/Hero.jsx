import React, { useState, useEffect, useRef } from 'react';
import { nxToast } from '../../utils/helpers';
import { recordUserVideo, recordScreen } from '../../utils/media';
import Stats from './Stats';

const SQ_DATA = {
  recruiting: [
    { icon: '🔍', text: 'Monitor job postings at target companies' },
    { icon: '💰', text: 'Benchmark salary for a specific role' },
    { icon: '📋', text: 'Build a hiring pipeline tracker' },
    { icon: '🤝', text: 'Research a candidate before an interview' },
    { icon: '🗺️', text: 'Build an interactive talent market map' },
  ],
  prototype: [
    { icon: '⚡', text: 'Generate a React component from a sketch' },
    { icon: '🎨', text: 'Design a landing page layout in minutes' },
    { icon: '🔧', text: 'Build a REST API prototype with Node.js' },
    { icon: '📱', text: 'Create a mobile app wireframe' },
    { icon: '🤖', text: 'Prototype a chatbot for my website' },
  ],
  business: [
    { icon: '📊', text: 'Write a business plan for a SaaS startup' },
    { icon: '📈', text: 'Build a financial model and projections' },
    { icon: '🎯', text: 'Create a go-to-market strategy' },
    { icon: '🤝', text: 'Draft an investor pitch deck outline' },
    { icon: '⚖️', text: 'Analyse competitors in my market' },
  ],
  learn: [
    { icon: '🧠', text: 'Explain machine learning in simple terms' },
    { icon: '📚', text: 'Create a personalised study plan for me' },
    { icon: '🌍', text: 'Help me learn a new language faster' },
    { icon: '💡', text: 'Summarise a complex topic step by step' },
    { icon: '🧪', text: 'Quiz me on any subject I choose' },
  ],
  research: [
    { icon: '🔬', text: 'Summarise latest research on a topic' },
    { icon: '📰', text: 'Find and compare top AI models for my task' },
    { icon: '🌐', text: 'Research market trends in my industry' },
    { icon: '📖', text: 'Explain a technical paper in plain English' },
    { icon: '🧩', text: 'Map out key players in a new field' },
  ],
};

const Hero = ({ openApp }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState('input'); // 'input', 'welcome', 'questions', 'building'
  const [currentQ, setCurrentQ] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [sqActive, setSqActive] = useState('recruiting');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const landingInputRef = useRef(null);
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
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
      const file = files[0];
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        setQuery(`What AI tools can help me work with this image: "${file.name}"?`);
      } else {
        setQuery(`Help me find AI tools for my file: "${file.name}"`);
      }
      nxToast(`${files.length} file(s) attached`);
    }
  };

  const handleImageAttach = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
      setQuery(`What can I do with this image: "${files[0].name}"?`);
      nxToast(`${files.length} image(s) attached`);
    }
  };

  const removeAttachment = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerImageInput = () => imageInputRef.current?.click();

  const handleVideoInput = async () => {
    try {
      const { blob } = await recordUserVideo({ durationMs: 4000 });
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      setAttachedFiles(prev => [...prev, file]);
      setQuery('Analyze this short video for me.');
      nxToast('🎥 Video captured and attached');
    } catch (err) {
      nxToast(err?.message || 'Unable to capture video');
    }
  };

  const handleScreenShare = async () => {
    try {
      const { blob } = await recordScreen({ durationMs: 4000 });
      const file = new File([blob], `screen-${Date.now()}.webm`, { type: 'video/webm' });
      setAttachedFiles(prev => [...prev, file]);
      setQuery('Here is a screen recording. Help with this.');
      nxToast('🖥️ Screen captured and attached');
    } catch (err) {
      nxToast(err?.message || 'Screen share failed');
    }
  };

  const handleSuggestionPick = (text) => {
    setQuery(text);
    setIsFocused(true);
    if (landingInputRef.current) {
      landingInputRef.current.focus();
      landingInputRef.current.style.height = 'auto';
      landingInputRef.current.style.height = Math.min(landingInputRef.current.scrollHeight, 120) + 'px';
    }
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
        openApp('chat', query || opt.label, attachedFiles);
      }, 1500);
    }
  };

  const launchWithQuery = () => {
    openApp('chat', query, attachedFiles);
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
          {(phase === 'input' || phase === 'welcome') && (
            <div className="hsb-row" id="hs-input-row">
              <div className="hsb-top-row">
                <textarea
                  ref={landingInputRef}
                  className={`hsb-input ${isRecording ? 'voice-listening' : ''}`}
                  id="landing-input"
                  placeholder="Click here and type anything — or just say hi! 👋"
                  autoComplete="off"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      launchWithQuery();
                    }
                  }}
                  onInput={(e) => {
                    // autosize textarea
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 120) + 'px';
                  }}
                  onFocus={handleFocus}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="hsb-avatar-icons">
                  <div className="hsb-avatar-icon" style={{ background: '#09A66D' }} title="AI Assistant">
                    <svg viewBox="0 0 24 24" fill="white" width="13" height="13"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  </div>
                  <div className="hsb-avatar-icon" style={{ background: '#2D55F0' }} title="Magic">
                    <svg viewBox="0 0 24 24" fill="white" width="13" height="13"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 3a3 3 0 0 1 3 3c0 2.25-3 5.5-3 5.5S9 10.25 9 8a3 3 0 0 1 3-3Z"/></svg>
                  </div>
                </div>
              </div>

              <div className="hsb-bottom-bar">
                <button
                  className={`hsb-ibox ${isRecording ? 'mic-active' : ''}`}
                  data-tip="Voice input"
                  onClick={toggleVoiceInput}
                  title="Voice input"
                  style={{ ['--ic']: '#7C3AED', ['--ic-lt']: '#F3EEFF', ['--ic-border']: 'rgba(124,58,237,0.25)' }}
                >
                  <div className="hsb-ibox-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  </div>
                </button>

                <button
                  className="hsb-ibox"
                  data-tip="Attach file"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.csv';
                    triggerFileInput();
                  }}
                  title="Attach file"
                  style={{ ['--ic']: '#D97706', ['--ic-lt']: '#FFFBEB', ['--ic-border']: 'rgba(217,119,6,0.25)' }}
                >
                  <div className="hsb-ibox-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </div>
                </button>

                <button
                  className="hsb-ibox"
                  data-tip="Upload image"
                  onClick={() => {
                    if (imageInputRef.current) imageInputRef.current.accept = 'image/*';
                    triggerImageInput();
                  }}
                  title="Upload image"
                  style={{ ['--ic']: '#2563EB', ['--ic-lt']: '#EFF6FF', ['--ic-border']: 'rgba(37,99,235,0.25)' }}
                >
                  <div className="hsb-ibox-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                </button>

                <button
                  className="hsb-ibox"
                  id="hero-vtype-btn"
                  data-tip="Voice typing"
                  onClick={toggleVoiceInput}
                  title="Voice typing"
                  style={{ ['--ic']: '#0891B2', ['--ic-lt']: '#E0F7FA', ['--ic-border']: 'rgba(8,145,178,0.25)' }}
                >
                  <div className="hsb-ibox-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="14" width="20" height="7" rx="2" />
                      <path d="M9 2a2 2 0 0 1 2 2v5a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z" transform="translate(3,0)" />
                      <path d="M17 10v1a5 5 0 0 1-10 0v-1" />
                      <line x1="8" y1="17" x2="8" y2="17.01" />
                      <line x1="12" y1="17" x2="12" y2="17.01" />
                      <line x1="16" y1="17" x2="16" y2="17.01" />
                    </svg>
                  </div>
                </button>

                <button
                  className="hsb-ibox"
                  data-tip="Video input"
                  onClick={handleVideoInput}
                  title="Video input"
                  style={{ ['--ic']: '#DC2626', ['--ic-lt']: '#FEF2F2', ['--ic-border']: 'rgba(220,38,38,0.22)' }}
                >
                  <div className="hsb-ibox-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                </button>

                <button
                  className="hsb-ibox"
                  data-tip="Share screen"
                  onClick={handleScreenShare}
                  title="Share screen"
                  style={{ ['--ic']: '#059669', ['--ic-lt']: '#ECFDF5', ['--ic-border']: 'rgba(5,150,105,0.25)' }}
                >
                  <div className="hsb-ibox-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <polyline points="8 21 12 17 16 21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                </button>

                <div className="hsb-bar-sep"></div>

                <button className="hsb-computer-chip" id="computer-agent-chip" title="Agent works for you" onClick={() => nxToast('Agent panel placeholder')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <polyline points="8 21 12 17 16 21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  Agent
                  <span className="hsb-computer-chip-plus">+</span>
                </button>

                <div style={{ flex: 1 }}></div>

                <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileAttach} />
                <input ref={imageInputRef} type="file" style={{ display: 'none' }} onChange={handleImageAttach} accept="image/*" />

                <button className="hsb-go-btn" onClick={launchWithQuery}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '14px', height: '14px' }}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Let's go
                </button>
              </div>
            </div>
          )}

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

        <div className="sq-panel" id="sq-panel">
          <div className="sq-tabs" id="sq-tabs">
            <button className={`sq-tab ${sqActive === 'recruiting' ? 'active' : ''}`} onClick={() => setSqActive('recruiting')}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Recruiting
            </button>
            <button className={`sq-tab ${sqActive === 'prototype' ? 'active' : ''}`} onClick={() => setSqActive('prototype')}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Create a prototype
            </button>
            <button className={`sq-tab ${sqActive === 'business' ? 'active' : ''}`} onClick={() => setSqActive('business')}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              Build a business
            </button>
            <button className={`sq-tab ${sqActive === 'learn' ? 'active' : ''}`} onClick={() => setSqActive('learn')}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Help me learn
            </button>
            <button className={`sq-tab ${sqActive === 'research' ? 'active' : ''}`} onClick={() => setSqActive('research')}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Research
            </button>
          </div>
          <div className="sq-body">
            <div className="sq-list" id="sq-list">
              {(SQ_DATA[sqActive] || []).map((q) => (
                <button key={q.text} className="sq-item" onClick={() => handleSuggestionPick(q.text)}>
                  <span className="sq-item-icon">{q.icon}</span>
                  <span className="sq-item-text">{q.text}</span>
                  <span className="sq-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
          <div className="sq-footer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Click any suggestion to fill the search box, then press <strong>Let's go</strong>
          </div>
        </div>
      </div>

      <Stats />
    </section>
  );
};

export default Hero;
