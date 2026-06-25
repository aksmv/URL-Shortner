import React, { useEffect, useState } from 'react';
import CreateLinkForm from '../components/CreateLinkForm';
import LinkRow from '../components/LinkRow';
import { fetchLinks, deleteLink } from '../api';

export default function Dashboard({ onSelect }) {
  const [links, setLinks] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleCreated(newLink) {
    setLinks((prev) => [{ ...newLink, trend7d: [] }, ...(prev || [])]);
  }

  async function handleDelete(shortCode) {
    try {
      await deleteLink(shortCode);
      setLinks((prev) => prev.filter((l) => l.shortCode !== shortCode));
    } catch (err) {
      setError(err.message);
    }
  }

  const totalClicks = (links || []).reduce((sum, l) => sum + l.clickCount, 0);

  return (
    <div>
      <header className="dashboard-header">
        <div>
          <h1 className="brand mono">snip</h1>
          <p className="tagline">Shorten links. Watch what happens next.</p>
        </div>
        {links && links.length > 0 && (
          <div className="header-stats mono">
            <span className="header-stat-value">{links.length}</span> links ·{' '}
            <span className="header-stat-value">{totalClicks}</span> clicks
          </div>
        )}
      </header>

      <CreateLinkForm onCreated={handleCreated} />

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="link-list">
        {links === null && <p className="text-muted loading-text">Loading links…</p>}

        {links && links.length === 0 && (
          <div className="empty-state">
            <p>No links yet.</p>
            <p className="text-muted">Paste a URL above to create your first one.</p>
          </div>
        )}

        {links && links.length > 0 && (
          <>
            <div className="list-label">Your links</div>
            {links.map((link) => (
              <LinkRow
                key={link.shortCode}
                link={link}
                onSelect={onSelect}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>

      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .brand {
          font-size: 26px;
          font-weight: 700;
          color: var(--accent);
          margin: 0;
        }
        .tagline {
          color: var(--text-muted);
          font-size: 13px;
          margin: 4px 0 0;
        }
        .header-stats {
          color: var(--text-muted);
          font-size: 13px;
        }
        .header-stat-value {
          color: var(--text);
          font-weight: 600;
        }
        .link-list {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .list-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .loading-text {
          padding: 40px 0;
          text-align: center;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          border: 1px dashed var(--border);
          border-radius: var(--radius);
        }
        .empty-state p {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
}
