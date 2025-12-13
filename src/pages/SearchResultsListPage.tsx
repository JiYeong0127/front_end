/**
 * 검색 결과 목록 페이지 컴포넌트
 * 
 * 기능: 논문 검색 결과 표시, 카테고리 필터링, 정렬, 페이지네이션
 */
import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Loader2, RefreshCw } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { SearchHeader } from '../components/layout/SearchHeader';
import { UnifiedPaperCard } from '../components/papers/UnifiedPaperCard';
import { CategoryFilter, getCategoryNameByCode } from '../components/category/CategoryFilter';
import { Footer } from '../components/layout/Footer';
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton';
import { PaginationControls } from '../components/ui/PaginationControls';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { useSearchPapersQuery, SearchPapersParams, useBookmarksQuery } from '../hooks/api';
import { usePaperActions } from '../hooks/usePaperActions';
import { useQueryClient } from '@tanstack/react-query';

const COLORS = {
  primary: '#215285',
  accent: '#4FA3D1',
  filterBg: '#EAF4FA',
  filterBgHover: '#D5E9F5',
};

export function SearchResultsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const categoriesParam = searchParams.get('categories');
  const pageParam = searchParams.get('page');
  const sortByParam = searchParams.get('sort_by');
  
  const selectedCategories = useMemo(() => {
    return categoriesParam 
      ? categoriesParam.split(',').filter(Boolean)
      : [];
  }, [categoriesParam]);
  
  const currentPage = useMemo(() => {
    return pageParam ? parseInt(pageParam, 10) : 1;
  }, [pageParam]);
  
  const sortBy = useMemo(() => {
    return sortByParam || 'view_count';
  }, [sortByParam]);
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const { handlePaperClick, handleBookmark } = usePaperActions();
  const queryClient = useQueryClient();
  const loadingStartTime = useRef<number | null>(null);
  const { data: bookmarks = [] } = useBookmarksQuery();
  
  const isBookmarked = (paperId: string | number) => {
    return bookmarks.some(b => {
      const bookmarkPaperId = b.paper_id || (b.paper?.id ? String(b.paper.id) : null);
      return bookmarkPaperId === String(paperId);
    });
  };

  const searchParams_obj: SearchPapersParams = useMemo(() => ({
    q: searchQuery,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    page: currentPage,
    sort_by: sortBy,
  }), [searchQuery, selectedCategories, currentPage, sortBy]);

  const { data: searchData, isLoading, isError, error, refetch } = useSearchPapersQuery(
    searchParams_obj,
    !!searchQuery || selectedCategories.length > 0
  );

  useEffect(() => {
    if (isLoading) {
      loadingStartTime.current = Date.now();
      setElapsedTime(0);
      const interval = setInterval(() => {
        if (loadingStartTime.current) {
          const elapsed = Math.floor((Date.now() - loadingStartTime.current) / 1000);
          setElapsedTime(elapsed);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
        loadingStartTime.current = null;
      };
    } else {
      loadingStartTime.current = null;
      setElapsedTime(0);
    }
  }, [isLoading]);

  const papers = searchData?.papers || [];
  const totalPages = searchData?.total ? Math.ceil(searchData.total / (searchData.pageSize || 10)) : 0;

  const updateSearchParams = (updater: (params: URLSearchParams) => void) => {
    const newSearchParams = new URLSearchParams(searchParams);
    updater(newSearchParams);
    setSearchParams(newSearchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryCode: string) => {
    const newCategories = selectedCategories.includes(categoryCode)
      ? selectedCategories.filter(code => code !== categoryCode)
      : [...selectedCategories, categoryCode];
    
    updateSearchParams((params) => {
      if (newCategories.length > 0) {
        params.set('categories', newCategories.join(','));
      } else {
        params.delete('categories');
      }
      params.set('page', '1');
    });
  };

  const handleRemoveCategory = (categoryCode: string) => {
    const newCategories = selectedCategories.filter(code => code !== categoryCode);
    
    updateSearchParams((params) => {
      if (newCategories.length > 0) {
        params.set('categories', newCategories.join(','));
      } else {
        params.delete('categories');
      }
      params.set('page', '1');
    });
  };

  const handleClearAllFilters = () => {
    updateSearchParams((params) => {
      params.delete('categories');
      params.set('page', '1');
    });
  };

  const handleSearch = (query: string) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('q', query);
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams((params) => {
      params.set('page', page.toString());
    });
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('타임아웃') || error.message.includes('시간이 초과')) {
        return '응답 시간이 초과되었습니다. 서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
      }
      if (error.message.includes('네트워크') || error.message.includes('연결')) {
        return error.message;
      }
      return error.message;
    }
    return '검색 중 오류가 발생했습니다.';
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['papers', 'search'] });
    refetch();
  };

  const getSearchResultText = () => {
    if (searchQuery) {
      return (
        <>
          <span className="text-[#215285]">"{searchQuery}"</span>에 대한 검색 결과 
        </>
      );
    }
    if (selectedCategories.length > 0) {
      return (
        <>
          카테고리 <span className="text-[#215285]">"{selectedCategories.map(c => getCategoryNameByCode(c)).join(', ')}"</span>에 대한 검색 결과
        </>
      );
    }
    return '검색 결과';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchHeader initialQuery={searchQuery} onSearch={handleSearch} />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-[var(--container-max-width-large)] mx-auto px-4 md:px-6 lg:px-10 py-8">
          <div className="flex gap-6">
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 lg:gap-4">
              <div className="sticky top-4 space-y-4">
                <div>
                  <CategoryFilter 
                    selectedCategories={selectedCategories}
                    onCategorySelect={handleCategorySelect}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" style={{ color: '#4FA3D1' }} />
                  <p className="text-gray-600 mb-2">검색 중입니다. 잠시만 기다려주세요...</p>
                  {elapsedTime > 0 && (
                    <p className="text-xs text-gray-400">
                      경과 시간: {Math.floor(elapsedTime / 60)}분 {elapsedTime % 60}초
                    </p>
                  )}
                </div>
              )}

              {isError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription className="flex flex-col gap-3">
                    <div>{getErrorMessage(error)}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      className="self-start"
                      style={{ borderColor: '#4FA3D1', color: '#4FA3D1' }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      다시 시도
                    </Button>
                    </AlertDescription>
                </Alert>
              )}

              {!isLoading && !isError && (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600">
                      {getSearchResultText()}
                      <span className="ml-2 text-sm text-gray-500">
                        ({searchData?.total || 0}개의 논문{searchData?.total && searchData.total > papers.length ? `, ${papers.length}개 표시` : ''})
                      </span>
                    </p>
                    
                    {selectedCategories.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-500">필터:</span>
                        
                        {selectedCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleRemoveCategory(category)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm hover:opacity-80 transition-opacity"
                            style={{ 
                              backgroundColor: COLORS.filterBg, 
                              color: COLORS.accent,
                            }}
                          >
                            {getCategoryNameByCode(category)}
                            <X className="h-3 w-3" />
                          </button>
                        ))}
                        
                        {selectedCategories.length > 1 && (
                          <button
                            onClick={handleClearAllFilters}
                            className="text-sm text-gray-500 hover:underline"
                            style={{ color: COLORS.accent }}
                          >
                            모두 지우기
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-12">
                    {papers.length > 0 ? (
                      papers.map((paper) => (
                          <UnifiedPaperCard
                            key={paper.id}
                            paperId={paper.id}
                            title={paper.title}
                            authors={Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                            update_count={paper.update_count}
                            update_date={paper.update_date}
                            categories={paper.categories}
                            journal={paper.journal_ref}
                            showJournal={true}
                            variant="search"
                            onPaperClick={handlePaperClick}
                            onToggleBookmark={handleBookmark}
                            isBookmarked={isBookmarked(paper.id)}
                          />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                          {searchQuery || selectedCategories.length > 0 
                            ? '검색 결과가 없습니다.' 
                            : '검색어를 입력하거나 카테고리를 선택해주세요.'}
                        </p>
                      </div>
                    )}
                  </div>

                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
