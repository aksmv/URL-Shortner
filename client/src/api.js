const BASE = '/api';

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function createLink({ url, customCode, title }) {
  const res = await fetch(`${BASE}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, customCode: customCode || undefined, title }),
  });
  return handle(res);
}

export async function fetchLinks() {
  const res = await fetch(`${BASE}/links`);
  return handle(res);
}

export async function fetchLink(shortCode) {
  const res = await fetch(`${BASE}/links/${shortCode}`);
  return handle(res);
}

export async function deleteLink(shortCode) {
  const res = await fetch(`${BASE}/links/${shortCode}`, { method: 'DELETE' });
  return handle(res);
}
