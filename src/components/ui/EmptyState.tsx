import React from 'react';
import { PackageSearch } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-12 px-4 rounded-lg border border-dashed border-border-subtle bg-white/70 max-w-xl mx-auto flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-soft-green text-forest flex items-center justify-center mb-4">
        {icon || <PackageSearch className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-bold text-charcoal mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-secondary-text max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
