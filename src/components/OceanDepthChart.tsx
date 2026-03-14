'use client';

import { motion } from 'framer-motion';

interface OceanDiscovery {
  name: string;
  depth: number; // meters
  description?: string;
}

interface OceanDepthChartProps {
  discoveries?: OceanDiscovery[];
  height?: number;
}

const zones = [
  { name: 'Sunlight Zone', range: [0, 200], color: '#1E40AF', lightColor: 'rgba(37, 99, 235, 0.3)' },
  { name: 'Twilight Zone', range: [200, 1000], color: '#1E3A5F', lightColor: 'rgba(30, 58, 95, 0.5)' },
  { name: 'Midnight Zone', range: [1000, 4000], color: '#0F2442', lightColor: 'rgba(15, 36, 66, 0.6)' },
  { name: 'Abyssal Zone', range: [4000, 6000], color: '#0A1628', lightColor: 'rgba(10, 22, 40, 0.7)' },
  { name: 'Hadal Zone', range: [6000, 11000], color: '#050D18', lightColor: 'rgba(5, 13, 24, 0.8)' },
];

const totalDepth = 11000;

export default function OceanDepthChart({ discoveries = [], height = 500 }: OceanDepthChartProps) {
  const depthToY = (depth: number) => (depth / totalDepth) * height;

  return (
    <div className="bg-surface/40 border border-border rounded-xl p-4 overflow-hidden">
      <svg width="100%" height={height} viewBox={`0 0 600 ${height}`} className="max-w-full">
        {/* Depth zones */}
        {zones.map((zone, i) => {
          const y = depthToY(zone.range[0]);
          const h = depthToY(zone.range[1]) - y;

          return (
            <motion.g key={zone.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
              <rect x={0} y={y} width={600} height={h} fill={zone.color} />
              {/* Zone label */}
              <text x={20} y={y + 20} className="fill-text-secondary text-[11px] font-medium">
                {zone.name}
              </text>
              <text x={20} y={y + 34} className="fill-text-muted text-[9px]">
                {zone.range[0].toLocaleString()}m &ndash; {zone.range[1].toLocaleString()}m
              </text>
              {/* Separator line */}
              {i > 0 && (
                <line x1={0} y1={y} x2={600} y2={y} stroke="rgba(51, 65, 85, 0.4)" strokeWidth={1} strokeDasharray="4,4" />
              )}
            </motion.g>
          );
        })}

        {/* Discoveries */}
        {discoveries.map((disc, i) => {
          const y = depthToY(disc.depth);
          const x = 150 + (i % 4) * 100;

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
            >
              {/* Connecting line to left */}
              <line x1={80} y1={y} x2={x - 10} y2={y} stroke="rgba(245, 158, 11, 0.3)" strokeWidth={1} strokeDasharray="2,2" />

              {/* Dot */}
              <circle cx={x} cy={y} r={6} fill="#F59E0B" />
              <circle cx={x} cy={y} r={10} fill="rgba(245, 158, 11, 0.2)" />

              {/* Label */}
              <text x={x} y={y - 12} textAnchor="middle" className="fill-text-primary text-[10px] font-medium">
                {disc.name}
              </text>
              <text x={x} y={y + 20} textAnchor="middle" className="fill-text-muted text-[9px]">
                {disc.depth.toLocaleString()}m
              </text>
            </motion.g>
          );
        })}

        {/* Depth scale on right */}
        {[0, 1000, 2000, 4000, 6000, 8000, 11000].map((d) => (
          <g key={d}>
            <line x1={560} y1={depthToY(d)} x2={580} y2={depthToY(d)} stroke="rgba(148, 163, 184, 0.3)" strokeWidth={1} />
            <text x={585} y={depthToY(d) + 4} className="fill-text-muted text-[8px]">
              {d === 0 ? '0m' : `${(d / 1000).toFixed(0)}km`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
