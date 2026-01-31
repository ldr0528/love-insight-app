import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import request from '@/utils/request';

export type PetType = 'cat' | 'dog' | 'chicken' | 'rabbit' | 'hamster' | 'fox';

interface User {
  id: string;
  username: string; // LinXXXX
  phone?: string;
  nickname: string;
  isVip?: boolean;
  avatar?: string;
  petType?: PetType | null;
  petName?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token'); // Clear token if stored separately
      },
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      refreshProfile: async () => {
        const { user, token } = get();
        if (!user || !token) return;

        try {
          // Use centralized request utility
          const data = await request<{ success: boolean; user: User; error?: string }>('/api/auth/me');
          
          if (data.success) {
            set({ user: data.user });
          }
        } catch (e) {
          console.error('Failed to refresh profile', e);
          // If 401, request.ts already called logout()
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
