'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onSelect: (id: string) => void;
}

export default function TabSelector({ tabs, activeTab, onSelect }: TabSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-surface/40 border border-border rounded-xl p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-truth-blue/15 border border-truth-blue/30 rounded-lg"
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
