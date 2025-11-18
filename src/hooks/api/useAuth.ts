import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { api, endpoints, SignupRequest, SignupResponse, User } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '../useNavigation';
import { toast } from 'sonner';

// Signup mutation
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

  // 성공 시 처리
  useEffect(() => {
    if (mutation.data) {
      const data = mutation.data;
      // Store token
      localStorage.setItem('access_token', data.token);
      
      // Update Zustand store
      const username = data.user.name || '';
      if (data.token && username) {
        login(data.token, username);
      }
      
      // Update React Query cache
      queryClient.setQueryData(['currentUser'], data.user);
      
      toast.success('회원가입 성공');
      goToLogin();
    }
  }, [mutation.data, login, queryClient, goToLogin]);

  // 에러 처리
  useEffect(() => {
    if (mutation.error) {
      const error = mutation.error as unknown;
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
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

// Current user query
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

  // 성공 시 Zustand store 업데이트
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

  // 에러 처리
  useEffect(() => {
    if (query.error) {
      // Clear auth on error
      localStorage.removeItem('access_token');
      logout();
    }
  }, [query.error, logout]);

  return query;
}
