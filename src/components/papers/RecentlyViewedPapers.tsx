import { Clock, ChevronRight, Bookmark, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '../../hooks/useNavigation';
import { useViewedPapersQuery } from '../../hooks/api/usePapers';

/**
 * 색상 상수
 */
const COLORS = {
  primary: '#215285',      // 메인 색상
  accent: '#4FA3D1',       // 강조 색상 (아이콘, 북마크)
  link: '#2563eb',         // 링크 색상
  categoryBg: '#E8F4F8',   // 카테고리 배경 색상
  bookmarkInactive: '#ccc', // 비활성 북마크 색상
} as const;

/**
 * 논문 관련 상수
 */
const PAPER_CONFIG = {
  PAGE: 1,                  // 페이지 번호
  PAGE_SIZE: 7,            // 표시할 논문 개수
} as const;

/**
 * RecentlyViewedPapers 컴포넌트 Props
 */
interface RecentlyViewedPapersProps {
  /** 논문 클릭 핸들러 */
  onPaperClick?: (paperId: string | number) => void;
  /** 전체 보기 클릭 핸들러 */
  onViewAll?: () => void;
  /** 북마크된 논문 ID 목록 */
  bookmarkedPaperIds?: Array<string | number>;
  /** 북마크 토글 핸들러 */
  onToggleBookmark?: (paperId: string | number) => void;
}

/**
 * 최근 조회 논문 컴포넌트
 * 
 * 사용자가 최근에 조회한 논문을 가로 스크롤 카드 형태로 표시합니다.
 * 북마크 기능과 논문 클릭 이벤트를 지원합니다.
 * 
 * @example
 * ```tsx
 * <RecentlyViewedPapers
 *   onPaperClick={(id) => handlePaperClick(id)}
 *   onToggleBookmark={(id) => handleBookmark(id)}
 *   bookmarkedPaperIds={[1, 2, 3]}
 * />
 * ```
 */
export function RecentlyViewedPapers({ 
  onPaperClick, 
  onViewAll,
  bookmarkedPaperIds = [],
  onToggleBookmark,
}: RecentlyViewedPapersProps) {
  // 인증 상태
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  // 네비게이션 훅
  const { goToRecentPapers } = useNavigation();

  /**
   * 조회한 논문 데이터 조회
   * 메인 페이지용으로 7개만 가져옴
   */
  const { data: viewedPapersData, isLoading, isError } = useViewedPapersQuery(
    PAPER_CONFIG.PAGE,
    PAPER_CONFIG.PAGE_SIZE,
    isLoggedIn
  );

  // 최근 조회 논문 목록
  const recentPapers = viewedPapersData?.papers || [];

  /**
   * 로딩 상태 렌더링
   */
  if (isLoading) {
    return (
      <section className="w-full py-16 md:py-20 bg-white">
        <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: COLORS.accent }} />
          </div>
        </div>
      </section>
    );
  }

  /**
   * 에러 상태 또는 데이터가 없으면 섹션 숨김
   */
  if (isError || recentPapers.length === 0) {
    return null;
  }

  /**
   * 전체 보기 클릭 핸들러
   * 커스텀 핸들러가 있으면 실행하고, 없으면 최근 조회 논문 페이지로 이동
   */
  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      goToRecentPapers();
    }
  };
  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between mb-8">
          {/* 제목 영역 */}
          <div className="flex items-center gap-3">
            <Clock className="h-7 w-7" style={{ color: COLORS.accent }} />
            <h2 className="text-[var(--font-size-28)]" style={{ color: COLORS.primary }}>최근 조회 논문</h2>
          </div>
          {/* 전체 보기 버튼 */}
          <button
            onClick={handleViewAll}
            className="flex items-center gap-1 text-sm hover:underline transition-all"
            style={{ color: COLORS.primary }}
          >
            전체 보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 스크롤 가능한 카드 컨테이너 */}
        <div className="relative">
          <div className="overflow-x-auto pb-4 horizontal-scroll" style={{ scrollSnapType: 'x mandatory' }}>
            <div className="flex gap-4 min-w-max md:min-w-0">
              {recentPapers.map((paper) => {
                // 저자 배열 정규화
                const authors = Array.isArray(paper.authors) ? paper.authors : [paper.authors];
                
                // 카테고리 배열 정규화
                const categories = Array.isArray(paper.categories)
                  ? paper.categories
                  : (paper.categories ? [paper.categories] : []);
                
                // 북마크 상태 확인
                const isBookmarked = bookmarkedPaperIds.includes(paper.id);
               
                return (
                  <Card
                    key={paper.id}
                    className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[220px] lg:w-[220px] hover:shadow-lg transition-shadow relative"
                    style={{ 
                      borderRadius: '12px',
                      scrollSnapAlign: 'start'
                    }}
                  >
                    <CardContent className="p-5 flex flex-col h-full">
                      {/* 북마크 아이콘 */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-all hover:scale-105 z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleBookmark?.(paper.id);
                              }}
                            >
                              <Bookmark
                                className="w-4 h-4 transition-colors"
                                style={{
                                  color: isBookmarked ? COLORS.accent : COLORS.bookmarkInactive,
                                  fill: isBookmarked ? COLORS.accent : 'none',
                                }}
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isBookmarked ? '북마크 해제' : '북마크 추가'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* 제목 (클릭 가능) */}
                      <h3 
                        className="mb-3 line-clamp-2 min-h-[3rem] cursor-pointer hover:text-[#4FA3D1] transition-colors pr-8"
                        style={{ color: COLORS.primary }}
                        onClick={() => onPaperClick?.(paper.id)}
                      >
                        {paper.title}
                      </h3>

                      {/* 저자 정보 */}
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {authors.slice(0, 2).join(', ')}
                        {authors.length > 2 && ' 외'}
                      </p>

                      {/* 카테고리 태그 */}
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {categories.slice(0, 2).map((category: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs rounded-full"
                              style={{
                                backgroundColor: COLORS.categoryBg,
                                color: COLORS.primary
                              }}
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 자세히 보기 링크 */}
                      <div className="mt-auto flex justify-end">
                        <button
                          onClick={() => onPaperClick?.(paper.id)}
                          className="flex items-center gap-1 text-sm transition-colors hover:underline"
                          style={{ color: COLORS.link }}
                        >
                          자세히 보기
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
