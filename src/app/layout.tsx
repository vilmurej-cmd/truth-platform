import type { Metadata } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

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
  openGraph: {
    title: "TRUTH — Universal Discovery Engine",
    description:
      "Cold cases, deep ocean, lost civilizations, declassified files, medical frontiers — seven lenses, one truth.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "TRUTH — seven lenses, one truth" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TRUTH — Universal Discovery Engine",
    description:
      "Cold cases, deep ocean, lost civilizations, declassified files, medical frontiers — seven lenses, one truth.",
    images: ["/og.png"],
  },
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
      <body className="bg-deep-navy text-text-primary font-sans antialiased min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
