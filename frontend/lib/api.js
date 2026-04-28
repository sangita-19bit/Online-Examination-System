/**
 * Central API utility
 * - Base URL is read from NEXT_PUBLIC_API_URL (set in .env.local / Vercel env vars)
 * - JWT is stored in a browser cookie (js-accessible, not httpOnly so the
 *   client can read it; if you want httpOnly you need a Next.js API Route proxy)
 * - Every request automatically includes the JWT in the Authorization header
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Cookie helpers ────────────────────────────────────────────────────────────

const COOKIE_NAME = "auth_token";
const USERNAME_COOKIE = "auth_username";

/**
 * Save JWT + username into cookies after a successful login/register.
 * @param {string} token  - JWT returned by the backend
 * @param {string} username - username returned by the backend
 */
export function setAuthCookies(token, username) {
  // 7-day expiry, SameSite=Lax so it works cross-origin on Vercel → Render
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${token}; expires=${expires}; path=/; SameSite=Lax`;
  document.cookie = `${USERNAME_COOKIE}=${username}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Read a cookie value by name.
 * @param {string} name
 * @returns {string|null}
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null; // SSR guard
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

/** Return the stored JWT token (or null if not logged in). */
export function getToken() {
  return getCookie(COOKIE_NAME);
}

/** Return the stored username (or null if not logged in). */
export function getUsername() {
  return getCookie(USERNAME_COOKIE);
}

/** Remove auth cookies (logout). */
export function clearAuthCookies() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  document.cookie = `${USERNAME_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

/** Returns true when the user has a valid token cookie. */
export function isAuthenticated() {
  return Boolean(getToken());
}

// ─── Fetch wrapper ─────────────────────────────────────────────────────────────

/**
 * Wrapper around fetch() that:
 *  1. Prepends the base API URL
 *  2. Attaches the JWT as `Authorization: Bearer <token>` if present
 *  3. Defaults Content-Type to application/json
 *
 * @param {string} path      - e.g. "/api/exams"
 * @param {RequestInit} opts - standard fetch options (method, body, headers…)
 * @returns {Promise<Response>}
 */
export async function apiFetch(path, opts = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };

  return fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
    // credentials: "include" lets the browser also send/receive cookies to the
    // backend domain (useful if the backend sets its own httpOnly cookies)
    credentials: "include",
  });
}
