'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

const lensLinks = [
  { name: 'Search', href: '/discover' },
  { name: 'Cold Cases', href: '/cold-cases' },
  { name: 'Deep Ocean', href: '/deep-ocean' },
  { name: 'Buried', href: '/buried' },
  { name: 'Declassified', href: '/declassified' },
  { name: 'Science', href: '/science' },
  { name: 'Public Knowledge', href: '/public-knowledge' },
];

const aboutLinks = [
  { name: 'About', href: '/about' },
  { name: 'Methodology', href: '/methodology' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
];

const connectLinks = [
  { name: 'GitHub', href: '#' },
  { name: 'Twitter', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-deep-navy border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-truth-blue/20 border border-truth-blue/30 flex items-center justify-center">
                <Search className="w-4 h-4 text-truth-blue" />
              </div>
              <span className="text-xl font-bold text-text-primary tracking-tight">TRUTH</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              The World&apos;s First Universal Discovery Engine. Seven lenses. One truth.
            </p>
          </div>

          {/* Lenses */}
          <div>
            <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-4">Lenses</h3>
            <ul className="space-y-2">
              {lensLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-secondary text-sm hover:text-truth-blue transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-secondary text-sm hover:text-truth-blue transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-4">Connect</h3>
            <ul className="space-y-2">
              {connectLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-text-secondary text-sm hover:text-truth-blue transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-text-muted text-xs">
            &copy; 2026 TRUTH Engine. Knowledge wants to be free.
          </p>
          <p className="text-text-muted text-xs italic">
            Seven lenses. One truth.
          </p>
        </div>
      </div>
    </footer>
  );
}
