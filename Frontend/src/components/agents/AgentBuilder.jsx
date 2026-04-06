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
    `Absolutely! I can handle that task for you. Here's my approach:\n\n**Phase 1:** Analysis & Planning\n- Review current state\n- Identify gaps\n- Define success criteria\n\n**Phase 2:** Execution\n- Implement changes\n- Validate results\n- Document process\n\nReady to start?`,
    `Great question! Based on your request, here's what I recommend:\n\n- Start with the core functionality\n- Add error handling and edge cases\n- Include tests for validation\n\nWould you like me to begin with step 1?`,
    `I understand what you need. Let me work on this right away.\n\nI'll process your request and provide a detailed output with all the relevant information organised clearly.`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
};

const getTimeLabel = () => {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

const formatMessageText = (text = '') =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

const CONV_SUG_DATA = {
  quick_start: [
    { icon: '🚀', text: 'Build a dashboard for my team' },
    { icon: '📊', text: 'Analyze my spreadsheet data' },
    { icon: '💼', text: 'Write a business proposal' },
    { icon: '🗺️', text: 'Plan my product launch strategy' },
  ],
  code: [
    { icon: '💻', text: 'Build a REST API from scratch' },
    { icon: '🐛', text: 'Debug and fix errors in my code' },
    { icon: '🧪', text: 'Write unit tests for my project' },
    { icon: '📦', text: 'Set up a CI/CD pipeline' },
  ],
  content: [
    { icon: '✍️', text: 'Write a blog post about AI trends' },
    { icon: '📧', text: 'Draft a professional email campaign' },
    { icon: '🎬', text: 'Write a video script for YouTube' },
    { icon: '📖', text: 'Create an eBook outline and draft' },
  ],
  research: [
    { icon: '🔍', text: 'Research competitor pricing strategies' },
    { icon: '🌐', text: 'Find the latest AI research papers' },
    { icon: '📊', text: 'Analyze market trends in my industry' },
    { icon: '🧠', text: 'Explore machine learning approaches' },
  ],
  business: [
    { icon: '💰', text: 'Build a financial model for my startup' },
    { icon: '👥', text: 'Create customer personas for my product' },
    { icon: '📈', text: 'Build a revenue forecast dashboard' },
    { icon: '🏢', text: 'Write a comprehensive business plan' },
  ],
};

const TOOL_LIBRARY = [
  { name: 'Web Search', desc: 'Search the web in real time for up-to-date information' },
  { name: 'Database Lookup', desc: 'Query your database or vector store for internal knowledge' },
  { name: 'Email Sender', desc: 'Send emails or notifications on behalf of the agent' },
  { name: 'Calendar API', desc: 'Read/write calendar events and schedule meetings' },
  { name: 'Slack Webhook', desc: 'Post messages and alerts to Slack channels' },
  { name: 'Jira', desc: 'Create and update Jira tickets automatically' },
  { name: 'Google Sheets', desc: 'Read from and write to spreadsheets' },
  { name: 'Custom Function', desc: 'Define your own tool with a JSON schema' },
];

const AgentBuilder = ({ openChatFromAgent }) => {
  const [activeTab, setActiveTab] = useState('use_cases');
  const [query, setQuery] = useState('');
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [convMap, setConvMap] = useState(INITIAL_CONVERSATIONS);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [convInput, setConvInput] = useState('');
  const [convSugTab, setConvSugTab] = useState('quick_start');
  const [showUseCaseDetail, setShowUseCaseDetail] = useState(false);
  const [showInlineLibrary, setShowInlineLibrary] = useState(false);
  const [myAgents, setMyAgents] = useState([{ name: 'My Agent', icon: '🤖', model: 'GPT-5', tools: [] }]);
  const [activeAgent, setActiveAgent] = useState(null);
  const [agentChatMessages, setAgentChatMessages] = useState([]);
  const [agentChatInput, setAgentChatInput] = useState('');
  const [agentMetrics, setAgentMetrics] = useState({ messages: 0, tokens: 0 });
  const [showTemplateModal, setShowTemplateModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mode, setMode] = useState('workspace');
  const [createStep, setCreateStep] = useState(0);
  const [createData, setCreateData] = useState({
    name: '',
    type: 'Customer Support',
    purpose: '',
    audience: 'Customers',
    tone: 'Professional',
    avoid: '',
    success: '',
    systemPrompt: '',
    tools: [],
    memory: 'Short-term Only',
    scenarios: [],
    manualScenario: '',
  });
  const [draftAgent, setDraftAgent] = useState({ name: '', purpose: '', model: 'GPT-5', tools: [], memory: 'short' });
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTarget, setVoiceTarget] = useState('workspace');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const recognitionRef = useRef(null);
  const voiceTargetRef = useRef('workspace');
  const workspaceFileInputRef = useRef(null);
  const workspaceImageInputRef = useRef(null);
  const convFileInputRef = useRef(null);
  const convImageInputRef = useRef(null);
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return ACP_SUGGESTED[activeTab] || [];
    const merged = Object.values(ACP_SUGGESTED).flat();
    return merged.filter((i) => i.text.toLowerCase().includes(query.toLowerCase()));
  }, [activeTab, query]);

  const filteredTasks = useMemo(() => {
    const q = taskInput.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.name.toLowerCase().includes(q));
  }, [taskInput, tasks]);

  const activeConversation = activeTaskId ? convMap[activeTaskId] || [] : [];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results).map((r) => r[0].transcript).join('').trim();
        const target = voiceTargetRef.current;
        if (target === 'agent-chat') {
          setAgentChatInput(transcript);
        } else if (target === 'task') {
          setConvInput(transcript);
        } else {
          setQuery(transcript);
        }
        if (Array.from(event.results).at(-1)?.isFinal) {
          setIsRecording(false);
        }
      };
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        nxToast('Voice recognition error. Please try again.');
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

  const sendTaskMessage = (forcedText) => {
    if (!activeTaskId) return;
    const text = (forcedText ?? convInput).trim();
    if (!text) return;
    setConvMap((prev) => ({
      ...prev,
      [activeTaskId]: [
        ...(prev[activeTaskId] || []),
        { role: 'user', text, time: getTimeLabel() },
        { role: 'agent', text: randomReply(), time: getTimeLabel() },
      ],
    }));
    setConvInput('');
  };

  const editTask = (taskId) => {
    const existing = tasks.find((t) => t.id === taskId);
    if (!existing) return;
    const updated = window.prompt('Edit task name', existing.name);
    if (updated === null) return;
    const nextName = updated.trim();
    if (!nextName) return;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, name: nextName } : t)));
    setOpenTaskMenuId(null);
  };

  const duplicateTask = (taskId) => {
    const existing = tasks.find((t) => t.id === taskId);
    if (!existing) return;
    const id = Date.now();
    const copyName = `${existing.name} (copy)`;
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === taskId);
      const item = { id, name: copyName, completed: false };
      if (idx < 0) return [...prev, item];
      const next = [...prev];
      next.splice(idx + 1, 0, item);
      return next;
    });
    setConvMap((prev) => ({ ...prev, [id]: [...(prev[taskId] || [])] }));
    setOpenTaskMenuId(null);
    nxToast('📋 Task duplicated');
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setConvMap((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
    if (activeTaskId === taskId) setActiveTaskId(null);
    setOpenTaskMenuId(null);
    nxToast('🗑️ Task deleted');
  };

  useEffect(() => {
    const closeMenu = () => setOpenTaskMenuId(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const launchAgent = (agent) => {
    const nextAgent = { ...agent, memory: agent.memory || 'Short-term' };
    if (!myAgents.find((a) => a.name === nextAgent.name)) setMyAgents((prev) => [...prev, nextAgent]);
    setActiveAgent(nextAgent);
    const welcome = nextAgent.name === 'Customer Support Agent'
      ? "👋 Hello! I'm your Customer Support Agent — I'm here to help with product questions, order issues, billing, and technical problems.\n\nHow can I assist you today?"
      : `👋 Hi! I'm your ${nextAgent.name}. How can I help you today?`;
    setAgentChatMessages([{ role: 'ai', text: welcome, time: getTimeLabel() }]);
    setAgentMetrics({ messages: 0, tokens: 0 });
    setMode('agent-chat');
    setShowInlineLibrary(false);
    nxToast(`🤖 ${nextAgent.name} activated!`);
  };

  const sendAgentChat = (presetText) => {
    const text = (presetText ?? agentChatInput).trim();
    if (!text) return;
    const reply = randomReply();
    const userWords = text.split(/\s+/).filter(Boolean).length;
    const aiWords = reply.split(/\s+/).filter(Boolean).length;
    setAgentChatMessages((prev) => [
      ...prev,
      { role: 'user', text, time: getTimeLabel() },
      { role: 'ai', text: reply, time: getTimeLabel() },
    ]);
    setAgentMetrics((prev) => ({
      messages: prev.messages + 1,
      tokens: prev.tokens + Math.floor(userWords * 1.3 + aiWords * 1.3),
    }));
    setAgentChatInput('');
  };

  const saveDraftAgent = () => {
    const resolvedName = (createData.name || '').trim() || 'My Custom Agent';
    const agent = {
      name: resolvedName,
      icon: '🤖',
      model: draftAgent.model || 'GPT-5',
      tools: createData.tools || [],
      purpose: createData.purpose || '',
      memory: createData.memory || 'Short-term Only',
      desc: createData.purpose || 'Custom agent created from scratch.',
    };
    if (!myAgents.find((a) => a.name === agent.name)) {
      setMyAgents((prev) => [...prev, agent]);
    }
    setShowCreateModal(false);
    setShowInlineLibrary(false);
    setMode('workspace');
    setShowUseCaseDetail(false);

    const taskId = Date.now();
    const taskName = `${agent.name} setup`;
    setTasks((prev) => [...prev, { id: taskId, name: taskName, completed: false }]);
    setConvMap((prev) => ({ ...prev, [taskId]: [] }));
    setActiveTaskId(taskId);
  };

  const openCustomAgentFlow = () => {
    setCreateStep(0);
    setShowCreateModal(true);
  };

  const buildSystemPromptFromAnswers = () => {
    return `You are ${createData.name || 'my agent'}.\n\n## Role\n${createData.purpose || 'Help users effectively.'}\n\n## Audience\nYou are talking to ${createData.audience}.\n\n## Tone\nUse a ${createData.tone.toLowerCase()} tone.\n\n## Rules\n- Stay focused on your role.\n- Be accurate and clear.\n- Escalate when needed.\n${createData.avoid ? `- Never: ${createData.avoid}` : ''}`;
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

  const toggleVoiceInput = (target = 'workspace') => {
    if (!recognitionRef.current) {
      nxToast('Voice recognition not supported in this browser');
      return;
    }
    voiceTargetRef.current = target;
    setVoiceTarget(target);
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }
    try {
      recognitionRef.current.start();
      setIsRecording(true);
      nxToast('🎤 Listening...');
    } catch (_) {
      setIsRecording(false);
      nxToast('Microphone is busy. Please try again.');
    }
  };

  const handleAttachFile = (e, target = 'workspace') => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachedFiles((prev) => [...prev, ...files]);
    const prompt = `Help me with this file: "${files[0].name}"`;
    if (target === 'conversation') setConvInput(prompt);
    else setQuery(prompt);
    nxToast(`${files.length} file(s) attached`);
  };

  const handleAttachImage = (e, target = 'workspace') => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachedFiles((prev) => [...prev, ...files]);
    const prompt = `Analyze this image: "${files[0].name}"`;
    if (target === 'conversation') setConvInput(prompt);
    else setQuery(prompt);
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
    const tryChips =
      activeAgent.name === 'Customer Support Agent'
        ? ['My order hasn\'t arrived', 'I need a refund', 'How do I reset my password?', 'Billing issue on my account', 'Report a bug']
        : ['What can you do?', 'Give me a quick summary', 'Show me an example', 'How do you handle errors?'];

  return (
      <div className="agent-chat-full">
        <div className="agent-chat-topbar">
          <button className="agent-pill-btn" onClick={() => setMode('workspace')}>← Agents</button>
          <div className="agent-title-wrap">
            <div className="agent-title-row">
              <div className="agent-icon-chip">{activeAgent.icon}</div>
              <div className="agent-name">{activeAgent.name}</div>
              <span className="agent-live-pill">● Live</span>
            </div>
            <div className="agent-meta-row">Tools: {activeAgent.tools?.join(', ')} · Memory: {activeAgent.memory}</div>
          </div>
          <div className="agent-top-actions">
            <button className="agent-pill-btn">⚙ Settings</button>
            <button className="agent-pill-btn">📊 Monitor</button>
            <button className="agent-edit-btn">✎ Edit Agent</button>
          </div>
        </div>

        <div className="agent-try-row">
          <span>TRY:</span>
          {tryChips.map((chip) => (
            <button key={chip} className="agent-try-chip" onClick={() => sendAgentChat(chip)}>{chip}</button>
          ))}
        </div>

        <div className="agent-chat-body">
          <div className="agent-chat-main">
            <div className="agent-chat-msgs">
              {agentChatMessages.map((m, i) => (
                <div key={i} className={`conv-msg ${m.role}`}>
                  <div className="conv-avatar">{m.role === 'user' ? 'Y' : activeAgent.icon}</div>
                  <div>
                    <div className="conv-bub" dangerouslySetInnerHTML={{ __html: formatMessageText(m.text) }} />
                    <div className="conv-time">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="conv-composer-wrap">
              <div className="conv-composer-card">
                <textarea
                  placeholder="Describe your project, ask a question, or just say hi — I`m here to help..."
                  value={agentChatInput}
                  onChange={(e) => setAgentChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendAgentChat())}
                />
                <div className="conv-composer-tools">
                  <button className={`agents-tool-btn purple ${isRecording && voiceTarget === 'agent-chat' ? 'active' : ''}`} onClick={() => toggleVoiceInput('agent-chat')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                  </button>
                  <button className="agents-tool-btn orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="20" height="7" rx="2"/></svg></button>
                  <button className="agents-tool-btn blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/></svg></button>
                  <button className="agents-tool-btn teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/></svg></button>
                  <button className="agents-tool-btn rose" onClick={() => convFileInputRef.current?.click()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
                  <button className="agents-tool-btn green" onClick={() => convImageInputRef.current?.click()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></button>
                  <button className="agents-tip-btn">✦</button>
                  <span className="conv-composer-agent">Agent</span>
                  <input ref={convFileInputRef} type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.csv" onChange={(e) => handleAttachFile(e, 'conversation')} />
                  <input ref={convImageInputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleAttachImage(e, 'conversation')} />
                </div>
              </div>
              <button className="conv-send-round" onClick={() => sendAgentChat()}>➤</button>
            </div>
      </div>

          <aside className="agent-chat-right">
            <div className="acr-title">AGENT INFO</div>
            <div className="acr-card"><small>Status</small><strong>● Deployed & Live</strong></div>
            <div className="acr-card"><small>Memory</small><strong>{activeAgent.memory}</strong></div>
            <div className="acr-card"><small>Tools Connected</small><div className="acr-tools">{activeAgent.tools?.map((t) => <span key={t}>{t}</span>)}</div></div>
            <div className="acr-title">LIVE METRICS</div>
            <div className="acr-metric"><span>Messages</span><strong>{agentMetrics.messages}</strong></div>
            <div className="acr-metric"><span>Avg latency</span><strong>—</strong></div>
            <div className="acr-metric"><span>Tokens used</span><strong>{agentMetrics.tokens}</strong></div>
            <div className="acr-title">ACTIONS</div>
            <button className="acr-btn">✎ Edit configuration</button>
            <button className="acr-btn">🔗 Copy endpoint URL</button>
            <button className="acr-btn">📊 View dashboard</button>
            <button className="acr-btn" onClick={() => setMode('workspace')}>← Back to Agents</button>
          </aside>
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
          {filteredTasks.map((task) => (
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
                        <button 
                className="task-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenTaskMenuId((prev) => (prev === task.id ? null : task.id));
                }}
              >
                ⋮
              </button>
              {openTaskMenuId === task.id && (
                <div className="task-menu" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => editTask(task.id)}>✎ Edit</button>
                  <button onClick={() => duplicateTask(task.id)}>⧉ Duplicate</button>
                  <button className="danger" onClick={() => deleteTask(task.id)}>🗑 Delete</button>
                </div>
              )}
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', padding: '0.55rem 0.3rem' }}>
              No matching tasks found.
            </div>
          )}
        </div>
      </aside>

      <main className="agents-main">
        {showInlineLibrary ? (
          <div className="agents-workspace">
            <div className="agents-inline">
              <div className="inline-left">
                <div className="inline-left-head">
                  <h4>My Agents</h4>
                  <button className="inline-close-btn" onClick={() => setShowInlineLibrary(false)}>✕</button>
                </div>
                <div className="my-agents">
                  {myAgents.map((a) => (
                    <div key={a.name} className={`my-agent ${activeAgent?.name === a.name ? 'active' : ''}`} onClick={() => launchAgent(a)}>
                      <span className="my-agent-icon">{a.icon}</span>
                      <div>
                        <div className="my-agent-name">{a.name}</div>
                        <div className="my-agent-sub">{a.model} · {(a.tools || []).length} tools</div>
                      </div>
                      <span className="my-agent-live-dot"></span>
                    </div>
                  ))}
                </div>
                 <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={openCustomAgentFlow}>
                  ✨ Create Custom Agent
                </button>
              </div>
              <div className="inline-right">
                <div className="inline-right-head">
                  <div>
                    <h4>Agent Library</h4>
                    <p>Choose a default agent or build your own</p>
                  </div>
                  <span className="inline-pill">Default Agents</span>
                </div>
                <div className="template-grid">
                  {DEFAULT_AGENTS.map((agent) => (
                    <div key={agent.name} className="template-card lib-card" onClick={() => launchAgent(agent)}>
                      <h5>{agent.icon} {agent.name}</h5>
                      <p>{agent.desc}</p>
                      <div className="template-tags">
                        <span>{agent.model}</span>
                        {agent.tools.map((t) => <span key={t}>{t}</span>)}
                      </div>
                    </div>
                  ))}
                   <div className="template-card scratch" onClick={openCustomAgentFlow}>Build from Scratch</div>
                </div>
              </div>
            </div>

            <div className="agents-templates">
              <h4>Agent Templates <span style={{ background: 'var(--bg2)', padding: '0 6px', borderRadius: 4 }}>{TEMPLATE_CARDS.length}</span></h4>
              <div className="template-grid">
                {TEMPLATE_CARDS.map((agent) => (
                  <div key={agent.name} className="template-card" onClick={() => launchAgent(agent)}>
                    <h5>{agent.icon} {agent.name}</h5>
                    <p>{agent.desc?.slice(0, 70) || 'Ready-to-use template.'}</p>
                    <div className="template-tags">
                      <span>{agent.model}</span>
                      {agent.tools.map((t) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                ))}
                 <div className="template-card scratch" onClick={openCustomAgentFlow}>+ Build from Scratch</div>
              </div>
            </div>
          </div>
        ) : activeTaskId ? (
          <div className="agents-conv">
            <div className="conv-head">
              <button className="btn btn-ghost" onClick={() => setActiveTaskId(null)}>←</button>
              <div>
                <strong>{tasks.find((t) => t.id === activeTaskId)?.name || 'Task'}</strong>
                <div className="conv-subline">● {activeConversation.length} messages</div>
              </div>
              <div className="conv-actions-right">⌕ ⋯</div>
            </div>
            <div className="conv-msgs">
              {activeConversation.length === 0 ? (
                <div className="conv-empty-wrap">
                  <div className="conv-empty-avatar">🤖</div>
                  <h3>What can I help you <span>with?</span></h3>
                  <p>Your AI agent is ready to help you accomplish any task — just type below or pick a suggestion.</p>
                  <div className="conv-sug-tabs">
                    {[
                      ['quick_start', '⚡ Quick start'],
                      ['code', '⌘ Code'],
                      ['content', '✎ Content'],
                      ['research', '⌕ Research'],
                      ['business', '◻ Business'],
                    ].map(([k, label]) => (
                      <button key={k} className={convSugTab === k ? 'active' : ''} onClick={() => setConvSugTab(k)}>{label}</button>
                    ))}
                  </div>
                  <div className="conv-sug-grid">
                    {(CONV_SUG_DATA[convSugTab] || []).map((item) => (
                      <button key={item.text} className="conv-sug-item" onClick={() => sendTaskMessage(item.text)}>
                        <span className="conv-sug-item-ic">{item.icon}</span>
                        <span>{item.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
              ) : (
                activeConversation.map((m, i) => (
                  <div key={i} className={`conv-msg ${m.role}`}>
                    <div className="conv-avatar">{m.role === 'user' ? 'Y' : 'AI'}</div>
                    <div>
                      <div className="conv-bub" dangerouslySetInnerHTML={{ __html: formatMessageText(m.text) }} />
                      <div className="conv-time">{m.time || getTimeLabel()}</div>
                    </div>
                  </div>
                ))
                )}
              </div>
            <div className="conv-composer-wrap">
              <div className="conv-composer-card">
                <textarea
                  placeholder="Type your message..."
                  value={convInput}
                  onChange={(e) => setConvInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendTaskMessage())}
                />
                <div className="conv-composer-tools">
                  <button className={`agents-tool-btn purple ${isRecording && voiceTarget === 'task' ? 'active' : ''}`} title="Voice conversation" onClick={() => toggleVoiceInput('task')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                  </button>
                  <button className={`agents-tool-btn orange ${isRecording && voiceTarget === 'task' ? 'active' : ''}`} title="Voice typing" onClick={() => toggleVoiceInput('task')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z"/></svg>
                  </button>
                  <button className="agents-tool-btn rose" title="Attach file" onClick={() => convFileInputRef.current?.click()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </button>
                  <button className="agents-tool-btn green" title="Upload image" onClick={() => convImageInputRef.current?.click()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </button>
                  <button
                    className="agents-tip-btn"
                    title="Prompt tips"
                    onClick={() => {
                      const tip = 'Help me break this task into clear, step-by-step actions with milestones.';
                      setConvInput((prev) => (prev ? `${prev}\n${tip}` : tip));
                    }}
                  >
                    ✦
                  </button>
                  <span className="conv-composer-agent">Agent</span>
                  <input ref={convFileInputRef} type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.csv" onChange={(e) => handleAttachFile(e, 'conversation')} />
                  <input ref={convImageInputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleAttachImage(e, 'conversation')} />
                </div>
              </div>
              <button className="conv-send-round" onClick={() => sendTaskMessage()}>➤</button>
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
                      <button className={`agents-tool-btn purple ${isRecording && voiceTarget === 'workspace' ? 'active' : ''}`} title="Voice conversation" onClick={() => toggleVoiceInput('workspace')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                      </button>
                      <button className={`agents-tool-btn orange ${isRecording && voiceTarget === 'workspace' ? 'active' : ''}`} title="Voice typing" onClick={() => toggleVoiceInput('workspace')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z"/></svg>
                      </button>
                      <button className="agents-tool-btn blue" title="Video" onClick={handleVideoInput}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                      </button>
                      <button className="agents-tool-btn teal" title="Screen sharing" onClick={handleScreenShare}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>
                      </button>
                      <button className="agents-tool-btn rose" title="Attach file" onClick={() => workspaceFileInputRef.current?.click()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                      </button>
                      <button className="agents-tool-btn green" title="Upload image" onClick={() => workspaceImageInputRef.current?.click()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </button>
                      <button className="agents-tip-btn" title="Prompt tips" onClick={() => nxToast('✨ Prompt tips coming soon')}>✦</button>
                      <div className="agents-chip-label">Agent</div>
                      <input ref={workspaceFileInputRef} type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.csv" onChange={(e) => handleAttachFile(e, 'workspace')} />
                      <input ref={workspaceImageInputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleAttachImage(e, 'workspace')} />
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
                <div className="template-card scratch" onClick={openCustomAgentFlow}>+ Build from Scratch</div>
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
          <div className="ag-modal ag-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-head">
              <div>
                <strong>{['Define your agent\'s purpose', 'Write the system prompt', 'Connect tools & APIs', 'Set up memory', 'Test & iterate', 'Deploy & monitor'][createStep]}</strong>
                <div style={{ fontSize: '.78rem', color: 'var(--text3)' }}>Step {createStep + 1} of 6</div>
              </div>
              <button className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="ag-step-tabs ag-step-tabs-rich">
               {['Purpose', 'System Prompt', 'Tools & APIs', 'Memory', 'Test', 'Deploy'].map((s, i) => (
                <button key={s} className={`${i === createStep ? 'active' : ''} ${i < createStep ? 'done' : ''}`} onClick={() => setCreateStep(i)}>
                  <span className="ag-step-dot">{i < createStep ? '✓' : i + 1}</span>{s}
                </button>
              ))}
            </div>
            <div className="ag-modal-body ag-rich-body">
              {createStep === 0 && (
                <>
                  <div className="ag-step-title">STEP 1 OF 6</div>
                  <div className="ag-step-copy">Answer a few quick questions - we'll use your answers to build the perfect agent.</div>
                  <div className="ag-field"><label>What do you want to call your agent?</label><input placeholder="e.g. Support Bot, Research Assistant, Code Reviewer..." value={createData.name} onChange={(e) => setCreateData((d) => ({ ...d, name: e.target.value }))} /></div>
                  <div className="ag-field"><label>What kind of agent is this?</label><div className="ag-chip-row">{['Customer Support','Research & Data','Code & Dev','Sales & CRM','Content & Writing','Operations','Finance & Reports','Something else'].map((v)=> <button key={v} className={`ag-chip ${createData.type===v?'on':''}`} onClick={()=>setCreateData((d)=>({...d,type:v}))}>{v}</button>)}</div></div>
                  <div className="ag-field"><label>What's the main job? <span style={{ color: 'var(--text3)', fontWeight: 500 }}>(in plain English)</span></label><textarea rows={3} placeholder="e.g. Answer customer questions, handle returns, and create support tickets for issues we can't resolve." value={createData.purpose} onChange={(e) => setCreateData((d) => ({ ...d, purpose: e.target.value }))} /></div>
                  <div className="ag-chip-row">{['Answer customer questions and escalate unresolved issues','Search the web and write structured research reports','Review code for bugs and suggest improvements','Draft emails, posts, and marketing content'].map((v)=> <button key={v} className="ag-chip alt" onClick={()=>setCreateData((d)=>({...d,purpose:v}))}>{v}</button>)}</div>
                  <div className="ag-field"><label>Who will be talking to this agent?</label><div className="ag-chip-row">{['Customers','Internal team','Developers','Executives'].map((v)=> <button key={v} className={`ag-chip ${createData.audience===v?'on':''}`} onClick={()=>setCreateData((d)=>({...d,audience:v}))}>{v}</button>)}</div></div>
                  <div className="ag-field"><label>How should the agent sound?</label><div className="ag-chip-row">{['Professional','Friendly','Short & direct','Thorough'].map((v)=> <button key={v} className={`ag-chip ${createData.tone===v?'on':''}`} onClick={()=>setCreateData((d)=>({...d,tone:v}))}>{v}</button>)}</div></div>
                  <div className="ag-field"><label>Anything it should never do? <span style={{ color: 'var(--text3)', fontWeight: 500 }}>- optional</span></label><input placeholder="e.g. Never share pricing, never discuss competitors, never give legal advice" value={createData.avoid} onChange={(e)=>setCreateData((d)=>({...d,avoid:e.target.value}))} /></div>
                  <div className="ag-field"><label>How will you know it's doing a good job? <span style={{ color: 'var(--text3)', fontWeight: 500 }}>- optional</span></label><input placeholder="e.g. Resolves most questions without human help, always polite, gives a ticket number" value={createData.success} onChange={(e)=>setCreateData((d)=>({...d,success:e.target.value}))} /></div>
                  <div className="ag-note-box">✨ Your answers will <strong>auto-generate a system prompt</strong> in the next step - you can edit or regenerate it any time.</div>
                </>
              )}
              {createStep === 1 && (
                <>
                  <div className="ag-step-title">STEP 2 OF 6</div>
                  <div className="ag-step-copy">The system prompt defines the agent's persona, scope, and behavior.</div>
                  <div className="ag-field">
                    <div className="ag-inline-actions"><label>System Prompt</label><button className="ag-mini-btn" onClick={()=>setCreateData((d)=>({...d,systemPrompt:buildSystemPromptFromAnswers()}))}>↻ Regenerate from answers</button></div>
                    <div className="ag-success-strip">✨ Auto-generated from your Step 1 answers - edit freely below.</div>
                    <textarea rows={12} value={createData.systemPrompt || buildSystemPromptFromAnswers()} onChange={(e)=>setCreateData((d)=>({...d,systemPrompt:e.target.value}))}/>
                  </div>
                  <div className="ag-two-cols">
                    <div className="ag-col-card"><strong>✅ Include</strong><ul><li>Agent persona & role</li><li>Scope (what it handles)</li><li>Tone & response length</li><li>Escalation rules</li><li>What it must never do</li></ul></div>
                    <div className="ag-col-card"><strong>❌ Avoid</strong><ul><li>Vague instructions</li><li>Contradictory rules</li><li>Unnecessary jargon</li><li>Overly long prompts</li><li>Missing edge cases</li></ul></div>
                  </div>
                </>
              )}
              {createStep === 2 && (
                <>
                  <div className="ag-step-title">STEP 3 OF 6</div>
                  <div className="ag-step-copy">Equip your agent with tools: web search, database lookup, email sender, calendar API, Slack webhook.</div>
                  <div className="ag-toolbar-row">
                    <div className="ag-chip-row">
                      {['All', 'Connected', 'Available', 'Suggested'].map((c, i) => <button key={c} className={`ag-chip ${i === 0 ? 'on' : ''}`}>{c}</button>)}
                    </div>
                    <button className="ag-chip">All categories ▾</button>
                  </div>
                  <div className="ag-tools-grid">
                    {TOOL_LIBRARY.map((tool)=> {
                      const checked = createData.tools.includes(tool.name);
                      return (
                        <button key={tool.name} className={`ag-tool-card ${checked?'on':''}`} onClick={() => setCreateData((d)=>({...d,tools: checked ? d.tools.filter((t)=>t!==tool.name) : [...d.tools, tool.name]}))}>
                          <div className="ag-tool-top"><input type="checkbox" checked={checked} readOnly /> <strong>{tool.name}</strong></div>
                          <p>{tool.desc}</p>
                          <div className="ag-tool-link">How to configure →</div>
              </button>
                      );
                    })}
                  </div>
                  <button className="ag-add-tool">＋ Add more tools</button>
                  <div className="ag-note-blue">GPT-5.4, Claude Opus 4.6, Grok-4 all support function calling - define tools in JSON schema and the model will invoke them automatically when needed.</div>
                </>
              )}
              {createStep === 3 && (
                <>
                  <div className="ag-step-title">STEP 4 OF 6</div>
                  <div className="ag-step-copy">Configure short-term and long-term memory behavior.</div>
                  {['No Memory','Short-term Only','Short + Long-term'].map((m)=>(
                    <button key={m} className={`ag-memory-card ${createData.memory===m?'on':''}`} onClick={()=>setCreateData((d)=>({...d,memory:m}))}>{m}</button>
                  ))}
                  <div className="ag-tip">Pro tip: Long-term memory uses a vector store (Pinecone, Weaviate, or NexusAI managed). Store user preferences, past resolutions, and context summaries - not raw conversation logs.</div>
                </>
              )}
              {createStep === 4 && (
                <>
                  <div className="ag-step-title">STEP 5 OF 6</div>
                  <div className="ag-step-copy">Run test scenarios and refine your prompt.</div>
                  {['Normal use case','Edge case','Escalation trigger','Empty / short input','Multilingual input','Harmful prompt'].map((s)=>(
                    <label key={s} className="ag-test-row"><input type="checkbox" /> {s}</label>
                  ))}
                  <div className="ag-divider">MANUAL SCENARIOS</div>
                  <div className="ag-field"><label>Add Your Own Test Scenarios</label><input placeholder="e.g. User asks in a language the agent wasn't trained for..." /></div>
                  <button className="ag-chip on">＋ Add scenario</button>
                </>
              )}
              {createStep === 5 && (
                <>
                  <div className="ag-step-title">STEP 6 OF 6</div>
                  <div className="ag-step-copy">Get a shareable endpoint or embed widget. Monitor performance in dashboard.</div>
                  <div className="ag-deploy-grid">
                    {['API Endpoint','Embed Widget','Slack Bot','WhatsApp / SMS'].map((d)=><div key={d} className="ag-deploy-card"><strong>{d}</strong><p>Ready-to-use deployment option.</p></div>)}
                  </div>
                  <div className="ag-deploy-finish">🎉 Your agent is ready to deploy!</div>
                </>
              )}
            </div>
            <div className="ag-actions">
              <button className="btn btn-ghost" onClick={() => setCreateStep((s) => Math.max(0, s - 1))}>← Back</button>
              {createStep < 5 ? (
                <button className="btn btn-primary" onClick={() => setCreateStep((s) => Math.min(5, s + 1))}>Next →</button>
              ) : (
                <button className="btn btn-primary" onClick={saveDraftAgent}>✓ Finish</button>
              )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AgentBuilder;
