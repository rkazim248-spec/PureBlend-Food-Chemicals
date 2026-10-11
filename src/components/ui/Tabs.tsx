'use client';

import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1.5 p-1 bg-[#EEF2EF] rounded-lg border border-border-subtle overflow-x-auto max-w-full ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 flex items-center gap-1.5 ${
              isActive
                ? 'bg-white text-forest shadow-xs font-bold border border-[#d6e0d9]'
                : 'text-secondary-text hover:text-charcoal hover:bg-white/50'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-soft-green text-forest font-bold' : 'bg-slate-200/70 text-secondary-text'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
