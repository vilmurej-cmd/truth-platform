'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Fingerprint, Waves, Landmark, ShieldAlert, FlaskConical, BookOpen, Snowflake, FileKey, Users, type LucideIcon } from 'lucide-react';

interface LensCardProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
}

const iconMap: Record<string, LucideIcon> = {
  Search,
  Fingerprint,
  Waves,
  Landmark,
  ShieldAlert,
  FlaskConical,
  BookOpen,
  Snowflake,
  FileKey,
  Users,
};

export default function LensCard({ name, description, icon, color, slug }: LensCardProps) {
  const Icon = iconMap[icon] || Search;

  return (
    <Link href={`/${slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group bg-surface/60 border border-border rounded-xl p-6 transition-all duration-300 hover:border-opacity-60 h-full"
        style={{
          // @ts-expect-error CSS custom property
          '--lens-color': color,
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>

        <h3 className="text-text-primary font-semibold text-lg mb-2">{name}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{description}</p>

        <span
          className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
          style={{ color }}
        >
          Explore
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </motion.div>
    </Link>
  );
}
