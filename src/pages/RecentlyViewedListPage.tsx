/**
 * 최근 본 논문 목록 페이지 컴포넌트
 * 
 * 기능: 최근 조회한 논문 목록 표시 및 페이지네이션
 */
import { useState } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { UnifiedPaperCard } from '../components/papers/UnifiedPaperCard';
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton';
import { PaginationControls } from '../components/ui/PaginationControls';
import { Alert, AlertDescription } from '../components/ui/alert';
import { usePaperActions } from '../hooks/usePaperActions';
import { useAuthStore } from '../store/authStore';
import { useMyProfileQuery } from '../hooks/api/useMyProfile';
import { useViewedPapersQuery, useBookmarksQuery } from '../hooks/api/usePapers';

const ITEMS_PER_PAGE = 10;
const COLORS = {
  primary: '#215285',
  accent: '#4FA3D1',
};

export function RecentlyViewedListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { handlePaperClick, handleBookmark } = usePaperActions();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { data: bookmarks = [] } = useBookmarksQuery();
  
  const isBookmarked = (paperId: string | number) => {
    return bookmarks.some(b => {
      const bookmarkPaperId = b.paper_id || (b.paper?.id ? String(b.paper.id) : null);
      return bookmarkPaperId === String(paperId);
    });
  };

  const { data: viewedPapersData, isLoading, isError, error } = useViewedPapersQuery(
    currentPage,
    ITEMS_PER_PAGE,
    isLoggedIn
  );

  const recentPapers = viewedPapersData?.papers || [];
  const totalPages = viewedPapersData?.total 
    ? Math.ceil(viewedPapersData.total / ITEMS_PER_PAGE)
    : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">로그인이 필요한 페이지입니다.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: COLORS.accent }} />
            <p className="text-gray-600">검색 기록을 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10 py-8">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error instanceof Error ? error.message : '검색 기록을 불러오는 중 오류가 발생했습니다.'}
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="h-7 w-7" style={{ color: '#4FA3D1' }} />
            <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
              최근 본 논문
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            {recentPapers.length > 0 ? (
              recentPapers.map((paper) => {
                const authors = Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors;
                
                return (
                  <UnifiedPaperCard
                    key={paper.id}
                    paperId={paper.id}
                    title={paper.title}
                    authors={authors}
                    categories={paper.categories}
                    variant="compact"
                    onPaperClick={handlePaperClick}
                    onToggleBookmark={handleBookmark}
                    isBookmarked={isBookmarked(paper.id)}
                  />
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">최근 본 논문이 없습니다.</p>
              </div>
            )}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
