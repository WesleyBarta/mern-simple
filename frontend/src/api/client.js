// Tiny fetch wrapper — attaches the JWT, surfaces server errors nicely,
// and redirects to /signin if the server says we're not authed.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const TOKEN_KEY = 'gsfs.token'
const USER_KEY = 'gsfs.user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}
export function setSession({ user, token }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = 'Bearer ' + t
  }
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  let data = null
  try { data = await res.json() } catch { /* no body */ }
  if (!res.ok) {
    const err = new Error(data?.error || 'Request failed (' + res.status + ')')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  get:    (p)    => request(p),
  post:   (p, b) => request(p, { method: 'POST', body: b }),
  put:    (p, b) => request(p, { method: 'PUT',  body: b }),
  patch:  (p, b) => request(p, { method: 'PATCH', body: b }),
  del:    (p)    => request(p, { method: 'DELETE' }),
  // public (no auth header sent)
  public: {
    get: (p) => request(p, { auth: false }),
    post: (p, b) => request(p, { method: 'POST', body: b, auth: false }),
  },
}
