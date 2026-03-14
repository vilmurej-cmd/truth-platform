import type { Metadata } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRUTH — Universal Discovery Engine",
  description:
    "The world's first universal discovery engine. Seven lenses. One truth. Connect the disconnected.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-deep-navy text-text-primary font-sans antialiased min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Navigation() {
  return (
    <nav className="border-b border-border bg-midnight/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-text-primary">
              TRUTH
            </span>
            <span className="text-xs text-text-muted font-mono uppercase tracking-widest">
              Engine
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/discover"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Discover
            </a>
            <a
              href="/cold-cases"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cold Cases
            </a>
            <a
              href="/deep-ocean"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Deep Ocean
            </a>
            <a
              href="/buried"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Buried
            </a>
            <a
              href="/declassified"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Declassified
            </a>
            <a
              href="/science"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Science
            </a>
            <a
              href="/public-knowledge"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Public
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-midnight/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-text-primary">
              TRUTH
            </span>
            <span className="text-xs text-text-muted">
              truthengine.ai
            </span>
          </div>
          <p className="text-sm text-text-muted">
            Seven lenses. One truth. Connect the disconnected.
          </p>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} TRUTH Engine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
