import { jwtDecode } from 'jwt-decode';

// 1 day expiration
export const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('tokenTimestamp', Date.now().toString());
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  const timestamp = localStorage.getItem('tokenTimestamp');

  if (!token || !timestamp) {
    return null;
  }

  if (Date.now() - Number(timestamp) > TOKEN_EXPIRY_TIME) {
    clearToken();
    return null;
  }

  return token;
};

export const clearToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenTimestamp');
};

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    // JWT expiration time from server
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Add new function to get expiration time from token
export const getTokenExpirationTime = (token: string): number => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : Date.now() + TOKEN_EXPIRY_TIME;
  } catch {
    return Date.now() + TOKEN_EXPIRY_TIME;
  }
};
