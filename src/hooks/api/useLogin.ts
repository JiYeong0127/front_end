/**
 * 로그인 뮤테이션 훅
 * 
 * 이 파일은 로그인 기능을 위한 React Query 뮤테이션 훅을 정의합니다.
 * - useLoginMutation: 로그인 API 호출 및 상태 업데이트
 */

import { useMutation } from '@tanstack/react-query';
import { login } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

/**
 * 로그인 뮤테이션 훅
 * 
 * @returns React Query 뮤테이션 객체
 * 
 * 기능:
 * - 로그인 API 호출 (POST /auth/login)
 * - 성공 시 authStore에 토큰과 사용자 정보 저장
 * - userId 업데이트
 * 
 * 사용 예시:
 * ```tsx
 * const { mutate: handleLogin, isPending } = useLoginMutation();
 * handleLogin({ username: 'user', password: 'pass' });
 * ```
 */
export const useLoginMutation = () => {
  const store = useAuthStore();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      store.login(data.access_token, data.username);
      // 로그인 시 username을 userId로도 설정 (name은 서버에서 가져와야 함)
      if (data.username) {
        store.updateUserId(data.username);
      }
    },
  });
};
