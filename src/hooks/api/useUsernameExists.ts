/**
 * 아이디 중복 확인 쿼리 훅
 * 
 * 이 파일은 아이디 중복 확인을 위한 React Query 쿼리 훅을 정의합니다.
 * - useUsernameExistsQuery: 아이디 존재 여부 확인
 */

import { useQuery } from '@tanstack/react-query';
import { checkUsernameExists } from '../../lib/api';

/**
 * 아이디 중복 확인 쿼리 훅
 * 
 * @param username - 확인할 아이디
 * @param enabled - 쿼리 활성화 여부 (username이 있을 때만 true로 설정)
 * @returns React Query 쿼리 객체
 * 
 * 기능:
 * - GET /auth/username-exists?username={username} 엔드포인트 호출
 * - enabled가 false이면 쿼리 비활성화
 * - staleTime: 30초 (30초 동안 캐시된 데이터 사용)
 * 
 * 사용 예시:
 * ```tsx
 * const { data: exists, isLoading } = useUsernameExistsQuery(username, username.length > 0);
 * // exists === true: 이미 사용 중인 아이디
 * // exists === false: 사용 가능한 아이디
 * ```
 */
export const useUsernameExistsQuery = (username: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['username-exists', username],
    queryFn: () => checkUsernameExists(username),
    enabled, // username이 있을 때만 실행되도록
    staleTime: 30 * 1000, // 30초 캐싱
  });
};

