/**
 * 논문 관련 React Query 훅
 * 
 * 이 파일은 논문 검색, 상세 조회, 북마크 관련 React Query 훅을 정의합니다.
 * - useSearchPapersQuery: 논문 검색 쿼리
 * - usePaperDetailQuery: 논문 상세 조회 쿼리
 * - useBookmarksQuery: 북마크 목록 조회 쿼리
 * - useToggleBookmarkMutation: 북마크 토글 뮤테이션
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, endpoints, Paper, SearchPapersResponse, BookmarkResponse } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'sonner';

/**
 * 논문 검색 쿼리 훅
 * 
 * @param query - 검색어
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 * @returns React Query 쿼리 객체
 * 
 * 기능:
 * - GET /papers/search?q={query} 엔드포인트 호출
 * - 검색어가 비어있으면 쿼리 비활성화
 * - staleTime: 2분 (2분 동안 캐시된 데이터 사용)
 */
export function useSearchPapersQuery(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['papers', 'search', query],
    queryFn: async (): Promise<SearchPapersResponse> => {
      const response = await api.get<SearchPapersResponse>(endpoints.papers.search, {
        params: { q: query },
      });
      return response.data;
    },
    enabled: enabled && !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * 논문 상세 조회 쿼리 훅
 * 
 * @param paperId - 논문 ID
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 * @returns React Query 쿼리 객체
 * 
 * 기능:
 * - GET /papers/{id} 엔드포인트 호출
 * - paperId가 없으면 쿼리 비활성화
 * - staleTime: 5분 (5분 동안 캐시된 데이터 사용)
 */
export function usePaperDetailQuery(paperId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['papers', 'detail', paperId],
    queryFn: async (): Promise<Paper> => {
      const response = await api.get<Paper>(endpoints.papers.detail(paperId));
      return response.data;
    },
    enabled: enabled && !!paperId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * 북마크 목록 조회 쿼리 훅
 * 
 * @returns React Query 쿼리 객체
 * 
 * 기능:
 * - GET /papers/bookmarks 엔드포인트 호출
 * - 로그인하지 않은 경우 쿼리 비활성화
 * - staleTime: 1분 (1분 동안 캐시된 데이터 사용)
 */
export function useBookmarksQuery() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['papers', 'bookmarks'],
    queryFn: async (): Promise<Paper[]> => {
      const response = await api.get<Paper[]>(endpoints.papers.bookmarks);
      return response.data;
    },
    enabled: isLoggedIn,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * 북마크 토글 뮤테이션 훅
 * 
 * @returns React Query 뮤테이션 객체
 * 
 * 기능:
 * - POST /papers/{id}/bookmark 엔드포인트 호출
 * - Optimistic Update: 서버 응답 전에 UI 업데이트
 * - 성공 시 관련 쿼리 무효화 (bookmarks, detail, search)
 * - 실패 시 이전 상태로 롤백
 * - Zustand store의 toggleBookmark 액션 호출
 * 
 * 주의사항:
 * - 로그인하지 않은 경우 에러 토스트 표시 및 요청 중단
 */
export function useToggleBookmarkMutation() {
  const queryClient = useQueryClient();
  const toggleBookmark = useAppStore((state) => state.toggleBookmark);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useMutation({
    mutationFn: async (paperId: number): Promise<BookmarkResponse> => {
      const response = await api.post<BookmarkResponse>(endpoints.papers.toggleBookmark(paperId));
      return response.data;
    },
    /**
     * 뮤테이션 실행 전 (Optimistic Update)
     * 
     * 서버 응답을 기다리지 않고 즉시 UI를 업데이트하여
     * 사용자 경험을 향상시킵니다.
     */
    onMutate: async (paperId: number) => {
      if (!isLoggedIn) {
        toast.error('로그인이 필요합니다', {
          description: '북마크 기능을 사용하려면 로그인해주세요.',
        });
        throw new Error('Not logged in');
      }

      // 진행 중인 북마크 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['papers', 'bookmarks'] });
      
      // 이전 북마크 목록 가져오기 (롤백용)
      const previousBookmarks = queryClient.getQueryData<Paper[]>(['papers', 'bookmarks']);
      
      // Optimistic Update: 즉시 UI 업데이트
      if (previousBookmarks) {
        const isBookmarked = previousBookmarks.some(p => p.id === paperId);
        const newBookmarks = isBookmarked
          ? previousBookmarks.filter(p => p.id !== paperId)
          : [...previousBookmarks, { id: paperId } as Paper];
        
        queryClient.setQueryData(['papers', 'bookmarks'], newBookmarks);
      }

      // 롤백을 위한 이전 상태 반환
      return { previousBookmarks };
    },
    /**
     * 뮤테이션 성공 시
     * 
     * - Zustand store 업데이트
     * - 관련 쿼리 무효화하여 최신 데이터로 갱신
     */
    onSuccess: (_data, paperId) => {
      // Zustand store 업데이트
      toggleBookmark(paperId);
      
      // 관련 쿼리 무효화 (최신 데이터로 갱신)
      queryClient.invalidateQueries({ queryKey: ['papers', 'bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['papers', 'detail', paperId] });
      queryClient.invalidateQueries({ queryKey: ['papers', 'search'] });
    },
    /**
     * 뮤테이션 실패 시
     * 
     * Optimistic Update로 변경한 UI를 이전 상태로 롤백합니다.
     */
    onError: (_error, _paperId, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousBookmarks) {
        queryClient.setQueryData(['papers', 'bookmarks'], context.previousBookmarks);
      }
      
      toast.error('북마크 처리 실패', {
        description: '다시 시도해주세요.',
      });
    },
  });
}
