import React, { useState } from 'react';
import Modal from './Modal';

const ModelDetailModal = ({ isOpen, onClose, model, initialTab }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // When modal opens or initialTab changes, switch to the requested tab
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'overview');
    }
  }, [isOpen, initialTab]);

  if (!model) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'guide', label: 'How to Use' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'prompt', label: 'Prompt Guide' },
    { id: 'agent', label: 'Agent Creation' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleCopy = (text, e) => {
    navigator.clipboard.writeText(text);
    const btn = e.target;
    const oldText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = oldText;
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-header">
        <div className="modal-icon" style={{ background: model.bg || '#EEF2FD' }}>{model.icon || '🧠'}</div>
        <div className="modal-title-block">
          <h2 id="md-name">{model.name}</h2>
          <p id="md-tagline">by {model.org} · {model.tags ? model.tags[0] : 'AI'} model</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span id="md-badge" className="badge-new" style={{ fontSize: '0.72rem', padding: '0.25rem 0.7rem', borderRadius: '2rem', background: 'var(--green-lt)', color: 'var(--green)', fontWeight: 700 }}>Live</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="modal-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            className={`mtab ${activeTab === tab.id ? 'on' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="modal-body">
        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <div className="modal-panel on">
            <div className="detail-grid">
              <div className="detail-card">
                <h4>Description</h4>
                <p id="md-desc-full">{model.desc || 'No description available for this model.'}</p>
              </div>
              <div className="detail-card">
                <h4>Input / Output</h4>
                <p>
                  <strong>Input:</strong> Text, images, audio, PDFs<br />
                  <strong>Output:</strong> Text, code, structured data<br />
                  <strong>Context:</strong> 128K tokens<br />
                  <strong>Max output:</strong> 4,096 tokens<br />
                  <strong>Latency:</strong> ~1.2s avg
                </p>
              </div>
            </div>
            <div className="detail-card" style={{ marginBottom: '1rem' }}>
              <h4>Use Cases</h4>
              <div className="use-case-grid">
                {[
                  { icon: '✍️', label: 'Content writing' },
                  { icon: '💻', label: 'Code generation' },
                  { icon: '🔍', label: 'Document analysis' },
                  { icon: '🌐', label: 'Translation' },
                  { icon: '🎓', label: 'Education' },
                  { icon: '📊', label: 'Data analysis' }
                ].map((uc, i) => (
                  <div key={i} className="uc-item">
                    <div className="uc-icon">{uc.icon}</div>
                    <div className="uc-label">{uc.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="detail-card" style={{ marginBottom: '1rem' }}>
              <h4>Example Prompt → Output</h4>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>User</div>
                <div style={{ background: 'var(--accent-lt)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.83rem', marginBottom: '8px' }}>
                  "Summarize this research paper in 3 bullet points and suggest 2 follow-up questions."
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{model.name}</div>
                <div style={{ background: 'var(--blue-lt)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.83rem', lineHeight: 1.6 }}>
                  • The paper introduces a new attention mechanism reducing compute by 40%<br />
                  • Results on MMLU show 3.2% improvement over baseline<br />
                  • Authors release code and weights under MIT license<br /><br />
                  <strong>Follow-up questions:</strong><br />
                  1. How does this scale to 100B+ parameter models?<br />
                  2. What are the trade-offs at inference time?
                </div>
              </div>
            </div>
            <div className="detail-card">
              <h4>Benchmark Scores</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '0.75rem' }}>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700 }}>87.2</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>MMLU</span>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700 }}>90.2</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>HumanEval</span>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700 }}>76.6</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>MATH</span>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700 }}>{model.rating || '4.7'}⭐</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Rating</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HOW TO USE PANEL */}
        {activeTab === 'guide' && (
          <div className="modal-panel on">
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>How to Use This Model</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1.25rem', lineHeight: 1.6 }}>Follow these steps to integrate and start getting value from this model in minutes.</p>
            <div className="agent-step">
              <div className="agent-step-num">1</div>
              <div className="agent-step-content">
                <h5>Get API Access</h5>
                <p>Sign up for a NexusAI account (free). Navigate to Settings → API Keys and create a new key. Your key grants access to all models in the marketplace — no separate accounts needed.</p>
              </div>
            </div>
            <div className="agent-step">
              <div className="agent-step-num">2</div>
              <div className="agent-step-content">
                <h5>Choose your integration method</h5>
                <p>Options: (a) NexusAI REST API — simple HTTP requests from any language, (b) Official SDK — Python, Node.js, Go packages available, (c) No-code — use the built-in Playground or connect via Zapier / Make.</p>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', marginTop: '0.75rem', position: 'relative' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '0.5rem' }}>Quick Start (Python)</div>
                  <code style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--blue)', whiteSpace: 'pre-wrap', display: 'block', lineHeight: 1.7 }}>
                    {`import nexusai\nclient = nexusai.Client(api_key="YOUR_KEY")\nresponse = client.chat(\n    model="${model.id}",\n    messages=[{"role":"user","content":"Hello!"}]\n)\nprint(response.content)`}
                  </code>
                  <button className="copy-btn" onClick={(e) => handleCopy(`import nexusai\nclient = nexusai.Client(api_key="YOUR_KEY")\nresponse = client.chat(\n    model="${model.id}",\n    messages=[{"role":"user","content":"Hello!"}]\n)\nprint(response.content)`, e)}>Copy</button>
                </div>
              </div>
            </div>
            <div className="agent-step">
              <div className="agent-step-num">3</div>
              <div className="agent-step-content">
                <h5>Understand input and output formats</h5>
                <p>This model accepts <strong>text, images, and PDFs</strong> as input. Outputs are <strong>text and structured JSON</strong>. The context window is 128K tokens — roughly 96,000 words. For long documents, consider chunking content into sections.</p>
              </div>
            </div>
            <div className="agent-step">
              <div className="agent-step-num">4</div>
              <div className="agent-step-content">
                <h5>Set parameters for your use case</h5>
                <p>Key parameters: <strong>temperature</strong> (0 = deterministic, 1 = creative), <strong>max_tokens</strong> (controls output length), <strong>system</strong> (sets model persona and behaviour). Start with temperature 0.3–0.7 for most applications.</p>
              </div>
            </div>
            <div className="agent-step">
              <div className="agent-step-num">5</div>
              <div className="agent-step-content">
                <h5>Test in the Playground first</h5>
                <p>Before writing code, iterate on your prompt in the built-in Playground. Test edge cases, adjust tone and format, then copy the final prompt into your integration.</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <button className="btn btn-primary" style={{ fontSize: '0.83rem', padding: '0.5rem 1.25rem' }} onClick={onClose}>Open Playground →</button>
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--teal-lt)', border: '1px solid rgba(10,94,73,0.2)', borderRadius: 'var(--radius)', padding: '1rem', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.83rem', color: 'var(--teal)', lineHeight: 1.6 }}>
                <strong>Pro tip:</strong> Start with a small free-tier experiment. Build a minimal working version, measure quality and latency, then scale. Most production apps iterate through 3–5 prompt versions before going live.
              </p>
            </div>
          </div>
        )}

        {/* PRICING PANEL */}
        {activeTab === 'pricing' && (
          <div className="modal-panel on">
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1.25rem' }}>Choose the plan that fits your usage. All plans include API access, documentation, and community support.</p>
            <div className="pricing-grid">
              <div className="price-card">
                <div className="price-tier">Pay-per-use</div>
                <div className="price-amt">$5</div>
                <div className="price-unit">per 1M input tokens</div>
                <ul className="price-feats">
                  <li>No monthly commitment</li>
                  <li>$15 per 1M output tokens</li>
                  <li>128K context window</li>
                  <li>Rate: 500 RPM</li>
                  <li>Standard support</li>
                </ul>
              </div>
              <div className="price-card featured">
                <div className="price-tag-ft">Most Popular</div>
                <div className="price-tier">Pro Subscription</div>
                <div className="price-amt">$49</div>
                <div className="price-unit">per month</div>
                <ul className="price-feats">
                  <li>$3 per 1M input tokens</li>
                  <li>$9 per 1M output tokens</li>
                  <li>128K context window</li>
                  <li>Rate: 3,000 RPM</li>
                  <li>Priority support</li>
                  <li>Usage dashboard</li>
                </ul>
              </div>
              <div className="price-card">
                <div className="price-tier">Enterprise</div>
                <div className="price-amt">Custom</div>
                <div className="price-unit">negotiated pricing</div>
                <ul className="price-feats">
                  <li>Volume discounts</li>
                  <li>Dedicated capacity</li>
                  <li>Fine-tuning access</li>
                  <li>Unlimited RPM</li>
                  <li>SLA & compliance</li>
                  <li>Dedicated CSM</li>
                </ul>
              </div>
            </div>
            <div style={{ background: 'var(--blue-lt)', border: '1px solid var(--blue-border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
              <p style={{ fontSize: '0.83rem', color: 'var(--blue)', lineHeight: 1.5 }}>
                <strong>Free tier available:</strong> Get 100K tokens/month at no cost. Perfect for prototyping and exploration. No credit card required to get started.
              </p>
            </div>
          </div>
        )}

        {/* PROMPT GUIDE PANEL */}
        {activeTab === 'prompt' && (
          <div className="modal-panel on">
            <div className="prompt-section">
              <h4>Prompt Engineering for {model.name}</h4>
              <p>Well-crafted prompts dramatically improve model output quality. Follow these principles to get the best results every time.</p>
              <div className="prompt-box">
                <div className="prompt-box-label">Principle 1 — Be explicit about format</div>
                <code>{`Summarize the following text in exactly 3 bullet points.\nEach bullet should be one sentence, under 20 words.\nText: {your_text_here}`}</code>
                <button className="copy-btn" onClick={(e) => handleCopy(`Summarize the following text in exactly 3 bullet points.\nEach bullet should be one sentence, under 20 words.\nText: {your_text_here}`, e)}>Copy</button>
              </div>
              <div className="prompt-box">
                <div className="prompt-box-label">Principle 2 — Assign a role</div>
                <code>{`You are a senior software engineer specializing in Python.\nReview the following code for bugs, performance issues,\nand style violations. Be concise and actionable.\n\nCode: {your_code_here}`}</code>
                <button className="copy-btn" onClick={(e) => handleCopy(`You are a senior software engineer specializing in Python.\nReview the following code for bugs, performance issues,\nand style violations. Be concise and actionable.\n\nCode: {your_code_here}`, e)}>Copy</button>
              </div>
              <div className="prompt-box">
                <div className="prompt-box-label">Principle 3 — Chain-of-thought for complex tasks</div>
                <code>{`Solve this step by step, showing your reasoning at each stage.\nProblem: {your_problem_here}\n\nThink through: assumptions → approach → calculation → answer`}</code>
                <button className="copy-btn" onClick={(e) => handleCopy(`Solve this step by step, showing your reasoning at each stage.\nProblem: {your_problem_here}\n\nThink through: assumptions → approach → calculation → answer`, e)}>Copy</button>
              </div>
              <div className="prompt-box">
                <div className="prompt-box-label">Principle 4 — Few-shot examples</div>
                <code>{`Classify customer sentiment. Examples:\nInput: "Shipping was fast!" → Output: positive\nInput: "Product broke after a day." → Output: negative\nInput: "It's okay, nothing special." → Output: neutral\n\nNow classify: "{new_review_here}"`}</code>
                <button className="copy-btn" onClick={(e) => handleCopy(`Classify customer sentiment. Examples:\nInput: "Shipping was fast!" → Output: positive\nInput: "Product broke after a day." → Output: negative\nInput: "It's okay, nothing special." → Output: neutral\n\nNow classify: "{new_review_here}"`, e)}>Copy</button>
              </div>
              <div style={{ background: 'var(--amber-lt)', border: '1px solid rgba(138,90,0,0.2)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                <p style={{ fontSize: '0.83rem', color: 'var(--amber)', lineHeight: 1.6 }}>
                  <strong>Pro tips:</strong> Always specify the desired output length. Use delimiters like triple backticks to separate instructions from content. For JSON output, include a sample structure in the prompt.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AGENT CREATION PANEL */}
        {activeTab === 'agent' && (
          <div className="modal-panel on">
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create an Agent with {model.name}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1.25rem' }}>Follow these steps to build a powerful AI agent in under 10 minutes.</p>
            {[
              { n: 1, title: "Define your agent's purpose", body: 'Clearly state what your agent should do. Example: "A customer support agent that answers product questions, escalates billing issues, and creates Jira tickets for bugs."' },
              { n: 2, title: 'Write the system prompt', body: "The system prompt defines the agent's persona, scope, and behaviour. Be explicit about what the agent should and shouldn't do. Include tone, response length, and escalation rules." },
              { n: 3, title: 'Connect tools & APIs', body: `Equip your agent with tools: web search, database lookup, email sender, calendar API, Slack webhook. ${model.name} supports function calling — define your tools in JSON schema format.` },
              { n: 4, title: 'Set up memory', body: 'Configure short-term (conversation history) and long-term memory (vector store). This lets the agent remember user preferences and important context across sessions.' },
              { n: 5, title: 'Test & iterate', body: 'Run the agent through 20+ test scenarios covering edge cases. Refine the system prompt based on failures. Use our Agent Playground to debug and tune before deployment.' },
              { n: 6, title: 'Deploy & monitor', body: 'Get a shareable endpoint or embed widget. Monitor performance in the NexusAI dashboard — track response quality, latency, token usage, and user satisfaction scores in real time.' },
            ].map(step => (
              <div key={step.n} className="agent-step">
                <div className="agent-step-num">{step.n}</div>
                <div className="agent-step-content">
                  <h5>{step.title}</h5>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem' }} onClick={onClose}>Open Agent Builder →</button>
              <button className="btn btn-ghost" style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }} onClick={onClose}>Ask the Hub</button>
            </div>
          </div>
        )}

        {/* REVIEWS PANEL */}
        {activeTab === 'reviews' && (
          <div className="modal-panel on">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{model.rating || '4.7'}</div>
                <div style={{ color: '#E8A020', fontSize: '1.1rem', letterSpacing: '-1px' }}>★★★★★</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: '2px' }}>{(model.reviews || 2847).toLocaleString()} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><span style={{ fontSize: '0.75rem', color: 'var(--text2)', width: '14px' }}>5</span><div style={{ flex: 1, background: 'var(--border)', borderRadius: '2px', height: '6px', overflow: 'hidden' }}><div style={{ width: '72%', background: '#E8A020', height: '100%' }}></div></div><span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>72%</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><span style={{ fontSize: '0.75rem', color: 'var(--text2)', width: '14px' }}>4</span><div style={{ flex: 1, background: 'var(--border)', borderRadius: '2px', height: '6px', overflow: 'hidden' }}><div style={{ width: '20%', background: '#E8A020', height: '100%' }}></div></div><span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>20%</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '0.75rem', color: 'var(--text2)', width: '14px' }}>3</span><div style={{ flex: 1, background: 'var(--border)', borderRadius: '2px', height: '6px', overflow: 'hidden' }}><div style={{ width: '6%', background: '#E8A020', height: '100%' }}></div></div><span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>6%</span></div>
              </div>
            </div>
            <div className="review-item">
              <div className="review-header">
                <div>
                  <div className="reviewer-name">Sarah K.</div>
                  <div className="reviewer-role">ML Engineer at Stripe</div>
                </div>
                <div>
                  <div style={{ color: '#E8A020', fontSize: '0.9rem' }}>★★★★★</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Mar 2026</div>
                </div>
              </div>
              <div className="review-text">
                {model.name} has transformed our document processing pipeline. The vision capabilities are remarkably accurate — it handles complex financial statements and extracts structured data with minimal post-processing.
              </div>
            </div>
            <div className="review-item">
              <div className="review-header">
                <div>
                  <div className="reviewer-name">Priya N.</div>
                  <div className="reviewer-role">Senior Developer at Shopify</div>
                </div>
                <div>
                  <div style={{ color: '#E8A020', fontSize: '0.9rem' }}>★★★★★</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Feb 2026</div>
                </div>
              </div>
              <div className="review-text">
                Best coding model we've used. Code review, refactoring suggestions, and debugging explanations are outstanding. The function calling is reliable and JSON mode outputs are always well-structured.
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModelDetailModal;
