const BASE_URL = '/api'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const url = `${BASE_URL}${endpoint}`
  console.log(`[API] ${options.method || 'GET'} ${url}`)

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
    throw new Error(err.message || `Lỗi server (${res.status})`)
  }

  return res.json()
}

export const api = {
  compare: (data) =>
    request('/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getHistory: () =>
    request('/history'),

  getHistoryById: (id) =>
    request(`/history?id=${id}`),

  deleteHistory: (id) =>
    request(`/history?id=${id}`, { method: 'DELETE' }),

  verifyGoogleToken: (credential) =>
    request('/auth', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),
}
