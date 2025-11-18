/**
 * React Query Client 설정
 * 
 * 이 파일은 React Query의 QueryClient 인스턴스를 생성하고 설정합니다.
 * - 기본 쿼리 옵션 설정 (retry, staleTime 등)
 * - 전역 에러 처리
 * - 캐시 관리 설정
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient 인스턴스 생성
 * 
 * 기본 설정:
 * - defaultOptions: 모든 쿼리와 뮤테이션에 적용되는 기본 옵션
 *   - queries: 쿼리 기본 옵션 (retry, refetchOnWindowFocus 등)
 *   - mutations: 뮤테이션 기본 옵션
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

