import React from 'react';

export function AudioVisualizer({ isRecording, volumeLevels }) {
  if (!isRecording) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      padding: '0.75rem 1.25rem',
      background: 'rgba(6, 182, 212, 0.1)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      borderRadius: '30px',
      margin: '0.5rem 0'
    }}>
      <span style={{ fontSize: '0.8rem', color: '#22d3ee', fontWeight: 600, marginRight: '0.5rem' }}>
        Recording Live Audio...
      </span>
      <div className="audio-visualizer-bar-container">
        {volumeLevels.map((vol, index) => (
          <div
            key={index}
            className="visualizer-bar"
            style={{
              height: `${vol}px`,
              background: 'linear-gradient(180deg, #22d3ee 0%, #6366f1 100%)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
