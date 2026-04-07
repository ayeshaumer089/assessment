import React from 'react';
import { MODELS } from '../../constants';

const ComparisonTable = () => {
  const getModelIcon = (name) => {
    const m = MODELS.find((x) => x.name === name);
    return m?.icon || '✦';
  };

  const rows = [
    { model: 'GPT-5.4 Omni', lab: 'OpenAI', context: '1.05M', input: '$2.50', output: '$15', multimodal: true, speed: 'Fast', bestFor: 'High-precision professional tasks' },
    { model: 'Claude Opus 4.6', lab: 'Anthropic', context: '200K/1Mβ', input: '$5', output: '$25', multimodal: true, speed: 'Moderate', bestFor: 'Agents, advanced coding' },
    { model: 'Claude Sonnet 4.6', lab: 'Anthropic', context: '200K/1Mβ', input: '$3', output: '$15', multimodal: true, speed: 'Fast', bestFor: 'Code, data, content at scale' },
    { model: 'Claude Haiku 4.5', lab: 'Anthropic', context: '200K', input: '$1', output: '$5', multimodal: true, speed: 'Fastest', bestFor: 'Real-time, high-volume' },
    { model: 'Gemini 3.1 Pro', lab: 'Google', context: '2M–5M', input: '$2', output: '$12', multimodal: true, speed: 'Moderate', bestFor: 'Deep reasoning, long context' },
    { model: 'Gemini 3 Flash', lab: 'Google', context: '1M', input: '$2', output: '$12', multimodal: true, speed: 'Moderate', bestFor: 'High-volume chat & coding' },
    { model: 'Gemini 3.1 Flash-Lite', lab: 'Google', context: '1M', input: '$0.10', output: '$0.40', multimodal: true, speed: 'Fastest', bestFor: 'Low-cost agents, translation' },
    { model: 'Grok-4-1 Fast', lab: 'xAI', context: '2000K', input: '$0.20', output: '$0.50', multimodal: true, speed: 'Moderate', bestFor: 'Real-time X data analysis' },
    { model: 'DeepSeek-V3', lab: 'DeepSeek', context: '128K', input: '~$0.07', output: '~$0.28', multimodal: true, speed: 'Moderate', bestFor: 'Budget general model' },
    { model: 'Llama 4 Maverick', lab: 'Meta', context: '128K', input: 'Free', output: 'Free', multimodal: true, speed: 'Moderate', bestFor: 'Open-source multimodal' },
    { model: 'Qwen3-Max', lab: 'Alibaba', context: '128K', input: '$0.40', output: '$1.20', multimodal: true, speed: 'Moderate', bestFor: 'Multilingual / APAC' },
    { model: 'Devstral 2', lab: 'Mistral', context: '256K', input: '$0.40', output: '$2', multimodal: true, speed: 'Fastest', bestFor: 'Software engineering agents' },
  ];

  const speedTone = (speed) => {
    if (speed === 'Fast') return 'fast';
    if (speed === 'Fastest') return 'fastest';
    return 'moderate';
  };

  return (
    <section className="section alt">
      <div className="sec-hd">
        <div>
          <h2>Flagship Model Comparison</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Side-by-side view of the leading models across all major labs. Input/Output prices per 1M tokens.
          </p>
        </div>
        <a className="flagship-cta" href="#" onClick={(e) => e.preventDefault()}>
          Compare all →
        </a>
      </div>
      <div className="flagship-card">
        <div className="flagship-scroll">
          <table className="flagship-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Lab</th>
                <th>Context</th>
                <th>Input $/1M</th>
                <th>Output $/1M</th>
                <th>Multimodal</th>
                <th>Speed</th>
                <th>Best for</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.model}>
                  <td>
                    <div className="flagship-model">
                      <span className="flagship-model-icon">{getModelIcon(r.model)}</span>
                      <span className="flagship-model-name">{r.model}</span>
                    </div>
                  </td>
                  <td className="flagship-muted">{r.lab}</td>
                  <td>
                    <span className="flagship-linklike">{r.context}</span>
                  </td>
                  <td className="flagship-price">{r.input}</td>
                  <td className="flagship-price">{r.output}</td>
                  <td>
                    <span className={`flagship-check ${r.multimodal ? 'on' : ''}`} aria-label={r.multimodal ? 'Yes' : 'No'}>
                      {r.multimodal ? '✓' : '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`flagship-speed ${speedTone(r.speed)}`}>
                      <span className="flagship-dot" />
                      {r.speed}
                    </span>
                  </td>
                  <td className="flagship-best">{r.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
