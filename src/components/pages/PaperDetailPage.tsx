import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { Header } from '../layout/Header';
import { SearchHeader } from '../layout/SearchHeader';
import { Footer } from '../layout/Footer';
import { Separator } from '../ui/separator';
import { ScrollToTopButton } from '../layout/ScrollToTopButton';
import { usePaperDetailQuery, useToggleBookmarkMutation } from '../../hooks/api';
import { usePaperActions } from '../../hooks/usePaperActions';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

export function PaperDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paperId = id ? parseInt(id) : 1;
  const searchQuery = searchParams.get('q') || '';
  const { isLoggedIn } = usePaperActions();
  const bookmarkedPaperIds = useAppStore((state) => state.bookmarkedPaperIds);
  const addRecentlyViewedPaper = useAppStore((state) => state.addRecentlyViewedPaper);
  
  const { data: paper, isLoading, isError, error } = usePaperDetailQuery(paperId, !!paperId);
  const toggleBookmarkMutation = useToggleBookmarkMutation();

  // 논문이 로드되면 최근 조회 목록에 추가
  useEffect(() => {
    if (paper && isLoggedIn) {
      addRecentlyViewedPaper(paper.id);
    }
  }, [paper, isLoggedIn, addRecentlyViewedPaper]);

  const handleBack = () => {
    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  const handleBookmark = (paperId: number) => {
    toggleBookmarkMutation.mutate(paperId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <SearchHeader onSearch={() => {}} />
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
        <SearchHeader onSearch={() => {}} />
        <main className="flex-1">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 py-8">
            <Alert variant="destructive">
              <AlertDescription>
                {error instanceof Error ? error.message : '논문 정보를 불러오는 중 오류가 발생했습니다.'}
              </AlertDescription>
            </Alert>
            <Button onClick={handleBack} className="mt-4">
              목록으로 돌아가기
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isBookmarked = bookmarkedPaperIds.includes(String(paper.id));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchHeader onSearch={() => {}} />
      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 py-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#215285] transition-colors"
          >
            <span>←</span>
            <span>목록으로 돌아가기</span>
          </button>

          {/* Paper Detail */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EAF4FA' }}>
                <Sparkles className="h-8 w-8" style={{ color: '#4FA3D1' }} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#215285' }}>
                  {paper.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <span>{Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}</span>
                  <span>{paper.year}</span>
                  <span>{paper.publisher}</span>
                </div>
                {paper.categories && paper.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.categories.map((cat: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: '#EAF4FA', color: '#4FA3D1' }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              {paper.abstract && (
                <section>
                  <h2 className="text-xl font-semibold mb-3" style={{ color: '#215285' }}>
                    Abstract
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{paper.abstract}</p>
                </section>
              )}

              {paper.translatedSummary && (
                <section>
                  <h2 className="text-xl font-semibold mb-3" style={{ color: '#215285' }}>
                    요약
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{paper.translatedSummary}</p>
                </section>
              )}

              {paper.keywords && paper.keywords.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3" style={{ color: '#215285' }}>
                    Keywords
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex gap-4 pt-4">
                {paper.externalUrl && (
                  <a
                    href={paper.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 rounded-md text-white transition-colors"
                    style={{ backgroundColor: '#215285' }}
                  >
                    원문 보기
                  </a>
                )}
                {isLoggedIn && (
                  <Button
                    variant="outline"
                    onClick={() => handleBookmark(paper.id)}
                    disabled={toggleBookmarkMutation.isPending}
                  >
                    {toggleBookmarkMutation.isPending ? '처리 중...' : isBookmarked ? '북마크 해제' : '북마크 추가'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Papers */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#215285' }}>
              추천 논문
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 추천 논문은 별도 API가 필요하므로 일단 비워둠 */}
              <p className="text-gray-500">추천 논문 기능은 준비 중입니다.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
