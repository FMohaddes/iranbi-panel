import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { STORAGE_KEY,REFRESH_KEY } from './constant';

// ----------------------------------------------------------------------

export function jwtDecode(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(() => {
    try {
      alert('توکن منقضی شده است.');
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = paths.auth.jwt.signIn;
    } catch (error) {
      console.error('Error during token expiration:', error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------
let isTokenExpiryTimerSet = false; // Add a flag to track if the timer is already set

export async function setSession(accessToken, refreshToken) {
  try {
    if (accessToken) {
      localStorage.setItem(STORAGE_KEY, accessToken);
      localStorage.setItem(REFRESH_KEY, refreshToken);

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      const decodedToken = jwtDecode(accessToken);

      if (decodedToken && 'exp' in decodedToken) {
        if (!isTokenExpiryTimerSet) { // Only set the timer if it hasn't been set already
          tokenExpired(decodedToken.exp);
          isTokenExpiryTimerSet = true; // Mark the timer as set
        }
      } else {
        throw new Error('توکن نامعتبر!');
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(REFRESH_KEY);
      delete axios.defaults.headers.common.Authorization;
      isTokenExpiryTimerSet = false; // Reset the flag when the token is removed
    }
  } catch (error) {
    console.error('ارور در حین ساخت:', error);
    throw error;
  }
}
