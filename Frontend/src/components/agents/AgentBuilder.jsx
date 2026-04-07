import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/agents.css';
import { nxToast } from '../../utils/helpers';
import { recordScreen, recordUserVideo } from '../../utils/media';
import { getChatResponse } from '../../services/chat';
import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  duplicateTask as duplicateTaskApi,
  fetchTasks as fetchTasksApi,
  updateTask as updateTaskApi,
} from '../../services/tasks';
import {
  ACP_SUGGESTED,
  AGENT_TABS,
  DEFAULT_AGENTS,
  INITIAL_CONVERSATIONS,
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
  const [tasks, setTasks] = useState([]);
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
  // Workspace attachments (existing behavior in workspace search area)
  const [attachedFiles, setAttachedFiles] = useState([]);
  // Task conversation attachments (preview shown in task composer)
  const [taskAttachedFiles, setTaskAttachedFiles] = useState([]);
  // Agent chat attachments (preview shown in agent-chat composer)
  const [agentChatAttachedFiles, setAgentChatAttachedFiles] = useState([]);
  const recognitionRef = useRef(null);
  const voiceTargetRef = useRef('workspace');
  const workspaceFileInputRef = useRef(null);
  const workspaceImageInputRef = useRef(null);
  const convFileInputRef = useRef(null);
  const convImageInputRef = useRef(null);
  const revokePreviewUrls = (items = []) => {
    items.forEach((it) => {
      if (it?.previewUrl) URL.revokeObjectURL(it.previewUrl);
    });
  };

  useEffect(() => {
    return () => {
      revokePreviewUrls(taskAttachedFiles);
      revokePreviewUrls(agentChatAttachedFiles);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPreviewFiles = (files, setTarget) => {
    const mapped = files.map((file) => {
      const isImage = file.type?.startsWith('image/');
      return {
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
        file,
        kind: isImage ? 'image' : 'file',
        previewUrl: isImage ? URL.createObjectURL(file) : '',
      };
    });
    setTarget((prev) => [...prev, ...mapped]);
  };

  const removePreviewFile = (id, setTarget) => {
    setTarget((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearPreviewFiles = (items, setTarget) => {
    revokePreviewUrls(items);
    setTarget([]);
  };

  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);
  const [showEditConfigModal, setShowEditConfigModal] = useState(false);
  const [editConfigStep, setEditConfigStep] = useState(0);
  const [showAgentDashboard, setShowAgentDashboard] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const mapDbTask = (t) => ({
    id: t._id || t.id,
    name: t.name,
    completed: Boolean(t.completed),
  });

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

  useEffect(() => {
    const abortController = new AbortController();
    fetchTasksApi(abortController.signal)
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data.map(mapDbTask));
        }
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          nxToast('Failed to load tasks');
        }
      });
    return () => abortController.abort();
  }, []);

  const addTask = async () => {
    const name = (taskInput || `New Task #${tasks.length + 1}`).trim();
    if (!name) return;
    try {
      const created = await createTaskApi(name);
      const task = mapDbTask(created);
      setTasks((prev) => [...prev, task]);
      setConvMap((prev) => ({ ...prev, [task.id]: [] }));
      setTaskInput('');
      setActiveTaskId(task.id);
      nxToast('✅ Task created');
    } catch {
      nxToast('Unable to create task');
    }
  };

  const sendTaskMessage = async (forcedText) => {
    if (!activeTaskId) return;
    const baseText = (forcedText ?? convInput).trim();
    if (!baseText && taskAttachedFiles.length === 0) return;

    let text = baseText;
    if (taskAttachedFiles.length > 0) {
      const fileNames = taskAttachedFiles.map((a) => `"${a.file.name}"`).join(', ');
      text = text ? `${text}\n\n[Attached: ${fileNames}]` : `[Attached: ${fileNames}]`;
    }

    setConvMap((prev) => ({
      ...prev,
      [activeTaskId]: [
        ...(prev[activeTaskId] || []),
        { role: 'user', text, time: getTimeLabel() },
      ],
    }));
    setConvInput('');
    if (taskAttachedFiles.length > 0) clearPreviewFiles(taskAttachedFiles, setTaskAttachedFiles);
    try {
      const res = await getChatResponse('task_replies', { input: text });
      const aiText = res?.text || randomReply();
      setConvMap((prev) => ({
        ...prev,
        [activeTaskId]: [
          ...(prev[activeTaskId] || []),
          { role: 'agent', text: aiText, time: getTimeLabel() },
        ],
      }));
    } catch {
      setConvMap((prev) => ({
        ...prev,
        [activeTaskId]: [
          ...(prev[activeTaskId] || []),
          { role: 'agent', text: randomReply(), time: getTimeLabel() },
        ],
      }));
    }
  };

  const editTask = async (taskId) => {
    const existing = tasks.find((t) => t.id === taskId);
    if (!existing) return;
    const updated = window.prompt('Edit task name', existing.name);
    if (updated === null) return;
    const nextName = updated.trim();
    if (!nextName) return;
    try {
      const saved = await updateTaskApi(taskId, { name: nextName });
      const mapped = mapDbTask(saved);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, name: mapped.name } : t)));
      setOpenTaskMenuId(null);
    } catch {
      nxToast('Unable to update task');
    }
  };

  const duplicateTask = async (taskId) => {
    try {
      const duplicated = await duplicateTaskApi(taskId);
      const item = mapDbTask(duplicated);
      setTasks((prev) => {
        const idx = prev.findIndex((t) => t.id === taskId);
        if (idx < 0) return [...prev, item];
        const next = [...prev];
        next.splice(idx + 1, 0, item);
        return next;
      });
      setConvMap((prev) => ({ ...prev, [item.id]: [...(prev[taskId] || [])] }));
      setOpenTaskMenuId(null);
      nxToast('📋 Task duplicated');
    } catch {
      nxToast('Unable to duplicate task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteTaskApi(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setConvMap((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      if (activeTaskId === taskId) setActiveTaskId(null);
      setOpenTaskMenuId(null);
      nxToast('🗑️ Task deleted');
    } catch {
      nxToast('Unable to delete task');
    }
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

  const sendAgentChat = async (presetText) => {
    const baseText = (presetText ?? agentChatInput).trim();
    if (!baseText && agentChatAttachedFiles.length === 0) return;

    let text = baseText;
    if (agentChatAttachedFiles.length > 0) {
      const fileNames = agentChatAttachedFiles.map((a) => `"${a.file.name}"`).join(', ');
      text = text ? `${text}\n\n[Attached: ${fileNames}]` : `[Attached: ${fileNames}]`;
    }

    setAgentChatMessages((prev) => [
      ...prev,
      { role: 'user', text, time: getTimeLabel() },
    ]);
    setAgentChatInput('');
    if (agentChatAttachedFiles.length > 0) clearPreviewFiles(agentChatAttachedFiles, setAgentChatAttachedFiles);
    try {
      const res = await getChatResponse('agent_replies', {
        agentName: activeAgent?.name ?? '',
        input: text,
      });
      const reply = res?.text || randomReply();
      const userWords = text.split(/\s+/).filter(Boolean).length;
      const aiWords = reply.split(/\s+/).filter(Boolean).length;
      setAgentChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: reply, time: getTimeLabel() },
      ]);
      setAgentMetrics((prev) => ({
        messages: prev.messages + 1,
        tokens: prev.tokens + Math.floor(userWords * 1.3 + aiWords * 1.3),
      }));
    } catch {
      const reply = randomReply();
      setAgentChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: reply, time: getTimeLabel() },
      ]);
      setAgentMetrics((prev) => ({ ...prev, messages: prev.messages + 1 }));
    }
  };

  const saveDraftAgent = async () => {
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

    const taskName = `${agent.name} setup`;
    try {
      const createdTask = await createTaskApi(taskName);
      const mappedTask = mapDbTask(createdTask);
      setTasks((prev) => [...prev, mappedTask]);
      setConvMap((prev) => ({ ...prev, [mappedTask.id]: [] }));
      setActiveTaskId(mappedTask.id);
    } catch {
      nxToast('Agent saved, but setup task creation failed.');
    }
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
    if (target === 'agent-chat') addPreviewFiles(files, setAgentChatAttachedFiles);
    else if (target === 'task' || target === 'conversation') addPreviewFiles(files, setTaskAttachedFiles);
    else setAttachedFiles((prev) => [...prev, ...files]);
    const prompt = `Help me with this file: "${files[0].name}"`;
    if (target === 'agent-chat') setAgentChatInput(prompt);
    else if (target === 'task' || target === 'conversation') setConvInput(prompt);
    else setQuery(prompt);
    nxToast(`${files.length} file(s) attached`);
    // allow attaching the same file again
    e.target.value = '';
  };

  const handleAttachImage = (e, target = 'workspace') => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (target === 'agent-chat') addPreviewFiles(files, setAgentChatAttachedFiles);
    else if (target === 'task' || target === 'conversation') addPreviewFiles(files, setTaskAttachedFiles);
    else setAttachedFiles((prev) => [...prev, ...files]);
    const prompt = `Analyze this image: "${files[0].name}"`;
    if (target === 'agent-chat') setAgentChatInput(prompt);
    else if (target === 'task' || target === 'conversation') setConvInput(prompt);
    else setQuery(prompt);
    nxToast(`${files.length} image(s) attached`);
    e.target.value = '';
  };

  const handleVideoInput = async (target = 'workspace') => {
    try {
      const { blob } = await recordUserVideo({ durationMs: 4000 });
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      if (target === 'agent-chat') addPreviewFiles([file], setAgentChatAttachedFiles);
      else if (target === 'task' || target === 'conversation') addPreviewFiles([file], setTaskAttachedFiles);
      else setAttachedFiles((prev) => [...prev, file]);
      const prompt = 'Analyze this short video for me.';
      if (target === 'agent-chat') setAgentChatInput(prompt);
      else if (target === 'task' || target === 'conversation') setConvInput(prompt);
      else setQuery(prompt);
      nxToast('🎥 Video captured and attached');
    } catch (err) {
      nxToast(err?.message || 'Unable to capture video');
    }
  };

  const handleScreenShare = async (target = 'workspace') => {
    try {
      const { blob } = await recordScreen({ durationMs: 4000 });
      const file = new File([blob], `screen-${Date.now()}.webm`, { type: 'video/webm' });
      if (target === 'agent-chat') addPreviewFiles([file], setAgentChatAttachedFiles);
      else if (target === 'task' || target === 'conversation') addPreviewFiles([file], setTaskAttachedFiles);
      else setAttachedFiles((prev) => [...prev, file]);
      const prompt = 'Here is a screen recording. Help with this.';
      if (target === 'agent-chat') setAgentChatInput(prompt);
      else if (target === 'task' || target === 'conversation') setConvInput(prompt);
      else setQuery(prompt);
      nxToast('🖥️ Screen captured and attached');
    } catch (err) {
      nxToast(err?.message || 'Screen share failed');
    }
  };

  const handleCopyEndpointUrl = () => {
    const url = `https://api.nexusai.app/agents/${(activeAgent?.name || 'agent').toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(url).then(() => {
      setUrlCopied(true);
      nxToast('🔗 Endpoint URL copied!');
      setTimeout(() => setUrlCopied(false), 2000);
    }).catch(() => nxToast('Failed to copy URL'));
  };

  const EDIT_CONFIG_STEPS = ['Purpose', 'System Prompt', 'Tools & APIs', 'Memory', 'Test', 'Deploy'];

  const EditConfigModal = () => {
    const [localData, setLocalData] = useState({
      name: activeAgent?.name || '',
      type: 'Customer Support',
      purpose: activeAgent?.desc || '',
      audience: 'Customers',
      tone: 'Professional',
      avoid: '',
      success: '',
      systemPrompt: `You are ${activeAgent?.name || 'my agent'}.\n\nHelp users effectively with a professional tone.`,
      tools: activeAgent?.tools || [],
      memory: activeAgent?.memory || 'Short-term',
    });

    const types = ['Customer Support', 'Research & Data', 'Code & Dev', 'Sales & CRM', 'Content & Writing', 'Operations', 'Finance & Reports', 'Something else'];
    const audiences = ['Customers', 'Internal team', 'Developers', 'Executives'];
    const tones = ['Professional', 'Friendly', 'Concise', 'Detailed'];
    const memoryOptions = ['Short-term Only', 'Long-term Memory', 'No Memory'];

    const stepContent = () => {
      switch (editConfigStep) {
        case 0:
          return (
            <div className="ag-rich-body">
              <div className="ag-step-title">STEP 1 OF 6</div>
              <div className="ag-step-copy">Answer a few quick questions — we'll use your answers to build the perfect agent.</div>
              <div className="ag-field" style={{marginBottom:'1rem'}}>
                <label style={{fontSize:'.9rem',fontWeight:700}}>🧑 What do you want to call your agent?</label>
                <input value={localData.name} onChange={e => setLocalData(p=>({...p,name:e.target.value}))} placeholder="e.g. Support Bot, Research Assistant, Code Reviewer..." />
              </div>
              <div className="ag-field" style={{marginBottom:'1rem'}}>
                <label style={{fontSize:'.9rem',fontWeight:700}}>🤖 What kind of agent is this?</label>
                <div className="ag-chip-row" style={{marginTop:6}}>
                  {types.map(t => <button key={t} className={`ag-chip ${localData.type===t?'on':''}`} onClick={()=>setLocalData(p=>({...p,type:t}))}>{t}</button>)}
                </div>
              </div>
              <div className="ag-field" style={{marginBottom:'1rem'}}>
                <label style={{fontSize:'.9rem',fontWeight:700}}>🎯 What's the main job? <span style={{fontWeight:400,color:'var(--text3)'}}>(in plain English)</span></label>
                <textarea rows={4} value={localData.purpose} onChange={e=>setLocalData(p=>({...p,purpose:e.target.value}))} placeholder="e.g. Answer customer questions, handle returns, and create support tickets for issues we can't resolve." style={{resize:'vertical'}} />
                <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:8}}>
                  {['Answer customer questions and escalate unresolved issues','Search the web and write structured research reports','Review code for bugs and suggest improvements','Draft emails, posts, and marketing content','Summarise meetings and extract action items'].map(s=>(
                    <button key={s} className="ag-chip" style={{fontSize:'.74rem',borderColor:'var(--accent-border)',color:'var(--accent)'}} onClick={()=>setLocalData(p=>({...p,purpose:s}))}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="ag-field">
                <label style={{fontSize:'.9rem',fontWeight:700}}>👥 Who will be talking to this agent?</label>
                <div className="ag-chip-row" style={{marginTop:6}}>
                  {audiences.map(a=><button key={a} className={`ag-chip ${localData.audience===a?'on':''}`} onClick={()=>setLocalData(p=>({...p,audience:a}))}>{a}</button>)}
                </div>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="ag-rich-body">
              <div className="ag-step-title">STEP 2 OF 6</div>
              <div className="ag-step-copy">Define how your agent should behave and respond.</div>
              <div className="ag-field">
                <label style={{fontSize:'.9rem',fontWeight:700}}>System Prompt</label>
                <textarea rows={10} value={localData.systemPrompt} onChange={e=>setLocalData(p=>({...p,systemPrompt:e.target.value}))} style={{resize:'vertical',fontFamily:'monospace',fontSize:'.82rem'}} />
              </div>
              <div className="ag-field">
                <label style={{fontSize:'.9rem',fontWeight:700}}>Tone</label>
                <div className="ag-chip-row" style={{marginTop:6}}>
                  {tones.map(t=><button key={t} className={`ag-chip ${localData.tone===t?'on':''}`} onClick={()=>setLocalData(p=>({...p,tone:t}))}>{t}</button>)}
                </div>
              </div>
              <div className="ag-field">
                <label style={{fontSize:'.9rem',fontWeight:700}}>What should the agent avoid?</label>
                <input value={localData.avoid} onChange={e=>setLocalData(p=>({...p,avoid:e.target.value}))} placeholder="e.g. Never discuss pricing, avoid medical advice..." />
              </div>
            </div>
          );
        case 2:
          return (
            <div className="ag-rich-body">
              <div className="ag-step-title">STEP 3 OF 6</div>
              <div className="ag-step-copy">Connect tools and APIs to extend your agent's capabilities.</div>
              <div className="ag-tools-grid">
                {TOOL_LIBRARY.map(tool=>(
                  <button key={tool.name} className={`ag-tool-card ${localData.tools.includes(tool.name)?'on':''}`} onClick={()=>setLocalData(p=>({...p,tools:p.tools.includes(tool.name)?p.tools.filter(t=>t!==tool.name):[...p.tools,tool.name]}))}>
                    <div className="ag-tool-top"><strong style={{fontSize:'.88rem'}}>{tool.name}</strong></div>
                    <p>{tool.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        case 3:
          return (
            <div className="ag-rich-body">
              <div className="ag-step-title">STEP 4 OF 6</div>
              <div className="ag-step-copy">Choose how your agent remembers context across conversations.</div>
              {memoryOptions.map(m=>(
                <button key={m} className={`ag-memory-card ${localData.memory===m?'on':''}`} onClick={()=>setLocalData(p=>({...p,memory:m}))}>
                  {m}
                  <div style={{fontSize:'.78rem',fontWeight:400,color:'var(--text3)',marginTop:3}}>
                    {m==='Short-term Only'?'Remembers context within a single session only.':m==='Long-term Memory'?'Persists memory across sessions using a vector store.':'Each conversation starts fresh with no prior context.'}
                  </div>
                </button>
              ))}
            </div>
          );
        case 4:
          return (
            <div className="ag-rich-body">
              <div className="ag-step-title">STEP 5 OF 6</div>
              <div className="ag-step-copy">Test your agent with sample inputs before deploying.</div>
              {['What can you help me with?','Give me a quick summary of your capabilities','How do you handle errors?'].map(s=>(
                <div key={s} className="ag-test-row">
                  <span style={{flex:1}}>{s}</span>
                  <button className="ag-mini-btn" onClick={()=>nxToast('Test sent!')}>Run →</button>
                </div>
              ))}
              <div className="ag-note-blue" style={{marginTop:12}}>All test messages are processed in sandbox mode and won't affect live metrics.</div>
            </div>
          );
        case 5:
          return (
            <div className="ag-rich-body">
              <div className="ag-step-title">STEP 6 OF 6</div>
              <div className="ag-step-copy">Your agent is ready. Choose how to deploy it.</div>
              <div className="ag-deploy-grid">
                {[{title:'Web Widget',desc:'Embed a chat widget on any website.'},{title:'API Endpoint',desc:'Call your agent via REST API.'},{title:'Slack Bot',desc:'Deploy directly into your Slack workspace.'},{title:'WhatsApp',desc:'Connect to WhatsApp Business API.'}].map(d=>(
                  <div key={d.title} className="ag-deploy-card">
                    <strong>{d.title}</strong>
                    <p>{d.desc}</p>
                    <button className="ag-mini-btn" style={{marginTop:8}} onClick={()=>nxToast(`${d.title} deployment started!`)}>Deploy →</button>
                  </div>
                ))}
              </div>
              <div className="ag-deploy-finish" style={{marginTop:14}}>🎉 Configuration saved successfully!</div>
            </div>
          );
        default: return null;
      }
    };

    return (
      <div className="ag-overlay" onClick={()=>setShowEditConfigModal(false)}>
        <div className="ag-modal" style={{width:'min(700px,94vw)',maxHeight:'88vh',overflow:'hidden',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
          <div className="ag-modal-head">
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1.1rem'}}>✦</div>
              <div>
                <div style={{fontWeight:700,fontSize:'1.05rem'}}>Define your agent's purpose</div>
                <div style={{fontSize:'.78rem',color:'var(--text3)'}}>Step {editConfigStep+1} of 6</div>
              </div>
            </div>
            <button style={{border:'1px solid var(--border2)',background:'var(--bg)',borderRadius:'50%',width:30,height:30,cursor:'pointer',fontSize:'1rem'}} onClick={()=>setShowEditConfigModal(false)}>✕</button>
          </div>
          <div className="ag-step-tabs-rich" style={{display:'flex',gap:0,overflowX:'auto'}}>
            {EDIT_CONFIG_STEPS.map((s,i)=>(
              <button key={s} className={`${editConfigStep===i?'active':''} ${editConfigStep>i?'done':''}`} style={{whiteSpace:'nowrap',padding:'.5rem .7rem',fontSize:'.8rem'}} onClick={()=>setEditConfigStep(i)}>
                <span className="ag-step-dot">{editConfigStep>i?'✓':i+1}</span>{s}
              </button>
            ))}
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {stepContent()}
          </div>
          <div className="ag-actions">
            <button className="agent-pill-btn" onClick={()=>editConfigStep>0?setEditConfigStep(s=>s-1):setShowEditConfigModal(false)}>{editConfigStep===0?'Cancel':'← Back'}</button>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{display:'flex',gap:5}}>
                {EDIT_CONFIG_STEPS.map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:'50%',background:i===editConfigStep?'var(--accent)':'var(--border2)'}} />)}
              </div>
              <button style={{background:'var(--accent)',color:'#fff',border:'none',borderRadius:999,padding:'.45rem 1.2rem',fontWeight:700,cursor:'pointer'}} onClick={()=>{if(editConfigStep<5)setEditConfigStep(s=>s+1);else{setShowEditConfigModal(false);nxToast('✅ Configuration saved!');}}}>{editConfigStep===5?'Save Configuration':'Next →'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AgentDashboard = () => (
    <div className="agent-chat-full" style={{background:'var(--bg)'}}>
      <div className="agent-chat-topbar">
        <button className="agent-pill-btn" onClick={()=>setShowAgentDashboard(false)}>← Back to Agents</button>
        <div className="agent-title-wrap">
          <div className="agent-title-row">
            <div className="agent-icon-chip">{activeAgent?.icon}</div>
            <div className="agent-name">{activeAgent?.name} — Dashboard</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'1.5rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:20}}>
          {[{label:'Total Messages',value:'1,284',icon:'💬',color:'#3b82f6'},{label:'Avg Latency',value:'320ms',icon:'⚡',color:'#f59e0b'},{label:'Tokens Used',value:'48,200',icon:'🔢',color:'#8b5cf6'},{label:'Success Rate',value:'98.4%',icon:'✅',color:'#10b981'}].map(m=>(
            <div key={m.label} style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:14,padding:'1rem',display:'flex',flexDirection:'column',gap:6}}>
              <div style={{fontSize:'1.4rem'}}>{m.icon}</div>
              <div style={{fontSize:'1.6rem',fontWeight:800,color:m.color}}>{m.value}</div>
              <div style={{fontSize:'.78rem',color:'var(--text3)'}}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
          <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:14,padding:'1rem'}}>
            <div style={{fontWeight:700,marginBottom:12,fontSize:'.9rem'}}>Messages Over Time</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:6,height:80}}>
              {[40,65,50,80,70,90,75,95,60,85,100,88].map((h,i)=>(
                <div key={i} style={{flex:1,background:'var(--accent)',borderRadius:4,height:`${h}%`,opacity:.7+i*.02}} />
              ))}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'.68rem',color:'var(--text3)',marginTop:6}}>
              <span>Jan</span><span>Jun</span><span>Dec</span>
            </div>
          </div>
          <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:14,padding:'1rem'}}>
            <div style={{fontWeight:700,marginBottom:12,fontSize:'.9rem'}}>Top Queries</div>
            {[{q:'Product information',pct:42},{q:'Order status',pct:28},{q:'Billing issues',pct:18},{q:'Technical support',pct:12}].map(r=>(
              <div key={r.q} style={{marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'.78rem',marginBottom:3}}><span>{r.q}</span><span style={{color:'var(--text3)'}}>{r.pct}%</span></div>
                <div style={{height:6,background:'var(--bg2)',borderRadius:999}}><div style={{height:'100%',width:`${r.pct}%`,background:'var(--accent)',borderRadius:999}} /></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:14,padding:'1rem'}}>
          <div style={{fontWeight:700,marginBottom:12,fontSize:'.9rem'}}>Recent Activity</div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.8rem'}}>
            <thead><tr style={{borderBottom:'1px solid var(--border)',color:'var(--text3)'}}>
              <th style={{textAlign:'left',padding:'.4rem .5rem'}}>Time</th>
              <th style={{textAlign:'left',padding:'.4rem .5rem'}}>User</th>
              <th style={{textAlign:'left',padding:'.4rem .5rem'}}>Query</th>
              <th style={{textAlign:'left',padding:'.4rem .5rem'}}>Status</th>
            </tr></thead>
            <tbody>
              {[{t:'10:04 AM',u:'user_291',q:'How do I reset my password?',s:'Resolved'},{t:'10:01 AM',u:'user_188',q:'My order hasn\'t arrived',s:'Escalated'},{t:'9:58 AM',u:'user_445',q:'Billing issue on my account',s:'Resolved'},{t:'9:52 AM',u:'user_302',q:'Report a bug',s:'Pending'}].map((r,i)=>(
                <tr key={i} style={{borderBottom:'1px solid var(--border)'}}>
                  <td style={{padding:'.45rem .5rem',color:'var(--text3)'}}>{r.t}</td>
                  <td style={{padding:'.45rem .5rem'}}>{r.u}</td>
                  <td style={{padding:'.45rem .5rem'}}>{r.q}</td>
                  <td style={{padding:'.45rem .5rem'}}><span style={{fontSize:'.72rem',padding:'.15rem .5rem',borderRadius:999,background:r.s==='Resolved'?'#dcfce7':r.s==='Escalated'?'#fee2e2':'#fef9c3',color:r.s==='Resolved'?'#15803d':r.s==='Escalated'?'#b91c1c':'#a16207'}}>{r.s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (mode === 'agent-chat' && activeAgent) {
    if (showAgentDashboard) return <AgentDashboard />;

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
                {agentChatAttachedFiles.length > 0 && (
                  <div className="conv-attach-preview">
                    {agentChatAttachedFiles.map((a) => (
                      <div key={a.id} className={`conv-attach-item ${a.kind}`}>
                        {a.kind === 'image' ? (
                          <img className="conv-attach-thumb" src={a.previewUrl} alt={a.file.name} />
                        ) : (
                          <div className="conv-attach-file">
                            <span className="conv-attach-ic">📎</span>
                            <span className="conv-attach-name" title={a.file.name}>{a.file.name}</span>
                          </div>
                        )}
                        <button
                          type="button"
                          className="conv-attach-x"
                          onClick={() => removePreviewFile(a.id, setAgentChatAttachedFiles)}
                          aria-label="Remove attachment"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  placeholder="Describe your project, ask a question, or just say hi — I`m here to help..."
                  value={agentChatInput}
                  onChange={(e) => setAgentChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendAgentChat())}
                />
                <div className="conv-composer-tools">
                  <button className={`agents-tool-btn purple ${isRecording && voiceTarget === 'agent-chat' ? 'active' : ''}`} title="Voice conversation" onClick={() => toggleVoiceInput('agent-chat')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                  </button>
                  <button className={`agents-tool-btn orange ${isRecording && voiceTarget === 'agent-chat' ? 'active' : ''}`} title="Voice typing" onClick={() => toggleVoiceInput('agent-chat')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="20" height="7" rx="2"/></svg></button>
                  <button className="agents-tool-btn blue" title="Video input" onClick={() => handleVideoInput('agent-chat')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/></svg></button>
                  <button className="agents-tool-btn teal" title="Screen sharing" onClick={() => handleScreenShare('agent-chat')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/></svg></button>
                  <button className="agents-tool-btn rose" title="Attach file" onClick={() => convFileInputRef.current?.click()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
                  <button className="agents-tool-btn green" title="Upload image" onClick={() => convImageInputRef.current?.click()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></button>
                  <button className="agents-tip-btn" title="Prompt tips" onClick={() => setAgentChatInput((prev) => (prev ? `${prev}\nHelp me break this into clear next steps.` : 'Help me break this into clear next steps.'))}>✦</button>
                  <span className="conv-composer-agent">Agent</span>
                  <input ref={convFileInputRef} type="file" multiple style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.csv" onChange={(e) => handleAttachFile(e, 'agent-chat')} />
                  <input ref={convImageInputRef} type="file" multiple style={{ display: 'none' }} accept="image/*" onChange={(e) => handleAttachImage(e, 'agent-chat')} />
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
            <button className="acr-btn" onClick={() => { setEditConfigStep(0); setShowEditConfigModal(true); }}>✎ Edit configuration</button>
            <button className="acr-btn" onClick={handleCopyEndpointUrl}>{urlCopied ? '✅ Copied!' : '🔗 Copy endpoint URL'}</button>
            <button className="acr-btn" onClick={() => setShowAgentDashboard(true)}>📊 View dashboard</button>
            <button className="acr-btn" onClick={() => setMode('workspace')}>← Back to Agents</button>
            {showEditConfigModal && <EditConfigModal />}
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
                onChange={async (e) => {
                  e.stopPropagation();
                  const nextCompleted = !task.completed;
                  try {
                    await updateTaskApi(task.id, { completed: nextCompleted });
                    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t)));
                  } catch {
                    nxToast('Unable to update task');
                  }
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
                {taskAttachedFiles.length > 0 && (
                  <div className="conv-attach-preview">
                    {taskAttachedFiles.map((a) => (
                      <div key={a.id} className={`conv-attach-item ${a.kind}`}>
                        {a.kind === 'image' ? (
                          <img className="conv-attach-thumb" src={a.previewUrl} alt={a.file.name} />
                        ) : (
                          <div className="conv-attach-file">
                            <span className="conv-attach-ic">📎</span>
                            <span className="conv-attach-name" title={a.file.name}>{a.file.name}</span>
                          </div>
                        )}
                        <button
                          type="button"
                          className="conv-attach-x"
                          onClick={() => removePreviewFile(a.id, setTaskAttachedFiles)}
                          aria-label="Remove attachment"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  <input ref={convFileInputRef} type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.csv" onChange={(e) => handleAttachFile(e, 'task')} />
                  <input ref={convImageInputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleAttachImage(e, 'task')} />
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
