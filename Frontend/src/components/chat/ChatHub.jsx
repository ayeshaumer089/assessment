import React, { useState, useEffect, useRef } from 'react';
import { MODELS, MODEL_VARS } from '../../constants';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

const ChatHub = ({ models = [], searchQuery, setSearchQuery, currentModelId, setCurrentModelId, isObDone, onboardingAnswers }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState('use_cases');
  const [showCPanel, setShowCPanel] = useState(true);
  const [localAnswers, setLocalAnswers] = useState(onboardingAnswers || {});
  const [onboardPhase, setOnboardPhase] = useState(isObDone ? 'chat' : 'start');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastAutoQueryRef = useRef('');
  const lastSentRef = useRef({ content: '', at: 0 });

  const modelsData = models.length > 0 ? models : MODELS;
  const activeModel = modelsData.find(m => m.id === currentModelId) || modelsData[0];

  const CPANEL_DATA = {
    use_cases: ['Help me find the best AI model for my project', 'I want to build an AI chatbot for my website', 'Generate realistic images for my marketing campaign', 'Analyse documents and extract key information', 'Create AI agents for workflow automation', 'Add voice and speech recognition to my app'],
    monitor: ['Track regulatory changes in my industry', 'Alert me when a product drops in price', 'Track my portfolio and alert me on big moves', 'Watch for job postings at target companies', 'Monitor a competitor daily for any changes', 'Set up news alerts for my niche topic'],
    prototype: ['Build a quick prototype for my app idea', 'Create a REST API scaffold for my project', 'Generate a landing page from my description', 'Turn my wireframe description into working HTML', 'Build a chatbot prototype in under 10 minutes', 'Create a data pipeline prototype with sample code'],
    business: ['Write a business plan for my startup idea', 'Create a go-to-market strategy for my product', 'Draft a financial projection model for investors', 'Identify my target market and ideal customer profile', 'Write an executive summary for my pitch deck', 'Create a competitive analysis for my industry'],
    create: ['Write a blog post about AI trends in my industry', 'Create social media captions for my product launch', 'Generate an email newsletter for my audience', 'Write a product description that converts', 'Create an infographic script on a complex topic', 'Draft a script for a 2-minute explainer video'],
    analyze: ['Analyse this dataset and summarise key insights', 'Compare the top AI models by performance and cost', 'Research the competitive landscape in my market', 'Summarise recent AI research papers on a topic', 'Identify trends from my customer feedback data', 'Build a pros and cons comparison for two options'],
    learn: ['Explain how large language models work simply', 'Teach me prompt engineering from scratch', 'What is RAG and when should you use it?', 'Help me understand AI agent architectures', 'Explain the difference between fine-tuning and RAG', 'Give me a 5-minute overview of AI safety concepts'],
  };

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
        setInputValue(transcript);
        
        if (Array.from(event.results).at(-1).isFinal) {
          setIsRecording(false);
        }
      };
      
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
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
  };

  const removeAttachment = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const mapHomeQueryToGoal = (query) => {
    const q = query.toLowerCase();
    if (q.includes('image') || q.includes('design') || q.includes('art')) {
      return { label: 'Create an image for me', icon: '🎨' };
    }
    if (q.includes('video')) {
      return { label: 'Create video', icon: '🎬' };
    }
    if (q.includes('audio') || q.includes('voice') || q.includes('music')) {
      return { label: 'Generate audio', icon: '🎵' };
    }
    if (q.includes('slide') || q.includes('presentation')) {
      return { label: 'Create slides', icon: '📊' };
    }
    if (q.includes('analy') || q.includes('data')) {
      return { label: 'Analyse data', icon: '📊' };
    }
    if (q.includes('code') || q.includes('build') || q.includes('app')) {
      return { label: 'Build something', icon: '🛠️' };
    }
    if (q.includes('translate')) {
      return { label: 'Write content', icon: '✍️' };
    }
    if (q.includes('explore')) {
      return { label: 'Just exploring', icon: '🔍' };
    }
    return null;
  };

  useEffect(() => {
    if (!searchQuery) return;
    const normalized = searchQuery.trim();
    if (!normalized) {
      setSearchQuery('');
      return;
    }
    if (lastAutoQueryRef.current === normalized) {
      return;
    }

    lastAutoQueryRef.current = normalized;
    const mappedGoal = mapHomeQueryToGoal(normalized);
    if (mappedGoal && messages.length === 0) {
      onboardPick('goal', mappedGoal.label, mappedGoal.icon);
    } else {
      handleSend(normalized);
    }
    setSearchQuery('');
  }, [searchQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    const val = text || inputValue;
    if (!val.trim()) return;
    const normalized = val.trim();
    const now = Date.now();

    // Prevent accidental duplicate sends (e.g., strict-mode/effect double trigger).
    if (
      lastSentRef.current.content === normalized &&
      now - lastSentRef.current.at < 1000
    ) {
      return;
    }
    lastSentRef.current = { content: normalized, at: now };
    
    setMessages(prev => [...prev, { role: 'user', content: normalized }]);
    setInputValue('');
    setIsTyping(true);
    setShowCPanel(false);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `I'm using **${activeModel.name}** to process your request. This is a demonstration of the NexusAI chat interface.` 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const buildAutoPrompt = () => {
    const goalMap = { 'write emails': 'a professional content writer', 'posts': 'a creative content strategist', 'stories': 'a skilled storyteller', 'images': 'a creative director specialising in visual content', 'artwork': 'a creative director specialising in visual content', 'build': 'a senior software developer', 'app': 'a senior software developer', 'website': 'a full-stack developer', 'automate': 'an automation and workflow expert', 'analys': 'a senior data analyst', 'data': 'a senior data analyst', 'documents': 'a document analysis specialist', 'exploring': 'an AI capabilities consultant' };
    const g = (localAnswers.goal || '').toLowerCase();
    let role = 'a helpful AI assistant';
    for (const [k, v] of Object.entries(goalMap)) { if (g.includes(k)) { role = v; break; } }
    const audienceMap = { 'just me': 'my personal use', 'my team': 'a small team', 'my company': 'business stakeholders', 'my customers': 'end users of a product', 'students': 'students and learners', 'anyone': 'a general audience' };
    const a = (localAnswers.audience || '').toLowerCase();
    let audience = 'my use case';
    for (const [k, v] of Object.entries(audienceMap)) { if (a.includes(k)) { audience = v; break; } }
    const levelNote = (localAnswers.level || '').toLowerCase().includes('beginner') ? 'Please explain things clearly with no assumed technical knowledge.' : (localAnswers.level || '').toLowerCase().includes('developer') ? 'I am a developer — feel free to use technical terms and code snippets.' : '';
    const budgetNote = (localAnswers.budget || '').toLowerCase().includes('free') ? 'Prioritise free or open-source solutions where possible.' : 'Focus on the best solution; note any significant costs.';
    return `You are ${role}. Help me with: ${localAnswers.goal || 'my AI goals'}.\n\nThis is for ${audience}. ${levelNote}\n\nPlease give a clear, structured response with practical steps I can act on immediately. ${budgetNote}\n\nStart with a concise overview, then walk me through the most effective approach step by step.`;
  };

  const onboardPick = (phase, value, icon) => {
    setMessages(prev => [...prev, { role: 'user', content: `${icon} ${value}` }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newAnswers = { ...localAnswers, [phase]: value };
      setLocalAnswers(newAnswers);
      
      if (phase === 'goal') {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `Great choice! 🎯 "**${value}**" — I can already think of some excellent models for that.\n\nNow, quick question:`,
          type: 'onboard_question',
          question: 'Who will be using this AI?',
          nextPhase: 'audience',
          options: [
            { icon: '🧑‍💼', label: 'Just me', sub: 'Personal use' },
            { icon: '👥', label: 'My team', sub: 'Small group, work' },
            { icon: '🏢', label: 'My company', sub: 'Business / enterprise' },
            { icon: '👨‍💻', label: 'My customers', sub: 'Building for end-users' },
            { icon: '🎓', label: 'Students', sub: 'Education / learning' },
            { icon: '🌐', label: 'Anyone / public', sub: 'Open to the world' },
          ]
        }]);
      } else if (phase === 'audience') {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `Perfect — "**${value}**". That helps a lot! 💡\n\nOne more:`,
          type: 'onboard_question',
          question: 'How comfortable are you with tech / AI?',
          nextPhase: 'level',
          options: [
            { icon: '👶', label: 'Complete beginner', sub: 'Never used AI before' },
            { icon: '🙂', label: 'Some experience', sub: 'Used ChatGPT etc.' },
            { icon: '💻', label: 'Developer', sub: 'I can write code' },
            { icon: '🔬', label: 'AI researcher', sub: 'Deep technical knowledge' },
          ]
        }]);
      } else if (phase === 'level') {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `Got it — "**${value}**". Almost there! 🚀\n\nLast question:`,
          type: 'onboard_question',
          question: "What's your budget?",
          nextPhase: 'budget',
          options: [
            { icon: '🆓', label: 'Free only', sub: 'No credit card' },
            { icon: '💸', label: 'Pay as I go', sub: 'Small monthly costs OK' },
            { icon: '📦', label: 'Fixed plan', sub: 'Predictable monthly bill' },
            { icon: '🏗️', label: 'Enterprise', sub: 'Scale, SLAs, support' },
          ]
        }]);
      } else if (phase === 'budget') {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `🎉 **You're all set!** Based on what you told me, I've prepared a personalised prompt for you.`,
          type: 'onboard_done'
        }]);
        setOnboardPhase('chat');
      }
    }, 800);
  };

  return (
    <div id="chat-view" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <Sidebar models={modelsData} currentModelId={currentModelId} setCurrentModelId={setCurrentModelId} />

      <main className="central">
        <div className="chat-area">
          {messages.length === 0 && onboardPhase === 'start' && (
            <div className="greet-card">
              <div className="greet-avatar">✦</div>
              <h3 style={{ fontSize: '1.45rem', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>Welcome! I'm here to help you 👋</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: '1.25rem', lineHeight: 1.65 }}>No tech background needed. Tell me what you'd like to <strong>achieve</strong> — I'll help you discover what's possible, step by step.</p>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent)', marginBottom: '0.75rem' }}>✨ What would you like to do today?</div>
                <div className="ob-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                  {[
                    { icon: '✍️', label: 'Write content', sub: 'Emails, posts, stories' },
                    { icon: '🎨', label: 'Create images', sub: 'Art, photos, designs' },
                    { icon: '🛠️', label: 'Build something', sub: 'Apps, tools, websites' },
                    { icon: '⚡', label: 'Automate work', sub: 'Save hours every week' },
                    { icon: '📊', label: 'Analyse data', sub: 'PDFs, sheets, reports' },
                    { icon: '🔍', label: 'Just exploring', sub: "Show me what's possible" },
                  ].map((tile, i) => (
                    <div key={i} className="ob-tile" onClick={() => onboardPick('goal', tile.label, tile.icon)}>
                      <span className="ob-tile-icon">{tile.icon}</span>
                      <div className="ob-tile-label">{tile.label}</div>
                      <div className="ob-tile-sub">{tile.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text3)' }}>Or type anything below — there are no wrong answers ↓</div>
            </div>
          )}

          {onboardPhase === 'chat' && messages.filter(m => m.role === 'user').length === 0 && (
            <div className="msg ai">
              <div className="msg-av">✦</div>
              <div>
                <div className="bubble" style={{ maxWidth: '560px' }}>
                  Here's a personalised prompt crafted from your answers. You can <strong>run it as-is</strong>, edit it, regenerate a new version, or delete it and type your own. 👇
                </div>
                <div className="prepop-card">
                  <div className="ppc-eyebrow">✦ Your AI Prompt</div>
                  <div className="ppc-display" style={{ whiteSpace: 'pre-wrap' }}>{buildAutoPrompt()}</div>
                  <div className="ppc-btns">
                    <button className="ppc-btn ppc-run" onClick={() => handleSend(buildAutoPrompt())}>▶ Run prompt</button>
                    <button className="ppc-btn ppc-edit">✏ Edit</button>
                    <button className="ppc-btn ppc-regen">🔄 Regenerate</button>
                    <button className="ppc-btn ppc-del" onClick={() => { setOnboardPhase('start'); setMessages([]); }}>✕ Delete</button>
                  </div>
                </div>
                <div className="msg-meta">NexusAI Hub · prompt ready</div>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="msg-av">{m.role === 'user' ? 'U' : '✦'}</div>
              <div>
                <div className="bubble" dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') }}></div>
                {m.type === 'onboard_question' && (
                  <div className="hub-q-card">
                    <div className="hub-q-eyebrow">✦ {m.nextPhase.toUpperCase().replace('_', ' ')}</div>
                    <div className="hub-q-title">{m.question}</div>
                    <div className="hub-q-hint" style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: '0.75rem' }}>This helps match the right tool style</div>
                    <div className="hub-q-opts">
                      {m.options.map((o, idx) => (
                        <button key={idx} className="hub-q-opt" onClick={() => onboardPick(m.nextPhase, o.label, o.icon)}>
                          <span className="hub-q-opt-em">{o.icon}</span>
                          <span>
                            <span className="hub-q-opt-label">{o.label}</span>
                            <span className="hub-q-opt-sub">{o.sub}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {m.type === 'onboard_done' && (
                  <div className="prepop-card" style={{ marginTop: '0.75rem' }}>
                    <div className="ppc-eyebrow">✦ YOUR AI PROMPT</div>
                    <div className="ppc-display" style={{ whiteSpace: 'pre-wrap' }}>{buildAutoPrompt()}</div>
                    <div className="ppc-btns">
                      <button className="ppc-btn ppc-run" onClick={() => handleSend(buildAutoPrompt())}>▶ Run prompt</button>
                      <button className="ppc-btn ppc-edit">✏ Edit</button>
                      <button className="ppc-btn ppc-regen">🔄 Regenerate</button>
                      <button className="ppc-btn ppc-del" onClick={() => { setOnboardPhase('start'); setMessages([]); setLocalAnswers({}); }}>✕ Delete</button>
                    </div>
                  </div>
                )}
                <div className="msg-meta">NexusAI Hub · guided setup</div>
              </div>
            </div>
          ))}
          {isTyping && <div className="typing-ind"><div className="td"></div><div className="td"></div><div className="td"></div></div>}
          <div ref={chatEndRef} />
        </div>

        <div className="inp-area">
          {attachedFiles.length > 0 && (
            <div className="hub-attach-row">
              {attachedFiles.map((file, i) => (
                <div key={i} className="attach-chip">
                  📎 {file.name}
                  <button className="attach-chip-x" onClick={() => removeAttachment(i)}>×</button>
                </div>
              ))}
            </div>
          )}

          <div className="inp-row">
            <div className="inp-wrap inp-wrap-hero">
              <textarea 
                id="chat-input" 
                rows="2" 
                placeholder="Describe your project, ask a question, or just say hi - I'm here to help..."
                value={inputValue}
                onFocus={() => setShowCPanel(true)}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              />
              <div className="inp-bar">
                <button 
                  className={`inp-icon-btn ${isRecording ? 'mic-active' : ''}`} 
                  title="Voice input"
                  onClick={toggleVoiceInput}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                </button>
                <button className="inp-icon-btn" title="Tools">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                </button>
                <button className="inp-icon-btn" title="Video">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>
                  </svg>
                </button>
                <button className="inp-icon-btn" title="Screen">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </button>
                <button 
                  className="inp-icon-btn" 
                  title="Attach file"
                  onClick={triggerFileInput}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <div className="model-sel">
                  <span>{activeModel.name || 'GPT-5'}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            <button className="send-btn" onClick={() => handleSend()}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>

          {showCPanel && (
            <div className="cpanel">
              <div className="cpanel-tabs">
                {Object.keys(CPANEL_DATA).map(cat => (
                  <button
                    key={cat}
                    className={`cpanel-tab ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1)}
                  </button>
                ))}
              </div>
              <div className="cpanel-prompts">
                {CPANEL_DATA[activeCategory].map((p, i) => (
                  <button key={i} className="cpanel-prompt" onClick={() => handleSend(p)}>{p}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <RightPanel activeModel={activeModel} onboardingAnswers={localAnswers} />
    </div>
  );
};

export default ChatHub;
