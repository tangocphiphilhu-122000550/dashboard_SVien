// Token storage abstraction
// Toggle USE_HTTPONLY_COOKIE to true when backend supports httpOnly cookie flow.
const USE_HTTPONLY_COOKIE = false;

const ACCESS_TOKEN_KEYS = ['access_token', 'auth_access_token', 'token'];

export const setUseHttpOnlyCookie = (value) => {
  // This flag is only client-side guidance. Server must implement cookie set endpoints.
  // For now it's a no-op because switching to httpOnly requires backend changes.
  // We expose it so devs can flip during migration testing.
  // eslint-disable-next-line no-console
  console.info('tokenStorage: setUseHttpOnlyCookie ->', value);
};

export const getStoredAccessToken = () => {
  if (typeof window === 'undefined') return '';
  if (USE_HTTPONLY_COOKIE) {
    // httpOnly cookies are not accessible from JS. The backend should provide session-check endpoints.
    return '';
  }

  for (const key of ACCESS_TOKEN_KEYS) {
    const v = window.localStorage.getItem(key);
    if (v) return v;
  }

  return '';
};

export const persistAccessToken = (token) => {
  if (typeof window === 'undefined') return;
  if (USE_HTTPONLY_COOKIE) {
    // Placeholder: to use httpOnly cookies, the frontend should call a backend endpoint that sets the cookie
    // e.g. await fetch('/api/auth/set-cookie', { method: 'POST', credentials: 'include' });
    return;
  }

  window.localStorage.setItem('access_token', token);
};

export const clearAccessToken = () => {
  if (typeof window === 'undefined') return;
  ACCESS_TOKEN_KEYS.forEach((k) => window.localStorage.removeItem(k));
};
