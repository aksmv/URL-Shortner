import React, { useState } from 'react';
import { createLink } from '../api';

export default function CreateLinkForm({ onCreated }) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!url.trim()) {
      setError('Add a URL to shorten.');
      return;
    }
    setLoading(true);
    try {
      const link = await createLink({ url: url.trim(), customCode: customCode.trim() });
      setUrl('');
      setCustomCode('');
      setShowCustom(false);
      onCreated(link);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <div className="create-form-row">
        <input
          type="text"
          placeholder="https://your-long-url.com/goes-here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="create-input mono"
          aria-label="URL to shorten"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Shortening…' : 'Shorten'}
        </button>
      </div>

      <div className="create-form-footer">
        <button
          type="button"
          className="link-toggle"
          onClick={() => setShowCustom((s) => !s)}
        >
          {showCustom ? '− Hide custom code' : '+ Use a custom code'}
        </button>

        {showCustom && (
          <div className="custom-code-row">
            <span className="mono custom-code-prefix">snip.app/</span>
            <input
              type="text"
              placeholder="my-link"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="custom-code-input mono"
              maxLength={20}
              aria-label="Custom short code"
            />
          </div>
        )}
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <style>{`
        .create-form {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
        }
        .create-form-row {
          display: flex;
          gap: 10px;
        }
        .create-input {
          flex: 1;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 12px 14px;
          color: var(--text);
          font-size: 14px;
        }
        .create-input:focus {
          border-color: var(--accent);
        }
        .btn-primary {
          background: var(--accent);
          color: #06251f;
          border: none;
          border-radius: 6px;
          padding: 12px 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.15s ease;
        }
        .btn-primary:hover {
          opacity: 0.88;
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .create-form-footer {
          margin-top: 12px;
        }
        .link-toggle {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          padding: 0;
        }
        .link-toggle:hover {
          color: var(--accent);
        }
        .custom-code-row {
          display: flex;
          align-items: center;
          margin-top: 10px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 4px 4px 4px 12px;
          max-width: 320px;
        }
        .custom-code-prefix {
          color: var(--text-muted);
          font-size: 13px;
        }
        .custom-code-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--accent);
          padding: 8px;
          font-size: 13px;
        }
        .custom-code-input:focus {
          outline: none;
        }
        .form-error {
          color: var(--danger);
          font-size: 13px;
          margin: 10px 0 0;
        }
      `}</style>
    </form>
  );
}
