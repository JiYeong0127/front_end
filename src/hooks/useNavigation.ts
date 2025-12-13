/**
 * 네비게이션 커스텀 훅
 * 
 * 이 파일은 React Router의 네비게이션 기능을 래핑한 커스텀 훅을 제공합니다.
 * 페이지 이동을 위한 편의 함수들을 제공합니다.
 */

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

/**
 * 네비게이션 훅
 * 
 * @returns 네비게이션 관련 함수 및 유틸리티 객체
 * 
 * 제공하는 기능:
 * - navigate: React Router의 navigate 함수
 * - params: 현재 라우트 파라미터
 * - searchParams: 현재 URL 쿼리 파라미터
 * - goToLogin: 로그인 페이지로 이동
 * - goToSignup: 회원가입 페이지로 이동
 * - goToHome: 홈 페이지로 이동 (새로고침 포함)
 * - goToService: 서비스 소개 페이지로 이동
 * - goToGuide: 사용자 가이드 페이지로 이동
 * - goToMyPage: 마이페이지로 이동
 * - goToRecentPapers: 최근 조회 논문 페이지로 이동
 * - goToMyLibrary: 내 서재 페이지로 이동
 * - goToQuitAccount: 회원 탈퇴 페이지로 이동
 * - goToPaper: 논문 상세 페이지로 이동
 * - goToSearch: 검색 결과 페이지로 이동
 * - goToCategorySearch: 카테고리 검색 결과 페이지로 이동
 * - goBack: 이전 페이지로 이동
 */
export function useNavigation() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  return {
    // React Router 기본 함수들
    navigate,
    params,
    searchParams,
    
    // 인증 관련 페이지 이동
    goToLogin: () => navigate('/login'),
    goToSignup: () => navigate('/signup'),
    
    // 홈 페이지로 이동 (새로고침 포함)
    goToHome: () => {
      window.location.href = '/';
    },
    
    // 정보 페이지 이동
    goToService: () => navigate('/intro'),
    goToGuide: () => navigate('/guide'),
    
    // 사용자 페이지 이동
    goToMyPage: () => navigate('/mypage'),
    goToRecentPapers: () => navigate('/recent'),
    goToMyLibrary: () => navigate('/library'),
    goToQuitAccount: () => navigate('/quit'),
    
    // 논문 관련 페이지 이동
    goToPaper: (paperId: string | number) => navigate(`/paper/${paperId}`),
    
    // 검색 관련 페이지 이동
    goToSearch: (query: string) => navigate(`/search?q=${encodeURIComponent(query)}`),
    goToCategorySearch: (categoryCode: string) => navigate(`/search?categories=${encodeURIComponent(categoryCode)}`),
    
    // 브라우저 히스토리 이동
    goBack: () => navigate(-1),
  };
}
