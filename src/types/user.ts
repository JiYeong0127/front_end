/**
 * 사용자 관련 타입 정의
 * 
 * 기능: 사용자 상태 및 액션 타입 정의
 */

export interface UserState {
  isLoggedIn: boolean;
  userName: string;
  userId: string;
  bookmarkedPaperIds: number[];
}

export interface UserActions {
  toggleBookmark: (paperId: number) => void;
  login: (userName: string, userId: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserState>) => void;
}

