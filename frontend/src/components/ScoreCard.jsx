import React from 'react';
import { formatScore } from '../utils/formatters';

export function ScoreCard({ title, score, icon: Icon, color = '#06b6d4', subtitle }) {
  const numScore = Number(score) || 0;
  
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            padding: '0.4rem',
            borderRadius: '8px',
            background: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
          {formatScore(numScore)}
        </span>
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/ 100</span>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '6px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(numScore, 100)}%`,
          background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
          borderRadius: '3px',
          transition: 'width 1s ease-out',
          boxShadow: `0 0 10px ${color}80`
        }} />
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{subtitle}</span>
      )}
    </div>
  );
}
