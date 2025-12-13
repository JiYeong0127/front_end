/**
 * 내 서재 페이지 컴포넌트
 * 
 * 기능: 북마크한 논문 목록 표시, 정렬, 페이지네이션
 */
import { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Bookmark, ArrowUpDown, Loader2 } from 'lucide-react';
import { PaginationControls } from '../components/ui/PaginationControls';
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { UnifiedPaperCard } from '../components/papers/UnifiedPaperCard';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useBookmarksQuery } from '../hooks/api';
import { usePaperActions } from '../hooks/usePaperActions';
import { useAuthStore } from '../store/authStore';
import { Paper, BookmarkItem } from '../lib/api';
import { useQueries } from '@tanstack/react-query';

const COLORS = {
  primary: '#215285',
  accent: '#4FA3D1',
};

export function MyLibraryPage() {
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'year'>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { handlePaperClick, handleBookmark } = usePaperActions();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  const { data: bookmarks = [], isLoading, isError, error } = useBookmarksQuery();
  const bookmarksWithoutPaper = bookmarks.filter(bookmark => !bookmark.paper && bookmark.paper_id);
  
  const paperDetailQueries = useQueries({
    queries: bookmarksWithoutPaper.map((bookmark) => ({
      queryKey: ['papers', 'detail', bookmark.paper_id],
      queryFn: async () => {
        try {
          const { getPaperDetail } = await import('../lib/api');
          return await getPaperDetail(bookmark.paper_id);
        } catch {
          return null;
        }
      },
      enabled: !!bookmark.paper_id,
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  const enrichedBookmarks: BookmarkItem[] = bookmarks.map((bookmark) => {
    if (bookmark.paper) {
      return bookmark;
    }
    
    const paperDetailIndex = bookmarksWithoutPaper.findIndex(b => b.id === bookmark.id);
    if (paperDetailIndex >= 0 && paperDetailQueries[paperDetailIndex]?.data) {
      return {
        ...bookmark,
        paper: paperDetailQueries[paperDetailIndex].data!,
      };
    }
    
    return bookmark;
  });

  const bookmarkedPapers = enrichedBookmarks
    .map(bookmark => {
      if (bookmark.paper) {
        return bookmark.paper;
      }
      return {
        id: bookmark.paper_id,
        title: `논문 (DOI: ${bookmark.paper_id})`,
        authors: '',
      } as Paper;
    })
    .filter(paper => paper.id);

  const sortedPapers = [...bookmarkedPapers].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'year': {
        const yearA = a.year != null ? Number(a.year) : 0;
        const yearB = b.year != null ? Number(b.year) : 0;
        const safeYearA = Number.isNaN(yearA) ? 0 : yearA;
        const safeYearB = Number.isNaN(yearB) ? 0 : yearB;

        return safeYearB - safeYearA;
      }
      case 'recent':
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedPapers.length / itemsPerPage);
  const currentPapers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedPapers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedPapers, currentPage, itemsPerPage]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Bookmark className="h-7 w-7" style={{ color: '#4FA3D1' }} />
              <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
                내 서재
              </h1>
              <span className="text-gray-600">
                ({sortedPapers.length}개)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={(value: 'recent' | 'title' | 'year') => {
                setSortBy(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">최근 추가순</SelectItem>
                  <SelectItem value="title">제목순</SelectItem>
                  <SelectItem value="year">연도순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mb-4" style={{ color: COLORS.accent }} />
              <p className="text-gray-600">북마크 목록을 불러오는 중...</p>
            </div>
          )}

          {isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error instanceof Error ? error.message : '북마크 목록을 불러오는 중 오류가 발생했습니다.'}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && (
            <>
              {sortedPapers.length > 0 ? (
                <>
                  <div className="space-y-4 mb-12">
                    {currentPapers.map((paper) => (
                      <UnifiedPaperCard
                        key={paper.id}
                        paperId={paper.id}
                        title={paper.title}
                        authors={Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                        update_count={paper.update_count}
                        update_date={paper.update_date}
                        categories={paper.categories}
                        variant="search"
                        onPaperClick={handlePaperClick}
                        onToggleBookmark={handleBookmark}
                        isBookmarked={true}
                      />
                    ))}
                  </div>

                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bookmark className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 text-lg mb-2">
                      북마크한 논문이 없습니다.
                    </p>
                    <p className="text-gray-500 text-sm">
                      관심 있는 논문을 북마크해보세요.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
