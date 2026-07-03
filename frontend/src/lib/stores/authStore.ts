import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  personId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nationality?: string;
  passengerProfile?: any;
  employeeProfile?: any;
  role?: string;
}

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user?: UserProfile) => void;
  setUser: (user: UserProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set((state) => ({ 
        accessToken: token, 
        isAuthenticated: true,
        user: user || state.user
      })),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'aeronova-auth-storage',
    }
  )
);
