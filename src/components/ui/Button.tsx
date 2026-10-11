'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const sizeStyles = {
      sm: 'text-xs py-1.5 px-3 gap-1.5 h-8',
      md: 'text-sm py-2 px-4 gap-2 h-10',
      lg: 'text-base py-2.5 px-6 gap-2.5 h-12'
    };

    const variantStyles = {
      primary: 'bg-forest text-white hover:bg-forest-light active:bg-forest-dark shadow-sm border border-transparent',
      secondary: 'bg-soft-green text-forest hover:bg-[#d8e7de] active:bg-[#c9ded0] border border-transparent',
      outline: 'bg-white text-charcoal border border-border-subtle hover:bg-warm-white hover:border-[#ccd7cf] shadow-sm',
      ghost: 'bg-transparent text-charcoal hover:bg-soft-green/60 active:bg-soft-green',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm'
    };

    const pending = isLoading || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || pending}
        aria-busy={pending}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
