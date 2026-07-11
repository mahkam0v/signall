// Backend qayerda ishlayotgan bo'lsa, shu manzilni ko'rsat.
export const API_BASE_URL = 'http://localhost:4000/api';
export const ASSET_BASE_URL = 'http://localhost:4000';

const TOKEN_KEY = 'signal_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const request = async (path, { method = 'GET', body, auth = false } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `So'rov muvaffaqiyatsiz tugadi (${res.status})`);
  }
  return data;
};

export const api = {
  register: (username, password) =>
    request('/auth/register', { method: 'POST', body: { username, password } }),
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: { username, password } }),
  me: () => request('/auth/me', { auth: true }),
  listAnime: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/anime${qs ? `?${qs}` : ''}`);
  },
  getAnime: (slug) => request(`/anime/${encodeURIComponent(slug)}`),
  listGenres: () => request('/anime/genres'),
};

export const assetUrl = (path) => (path ? `${ASSET_BASE_URL}${path}` : null);
