/**
 * 논문 상세 페이지 컴포넌트
 * 
 * 기능: 논문 상세 정보 표시, 북마크, 추천 논문 목록 제공
 */
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Loader2, Bookmark, ExternalLink, Star } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { SearchHeader } from '../components/layout/SearchHeader';
import { Footer } from '../components/layout/Footer';
import { Separator } from '../components/ui/separator';
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton';
import { usePaperDetailQuery, useBookmarksQuery, useRecommendationsQuery } from '../hooks/api';
import type { Paper } from '../lib/api';
import { usePaperActions } from '../hooks/usePaperActions';
import { useAppStore } from '../store/useAppStore';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { UnifiedPaperCard } from '../components/papers/UnifiedPaperCard';
import { Button } from '../components/ui/button';
import { useNavigation } from '../hooks/useNavigation';

const COLORS = {
  primary: '#215285',
  accent: '#4FA3D1',
  bookmarkActive: '#4FA3D1',
  bookmarkInactive: '#ccc',
};

export function PaperDetailPage() {
  const { id } = useParams<{ id: string }>();
  const paperId = id || '';
  const { isLoggedIn, handlePaperClick, handleBookmark } = usePaperActions();
  const addRecentlyViewedPaper = useAppStore((state) => state.addRecentlyViewedPaper);
  const { data: bookmarks = [] } = useBookmarksQuery();

  const { data: paper, isLoading, isError, error } = usePaperDetailQuery(paperId, !!paperId);
  const { 
    data: recommendedPapers,
    isLoading: isLoadingRecommendations,
    isError: isErrorRecommendations,
    error: errorRecommendations 
  } = useRecommendationsQuery(paperId, 6, true);

  const typedRecommendedPapers: Paper[] = (recommendedPapers ?? []) as Paper[];

  const { goToLogin, goToSearch } = useNavigation();

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (!isLoggedIn) {
      goToLogin();
      return;
    }

    goToSearch(trimmed);
  };

  const [isAuthorsExpanded, setIsAuthorsExpanded] = useState(false);
  const [showAuthorsToggle, setShowAuthorsToggle] = useState(false);
  const authorsRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (authorsRef.current) {
      const element = authorsRef.current;
      const computedStyle = getComputedStyle(element);
      const lineHeight = parseFloat(computedStyle.lineHeight || '0');
      if (lineHeight > 0) {
        const maxHeight = lineHeight * 2; // 2줄 높이
        setShowAuthorsToggle(element.scrollHeight > maxHeight);
      } else {
        setShowAuthorsToggle(false);
      }
    }
  }, [paper?.authors]);

  useEffect(() => {
    if (paper && isLoggedIn) {
      const numericId = typeof paper.id === 'string' ? Number(paper.id) : paper.id;
      if (Number.isFinite(numericId)) {
        addRecentlyViewedPaper(numericId as number);
      }
    }
  }, [paper, isLoggedIn, addRecentlyViewedPaper]);

  const checkIsBookmarked = (paperId: string | number) => {
    return bookmarks.some(b => {
      const bookmarkPaperId = b.paper_id || (b.paper?.id ? String(b.paper.id) : null);
      return bookmarkPaperId === String(paperId);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <SearchHeader onSearch={handleSearch} />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#4FA3D1' }} />
            <p className="text-gray-600">논문 정보를 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !paper) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <SearchHeader onSearch={handleSearch} />
        <main className="flex-1">
          <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10 py-8">
            <Alert variant="destructive">
              <AlertDescription>
                {error instanceof Error ? error.message : '논문 정보를 불러오는 중 오류가 발생했습니다.'}
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isBookmarked = checkIsBookmarked(paper.id);
  const externalUrl =
    paper.externalUrl ||
    (paper.id ? `https://arxiv.org/abs/${paper.id}` : undefined);
  const rawSummary = paper.summary as unknown;
  const hasSummaryObject = rawSummary && typeof rawSummary === 'object';
  const koSummaryText = hasSummaryObject
    ? (rawSummary as any).ko ?? null
    : undefined;
  const shouldShowSummarySection = hasSummaryObject || paper.summary;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchHeader onSearch={handleSearch} />
      {/* 상세 페이지 본문 전체 폰트 크기 확대 (검색 영역 제외) */}
      <main className="flex-1">
        <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10 py-8 text-lg md:text-xl">
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 md:p-8 mb-8 relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-105 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(paper.id);
                    }}
                  >
                    <Bookmark
                      className="w-5 h-5 transition-colors"
                      style={{
                        color: isBookmarked ? COLORS.bookmarkActive : COLORS.bookmarkInactive,
                        fill: isBookmarked ? COLORS.bookmarkActive : 'none',
                      }}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isBookmarked ? '북마크 해제' : '북마크 추가'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-start gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: COLORS.primary }}>
                  {paper.title}
                </h1>
                
                <div className="flex flex-col gap-1 text-gray-600 mb-4">
                  <span
                    ref={authorsRef}
                    className={isAuthorsExpanded ? '' : 'line-clamp-2'}
                  >
                    저자: {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                  </span>
                  {showAuthorsToggle && (
                    <button
                      type="button"
                      className="text-sm hover:underline self-start"
                      style={{ color: COLORS.primary }}
                      onClick={() => setIsAuthorsExpanded(!isAuthorsExpanded)}
                    >
                      {isAuthorsExpanded ? '간략히' : '더보기'}
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col gap-1 text-gray-600 mb-4">
                  <span>
                    저널: {paper.journal_ref && typeof paper.journal_ref === 'string' && paper.journal_ref.trim() !== '' ? paper.journal_ref : 'Undefined'}
                  </span>
                </div>
                
                {paper.categories && paper.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.categories.map((cat: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: '#EAF4FA', color: COLORS.accent }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                
                {(paper.update_date || externalUrl) && (
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {paper.update_date && (
                      <span className="text-sm text-gray-500">
                        업데이트: {paper.update_date}
                      </span>
                    )}
                    {externalUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto rounded-full hover:opacity-90"
                        style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                        onClick={() => window.open(externalUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        원문 보기
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              {shouldShowSummarySection && (
                <section>
                  <h2 className="mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-7 w-7" style={{ color: COLORS.accent }} />
                      <span
                        className="text-2xl md:text-3xl font-extrabold"
                        style={{ color: COLORS.primary }}
                      >
                        요약
                      </span>
                    </div>
                  </h2>
                  {koSummaryText && koSummaryText.trim() !== '' ? (
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {koSummaryText}
                    </p>
                  ) : (
                    <p className="text-xl md:text-2xl text-gray-500 italic">
                      요약 준비 중입니다...
                    </p>
                  )}
                </section>
              )}
            </div>
          </div>

          <section className="mb-8">
            <h2 className="mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-7 w-7" style={{ color: COLORS.accent }} />
                <span
                  className="text-2xl md:text-3xl font-extrabold"
                  style={{ color: COLORS.primary }}
                >
                  추천 논문
                </span>
              </div>
            </h2>
            {isLoadingRecommendations ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: COLORS.accent }} />
              </div>
            ) : isErrorRecommendations ? (
              <div className="text-center py-12">
                <Alert variant="destructive">
                  <AlertDescription>
                    추천 논문을 불러오는 중 오류가 발생했습니다.
                    {errorRecommendations instanceof Error && (
                      <span className="block mt-2 text-sm">
                        {errorRecommendations.message}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            ) : typedRecommendedPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {typedRecommendedPapers.map((recommendedPaper: Paper) => (
                  <UnifiedPaperCard
                    key={recommendedPaper.id}
                    paperId={recommendedPaper.id}
                    title={recommendedPaper.title}
                    authors={Array.isArray(recommendedPaper.authors) ? recommendedPaper.authors.join(', ') : recommendedPaper.authors}
                    categories={recommendedPaper.categories}
                    update_date={recommendedPaper.update_date}
                    journal={recommendedPaper.journal_ref}
                    variant="recommended"
                    onPaperClick={handlePaperClick}
                    onToggleBookmark={handleBookmark}
                    isBookmarked={checkIsBookmarked(recommendedPaper.id)}
                    showSummary={false}
                    showJournal={true}
                    showBookmark={true}
                    recommendationId={recommendedPaper.recommendation_id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">추천 논문이 없습니다.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
