/**
 * 논문 관련 사용자 액션(클릭, 북마크)을 처리하는 커스텀 훅
 */

import { useAuthStore } from '../store/authStore';
import { useNavigation } from './useNavigation';
import { useAddBookmarkMutation, useDeleteBookmarkMutation, useBookmarksQuery } from './api';
import { recordRecommendationClick } from '../lib/api';
import { toast } from 'sonner';

/**
 * 논문 액션 핸들러 및 상태를 제공하는 훅
 * 
 * 기능: 논문 클릭 처리, 북마크 토글 처리, 로그인 상태 제공
 */
export function usePaperActions() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { goToPaper, goToLogin } = useNavigation();
  const addBookmarkMutation = useAddBookmarkMutation();
  const deleteBookmarkMutation = useDeleteBookmarkMutation();
  const { data: bookmarks = [] } = useBookmarksQuery();

  /**
   * 논문 클릭 핸들러
   * 
   * 기능: 로그인 확인 후 논문 상세 페이지로 이동, 추천 논문인 경우 클릭 기록
   */
  const handlePaperClick = (paperId: number | string, recommendationId?: string) => {
    if (!isLoggedIn) {
      goToLogin();
      return;
    }
    
    if (recommendationId) {
      recordRecommendationClick(recommendationId).catch(() => {
        // 클릭 기록 실패는 조용히 처리
      });
    }
    
    goToPaper(paperId);
  };

  /**
   * 북마크 토글 핸들러
   * 
   * 기능: 로그인 확인 후 북마크 상태에 따라 추가 또는 삭제
   */
  const handleBookmark = (paperId: number | string, notes?: string) => {
    if (!isLoggedIn) {
      toast.error('로그인이 필요합니다', {
        description: '북마크 기능을 사용하려면 로그인해주세요.',
      });
      goToLogin();
      return;
    }
    
    const paperIdString = typeof paperId === 'string' ? paperId.trim() : String(paperId);
    
    if (!paperIdString || paperIdString === '') {
      toast.error('유효하지 않은 논문 ID입니다.');
      return;
    }
    
    const bookmark = bookmarks.find(b => {
      const bookmarkPaperId = b.paper_id || (b.paper?.id ? String(b.paper.id) : null);
      return bookmarkPaperId === paperIdString;
    });
    
    if (bookmark) {
      if (bookmark.id) {
        deleteBookmarkMutation.mutate(bookmark.id);
      } else {
        toast.error('북마크 ID를 찾을 수 없습니다.');
      }
    } else {
      addBookmarkMutation.mutate({ paperId: paperIdString, notes });
    }
  };

  return {
    handlePaperClick,
    handleBookmark,
    isLoggedIn,
  };
}
