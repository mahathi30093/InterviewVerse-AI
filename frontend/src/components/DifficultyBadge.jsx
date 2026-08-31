import React from 'react';
import { DIFFICULTY_LEVELS } from '../utils/constants';

export function DifficultyBadge({ difficulty }) {
  const diffKey = (difficulty || 'EASY').toUpperCase();
  const config = DIFFICULTY_LEVELS[diffKey] || DIFFICULTY_LEVELS.EASY;

  return (
    <span className={`badge ${config.badgeClass}`}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: config.color,
        display: 'inline-block'
      }} />
      {config.label}
    </span>
  );
}
