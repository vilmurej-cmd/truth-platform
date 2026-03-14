'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Snowflake, Waves, Landmark, FileKey, FlaskConical, Users, Menu, X } from 'lucide-react';

const lenses = [
  { name: 'Search', slug: '/discover', icon: Search },
  { name: 'Cold Cases', slug: '/cold-cases', icon: Snowflake },
  { name: 'Deep Ocean', slug: '/deep-ocean', icon: Waves },
  { name: 'Buried', slug: '/buried', icon: Landmark },
  { name: 'Declassified', slug: '/declassified', icon: FileKey },
  { name: 'Science', slug: '/science', icon: FlaskConical },
  { name: 'Public', slug: '/public-knowledge', icon: Users },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-deep-navy/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-truth-blue/20 border border-truth-blue/30 flex items-center justify-center group-hover:bg-truth-blue/30 transition-colors">
                <Search className="w-4 h-4 text-truth-blue" />
              </div>
              <span className="text-xl font-bold text-text-primary tracking-tight">
                TRUTH
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {lenses.map((lens) => {
                const isActive = pathname === lens.slug;
                const Icon = lens.icon;
                return (
                  <Link
                    key={lens.slug}
                    href={lens.slug}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-truth-blue bg-truth-blue/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {lens.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-truth-blue rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface/50 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-deep-navy border-l border-border lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-bold text-text-primary">TRUTH</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {lenses.map((lens) => {
                  const isActive = pathname === lens.slug;
                  const Icon = lens.icon;
                  return (
                    <Link
                      key={lens.slug}
                      href={lens.slug}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-truth-blue bg-truth-blue/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {lens.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
