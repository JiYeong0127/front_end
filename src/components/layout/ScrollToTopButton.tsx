import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * 색상 상수
 */
const COLORS = {
  primary: '#215285',      // 메인 색상 (버튼 배경)
} as const;

/**
 * 스크롤 관련 상수
 */
const SCROLL_CONFIG = {
  THRESHOLD: 300,          // 버튼이 표시되는 스크롤 임계값 (px)
} as const;

/**
 * 스크롤 투 탑 버튼 컴포넌트
 * 
 * 페이지를 일정 거리 이상 스크롤했을 때 나타나는 버튼으로,
 * 클릭 시 페이지 상단으로 부드럽게 스크롤합니다.
 * 
 * @example
 * ```tsx
 * <ScrollToTopButton />
 * ```
 */
export function ScrollToTopButton() {
  // 버튼 표시 여부 상태
  const [isVisible, setIsVisible] = useState(false);

  /**
   * 스크롤 이벤트 리스너 설정
   * 스크롤 위치에 따라 버튼 표시/숨김 처리
   */
  useEffect(() => {
    /**
     * 스크롤 위치에 따라 버튼 표시 여부 결정
     */
    const toggleVisibility = () => {
      if (window.scrollY > SCROLL_CONFIG.THRESHOLD) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', toggleVisibility);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  /**
   * 페이지 상단으로 부드럽게 스크롤
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 버튼이 보이지 않으면 렌더링하지 않음
  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 z-50"
      style={{ backgroundColor: COLORS.primary }}
      aria-label="맨 위로 이동"
    >
      <ChevronUp className="w-6 h-6 text-white" />
    </button>
  );
}
