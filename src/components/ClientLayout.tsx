'use client';

import { LanguageProvider } from '@/lib/language-context';
import Navigation from './Navigation';
import Footer from './Footer';
import UniversalLanguageSelector from './UniversalLanguageSelector';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <div className="relative">
          <Navigation />
          {/* Language selector floats in the nav bar area */}
          <div className="fixed top-0 right-14 lg:right-4 z-50 h-16 flex items-center">
            <UniversalLanguageSelector />
          </div>
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
