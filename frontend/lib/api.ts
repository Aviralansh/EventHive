export type Role = "attendee" | "organizer"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "http://80.225.233.82:8000"

type StorageMode = "local" | "session"

const TOKEN_KEY = "eh_access_token"
const USER_KEY = "eh_user"

export function setToken(token: string, user: any, mode: StorageMode) {
  const store = mode === "local" ? window.localStorage : window.sessionStorage
  store.setItem(TOKEN_KEY, token)
  store.setItem(USER_KEY, JSON.stringify(user))
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
    window.sessionStorage.removeItem(TOKEN_KEY)
    window.sessionStorage.removeItem(USER_KEY)
  } catch {}
}

export function getToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export async function apiFetch<T>(path: string, opts: RequestInit = {}, auth = true): Promise<T> {
  const headers = new Headers(opts.headers || {})
  headers.set("Content-Type", "application/json")
  if (auth) {
    const token = getToken()
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
  const res = await fetch(url, {
    ...opts,
    headers,
  })
  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try {
      const data = await res.json()
      msg = data?.message || data?.detail || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export async function loginReq(input: { email: string; password: string }) {
  return apiFetch<{ access_token: string; token_type: string; user: any }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify(input) },
    false,
  )
}

export async function registerReq(input: {
  email: string
  full_name: string
  password: string
  phone?: string
  role: Role
}) {
  return apiFetch<any>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    false,
  )
}

export async function meReq() {
  return apiFetch<{
    id: number
    email: string
    full_name: string
    phone: string
    role: Role
    loyalty_points: number
  }>("/api/auth/me")
}

export async function myBookingsReq() {
  return apiFetch<any[]>("/api/bookings/my-bookings")
}

export async function myEventsReq() {
  return apiFetch<any[]>("/api/events/my-events")
}
