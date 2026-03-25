import React from 'react';

interface AvatarProps {
  name: string;
  initials: string;
  color: string;
  size?: 'sm' | 'md';
}

export const Avatar: React.FC<AvatarProps> = ({ name, initials, color, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
  return (
    <div
      className={`${color} ${sizeClass} rounded-full flex items-center justify-center text-white font-medium`}
      title={name}
    >
      {initials}
      
    </div>
  );
};