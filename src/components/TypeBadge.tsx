import React from 'react';
import { getTypeStyle } from '../utils/typeColors';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'md' }) => {
  const style = getTypeStyle(type);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-bold'
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md uppercase tracking-wider shadow-sm font-sans ${style.bg} ${style.text} ${sizeClasses[size]}`}
    >
      {type}
    </span>
  );
};
