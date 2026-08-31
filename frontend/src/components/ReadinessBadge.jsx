import React from 'react';
import { READINESS_LEVELS } from '../utils/constants';

export function ReadinessBadge({ level }) {
  const normalized = (level || 'BEGINNER READY').toUpperCase();
  const config = READINESS_LEVELS[normalized] || READINESS_LEVELS['BEGINNER READY'];

  return (
    <span className={`badge ${config.badgeClass}`} style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}>
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: config.color,
        display: 'inline-block',
        boxShadow: `0 0 8px ${config.color}`
      }} />
      {config.text}
    </span>
  );
}
