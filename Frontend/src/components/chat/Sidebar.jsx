import React, { useState } from 'react';

const Sidebar = ({ models = [], currentModelId, setCurrentModelId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.org.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <div className="sb-sec" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderBottom: 'none' }}>
        <div className="sb-lbl" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '0.75rem' }}>Models</div>
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input 
            className="sb-search" 
            type="text" 
            placeholder={`Search ${models.length || 0} models...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.6rem 1rem', 
              fontSize: '0.82rem', 
              borderRadius: '2rem', 
              border: '1.5px solid var(--border2)',
              background: 'var(--white)',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </div>
        <div id="sb-model-list" style={{ overflowY: 'auto', flex: 1 }}>
          {filteredModels.map(m => (
            <div 
              key={m.id} 
              className={`sb-model ${currentModelId === m.id ? 'on' : ''}`}
              onClick={() => setCurrentModelId(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '4px',
                background: currentModelId === m.id ? 'linear-gradient(135deg, var(--accent-lt), rgba(200,98,42,0.05))' : 'transparent',
                border: currentModelId === m.id ? '1px solid var(--accent-border)' : '1px solid transparent'
              }}
            >
              <div className="sb-mi" style={{ 
                background: m.bg, 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>{m.icon}</div>
              <div>
                <div className="sb-mn" style={{ 
                  fontSize: '0.88rem', 
                  fontWeight: 600, 
                  color: currentModelId === m.id ? 'var(--accent)' : 'var(--text)' 
                }}>{m.name}</div>
                <div className="sb-ms" style={{ 
                  fontSize: '0.72rem', 
                  color: 'var(--text3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span className="sdot live" style={{ width: '5px', height: '5px', background: 'var(--green)', borderRadius: '50%' }}></span>
                  {m.org}
                </div>
              </div>
            </div>
          ))}
          {filteredModels.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)', fontSize: '0.8rem' }}>
              No models found
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
