import { useState, useMemo } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { UnifiedPaperCard } from './UnifiedPaperCard';
import { useSearchPapersQuery, useBookmarksQuery } from '../../hooks/api';

// 상수 정의
const MAX_PAPERS = 5;
const PRIMARY_COLOR = '#215285';
const ACCENT_COLOR = '#4FA3D1';

interface PopularPapersProps {
  onToggleBookmark?: (paperId: string | number) => void;
  onPaperClick?: (paperId: string | number) => void;
}

type TabType = 'popular' | 'recent';

interface TabConfig {
  value: TabType;
  label: string;
  sortBy: string;
}

const TABS: TabConfig[] = [
  { value: 'popular', label: '인기순', sortBy: 'view_count' },
  { value: 'recent', label: '최신순', sortBy: 'update_date' },
];

export function PopularPapers({ onToggleBookmark, onPaperClick }: PopularPapersProps) {
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  const { data: bookmarks = [] } = useBookmarksQuery();

  // 북마크 상태 확인 함수
  const isBookmarked = (paperId: string | number) => {
    return bookmarks.some(b => {
      const bookmarkPaperId = b.paper_id || (b.paper?.id ? String(b.paper.id) : null);
      return bookmarkPaperId === String(paperId);
    });
  };

  // API 호출 파라미터 구성
  const searchParams = useMemo(() => {
    const activeTabConfig = TABS.find(tab => tab.value === activeTab);
    return {
      sort_by: activeTabConfig?.sortBy || 'view_count',
      page: 1,
    };
  }, [activeTab]);

  // API에서 논문 데이터 가져오기
  const { data: searchData, isLoading, isError } = useSearchPapersQuery(
    searchParams,
    true
  );

  const displayPapers = (searchData?.papers || []).slice(0, MAX_PAPERS);

  // 빈 상태 메시지 렌더링
  const renderEmptyState = (message: string) => (
    <div className="flex items-center justify-center py-12">
      <p className="text-gray-600">{message}</p>
    </div>
  );

  // 로딩 상태 렌더링
  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: ACCENT_COLOR }} />
    </div>
  );

  // 논문 목록 렌더링
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
          isBookmarked={isBookmarked(paper.id)}
          onToggleBookmark={onToggleBookmark}
          onPaperClick={onPaperClick}
          variant="popular"
          showBookmark={!!onToggleBookmark}
        />
      ))}
    </div>
  );

  // 콘텐츠 렌더링
  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (isError) return renderEmptyState('논문을 불러오는 중 오류가 발생했습니다.');
    if (displayPapers.length === 0) return renderEmptyState('표시할 논문이 없습니다.');
    return renderPapersList();
  };

  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10">
        {/* Header with Title and Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7" style={{ color: ACCENT_COLOR }} />
            <h2 className="text-[28px]">인기 논문</h2>
          </div>

          {/* Tabs */}
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
                style={activeTab === tab.value ? { backgroundColor: PRIMARY_COLOR } : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Paper List */}
        {renderContent()}
      </div>
    </section>
  );
}