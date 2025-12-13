import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { toast } from "sonner";
import { useAuthStore } from "../../store/authStore";
import { loadRecentSearches, saveSearchKeyword, removeSearchKeyword } from "../../utils/localSearchHistory";

/**
 * 색상 상수
 */
const COLORS = {
  accent: '#4FA3D1',           // 강조 색상 (검색 버튼, 포커스 테두리)
  accentHover: '#3d8ab8',      // 강조 색상 호버 상태
} as const;

/**
 * 상수 값
 */
const CONSTANTS = {
  MAX_RECENT_SEARCHES: 8,      // 최근 검색어 최대 개수
  TOAST_MESSAGE: {
    TITLE: '로그인 후 이용 가능한 기능입니다',
    DESCRIPTION: '검색 기능을 사용하려면 로그인해주세요.',
  },
} as const;

/**
 * HeroSection 컴포넌트 Props
 */
interface HeroSectionProps {
  /** 검색 실행 시 호출되는 콜백 함수 */
  onSearch?: (query: string) => void;
}

/**
 * 히어로 섹션 컴포넌트
 * 
 * 홈페이지 상단에 위치하는 검색 인터페이스를 제공합니다.
 * 논문 검색 입력 필드와 최근 검색어 목록을 표시합니다.
 * 
 * @example
 * ```tsx
 * <HeroSection onSearch={(query) => handleSearch(query)} />
 * ```
 */
export function HeroSection({ onSearch }: HeroSectionProps) {
  // 인증 상태
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  // 검색어 입력 상태
  const [searchValue, setSearchValue] = useState("");
  
  // 최근 검색어 목록 상태
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  /**
   * 컴포넌트 마운트 시 localStorage에서 최근 검색어 로드
   */
  useEffect(() => {
    setRecentSearches(loadRecentSearches(CONSTANTS.MAX_RECENT_SEARCHES));
  }, []);

  /**
   * 검색 실행 핸들러
   * 빈 값 체크, 로그인 상태 확인, 검색어 저장 후 검색 실행
   */
  const handleSearch = useCallback(() => {
    // 빈 값 체크
    if (!searchValue.trim()) {
      return;
    }

    // 로그인 상태 확인
    if (!isLoggedIn) {
      toast.info(CONSTANTS.TOAST_MESSAGE.TITLE, {
        description: CONSTANTS.TOAST_MESSAGE.DESCRIPTION,
      });
      return;
    }

    const trimmedValue = searchValue.trim();

    // 검색어를 localStorage에 저장하고 최근 검색어 목록 업데이트
    const updated = saveSearchKeyword(trimmedValue, CONSTANTS.MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    
    // 검색 콜백 실행
    if (onSearch) {
      onSearch(trimmedValue);
    }
  }, [searchValue, isLoggedIn, onSearch]);

  /**
   * 키보드 이벤트 핸들러
   * Enter 키 입력 시 검색 실행
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);

  /**
   * 최근 검색어 제거 핸들러
   * localStorage에서 검색어를 제거하고 상태 업데이트
   */
  const removeSearch = useCallback((searchToRemove: string) => {
    const updated = removeSearchKeyword(searchToRemove, CONSTANTS.MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
  }, []);

  /**
   * 최근 검색어 클릭 핸들러
   * 검색어를 입력 필드에 설정하고 검색 실행
   */
  const handleRecentSearchClick = useCallback((search: string) => {
    setSearchValue(search);

    // 로그인 상태 확인
    if (!isLoggedIn) {
      toast.info(CONSTANTS.TOAST_MESSAGE.TITLE, {
        description: CONSTANTS.TOAST_MESSAGE.DESCRIPTION,
      });
      return;
    }

    // 검색 실행
    if (onSearch) {
      onSearch(search);
    }
  }, [isLoggedIn, onSearch]);

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* 메인 타이틀 */}
          <h1 className="px-4 text-[32px]">
            원하는 논문을 쉽게 검색하고 요약해보세요
          </h1>

          <div className="space-y-4">
            {/* 검색 입력 영역 */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-1 relative">
                {/* 검색 입력 필드 */}
                <Input
                  id="hero-search"
                  name="hero-search"
                  type="text"
                  placeholder="논문 제목 또는 키워드를 입력하세요"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-24 py-8 text-base md:text-lg border-gray-300 focus:border-[#4FA3D1] focus:ring-[#4FA3D1]"
                  style={{
                    borderRadius: "var(--input-border-radius)",
                  }}
                />
                {/* 검색 버튼 (입력 필드 내부) */}
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-3 rounded-md transition-colors text-white flex items-center gap-2 text-base md:text-lg cursor-pointer hover:bg-[#3d8ab8]"
                  style={{ backgroundColor: COLORS.accent }}
                  aria-label="검색"
                >
                  <Search className="h-6 w-6" />
                  <span className="hidden sm:inline">검색</span>
                </button>
              </div>
            </div>

            {/* 최근 검색어 영역 (로그인한 사용자에게만 표시) */}
            {isLoggedIn && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 whitespace-nowrap">최근 검색:</span>
                {recentSearches.length > 0 ? (
                  <ScrollArea className="w-full max-h-[40px]">
                    <div className="flex gap-2 pb-2 pr-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={`${search}-${index}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 whitespace-nowrap transition-colors flex-shrink-0"
                          onClick={() => handleRecentSearchClick(search)}
                        >
                          {search}
                          {/* 검색어 삭제 버튼 */}
                          <X
                            className="h-3 w-3 hover:text-red-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSearch(search);
                            }}
                          />
                        </button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                ) : (
                  <span className="text-sm text-gray-400">검색 기록이 없습니다</span>
                )}
              </div>
            )}
          </div>

          {/* 설명 텍스트 */}
          <p className="text-gray-600 mt-4">
            AI 기반 자동 번역 및 요약으로 논문을 빠르게 이해하세요
          </p>
        </div>
      </div>
    </section>
  );
}