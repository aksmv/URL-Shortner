import React from 'react';

// Renders a tiny 7-day click trend as a sparkline with a glowing endpoint.
// This is the page's signature element: turns a static link list into something alive.
export default function Sparkline({ data = [], width = 100, height = 32 }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - (d.count / max) * (height - 6) - 3;
    return { x, y, count: d.count, label: d.label };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  const last = points[points.length - 1];
  const hasActivity = data.some((d) => d.count > 0);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Click trend over the last 7 days, ${data.reduce((s, d) => s + d.count, 0)} total clicks`}
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkFill)" stroke="none" />
      <path
        d={pathD}
        fill="none"
        stroke={hasActivity ? 'var(--accent)' : 'var(--text-muted)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {last && hasActivity && (
        <circle cx={last.x} cy={last.y} r="2.5" fill="var(--accent)">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
}
