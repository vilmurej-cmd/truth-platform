'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GlobePoint {
  lat: number;
  lng: number;
  label: string;
}

interface GlobeVisualizationProps {
  points?: GlobePoint[];
  size?: number;
}

function latLngToXY(lat: number, lng: number, rotation: number, cx: number, cy: number, r: number) {
  const phi = (lat * Math.PI) / 180;
  const lambda = ((lng + rotation) * Math.PI) / 180;
  const x = r * Math.cos(phi) * Math.sin(lambda);
  const y = -r * Math.sin(phi);
  const z = r * Math.cos(phi) * Math.cos(lambda);
  return { x: cx + x, y: cy + y, visible: z > 0 };
}

function generateGraticule(rotation: number, cx: number, cy: number, r: number) {
  const paths: string[] = [];

  // Latitude lines
  for (let lat = -60; lat <= 60; lat += 30) {
    let d = '';
    for (let lng = -180; lng <= 180; lng += 5) {
      const { x, y, visible } = latLngToXY(lat, lng, rotation, cx, cy, r);
      if (visible) {
        d += d === '' ? `M${x},${y}` : `L${x},${y}`;
      } else {
        d += '';
      }
    }
    if (d) paths.push(d);
  }

  // Longitude lines
  for (let lng = -180; lng < 180; lng += 30) {
    let d = '';
    for (let lat = -90; lat <= 90; lat += 5) {
      const { x, y, visible } = latLngToXY(lat, lng, rotation, cx, cy, r);
      if (visible) {
        d += d === '' ? `M${x},${y}` : `L${x},${y}`;
      } else {
        d += '';
      }
    }
    if (d) paths.push(d);
  }

  return paths;
}

export default function GlobeVisualization({ points = [], size = 300 }: GlobeVisualizationProps) {
  const [rotation, setRotation] = useState(0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const graticule = generateGraticule(rotation, cx, cy, r);
  const projectedPoints = points.map((p) => ({
    ...p,
    ...latLngToXY(p.lat, p.lng, rotation, cx, cy, r),
  }));

  // Connection lines between visible points
  const visiblePoints = projectedPoints.filter((p) => p.visible);
  const connections: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < visiblePoints.length; i++) {
    for (let j = i + 1; j < visiblePoints.length; j++) {
      const dist = Math.hypot(visiblePoints[i].x - visiblePoints[j].x, visiblePoints[i].y - visiblePoints[j].y);
      if (dist < r * 1.2) {
        connections.push({
          x1: visiblePoints[i].x, y1: visiblePoints[i].y,
          x2: visiblePoints[j].x, y2: visiblePoints[j].y,
        });
      }
    }
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Globe outline */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(37, 99, 235, 0.15)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={r} fill="rgba(37, 99, 235, 0.03)" />

        {/* Graticule */}
        {graticule.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(37, 99, 235, 0.2)" strokeWidth={0.5} />
        ))}

        {/* Connections */}
        {connections.map((c, i) => (
          <motion.line
            key={`conn-${i}`}
            x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke="rgba(37, 99, 235, 0.3)"
            strokeWidth={0.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        ))}

        {/* Points */}
        {projectedPoints.map((p, i) =>
          p.visible ? (
            <g key={i}>
              <motion.circle
                cx={p.x} cy={p.y} r={4}
                fill="#F59E0B"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <circle cx={p.x} cy={p.y} r={8} fill="rgba(245, 158, 11, 0.15)" />
              <text
                x={p.x} y={p.y - 10}
                textAnchor="middle"
                className="fill-text-secondary text-[8px]"
              >
                {p.label}
              </text>
            </g>
          ) : null
        )}
      </svg>
    </div>
  );
}
