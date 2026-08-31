import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export function LoadingSpinner({ message = 'Analyzing your response...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      gap: '1rem',
      textAlign: 'center'
    }}>
      <div style={{ position: 'relative' }}>
        <Loader2 size={42} color="#06b6d4" className="spinning" />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'rgba(6, 182, 212, 0.4)',
          filter: 'blur(4px)'
        }} />
      </div>
      <div>
        <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', fontWeight: 600, marginBottom: '0.25rem' }}>
          {message}
        </h4>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          LangChain Multi-Agent Evaluation & Difficulty Calibration in progress
        </span>
      </div>
    </div>
  );
}
