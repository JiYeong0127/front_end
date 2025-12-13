import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { api, endpoints, SignupRequest, SignupResponse, User } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '../useNavigation';
import { toast } from 'sonner';

/**
 * 회원가입 뮤테이션 훅
 * 
 * @returns React Query 뮤테이션 객체
 * 
 * 기능:
 * - POST /auth/signup 엔드포인트 호출
 * - 성공 시 토큰을 localStorage에 저장
 * - authStore에 사용자 정보 저장
 * - React Query 캐시 업데이트
 * - 성공 시 로그인 페이지로 이동
 */
export function useSignupMutation() {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);
  const { goToLogin } = useNavigation();

  const mutation = useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: async (data: SignupRequest): Promise<SignupResponse> => {
      const response = await api.post<SignupResponse>(endpoints.auth.signup, data);
      return response.data;
    },
  });

  /**
   * 회원가입 성공 시 처리
   * 토큰 저장, 상태 업데이트, 캐시 갱신
   */
  useEffect(() => {
    if (mutation.data) {
      const data = mutation.data;
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('access_token', data.token);
      
      // Zustand store에 사용자 정보 저장
      const username = data.user.name || '';
      if (data.token && username) {
        login(data.token, username);
      }
      
      // React Query 캐시 업데이트
      queryClient.setQueryData(['currentUser'], data.user);
      
      toast.success('회원가입 성공');
      goToLogin();
    }
  }, [mutation.data, login, queryClient, goToLogin]);

  /**
   * 회원가입 에러 처리
   * API 에러 메시지를 추출하여 사용자에게 표시
   */
  useEffect(() => {
    if (mutation.error) {
      const error = mutation.error as unknown;
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
      // Axios 에러인 경우 응답 데이터에서 메시지 추출
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        const data = axiosError.response?.data as any;
        errorMessage = data?.message || errorMessage;
      }
      
      toast.error('회원가입 실패', {
        description: errorMessage,
      });
    }
  }, [mutation.error]);

  return mutation;
}

/**
 * 현재 사용자 정보 조회 쿼리 훅
 * 
 * @returns React Query 쿼리 객체
 * 
 * 기능:
 * - GET /auth/current-user 엔드포인트 호출
 * - 로그인 상태이고 토큰이 있을 때만 활성화
 * - 성공 시 authStore에 사용자 정보 저장
 * - 에러 시 인증 정보 초기화
 */
export function useCurrentUserQuery() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const query = useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      const response = await api.get<User>(endpoints.auth.currentUser);
      return response.data;
    },
    enabled: isLoggedIn && !!localStorage.getItem('access_token'),
  });

  /**
   * 쿼리 성공 시 Zustand store 업데이트
   * 사용자 정보를 authStore에 저장
   */
  useEffect(() => {
    if (query.data) {
      const data = query.data;
      const username = data.name || data.username || '';
      const token = localStorage.getItem('access_token');
      if (token && username) {
        login(token, username);
      }
    }
  }, [query.data, login]);

  /**
   * 쿼리 에러 처리
   * 에러 발생 시 인증 정보 초기화
   */
  useEffect(() => {
    if (query.error) {
      // 에러 발생 시 인증 정보 초기화
      localStorage.removeItem('access_token');
      logout();
    }
  }, [query.error, logout]);

  return query;
}
