import type { User } from '../types';

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const setAuth = (token: string, user: User, refreshToken?: string): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

