'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, category?: string) => void;
  placeholder?: string;
  categories?: string[];
}

export default function SearchBar({ onSearch, placeholder = 'What do you want to discover?', categories }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), category || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <motion.div
        className="relative flex items-center rounded-xl border bg-surface/80 backdrop-blur-sm transition-colors"
        animate={{
          borderColor: focused ? 'rgba(37, 99, 235, 0.6)' : 'rgba(51, 65, 85, 1)',
          boxShadow: focused
            ? '0 0 0 3px rgba(37, 99, 235, 0.15), 0 0 20px rgba(37, 99, 235, 0.1)'
            : '0 0 0 0px transparent',
        }}
        transition={{ duration: 0.2 }}
      >
        <Search className="w-5 h-5 text-text-muted ml-4 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-3 py-4 text-base outline-none"
        />

        {categories && categories.length > 0 && (
          <div className="relative mr-2">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary bg-midnight/50 hover:bg-midnight transition-colors"
            >
              {category || 'All'}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-lg shadow-xl z-10 py-1">
                <button
                  type="button"
                  onClick={() => { setCategory(''); setDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-midnight/50 transition-colors"
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setCategory(cat); setDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-midnight/50 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="mr-2 px-4 py-2 bg-truth-blue hover:bg-truth-blue/80 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Search
        </button>
      </motion.div>
    </form>
  );
}
