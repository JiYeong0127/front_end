/**
 * 로그아웃 뮤테이션 훅
 * 
 * 이 파일은 로그아웃 기능을 위한 React Query 뮤테이션 훅을 정의합니다.
 * - useLogoutMutation: 로그아웃 API 호출 및 상태 초기화
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

/**
 * 로그아웃 뮤테이션 훅
 * 
 * @returns React Query 뮤테이션 객체
 * 
 * 기능:
 * - POST /auth/logout 엔드포인트 호출
 * - 성공/실패 여부와 관계없이 로컬 상태 초기화
 * - 홈 페이지로 이동
 */
export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      // 성공 시 로컬 상태 초기화 및 홈으로 이동
      logout();
      navigate('/');
    },
    onError: () => {
      // 에러 발생 시에도 로컬 상태 초기화 및 홈으로 이동
      // (서버 통신 실패해도 클라이언트에서는 로그아웃 처리)
      logout();
      navigate('/');
    },
  });
};
