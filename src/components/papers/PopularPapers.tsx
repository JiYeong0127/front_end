import { useState, useMemo } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { UnifiedPaperCard } from './UnifiedPaperCard';
import { useSearchPapersQuery, useBookmarksQuery } from '../../hooks/api';

/**
 * 색상 상수
 */
const COLORS = {
  primary: '#215285',      // 메인 색상 
  accent: '#4FA3D1',        // 강조 색상 
  tabInactive: '#F1F1F1',  // 비활성 탭 배경
} as const;

/**
 * 논문 관련 상수
 */
const PAPER_CONFIG = {
  MAX_DISPLAY: 5,          // 표시할 최대 논문 개수
} as const;

/**
 * PopularPapers 컴포넌트 Props
 */
interface PopularPapersProps {
  /** 북마크 토글 핸들러 */
  onToggleBookmark?: (paperId: string | number) => void;
  /** 논문 클릭 핸들러 */
  onPaperClick?: (paperId: string | number) => void;
}

/**
 * 탭 타입
 */
type TabType = 'popular' | 'recent';

/**
 * 탭 설정 인터페이스
 */
interface TabConfig {
  value: TabType;
  label: string;
  sortBy: string;
}

/**
 * 탭 설정 배열
 */
const TABS: TabConfig[] = [
  { value: 'popular', label: '인기순', sortBy: 'view_count' },
  { value: 'recent', label: '최신순', sortBy: 'update_date' },
];

/**
 * 인기 논문 컴포넌트
 * 
 * 인기순/최신순 탭으로 논문을 정렬하여 표시합니다.
 * 북마크 기능과 논문 클릭 이벤트를 지원합니다.
 * 
 * @example
 * ```tsx
 * <PopularPapers
 *   onToggleBookmark={(id) => handleBookmark(id)}
 *   onPaperClick={(id) => handlePaperClick(id)}
 * />
 * ```
 */
export function PopularPapers({ onToggleBookmark, onPaperClick }: PopularPapersProps) {
  // 활성 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  
  // 북마크 목록 조회
  const { data: bookmarks = [] } = useBookmarksQuery();

  /**
   * 북마크 상태 확인 함수
   * 논문 ID가 북마크 목록에 있는지 확인
   */
  const isBookmarked = (paperId: string | number) => {
    return bookmarks.some(b => {
      const bookmarkPaperId = b.paper_id || (b.paper?.id ? String(b.paper.id) : null);
      return bookmarkPaperId === String(paperId);
    });
  };

  /**
   * API 호출 파라미터 구성
   * 활성 탭에 따라 정렬 기준을 설정하고, 모든 카테고리에서 논문을 조회
   */
  const searchParams = useMemo(() => {
    const activeTabConfig = TABS.find(tab => tab.value === activeTab);
    return {
      q: undefined, // 검색어 없음
      categories: undefined, // 카테고리 없음 
      sort_by: activeTabConfig?.sortBy || 'view_count',
      page: 1,
      page_size: PAPER_CONFIG.MAX_DISPLAY, // 최대 표시 개수만큼만 가져오기
    };
  }, [activeTab]);

  /**
   * API에서 논문 데이터 가져오기
   * enabled를 true로 설정하여 sort_by만으로도 API 호출 가능하도록 함
   */
  const { data: searchData, isLoading, isError } = useSearchPapersQuery(
    searchParams,
    true
  );

  /**
   * 표시할 논문 목록
   * API 응답이 예상과 다를 수 있으므로 안전하게 최대 개수로 제한
   */
  const displayPapers = (searchData?.papers || []).slice(0, PAPER_CONFIG.MAX_DISPLAY);

  /**
   * 빈 상태 메시지 렌더링
   */
  const renderEmptyState = (message: string) => (
    <div className="flex items-center justify-center py-12">
      <p className="text-gray-600">{message}</p>
    </div>
  );

  /**
   * 로딩 상태 렌더링
   */
  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: COLORS.accent }} />
    </div>
  );

  /**
   * 논문 목록 렌더링
   */
  const renderPapersList = () => (
    <div className="space-y-4">
      {displayPapers.map((paper) => (
        <UnifiedPaperCard
          key={paper.id}
          paperId={paper.id}
          title={paper.title}
          authors={paper.authors}
          update_date={paper.update_date}
          categories={paper.categories}
          journal={paper.journal_ref}
          isBookmarked={isBookmarked(paper.id)}
          onToggleBookmark={onToggleBookmark}
          onPaperClick={onPaperClick}
          variant="popular"
          showBookmark={!!onToggleBookmark}
        />
      ))}
    </div>
  );

  /**
   * 콘텐츠 렌더링
   * 로딩, 에러, 빈 상태, 논문 목록을 조건에 따라 렌더링
   */
  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (isError) return renderEmptyState('논문을 불러오는 중 오류가 발생했습니다.');
    if (displayPapers.length === 0) return renderEmptyState('표시할 논문이 없습니다.');
    return renderPapersList();
  };

  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10">
        {/* 헤더 영역 (제목 및 탭) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* 제목 영역 */}
          <div className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7" style={{ color: COLORS.accent }} />
            <h2 className="text-[var(--font-size-28)]">인기 논문</h2>
          </div>

          {/* 정렬 탭 */}
          <div className="flex gap-2">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === tab.value
                    ? 'text-white'
                    : 'bg-[#F1F1F1] text-gray-700 hover:bg-gray-300'
                }`}
                style={activeTab === tab.value ? { backgroundColor: COLORS.primary } : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 논문 목록 영역 */}
        {renderContent()}
      </div>
    </section>
  );
}