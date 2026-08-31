import React from 'react';

export function SkillRadarChart({ technical = 0, problemSolving = 0, communication = 0, behavioral = 0 }) {
  const skills = [
    { name: 'Technical', value: Number(technical) || 0, color: '#06b6d4' },
    { name: 'Problem Solving', value: Number(problemSolving) || 0, color: '#6366f1' },
    { name: 'Communication', value: Number(communication) || 0, color: '#10b981' },
    { name: 'Behavioral', value: Number(behavioral) || 0, color: '#f59e0b' }
  ];

  // SVG Radar Geometry (Center at 150, 150, Radius = 100)
  const size = 300;
  const center = size / 2;
  const radius = 100;

  // Angles for 4 axes: Top (-90), Right (0), Bottom (90), Left (180)
  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

  // Compute Polygon points
  const points = skills.map((s, i) => {
    const r = (s.value / 100) * radius;
    const x = center + r * Math.cos(angles[i]);
    const y = center + r * Math.sin(angles[i]);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Competency Matrix</h3>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Multi-Skill Evaluation</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        {/* SVG Radar Chart */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background concentric reference rings */}
            {[25, 50, 75, 100].map(pct => (
              <circle
                key={pct}
                cx={center}
                cy={center}
                r={(pct / 100) * radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray={pct === 100 ? 'none' : '3 3'}
                strokeWidth="1"
              />
            ))}

            {/* Axes */}
            {angles.map((angle, idx) => (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(angle)}
                y2={center + radius * Math.sin(angle)}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
              />
            ))}

            {/* Data Polygon with Glow */}
            <polygon
              points={points}
              fill="rgba(6, 182, 212, 0.25)"
              stroke="#06b6d4"
              strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))' }}
            />

            {/* Data Nodes */}
            {skills.map((s, i) => {
              const r = (s.value / 100) * radius;
              const x = center + r * Math.cos(angles[i]);
              const y = center + r * Math.sin(angles[i]);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#ffffff"
                  stroke={s.color}
                  strokeWidth="2"
                />
              );
            })}

            {/* Axis Labels */}
            <text x={center} y={center - radius - 12} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Technical</text>
            <text x={center + radius + 10} y={center + 4} textAnchor="start" fill="#94a3b8" fontSize="11" fontWeight="600">Problem Solving</text>
            <text x={center} y={center + radius + 18} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Communication</text>
            <text x={center - radius - 10} y={center + 4} textAnchor="end" fill="#94a3b8" fontSize="11" fontWeight="600">Behavioral</text>
          </svg>
        </div>

        {/* Breakdown Progress Bars */}
        <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {skills.map((s, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{s.name}</span>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.value.toFixed(1)}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(s.value, 100)}%`,
                  background: s.color,
                  borderRadius: '4px',
                  boxShadow: `0 0 10px ${s.color}80`,
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
