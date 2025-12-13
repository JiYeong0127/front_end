/**
 * 네비게이션 관련 타입 정의
 * 
 * 기능: 페이지 라우팅 및 네비게이션 핸들러 타입 정의
 */

export type Page = 
  | 'home' 
  | 'login' 
  | 'signup' 
  | 'search-list' 
  | 'paper-detail' 
  | 'service-intro' 
  | 'user-guide' 
  | 'mypage' 
  | 'recent-papers' 
  | 'my-library';

export interface NavigationHandlers {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onNavigateToHome: () => void;
  onNavigateToService: () => void;
  onNavigateToGuide: () => void;
  onNavigateToMyPage: () => void;
  onNavigateToRecentPapers: () => void;
  onNavigateToMyLibrary: () => void;
  onLogout: () => void;
}

export interface NavigationParams {
  paperId?: number;
  searchQuery?: string;
  [key: string]: unknown;
}

