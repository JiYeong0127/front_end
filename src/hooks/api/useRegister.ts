/**
 * 회원가입 뮤테이션 훅
 * 
 * 이 파일은 회원가입 기능을 위한 React Query 뮤테이션 훅을 정의합니다.
 * - useRegisterMutation: 회원가입 API 호출 및 상태 업데이트
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { register } from '../../lib/api';
import { RegisterRequest, RegisterResponse } from '../../types/auth';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

/**
 * 회원가입 뮤테이션 훅
 * 
 * @returns React Query 뮤테이션 객체
 * 
 * 기능:
 * - 회원가입 API 호출 (POST /auth/register)
 * - 성공 시 authStore에 사용자 정보 저장
 * - 성공 시 로그인 페이지로 이동
 * - 401 에러 시 특별 메시지 표시 (관리자 전용 기능일 수 있음)
 * 
 * 주의사항:
 * - Authorization 헤더가 필요할 수 있음
 */
export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  return useMutation({
    mutationFn: (body: RegisterRequest): Promise<RegisterResponse> => register(body),
    onSuccess: (data, variables) => {
      // 회원가입 시 입력한 이름과 아이디를 store에 저장
      if (data.user) {
        setUserInfo(data.user.name, data.user.username);
      } else {
        // 응답에 user 정보가 없으면 요청에서 가져온 정보 사용
        setUserInfo(variables.name, variables.username);
      }
      toast.success('회원가입 성공');
      navigate('/login');
    },
    onError: (error: Error | AxiosError) => {
      // AxiosError인 경우 status 확인
      let errorMessage = error.message || '회원가입 중 오류가 발생했습니다.';
      let is401Error = false;

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const data = error.response.data as any;
        errorMessage = data?.message || data?.error || errorMessage;
        is401Error = status === 401;
      } else if (errorMessage.includes('401') || errorMessage.includes('권한')) {
        is401Error = true;
      }

      // 401 에러인 경우 특별 메시지
      if (is401Error) {
        toast.error('회원가입 권한이 없습니다', {
          description: '관리자 전용 기능일 수 있습니다. 로그인 후 다시 시도해주세요.',
        });
      } else {
        toast.error('회원가입 실패', {
          description: errorMessage,
        });
      }
    },
  });
};

