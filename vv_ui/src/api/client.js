//
// Simple API client for vv_ui
//
// Reads base URL from REACT_APP_API_BASE_URL (.env) with a default of http://localhost:3001

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// PUBLIC_INTERFACE
export async function apiGet(path, { signal } = {}) {
  /** Perform a GET request and return JSON. Throws on HTTP errors. */
  const res = await fetch(joinUrl(BASE_URL, path), {
    headers: { Accept: 'application/json' },
    signal,
  });
  await ensureOk(res);
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPostJson(path, body, { signal } = {}) {
  /** POST JSON and return JSON. */
  const res = await fetch(joinUrl(BASE_URL, path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body ?? {}),
    signal,
  });
  await ensureOk(res);
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

// PUBLIC_INTERFACE
export async function apiPostMultipart(path, formData, { signal } = {}) {
  /** POST multipart/form-data and return JSON. */
  const res = await fetch(joinUrl(BASE_URL, path), {
    method: 'POST',
    body: formData,
    signal,
  });
  await ensureOk(res);
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

function joinUrl(base, path) {
  if (!path.startsWith('/')) path = `/${path}`;
  return `${base}${path}`;
}

async function ensureOk(res) {
  if (!res.ok) {
    let detail = '';
    try {
      const data = await res.json();
      detail = data?.detail || JSON.stringify(data);
    } catch {
      detail = await res.text();
    }
    const err = new Error(`HTTP ${res.status} ${res.statusText} - ${detail}`);
    err.status = res.status;
    err.detail = detail;
    throw err;
  }
}
