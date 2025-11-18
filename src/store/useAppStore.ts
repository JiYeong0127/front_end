/**
 * 앱 전역 상태 관리 Store
 * 
 * 이 파일은 애플리케이션의 전역 상태를 관리하는 Zustand store를 정의합니다.
 * - 사용자 상태 (로그인 여부, 북마크 목록 등)
 * - 논문 관련 상태 (선택된 논문, 최근 조회한 논문 등)
 * - 검색 상태
 * 
 * 주의사항:
 * - authStore와는 별도로 관리되는 앱 전역 상태
 * - 북마크는 문자열 배열로 관리 (API와의 호환성을 위해)
 */

import { create } from 'zustand';
import { toast } from 'sonner';

/**
 * 앱 상태 인터페이스
 */
interface AppState {
  // User state
  isLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  bookmarkedPaperIds: string[];
  
  // Paper state
  selectedPaperId: string | null;
  recentlyViewedPaperIds: number[]; // 최근 조회한 논문 ID 목록
  
  // Search state
  searchQuery: string;
  
  // Actions
  login: (userName: string, userId: string) => void;
  logout: () => void;
  toggleBookmark: (paperId: number) => void;
  setSelectedPaper: (paperId: string | null) => void;
  setSearchQuery: (query: string) => void;
  addRecentlyViewedPaper: (paperId: number) => void;
  updateUser: (updates: Partial<Pick<AppState, 'userName' | 'userId'>>) => void;
}

/**
 * 초기 상태
 * 앱 시작 시 또는 로그아웃 시 사용되는 기본 상태값
 */
const initialState = {
  isLoggedIn: false,
  userId: null,
  userName: null,
  bookmarkedPaperIds: ['8', '9', '10', '11', '12', '13', '14'], // 초기 북마크 데이터 (string으로 변환)
  selectedPaperId: null,
  recentlyViewedPaperIds: [], // 최근 조회한 논문 ID 목록
  searchQuery: '',
};

/**
 * 앱 Store 생성
 * 전역 상태와 액션들을 정의합니다.
 */
export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  /**
   * 로그인 액션
   * 
   * @param userName - 사용자 이름
   * @param userId - 사용자 ID
   * 
   * 사용자 로그인 시 호출되어 앱 상태를 업데이트합니다.
   */
  login: (userName: string, userId: string) => {
    set({
      isLoggedIn: true,
      userName,
      userId,
    });
  },

  /**
   * 로그아웃 액션
   * 
   * 모든 앱 상태를 초기 상태로 리셋합니다.
   */
  logout: () => {
    set(initialState);
  },

  /**
   * 북마크 토글 액션
   * 
   * @param paperId - 논문 ID
   * 
   * 논문의 북마크 상태를 토글합니다.
   * - 로그인하지 않은 경우 에러 토스트 표시
   * - 이미 북마크된 경우 제거, 없으면 추가
   * - 성공 시 토스트 메시지 표시
   */
  toggleBookmark: (paperId: number) => {
    const paperIdStr = String(paperId);
    set((state) => {
      if (!state.isLoggedIn) {
        toast.error('로그인이 필요합니다', {
          description: '북마크 기능을 사용하려면 로그인해주세요.',
        });
        return state;
      }

      const isBookmarked = state.bookmarkedPaperIds.includes(paperIdStr);
      const newBookmarkedIds = isBookmarked
        ? state.bookmarkedPaperIds.filter((id) => id !== paperIdStr)
        : [...state.bookmarkedPaperIds, paperIdStr];

      toast.success(isBookmarked ? '북마크가 해제되었습니다' : '내 서재에 추가되었습니다');

      return {
        ...state,
        bookmarkedPaperIds: newBookmarkedIds,
      };
    });
  },

  /**
   * 선택된 논문 설정 액션
   * 
   * @param paperId - 선택된 논문 ID (null이면 선택 해제)
   */
  setSelectedPaper: (paperId: string | null) => {
    set({ selectedPaperId: paperId });
  },

  /**
   * 검색 쿼리 설정 액션
   * 
   * @param query - 검색어
   */
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  /**
   * 최근 조회한 논문 추가 액션
   * 
   * @param paperId - 조회한 논문 ID
   * 
   * 논문을 조회했을 때 호출되어 최근 조회 목록에 추가합니다.
   * - 이미 목록에 있으면 제거하고 맨 앞에 추가 (최신순 유지)
   * - 최대 10개까지만 유지
   */
  addRecentlyViewedPaper: (paperId: number) => {
    set((state) => {
      // 이미 목록에 있으면 제거하고 맨 앞에 추가 (최신순 유지)
      const filtered = state.recentlyViewedPaperIds.filter((id) => id !== paperId);
      const newList = [paperId, ...filtered].slice(0, 10); // 최대 10개만 유지
      
      return {
        ...state,
        recentlyViewedPaperIds: newList,
      };
    });
  },

  /**
   * 사용자 정보 업데이트 액션
   * 
   * @param updates - 업데이트할 사용자 정보 (userName, userId)
   * 
   * 사용자 정보를 부분적으로 업데이트합니다.
   */
  updateUser: (updates) => {
    set((state) => ({
      ...state,
      ...updates,
    }));
  },
}));

