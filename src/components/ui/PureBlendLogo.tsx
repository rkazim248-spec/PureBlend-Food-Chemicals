import React from 'react';

interface PureBlendLogoProps {
  variant?: 'light' | 'dark' | 'mark-only';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// SVG Icon: Dark emerald green leaf with a chemical branching structure, 3 amber nodes, 1 white node
function LeafIcon({ iconSize = 36 }: { iconSize?: number }) {
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Outer dark forest green shield/leaf */}
      <path
        d="M50 6C30 6 12 28 12 52C12 78 34 94 50 94C66 94 88 78 88 52C88 28 70 6 50 6Z"
        fill="#12372A"
      />
      {/* Inner lighter green leaf facet */}
      <path
        d="M50 14C35 14 20 32 20 52C20 73 37 86 50 86C63 86 80 73 80 52C80 32 65 14 50 14Z"
        fill="#1E7A5A"
      />
      {/* Main central branch/stem */}
      <line
        x1="50"
        y1="28"
        x2="50"
        y2="76"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Left upper branch */}
      <line
        x1="50"
        y1="44"
        x2="32"
        y2="54"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Right middle branch */}
      <line
        x1="50"
        y1="56"
        x2="68"
        y2="42"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Right lower branch */}
      <line
        x1="50"
        y1="64"
        x2="66"
        y2="72"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Amber/Gold Node 1 (Top) */}
      <circle cx="50" cy="27" r="5.5" fill="#C9A227" stroke="#12372A" strokeWidth="1" />
      {/* Amber/Gold Node 2 (Left branch) */}
      <circle cx="32" cy="54" r="5.5" fill="#C9A227" stroke="#12372A" strokeWidth="1" />
      {/* Amber/Gold Node 3 (Right middle branch) */}
      <circle cx="68" cy="42" r="5.5" fill="#C9A227" stroke="#12372A" strokeWidth="1" />
      {/* White/Silver Node 4 (Right lower branch) */}
      <circle cx="66" cy="72" r="5" fill="#FFFFFF" stroke="#12372A" strokeWidth="1" />
    </svg>
  );
}

export function PureBlendLogo({
  variant = 'light',
  className = '',
  size = 'md'
}: PureBlendLogoProps) {
  if (variant === 'mark-only') {
    const iconSizes = { sm: 28, md: 36, lg: 48 };
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <LeafIcon iconSize={iconSizes[size]} />
      </div>
    );
  }

  const textSizes = {
    sm: { title: 'text-base', sub: 'text-[9px]' },
    md: { title: 'text-xl', sub: 'text-[10px]' },
    lg: { title: 'text-2xl', sub: 'text-xs' }
  };

  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <LeafIcon iconSize={size === 'sm' ? 30 : size === 'lg' ? 44 : 36} />
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-tight uppercase ${
              isDark ? 'text-white' : 'text-[#12372A]'
            } ${textSizes[size].title}`}
          >
            PURE
          </span>
          <span
            className={`font-black tracking-tight uppercase text-[#1F7A5A] ${textSizes[size].title}`}
          >
            BLEND
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`font-bold tracking-widest uppercase font-mono ${
              isDark ? 'text-[#88aa9a]' : 'text-[#52615A]'
            } ${textSizes[size].sub}`}
          >
            FOOD CHEMICALS
          </span>
          <span className="text-[#C9A227] font-bold text-[8px]">•</span>
          <span
            className={`font-semibold tracking-wider font-mono ${
              isDark ? 'text-[#688a7a]' : 'text-[#7A8781]'
            } ${textSizes[size].sub}`}
          >
            EST. B2B PURITY
          </span>
        </div>
      </div>
    </div>
  );
}
