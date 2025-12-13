/**
 * 앱 전역 상태 관리 Store
 * 
 * 기능: 사용자 상태, 논문 상태, 검색 상태 관리
 */
import { create } from 'zustand';
import { toast } from 'sonner';

interface AppState {
  isLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  bookmarkedPaperIds: string[];
  selectedPaperId: string | null;
  recentlyViewedPaperIds: number[];
  searchQuery: string;
  login: (userName: string, userId: string) => void;
  logout: () => void;
  toggleBookmark: (paperId: number) => void;
  setSelectedPaper: (paperId: string | null) => void;
  setSearchQuery: (query: string) => void;
  addRecentlyViewedPaper: (paperId: number) => void;
  updateUser: (updates: Partial<Pick<AppState, 'userName' | 'userId'>>) => void;
}

const initialState = {
  isLoggedIn: false,
  userId: null,
  userName: null,
  bookmarkedPaperIds: [],
  selectedPaperId: null,
  recentlyViewedPaperIds: [],
  searchQuery: '',
};
export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  login: (userName: string, userId: string) => {
    set({
      isLoggedIn: true,
      userName,
      userId,
    });
  },

  logout: () => {
    set(initialState);
  },

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

  setSelectedPaper: (paperId: string | null) => {
    set({ selectedPaperId: paperId });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  addRecentlyViewedPaper: (paperId: number) => {
    set((state) => {
      const filtered = state.recentlyViewedPaperIds.filter((id) => id !== paperId);
      const newList = [paperId, ...filtered].slice(0, 10);
      
      return {
        ...state,
        recentlyViewedPaperIds: newList,
      };
    });
  },

  updateUser: (updates) => {
    set((state) => ({
      ...state,
      ...updates,
    }));
  },
}));

