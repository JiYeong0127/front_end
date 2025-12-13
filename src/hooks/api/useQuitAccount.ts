/**
 * 회원 탈퇴 뮤테이션 훅
 * 
 * 이 파일은 회원 탈퇴 기능을 위한 React Query 뮤테이션 훅을 정의합니다.
 * - useQuitAccountMutation: 회원 탈퇴 API 호출 및 상태 초기화
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { quitAccount } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

/**
 * 회원 탈퇴 뮤테이션 훅
 * 
 * @returns React Query 뮤테이션 객체
 * 
 * 기능:
 * - DELETE /user/quit 엔드포인트 호출
 * - 성공 시 로컬 상태 초기화 및 홈으로 이동
 * - 에러 처리 포함
 */
export const useQuitAccountMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: quitAccount,
    onSuccess: () => {
      // 성공 시 로컬 상태 초기화 및 홈으로 이동
      logout();
      toast.success('회원 탈퇴가 완료되었습니다');
      navigate('/');
    },
    onError: (error) => {
      // 에러 메시지 추출 및 표시
      const errorMessage = error instanceof Error ? error.message : '회원 탈퇴 중 오류가 발생했습니다.';
      toast.error('회원 탈퇴 실패', {
        description: errorMessage,
      });
    },
  });
};

