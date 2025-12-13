/**
 * 사용자 프로필 조회 쿼리 훅
 * 
 * 이 파일은 사용자 프로필 정보를 조회하는 React Query 쿼리 훅을 정의합니다.
 * - useMyProfileQuery: 내 프로필 정보 조회
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { fetchMyProfile } from '../../lib/api';
import { UserProfile } from '../../types/auth';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

/**
 * 사용자 프로필 조회 쿼리 훅
 * 
 * @returns React Query 쿼리 객체
 * 
 * 기능:
 * - GET /user/profile 엔드포인트 호출
 * - 로그인 상태일 때만 활성화
 * - 성공 시 authStore에 사용자 정보 저장
 * - 401 에러 시 로그아웃 처리 및 로그인 페이지로 이동
 * - staleTime: 5분 (5분 동안 캐시된 데이터 사용)
 */
export const useMyProfileQuery = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const logout = useAuthStore((state) => state.logout);

  const query = useQuery<UserProfile, Error>({
    queryKey: ['myProfile'],
    queryFn: async (): Promise<UserProfile> => {
      return fetchMyProfile();
    },
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  });

  /**
   * 쿼리 성공 시 사용자 정보를 authStore에 저장
   */
  useEffect(() => {
    if (query.data) {
      setUserInfo(query.data.name, query.data.username);
    }
  }, [query.data, setUserInfo]);

  /**
   * 쿼리 에러 처리
   * 401 에러(인증 실패) 시 로그아웃 처리 및 로그인 페이지로 이동
   */
  useEffect(() => {
    if (query.error) {
      const error = query.error as unknown;
      
      // 401 에러인 경우 (인증 실패)
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          logout();
          toast.error('로그인이 필요합니다', {
            description: '세션이 만료되었습니다. 다시 로그인해주세요.',
          });
          navigate('/login');
          return;
        }
      }
      
      // 기타 에러 처리
      const errorMessage = error instanceof Error ? error.message : '다시 시도해주세요.';
      toast.error('사용자 정보를 불러오는 중 오류가 발생했습니다', {
        description: errorMessage,
      });
    }
  }, [query.error, logout, navigate]);

  return query;
};
