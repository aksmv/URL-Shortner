import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { fetchLink } from '../api';

const COLORS = ['#5eead4', '#f59e0b', '#7c8b9e', '#f87171', '#a78bfa'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip mono">
      <div className="chart-tooltip-label">{label}</div>
      <div className="chart-tooltip-value">{payload[0].value} clicks</div>
    </div>
  );
}

export default function LinkDetail({ shortCode, onBack }) {
  const [link, setLink] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchLink(shortCode)
      .then((data) => !cancelled && setLink(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [shortCode]);

  if (error) {
    return (
      <div className="detail-page">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <p className="form-error">{error}</p>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="detail-page">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  const { analytics } = link;
  const shortUrl = `${window.location.origin}/${link.shortCode}`;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={onBack}>← Back to all links</button>

      <div className="detail-header">
        <h1 className="mono detail-code">/{link.shortCode}</h1>
        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="detail-target">
          {link.originalUrl}
        </a>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-value mono">{analytics.totalClicks}</div>
          <div className="stat-label">Total clicks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value mono">{analytics.byDevice.length ? analytics.byDevice[0].name : '—'}</div>
          <div className="stat-label">Top device</div>
        </div>
        <div className="stat-card">
          <div className="stat-value mono">{analytics.byBrowser.length ? analytics.byBrowser[0].name : '—'}</div>
          <div className="stat-label">Top browser</div>
        </div>
      </div>

      <section className="chart-section">
        <h2 className="section-title">Last 7 days</h2>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.trend7d}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5eead4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#5eead4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#232d3d" vertical={false} />
              <XAxis dataKey="label" stroke="#7c8b9e" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#7c8b9e" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#5eead4" strokeWidth={2} fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="chart-grid">
        <section className="chart-section">
          <h2 className="section-title">By device</h2>
          <div className="chart-box">
            {analytics.byDevice.length === 0 ? (
              <p className="text-muted empty-chart">No clicks yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={analytics.byDevice} layout="vertical" margin={{ left: 8 }}>
                  <XAxis type="number" hide allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#7c8b9e" fontSize={12} tickLine={false} axisLine={false} width={70} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {analytics.byDevice.map((entry, i) => (
                      <Bar key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="chart-section">
          <h2 className="section-title">By browser</h2>
          <div className="chart-box">
            {analytics.byBrowser.length === 0 ? (
              <p className="text-muted empty-chart">No clicks yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={analytics.byBrowser} layout="vertical" margin={{ left: 8 }}>
                  <XAxis type="number" hide allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#7c8b9e" fontSize={12} tickLine={false} axisLine={false} width={70} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .detail-page {
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          margin-bottom: 24px;
        }
        .back-btn:hover {
          color: var(--accent);
        }
        .detail-header {
          margin-bottom: 28px;
        }
        .detail-code {
          font-size: 28px;
          color: var(--accent);
          margin: 0 0 6px;
        }
        .detail-target {
          font-size: 13px;
          color: var(--text-muted);
          word-break: break-all;
        }
        .detail-target:hover {
          color: var(--accent);
        }
        .stat-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
        }
        .stat-value {
          font-size: 22px;
          font-weight: 700;
          color: var(--text);
          text-transform: capitalize;
        }
        .stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-top: 4px;
        }
        .chart-section {
          margin-bottom: 24px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 12px;
        }
        .chart-box {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
        }
        .chart-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .empty-chart {
          text-align: center;
          padding: 50px 0;
          font-size: 13px;
        }
        .text-muted {
          color: var(--text-muted);
        }
        .chart-tooltip {
          background: var(--surface-raised);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
        }
        .chart-tooltip-label {
          color: var(--text-muted);
        }
        .chart-tooltip-value {
          color: var(--accent);
          font-weight: 600;
        }
        @media (max-width: 640px) {
          .stat-row, .chart-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
