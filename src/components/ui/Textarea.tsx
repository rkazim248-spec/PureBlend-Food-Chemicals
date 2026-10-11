'use client';

import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, helperText, error, id, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-red-600 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-desc` : undefined}
          className={`w-full rounded-md border bg-white px-3.5 py-2 text-sm text-charcoal transition-colors placeholder:text-secondary-text/60 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green disabled:bg-slate-50 disabled:cursor-not-allowed resize-y ${
            error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-border-subtle'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p id={`${textareaId}-error`} className="text-xs text-red-600 mt-1 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${textareaId}-desc`} className="text-xs text-secondary-text mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
