import React, { useState } from 'react';
import Sparkline from './Sparkline';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function truncate(str, n) {
  return str.length > n ? `${str.slice(0, n - 1)}…` : str;
}

export default function LinkRow({ link, onSelect, onDelete }) {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${window.location.origin}/${link.shortCode}`;

  function handleCopy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleDelete(e) {
    e.stopPropagation();
    if (window.confirm(`Delete /${link.shortCode}? This can't be undone.`)) {
      onDelete(link.shortCode);
    }
  }

  return (
    <div className="link-row" onClick={() => onSelect(link.shortCode)} role="button" tabIndex={0}>
      <div className="link-row-main">
        <div className="link-row-code mono">/{link.shortCode}</div>
        <div className="link-row-url">{truncate(link.originalUrl, 56)}</div>
      </div>

      <div className="link-row-spark">
        <Sparkline data={link.trend7d} />
      </div>

      <div className="link-row-count mono">
        <span className="count-value">{link.clickCount}</span>
        <span className="count-label">clicks</span>
      </div>

      <div className="link-row-meta">{timeAgo(link.createdAt)}</div>

      <div className="link-row-actions">
        <button className="icon-btn" onClick={handleCopy} title="Copy short link">
          {copied ? '✓' : 'Copy'}
        </button>
        <button className="icon-btn icon-btn-danger" onClick={handleDelete} title="Delete link">
          Delete
        </button>
      </div>

      <style>{`
        .link-row {
          display: grid;
          grid-template-columns: 1fr 110px 80px 70px auto;
          align-items: center;
          gap: 16px;
          padding: 16px 18px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--surface);
          cursor: pointer;
          transition: border-color 0.15s ease, transform 0.1s ease;
        }
        .link-row:hover {
          border-color: var(--accent);
        }
        .link-row-main {
          min-width: 0;
        }
        .link-row-code {
          color: var(--accent);
          font-size: 14px;
          font-weight: 600;
        }
        .link-row-url {
          color: var(--text-muted);
          font-size: 12px;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .link-row-count {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .count-value {
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
        }
        .count-label {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .link-row-meta {
          color: var(--text-muted);
          font-size: 12px;
          text-align: right;
        }
        .link-row-actions {
          display: flex;
          gap: 6px;
        }
        .icon-btn {
          background: var(--surface-raised);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        .icon-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
        }
        .icon-btn-danger:hover {
          color: var(--danger);
          border-color: var(--danger);
        }
        @media (max-width: 640px) {
          .link-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .link-row-spark, .link-row-meta {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
