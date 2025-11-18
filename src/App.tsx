/**
 * 메인 App 컴포넌트
 * 
 * 이 파일은 애플리케이션의 최상위 컴포넌트로, 다음을 담당합니다:
 * - React Router를 통한 라우팅 설정
 * - React Query Provider 설정
 * - 앱 시작 시 인증 정보 복원
 * - 전역 Toast 알림 설정
 * - 페이지 전환 시 스크롤 위치 초기화
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useAuthStore } from './store/authStore';
import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { SearchResultsListPage } from './components/pages/SearchResultsListPage';
import { PaperDetailPage } from './components/pages/PaperDetailPage';
import { ServiceIntroPage } from './components/pages/ServiceIntroPage';
import { UserGuidePage } from './components/pages/UserGuidePage';
import { MyPage } from './components/pages/MyPage';
import { RecentlyViewedListPage } from './components/pages/RecentlyViewedListPage';
import { MyLibraryPage } from './components/pages/MyLibraryPage';
import { Toaster } from './components/ui/sonner';
import { ScrollToTop } from './components/ScrollToTop';

/**
 * AppContent 컴포넌트
 * 
 * 라우팅과 인증 정보 복원을 담당합니다.
 */
function AppContent() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  /**
   * 앱 마운트 시 실행
   * localStorage에서 인증 정보를 복원하여 새로고침 후에도 로그인 상태를 유지합니다.
   */
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <BrowserRouter>
      {/* 페이지 전환 시 스크롤 위치를 맨 위로 이동 */}
      <ScrollToTop />
      {/* 전역 Toast 알림 컴포넌트 */}
      <Toaster />
      <Routes>
        {/* 라우트 정의
            - /: 홈 페이지
            - /login: 로그인 페이지
            - /signup: 회원가입 페이지
            - /search: 검색 결과 페이지
            - /paper/:id: 논문 상세 페이지
            - /intro: 서비스 소개 페이지
            - /guide: 이용 가이드 페이지
            - /mypage: 마이페이지
            - /recent: 최근 본 논문 목록
            - /library: 내 서재 (북마크 목록)
        */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/search" element={<SearchResultsListPage />} />
        <Route path="/paper/:id" element={<PaperDetailPage />} />
        <Route path="/intro" element={<ServiceIntroPage />} />
        <Route path="/guide" element={<UserGuidePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/recent" element={<RecentlyViewedListPage />} />
        <Route path="/library" element={<MyLibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * App 컴포넌트
 * 
 * React Query Provider로 앱을 래핑하여
 * 모든 컴포넌트에서 React Query를 사용할 수 있도록 합니다.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
