import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'forest';
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  tone,
  size = 'sm',
  className = ''
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 font-medium'
  };

  const variantStyles = {
    neutral: 'bg-slate-100 text-charcoal border border-border-subtle',
    success: 'bg-[#edf7f1] text-[#1c633d] border border-[#cbe6d5]',
    warning: 'bg-[#fdf8ee] text-[#9c6414] border border-[#f5e3bc]',
    error: 'bg-[#fef2f2] text-[#b42318] border border-[#fecdca]',
    forest: 'bg-soft-green text-forest border border-[#cbe0d3]'
  };

  const resolvedVariant = tone === 'danger' ? 'error' : tone === 'info' || tone === 'brand' ? 'forest' : tone ?? variant;

  return (
    <span
      className={`inline-flex items-center rounded border font-mono uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[resolvedVariant]} ${className}`}
    >
      {children}
    </span>
  );
}
