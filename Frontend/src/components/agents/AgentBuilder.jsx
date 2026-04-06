import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/agents.css';
import { nxToast } from '../../utils/helpers';
import { recordScreen, recordUserVideo } from '../../utils/media';
import {
  ACP_SUGGESTED,
  AGENT_TABS,
  DEFAULT_AGENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_TASKS,
  TEMPLATE_CARDS,
  UC_APPS,
} from './agentsData';

const randomReply = () => {
  const replies = [
    'I have mapped this out and can execute step-by-step. Want me to start with a draft output?',
    'Great ask. I can handle this end-to-end with checkpoints so you can approve each stage.',
    'I can do that. I will begin with a structured plan and then implement directly.',
  ];
  return replies[Math.floor(Math.random() * replies.length)];
};

const AgentBuilder = ({ openChatFromAgent }) => {
  const [activeTab, setActiveTab] = useState('use_cases');
  const [query, setQuery] = useState('');
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [convMap, setConvMap] = useState(INITIAL_CONVERSATIONS);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [convInput, setConvInput] = useState('');
  const [showUseCaseDetail, setShowUseCaseDetail] = useState(false);
  const [showInlineLibrary, setShowInlineLibrary] = useState(false);
  const [myAgents, setMyAgents] = useState([{ name: 'My Agent', icon: '🤖', model: 'GPT-5', tools: [] }]);
  const [activeAgent, setActiveAgent] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mode, setMode] = useState('workspace');
  const [createStep, setCreateStep] = useState(0);
  const [draftAgent, setDraftAgent] = useState({ name: '', purpose: '', model: 'GPT-5', tools: [], memory: 'short' });
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return ACP_SUGGESTED[activeTab] || [];
    const merged = Object.values(ACP_SUGGESTED).flat();
    return merged.filter((i) => i.text.toLowerCase().includes(query.toLowerCase()));
  }, [activeTab, query]);

  const activeConversation = activeTaskId ? convMap[activeTaskId] || [] : [];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results).map((r) => r[0].transcript).join('');
        setQuery(transcript);
        if (Array.from(event.results).at(-1)?.isFinal) setIsRecording(false);
      };
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        nxToast('Voice recognition error');
      };
      recognitionRef.current.onend = () => setIsRecording(false);
    }
    return () => recognitionRef.current?.stop();
  }, []);

  const addTask = () => {
    const name = (taskInput || `New Task #${tasks.length + 1}`).trim();
    const id = Date.now();
    setTasks((prev) => [...prev, { id, name, completed: false }]);
    setConvMap((prev) => ({ ...prev, [id]: [] }));
    setTaskInput('');
    setActiveTaskId(id);
    nxToast('✅ Task created');
  };

  const sendTaskMessage = () => {
    if (!activeTaskId || !convInput.trim()) return;
    const text = convInput.trim();
    setConvMap((prev) => ({
      ...prev,
      [activeTaskId]: [...(prev[activeTaskId] || []), { role: 'user', text }, { role: 'agent', text: randomReply() }],
    }));
    setConvInput('');
  };

  const launchAgent = (agent) => {
    if (!myAgents.find((a) => a.name === agent.name)) setMyAgents((prev) => [...prev, agent]);
    setActiveAgent(agent);
    setMode('agent-chat');
    setShowInlineLibrary(false);
    nxToast(`🤖 ${agent.name} activated!`);
  };

  const saveDraftAgent = () => {
    if (!draftAgent.name.trim()) {
      nxToast('Please add an agent name');
      return;
    }
    launchAgent({ ...draftAgent, icon: '🤖', tools: draftAgent.tools || [] });
    setShowCreateModal(false);
  };

  const handleSuggestionClick = (text) => {
    if (openChatFromAgent) {
      openChatFromAgent(text);
      return;
    }
    setShowUseCaseDetail(true);
  };

  const handleUseCaseCardClick = (app) => {
    const prompt = `Build me: ${app.name}. Create a fully functional web application with clean UI, modern design, and responsive layout.`;
    if (openChatFromAgent) {
      openChatFromAgent(prompt);
      return;
    }
    nxToast(`Launch: ${app.name}`);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      nxToast('Voice recognition not supported in this browser');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const handleAttachFile = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachedFiles((prev) => [...prev, ...files]);
    setQuery(`Help me with this file: "${files[0].name}"`);
    nxToast(`${files.length} file(s) attached`);
  };

  const handleAttachImage = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachedFiles((prev) => [...prev, ...files]);
    setQuery(`Analyze this image: "${files[0].name}"`);
    nxToast(`${files.length} image(s) attached`);
  };

  const handleVideoInput = async () => {
    try {
      const { blob } = await recordUserVideo({ durationMs: 4000 });
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      setAttachedFiles((prev) => [...prev, file]);
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
      setAttachedFiles((prev) => [...prev, file]);
      setQuery('Here is a screen recording. Help with this.');
      nxToast('🖥️ Screen captured and attached');
    } catch (err) {
      nxToast(err?.message || 'Screen share failed');
    }
  };

  if (mode === 'agent-chat' && activeAgent) {
    return (
      <div className="agent-chat">
        <div className="agent-chat-top">
          <button className="btn btn-ghost" onClick={() => setMode('workspace')}>Agents</button>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeAgent.icon}</div>
          <div style={{ fontWeight: 700 }}>{activeAgent.name}</div>
        </div>
        <div className="agent-chat-area">
          <div className="conv-msg"><div className="conv-bub">Hi! I am <strong>{activeAgent.name}</strong>. Ask anything to start.</div></div>
        </div>
        <div className="conv-input">
          <textarea placeholder="Type your message..." />
          <button className="send-btn">➤</button>
        </div>
      </div>
    );
  }

  return (
    <div className="agents-page" id="agents-view">
      <aside className="agents-left">
        <div className="agents-brand">
          <div className="agents-brand-icon">🤖</div>
          <div>
            <h3>Agent Builder</h3>
            <p>Create powerful AI agents using any model.</p>
          </div>
        </div>
        <button className="agents-new-btn" onClick={() => setShowInlineLibrary((s) => !s)}>
          {showInlineLibrary ? '← Back' : '+ New Agent'}
        </button>
        <div className="agents-help">
          <div className="agents-help-head">
            <span className="agents-help-star">✦</span>
            <strong>Not sure where to start?</strong>
          </div>
          <p>Chat with our AI guide - describe what you want your agent to do and get a personalised setup plan.</p>
          <button
            onClick={() => {
              if (openChatFromAgent) {
                openChatFromAgent('Help me plan and build the right AI agent for my use case.');
              } else {
                nxToast('Opening Chat Hub...');
              }
            }}
          >
            Ask the Hub →
          </button>
        </div>

        <button className="task-add" onClick={addTask}>+ New Task</button>
        <input
          className="nlr-input"
          style={{ marginTop: 6 }}
          placeholder="Task name..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <div className="task-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-row ${activeTaskId === task.id ? 'active' : ''} ${task.completed ? 'done' : ''}`}
              onClick={() => setActiveTaskId(task.id)}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => {
                  e.stopPropagation();
                  setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
                }}
              />
              <span>{task.name}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className="agents-main">
        {showInlineLibrary ? (
          <div className="agents-inline">
            <div className="inline-left">
              <h4>My Agents</h4>
              <div className="my-agents">
                {myAgents.map((a) => (
                  <div key={a.name} className={`my-agent ${activeAgent?.name === a.name ? 'active' : ''}`} onClick={() => launchAgent(a)}>
                    <span>{a.icon}</span><span>{a.name}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => setShowCreateModal(true)}>
                ✨ Create Custom Agent
              </button>
            </div>
            <div className="inline-right">
              <h4>Agent Library</h4>
              <div className="template-grid">
                {DEFAULT_AGENTS.map((agent) => (
                  <div key={agent.name} className="template-card" onClick={() => launchAgent(agent)}>
                    <h5>{agent.icon} {agent.name}</h5>
                    <p>Prebuilt template ready to use.</p>
                    <div className="template-tags">
                      <span>{agent.model}</span>
                      {agent.tools.map((t) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                ))}
                <div className="template-card scratch" onClick={() => setShowCreateModal(true)}>Build from Scratch</div>
              </div>
            </div>
          </div>
        ) : activeTaskId ? (
          <div className="agents-conv">
            <div className="conv-head">
              <button className="btn btn-ghost" onClick={() => setActiveTaskId(null)}>←</button>
              <strong>{tasks.find((t) => t.id === activeTaskId)?.name || 'Task'}</strong>
            </div>
            <div className="conv-msgs">
              {activeConversation.length === 0 ? (
                <div className="conv-msg"><div className="conv-bub">What can I help you with? Pick a suggestion above or type below.</div></div>
              ) : (
                activeConversation.map((m, i) => (
                  <div key={i} className={`conv-msg ${m.role}`}>
                    <div className="conv-bub">{m.text}</div>
                  </div>
                ))
              )}
            </div>
            <div className="conv-input">
              <textarea value={convInput} onChange={(e) => setConvInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendTaskMessage())} />
              <button className="send-btn" onClick={sendTaskMessage}>➤</button>
            </div>
          </div>
        ) : (
          <div className="agents-workspace">
            {showUseCaseDetail ? (
              <div className="uc-detail">
                <div className="uc-top">
                  <button className="btn btn-ghost" onClick={() => setShowUseCaseDetail(false)}>←</button>
                  <strong>{AGENT_TABS.find((t) => t.key === activeTab)?.label}</strong>
                  <span style={{ color: 'var(--text3)', fontSize: '.8rem' }}>{(UC_APPS[activeTab] || []).length} apps</span>
                </div>
                <div className="uc-grid">
                  {(UC_APPS[activeTab] || []).map((app) => (
                    <div key={app.name} className="uc-card" onClick={() => handleUseCaseCardClick(app)}>
                      <div style={{ fontSize: '1.55rem' }}>{app.emoji}</div>
                      <strong>{app.name}</strong>
                      <small>{app.type}</small>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="agents-head">
                  <h2>Agent works <span>for you.</span></h2>
                  <p>Your AI agent takes care of everything, end to end.</p>
                </div>
                <div className="agents-search">
                  <div className="agents-search-card">
                    <textarea
                      rows={1}
                      placeholder="What should we work on next?"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="agents-search-bar">
                      <button className={`agents-tool-btn purple ${isRecording ? 'active' : ''}`} title="Voice conversation" onClick={toggleVoiceInput}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                      </button>
                      <button className={`agents-tool-btn orange ${isRecording ? 'active' : ''}`} title="Voice typing" onClick={toggleVoiceInput}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z"/></svg>
                      </button>
                      <button className="agents-tool-btn blue" title="Video" onClick={handleVideoInput}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                      </button>
                      <button className="agents-tool-btn teal" title="Screen sharing" onClick={handleScreenShare}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>
                      </button>
                      <button className="agents-tool-btn rose" title="Attach file" onClick={() => fileInputRef.current?.click()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                      </button>
                      <button className="agents-tool-btn green" title="Upload image" onClick={() => imageInputRef.current?.click()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </button>
                      <button className="agents-tip-btn" title="Prompt tips" onClick={() => nxToast('✨ Prompt tips coming soon')}>✦</button>
                      <div className="agents-chip-label">Agent</div>
                      <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.csv" onChange={handleAttachFile} />
                      <input ref={imageInputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={handleAttachImage} />
                      <button className="agents-send" onClick={() => setShowUseCaseDetail(true)}>➤</button>
                    </div>
                  </div>
                  {attachedFiles.length > 0 && (
                    <div className="agents-attach-row">
                      {attachedFiles.map((file, idx) => (
                        <div key={`${file.name}-${idx}`} className="agents-attach-chip">
                          📎 {file.name}
                          <button
                            onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="agents-tabs">
                  {AGENT_TABS.map((tab) => (
                    <button key={tab.key} className={`agents-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => { setActiveTab(tab.key); setQuery(''); }}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
                <div className="agents-suggest">
                  {filteredSuggestions.map((s) => (
                    <button key={s.text} className="agents-sq" onClick={() => handleSuggestionClick(s.text)}>
                      <div className="ic">{s.icon}</div>
                      <span>{s.text}</span>
                    </button>
                  ))}
                </div>
                <div className="agents-foot">
                  <button onClick={() => setShowUseCaseDetail(true)}>View all suggestions</button>
                  <button onClick={() => setQuery('')}>Shuffle</button>
                </div>
              </>
            )}
            <div className="agents-templates">
              <h4>Agent Templates <span style={{ background: 'var(--bg2)', padding: '0 6px', borderRadius: 4 }}>{TEMPLATE_CARDS.length + 1}</span></h4>
              <div className="template-grid">
                {TEMPLATE_CARDS.map((card) => (
                  <div key={card.name} className="template-card" onClick={() => setShowTemplateModal(card)}>
                    <h5>{card.icon} {card.name}</h5>
                    <p>Ready-to-use template with tools and model presets.</p>
                    <div className="template-tags">
                      <span>{card.model}</span>
                      {card.tools.map((t) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                ))}
                <div className="template-card scratch" onClick={() => setShowCreateModal(true)}>+ Build from Scratch</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showTemplateModal && (
        <div className="ag-overlay" onClick={() => setShowTemplateModal(null)}>
          <div className="ag-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-head">
              <div><strong>{showTemplateModal.icon} {showTemplateModal.name}</strong><div style={{ fontSize: '.78rem', color: 'var(--text3)' }}>Pre-built template</div></div>
              <button className="btn btn-ghost" onClick={() => setShowTemplateModal(null)}>✕</button>
            </div>
            <div className="ag-modal-body">
              <p style={{ fontSize: '.86rem', color: 'var(--text2)' }}>This template is configured with model <strong>{showTemplateModal.model}</strong> and tools: {showTemplateModal.tools.join(', ')}.</p>
              <div className="ag-actions" style={{ marginTop: 12 }}>
                <button className="btn btn-ghost" onClick={() => setShowTemplateModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => launchAgent(showTemplateModal)}>Use template as-is</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="ag-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="ag-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-head">
              <div><strong>Create New Agent</strong><div style={{ fontSize: '.78rem', color: 'var(--text3)' }}>Step {createStep + 1} of 6</div></div>
              <button className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="ag-step-tabs">
              {['Purpose', 'Prompt', 'Tools', 'Memory', 'Test', 'Deploy'].map((s, i) => (
                <button key={s} className={i === createStep ? 'active' : ''} onClick={() => setCreateStep(i)}>{s}</button>
              ))}
            </div>
            <div className="ag-modal-body">
              {createStep === 0 && (
                <>
                  <div className="ag-field"><input placeholder="Agent name" value={draftAgent.name} onChange={(e) => setDraftAgent((d) => ({ ...d, name: e.target.value }))} /></div>
                  <div className="ag-field"><textarea rows={4} placeholder="Agent purpose" value={draftAgent.purpose} onChange={(e) => setDraftAgent((d) => ({ ...d, purpose: e.target.value }))} /></div>
                </>
              )}
              {createStep === 1 && <div className="ag-field"><textarea rows={6} placeholder="System prompt" /></div>}
              {createStep === 2 && (
                <div className="ag-field">
                  <label><input type="checkbox" onChange={(e) => setDraftAgent((d) => ({ ...d, tools: e.target.checked ? [...d.tools, 'Web Search'] : d.tools.filter((t) => t !== 'Web Search') }))} /> Web Search</label><br />
                  <label><input type="checkbox" onChange={(e) => setDraftAgent((d) => ({ ...d, tools: e.target.checked ? [...d.tools, 'File Parser'] : d.tools.filter((t) => t !== 'File Parser') }))} /> File Parser</label>
                </div>
              )}
              {createStep === 3 && (
                <div className="ag-field">
                  <select value={draftAgent.memory} onChange={(e) => setDraftAgent((d) => ({ ...d, memory: e.target.value }))}>
                    <option value="none">No memory</option>
                    <option value="short">Short-term</option>
                    <option value="long">Short + Long-term</option>
                  </select>
                </div>
              )}
              {createStep >= 4 && <p style={{ fontSize: '.85rem', color: 'var(--text2)' }}>Ready to deploy this agent with selected config.</p>}
            </div>
            <div className="ag-actions">
              <button className="btn btn-ghost" onClick={() => setCreateStep((s) => Math.max(0, s - 1))}>← Back</button>
              {createStep < 5 ? (
                <button className="btn btn-primary" onClick={() => setCreateStep((s) => Math.min(5, s + 1))}>Next →</button>
              ) : (
                <button className="btn btn-primary" onClick={saveDraftAgent}>Finish</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentBuilder;
