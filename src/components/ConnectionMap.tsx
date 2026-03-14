'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MapNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
}

interface MapConnection {
  from: string;
  to: string;
  strength: number; // 0-1
}

interface ConnectionMapProps {
  nodes: MapNode[];
  connections: MapConnection[];
  width?: number;
  height?: number;
}

const typeColors: Record<string, string> = {
  person: '#2563EB',
  event: '#F59E0B',
  location: '#10B981',
  document: '#EF4444',
  organization: '#8B5CF6',
  default: '#94A3B8',
};

export default function ConnectionMap({ nodes, connections, width = 600, height = 400 }: ConnectionMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="bg-surface/40 border border-border rounded-xl p-4 overflow-hidden">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="max-w-full">
        {/* Connections */}
        {connections.map((conn, i) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);
          if (!fromNode || !toNode) return null;

          const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;

          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isHighlighted ? '#2563EB' : 'rgba(51, 65, 85, 0.6)'}
              strokeWidth={Math.max(1, conn.strength * 3)}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isHighlighted ? 1 : 0.5 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const color = typeColors[node.type] || typeColors.default;
          const isHovered = hoveredNode === node.id;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              {/* Glow */}
              {isHovered && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={24}
                  fill={color}
                  opacity={0.15}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}

              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? 10 : 8}
                fill={color}
                stroke={isHovered ? '#F1F5F9' : 'rgba(51, 65, 85, 0.8)'}
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
              />

              <text
                x={node.x}
                y={node.y + 22}
                textAnchor="middle"
                className={`text-[11px] font-medium ${isHovered ? 'fill-text-primary' : 'fill-text-secondary'}`}
              >
                {node.label}
              </text>

              {/* Tooltip on hover */}
              {isHovered && (
                <foreignObject x={node.x - 60} y={node.y - 55} width={120} height={30}>
                  <div className="bg-midnight border border-border rounded px-2 py-1 text-center">
                    <span className="text-[10px] text-text-muted capitalize">{node.type}</span>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
