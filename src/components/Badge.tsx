import React from 'react';
import type { Priority } from '../types';
import { PRIORITIES } from '../constants';

interface BadgeProps {
  priority: Priority;
}

export const Badge: React.FC<BadgeProps> = ({ priority }) => {
  const config = PRIORITIES.find(p => p.value === priority)!;
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};