import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  hoverEffect = false
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div
      className={`bg-white rounded-lg border border-border-subtle shadow-xs ${paddingStyles[padding]} ${
        hoverEffect
          ? 'transition-all duration-200 hover:shadow-md hover:border-[#ccd9d0]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
