/**
 * 인증 상태 관리 Store
 * 
 * 이 파일은 사용자 인증 상태를 관리하는 Zustand store를 정의합니다.
 * - 로그인/로그아웃 상태 관리
 * - 인증 토큰 관리
 * - 사용자 정보 관리 (username, name, userId)
 * - localStorage를 통한 상태 영속화
 * 
 * 주요 기능:
 * - login: 로그인 시 토큰과 사용자 정보 저장
 * - logout: 로그아웃 시 모든 상태 초기화
 * - loadFromStorage: 앱 시작 시 localStorage에서 인증 정보 복원
 * - setUserInfo: 사용자 정보 업데이트
 * - updateUserId: 사용자 ID 업데이트
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 인증 상태 인터페이스
 */
interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  username: string | null;
  name: string | null; // 사용자 이름
  userId: string | null; // 사용자 아이디 (username과 동일할 수 있음)
  
  // Actions
  login: (token: string, username: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
  setUserInfo: (name: string, userId: string) => void;
  updateUserId: (userId: string) => void;
}

/**
 * localStorage 키 상수
 * - STORAGE_KEY: Zustand persist 미들웨어에서 사용하는 키
 * - TOKEN_KEY: 인증 토큰을 저장하는 키
 */
const STORAGE_KEY = 'auth-storage';
const TOKEN_KEY = 'access_token';

/**
 * 인증 Store 생성
 * persist 미들웨어를 사용하여 상태를 localStorage에 자동 저장/복원합니다.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      username: null,
      name: null,
      userId: null,

      /**
       * 로그인 액션
       * 
       * @param token - 인증 토큰
       * @param username - 사용자 이름
       * 
       * 토큰을 localStorage에 'access_token' 키로 저장하고,
       * Zustand store의 상태를 업데이트합니다.
       */
      login: (token: string, username: string) => {
        set({
          isLoggedIn: true,
          token,
          username,
        });
        // localStorage에 "access_token" 키로 저장
        localStorage.setItem(TOKEN_KEY, token);
      },

      /**
       * 로그아웃 액션
       * 
       * 모든 인증 관련 상태를 초기화하고,
       * localStorage에서 토큰을 제거합니다.
       */
      logout: () => {
        set({
          isLoggedIn: false,
          token: null,
          username: null,
          name: null,
          userId: null,
        });
        // localStorage에서 token 제거
        localStorage.removeItem(TOKEN_KEY);
      },

      /**
       * 사용자 정보 설정 액션
       * 
       * @param name - 사용자 이름
       * @param userId - 사용자 ID
       * 
       * 회원가입 후 또는 프로필 조회 후 사용자 정보를 업데이트합니다.
       * username도 함께 업데이트됩니다.
       */
      setUserInfo: (name: string, userId: string) => {
        set((state) => ({
          ...state,
          name,
          userId,
          username: userId, // username도 함께 업데이트
        }));
      },

      /**
       * 사용자 ID 업데이트 액션
       * 
       * @param userId - 새로운 사용자 ID
       * 
       * 로그인 후 서버에서 받은 userId를 업데이트합니다.
       * username도 함께 업데이트됩니다.
       */
      updateUserId: (userId: string) => {
        set((state) => ({
          ...state,
          userId,
          username: userId, // username도 함께 업데이트
        }));
      },

      /**
       * localStorage에서 인증 정보 복원
       * 
       * 앱 시작 시 또는 새로고침 시 호출되어
       * localStorage에 저장된 인증 정보를 복원합니다.
       * 
       * 복원 로직:
       * 1. token과 store가 모두 있으면 복원
       * 2. token만 있고 store가 없으면 마이그레이션 시도
       * 3. 파싱 실패 시 모든 데이터 초기화
       */
      loadFromStorage: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (token && stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.state?.token && parsed.state?.username) {
              set({
                isLoggedIn: true,
                token: parsed.state.token,
                username: parsed.state.username,
                name: parsed.state.name || null,
                userId: parsed.state.userId || parsed.state.username || null,
              });
            }
          } catch (e) {
            // 파싱 실패 시 초기화
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(STORAGE_KEY);
          }
        } else if (token) {
          // token만 있고 store가 없는 경우 (마이그레이션)
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed.state?.username) {
                set({
                  isLoggedIn: true,
                  token: token,
                  username: parsed.state.username,
                  name: parsed.state.name || null,
                  userId: parsed.state.userId || parsed.state.username || null,
                });
              }
            } catch (e) {
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        }
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
