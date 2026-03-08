import { create } from 'zustand';
import { getToken, removeToken, setToken } from './api-client';

export interface AuthUser {
  id: string;
  role: 'admin' | 'member';
  fullName: string | null;
  email: string | null;
  phone: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  login: (user, token) => {
    setToken(token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  hydrate: () => {
    const token = getToken();
    if (token) {
      set({ token, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },
}));
