import React from 'react';
import { COMPARISON_DATA } from '../../constants';

const ComparisonTable = () => {
  return (
    <section className="section alt">
      <div className="sec-hd">
        <div>
          <h2>Flagship Model Comparison</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Comparing the three current frontier models side-by-side.</p>
        </div>
      </div>
      <div className="comparison-card" style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</th>
              <th style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700 }}>GPT-5.4 Omni</th>
              <th style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700 }}>Claude 3.7 Opus</th>
              <th style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700 }}>Gemini 3.1 Pro</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_DATA.map((row, i) => (
              <tr key={i} style={{ borderBottom: i === COMPARISON_DATA.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>{row.feature}</td>
                <td style={{ padding: '1.25rem', fontSize: '0.85rem' }}>{row.gpt}</td>
                <td style={{ padding: '1.25rem', fontSize: '0.85rem' }}>{row.claude}</td>
                <td style={{ padding: '1.25rem', fontSize: '0.85rem' }}>{row.gemini}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComparisonTable;
