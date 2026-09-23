// Shared helpers so the backend URL and token handling live in ONE place.
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Decode the payload of a JWT (no verification: the server does that).
// Returns null if the token is malformed or already expired.
export function parseToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(json);
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload; // { id, username, iat, exp }
  } catch (e) {
    return null;
  }
}
