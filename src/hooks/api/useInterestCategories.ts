/**
 * 관심 카테고리 관련 React Query 훅
 * 
 * 이 파일은 관심 카테고리 조회, 추가 및 삭제를 위한 React Query 훅을 정의합니다.
 * - useInterestCategories: 관심 카테고리 조회 쿼리
 * - useAddInterestCategories: 관심 카테고리 추가 mutation
 * - useDeleteInterestCategory: 관심 카테고리 삭제 mutation
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addInterestCategories, deleteInterestCategory, getInterestCategories, UserInterestsResponse } from '../../lib/api';
import { toast } from 'sonner';

/**
 * 관심 카테고리 조회 쿼리 훅
 * 
 * API 명세:
 * - Method: GET
 * - URL: /user-interests
 * - Body: none (없음)
 * - Auth: Bearer 토큰 필요 (inherit)
 * 
 * @returns React Query 쿼리 객체
 * 
 * 기능:
 * - GET /user-interests 엔드포인트 호출
 * - 성공 시 관심 카테고리 코드 배열 반환
 * - 응답: { "category_codes": string[] }
 * - staleTime: 5분 (5분 동안 캐시된 데이터 사용)
 * - retry: 1 (실패 시 1번만 재시도)
 */
export const useInterestCategories = () => {
  return useQuery<UserInterestsResponse, Error>({
    queryKey: ['interestCategories'],
    queryFn: async (): Promise<UserInterestsResponse> => {
      return getInterestCategories();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // 실패 시 1번만 재시도
  });
};

/**
 * 관심 카테고리 추가 mutation 훅
 * 
 * @returns React Query mutation 객체
 * 
 * 기능:
 * - POST /user-interests 엔드포인트 호출
 * - 성공 시 관련 쿼리 캐시 무효화 (선택사항)
 * - 에러 처리 포함
 */
export const useAddInterestCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category_codes: string[]) => addInterestCategories(category_codes),
    onSuccess: () => {
      // 성공 시 관심 카테고리 조회 쿼리 캐시 무효화 및 재조회
      queryClient.invalidateQueries({ queryKey: ['interestCategories'] });
      queryClient.refetchQueries({ queryKey: ['interestCategories'] });
      toast.success('카테고리가 추가되었습니다.');
    },
    onError: (error: Error) => {
      const errorMessage = error instanceof Error ? error.message : '추가에 실패했습니다.';
      toast.error(errorMessage);
    },
  });
};

/**
 * 관심 카테고리 삭제 mutation 훅
 * 
 * @returns React Query mutation 객체
 * 
 * 기능:
 * - DELETE /user-interests?codes={code} 엔드포인트 호출
 * - 성공 시 관련 쿼리 캐시 무효화
 * - 에러 처리 포함
 */
export const useDeleteInterestCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => deleteInterestCategory(code),
    onSuccess: () => {
      // 성공 시 관심 카테고리 조회 쿼리 캐시 무효화 및 재조회
      queryClient.invalidateQueries({ queryKey: ['interestCategories'] });
      queryClient.refetchQueries({ queryKey: ['interestCategories'] });
    },
    onError: (error: Error) => {
      const errorMessage = error instanceof Error ? error.message : '삭제에 실패했습니다.';
      toast.error(errorMessage);
    },
  });
};

