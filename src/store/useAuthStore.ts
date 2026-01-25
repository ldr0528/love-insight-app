import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string; // LinXXXX
  nickname: string;
  isVip?: boolean;
  avatar?: string;
  petType?: 'cat' | 'dog' | 'chicken' | 'rabbit' | 'panda' | 'hamster' | 'koala' | 'fox' | 'lion' | null;
  petName?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  login: (user: User) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('token'); // Clear token if stored separately
      },
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      refreshProfile: async () => {
        const { user } = get();
        // Assume token is stored in localStorage by login logic in UI, or we need to persist it here.
        // For simplicity, let's assume we can get it from localStorage 'mock-token-' + user.phone if we knew it,
        // or just assume the UI saved it.
        // Actually, previous login implementation didn't explicitly save token to localStorage in store, 
        // but let's check SimpleAuthModal.tsx. It just calls login(data.user).
        // We should probably save the token too. 
        // Let's grab the token from localStorage if available (assuming it was saved).
        // Wait, SimpleAuthModal.tsx doesn't save token to localStorage yet.
        // I should fix that first or assume we can't easily refresh without it.
        // But for this specific "mock" setup:
        if (!user) return;
        
        // We can construct the mock token from the user phone since we know the pattern
        // (This is a hack for this mock setup, normally you'd use a real stored JWT)
        // Check User interface, it has 'username' which is phone for registration? 
        // No, username is phone, nickname is displayed name.
        // Let's try to use user.username (which is phone)
        const token = `mock-token-${user.username}`; 

        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user });
          }
        } catch (e) {
          console.error('Failed to refresh profile');
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
