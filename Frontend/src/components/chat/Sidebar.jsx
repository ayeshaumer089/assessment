import React from 'react';

const Sidebar = ({ models = [], currentModelId, setCurrentModelId }) => {
  return (
    <aside className="sidebar">
      <div className="sb-sec" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="sb-lbl">Models</div>
        <input className="sb-search" type="text" placeholder={`Search ${models.length || 0} models...`} />
        <div id="sb-model-list" style={{ marginTop: '0.5rem', overflowY: 'auto' }}>
          {models.slice(0, 20).map(m => (
            <div 
              key={m.id} 
              className={`sb-model ${currentModelId === m.id ? 'on' : ''}`}
              onClick={() => setCurrentModelId(m.id)}
            >
              <div className="sb-mi" style={{ background: m.bg }}>{m.icon}</div>
              <div>
                <div className="sb-mn">{m.name}</div>
                <div className="sb-ms"><span className="sdot live"></span>{m.org}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sb-sec">
        <div className="sb-lbl">Filters</div>
        <div className="fopt-col">
          <button className="fopt on">All models</button>
          <button className="fopt">Language</button>
          <button className="fopt">Vision</button>
          <button className="fopt">Code</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
