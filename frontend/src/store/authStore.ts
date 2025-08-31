import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'organizer' | 'attendee';
  phone?: string;
  is_active: boolean;
  loyalty_points: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setToken: (token: string) => set({ token }),
      setUser: (user: User) => set({ user }),
      login: async (email: string, password: string) => {
        try {
          const response = await authAPI.login({ email, password });
          const { access_token, user } = response.data;
          set({ token: access_token, user });
          localStorage.setItem('token', access_token);
        } catch (error) {
          throw error;
        }
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
