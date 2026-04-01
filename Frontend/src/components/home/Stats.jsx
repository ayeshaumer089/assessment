import React from 'react';

const Stats = () => {
  const stats = [
    { value: '525+', label: 'AI Models' },
    { value: '82K', label: 'Builders' },
    { value: '28', label: 'AI Labs' },
    { value: '4.8⭐', label: 'Avg Rating' },
  ];

  return (
    <div className="hero-stats">
      {stats.map((stat, i) => (
        <div key={i} className="hstat">
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Stats;
