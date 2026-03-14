'use client';

import { useEffect, useRef, useState } from 'react';

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

export default function GlobeVisualization({ points = [], size = 300 }: GlobeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rotationRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;

  useEffect(() => {
    setMounted(true);
    let lastTime = 0;

    const animate = (time: number) => {
      if (time - lastTime > 50) {
        rotationRef.current = (rotationRef.current + 0.3) % 360;
        lastTime = time;

        const svg = svgRef.current;
        if (!svg) { animFrameRef.current = requestAnimationFrame(animate); return; }

        const rot = rotationRef.current;

        // Update graticule paths
        const gratPaths = svg.querySelectorAll('.grat');
        let pathIdx = 0;
        for (let lat = -60; lat <= 60; lat += 30) {
          let d = '';
          for (let lng = -180; lng <= 180; lng += 10) {
            const p = latLngToXY(lat, lng, rot, cx, cy, r);
            if (p.visible) d += d === '' ? `M${p.x},${p.y}` : `L${p.x},${p.y}`;
          }
          if (gratPaths[pathIdx]) (gratPaths[pathIdx] as SVGPathElement).setAttribute('d', d || 'M0,0');
          pathIdx++;
        }
        for (let lng = -180; lng < 180; lng += 30) {
          let d = '';
          for (let lat = -90; lat <= 90; lat += 10) {
            const p = latLngToXY(lat, lng, rot, cx, cy, r);
            if (p.visible) d += d === '' ? `M${p.x},${p.y}` : `L${p.x},${p.y}`;
          }
          if (gratPaths[pathIdx]) (gratPaths[pathIdx] as SVGPathElement).setAttribute('d', d || 'M0,0');
          pathIdx++;
        }

        // Update points
        const projected = points.map((pt) => latLngToXY(pt.lat, pt.lng, rot, cx, cy, r));
        const pointGroups = svg.querySelectorAll('.globe-point');
        projected.forEach((p, i) => {
          const g = pointGroups[i] as SVGGElement | undefined;
          if (!g) return;
          g.setAttribute('transform', `translate(${p.x},${p.y})`);
          g.style.opacity = p.visible ? '1' : '0';
        });

        // Update connections
        const visible = projected.map((p, i) => ({ ...p, i })).filter((p) => p.visible);
        const connLines = svg.querySelectorAll('.conn-line');
        let ci = 0;
        for (let i = 0; i < visible.length && ci < connLines.length; i++) {
          for (let j = i + 1; j < visible.length && ci < connLines.length; j++) {
            const dist = Math.hypot(visible[i].x - visible[j].x, visible[i].y - visible[j].y);
            if (dist < r * 1.2) {
              const line = connLines[ci] as SVGLineElement;
              line.setAttribute('x1', String(visible[i].x));
              line.setAttribute('y1', String(visible[i].y));
              line.setAttribute('x2', String(visible[j].x));
              line.setAttribute('y2', String(visible[j].y));
              line.style.opacity = '0.3';
              ci++;
            }
          }
        }
        for (; ci < connLines.length; ci++) {
          (connLines[ci] as SVGLineElement).style.opacity = '0';
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [points, cx, cy, r]);

  // Count graticule paths: 5 lat lines (-60,-30,0,30,60) + 12 lng lines
  const gratCount = 5 + 12;
  // Max possible connections
  const maxConns = 20;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(37, 99, 235, 0.15)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={r} fill="rgba(37, 99, 235, 0.03)" />

        {Array.from({ length: gratCount }).map((_, i) => (
          <path key={i} className="grat" d="M0,0" fill="none" stroke="rgba(37, 99, 235, 0.2)" strokeWidth={0.5} />
        ))}

        {Array.from({ length: maxConns }).map((_, i) => (
          <line key={`c${i}`} className="conn-line" stroke="rgba(37, 99, 235, 0.3)" strokeWidth={0.5} style={{ opacity: 0, transition: 'opacity 0.3s' }} />
        ))}

        {mounted && points.map((p, i) => (
          <g key={i} className="globe-point" style={{ opacity: 0, transition: 'opacity 0.3s' }}>
            <circle r={8} fill="rgba(245, 158, 11, 0.15)" />
            <circle r={4} fill="#F59E0B">
              <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </circle>
            <text y={-10} textAnchor="middle" className="fill-text-secondary" style={{ fontSize: '8px' }}>{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
