/**
 * 인증 상태 관리 Store
 * 
 * 기능: 로그인/로그아웃, 토큰, 사용자 정보 관리 및 localStorage 영속화
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  username: string | null;
  name: string | null;
  userId: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
  setUserInfo: (name: string, userId: string) => void;
  updateUserId: (userId: string) => void;
}

const STORAGE_KEY = 'auth-storage';
const TOKEN_KEY = 'access_token';
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      username: null,
      name: null,
      userId: null,

      login: (token: string, username: string) => {
        set({
          isLoggedIn: true,
          token,
          username,
        });
        localStorage.setItem(TOKEN_KEY, token);
      },

      logout: () => {
        set({
          isLoggedIn: false,
          token: null,
          username: null,
          name: null,
          userId: null,
        });
        localStorage.removeItem(TOKEN_KEY);
      },

      setUserInfo: (name: string, userId: string) => {
        set((state) => ({
          ...state,
          name,
          userId,
          username: userId,
        }));
      },

      updateUserId: (userId: string) => {
        set((state) => ({
          ...state,
          userId,
          username: userId,
        }));
      },

      loadFromStorage: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (!token || !stored) {
          return;
        }

        try {
          const parsed = JSON.parse(stored);
          const state = parsed.state;
          
          if (state?.username) {
            set({
              isLoggedIn: true,
              token: state.token || token,
              username: state.username,
              name: state.name || null,
              userId: state.userId || state.username || null,
            });
          }
        } catch (e) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(STORAGE_KEY);
        }
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
