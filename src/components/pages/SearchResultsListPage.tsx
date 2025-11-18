import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import { Header } from '../layout/Header';
import { SearchHeader } from '../layout/SearchHeader';
import { UnifiedPaperCard } from '../papers/UnifiedPaperCard';
import { CategoryFilter, getCategoryNameByCode } from '../filters/CategoryFilter';
import { YearFilter } from '../filters/YearFilter';
import { Footer } from '../layout/Footer';
import { ScrollToTopButton } from '../layout/ScrollToTopButton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { Alert, AlertDescription } from '../ui/alert';
import { useSearchPapersQuery } from '../../hooks/api';
import { usePaperActions } from '../../hooks/usePaperActions';

const ITEMS_PER_PAGE = 10;

export function SearchResultsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2015, 2025]);
  const { handlePaperClick } = usePaperActions();

  // API에서 검색 결과 가져오기
  const { data: searchData, isLoading, isError, error } = useSearchPapersQuery(
    searchQuery,
    !!searchQuery
  );

  // 검색어가 변경되면 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 클라이언트 사이드 필터링 (카테고리, 연도)
  const filteredPapers = searchData?.papers?.filter(paper => {
    // 카테고리 필터
    const categoryMatch = selectedCategories.length === 0 || 
      selectedCategories.some(category => 
        paper.categories?.some(cat => cat.toLowerCase().includes(category.toLowerCase())) ||
        paper.title.toLowerCase().includes(category.toLowerCase())
      );
    
    // 연도 필터
    const paperYear = typeof paper.year === 'string' ? parseInt(paper.year) : paper.year;
    const yearMatch = paperYear >= yearRange[0] && paperYear <= yearRange[1];
    
    return categoryMatch && yearMatch;
  }) || [];

  const totalPages = Math.ceil(filteredPapers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPapers = filteredPapers.slice(startIndex, endIndex);

  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryCode)) {
        return prev.filter(code => code !== categoryCode);
      } else {
        return [...prev, categoryCode];
      }
    });
    setCurrentPage(1);
  };

  const handleRemoveCategory = (categoryCode: string) => {
    setSelectedCategories((prev) => prev.filter(code => code !== categoryCode));
    setCurrentPage(1);
  };

  const handleYearRangeChange = (range: [number, number]) => {
    setYearRange(range);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchParams({ q: query });
    setCurrentPage(1);
  };


  // 연도 필터 활성화 여부 확인
  const isYearFilterActive = yearRange[0] !== 2015 || yearRange[1] !== 2025;

  // 페이지 번호 생성 함수
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchHeader initialQuery={searchQuery} onSearch={handleSearch} />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-8">
          <div className="flex gap-6 lg:gap-8">
            {/* 좌측 필터 영역 */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 lg:gap-4">
              <div className="sticky top-4 space-y-4">
                {/* 카테고리 필터 */}
                <div>
                  <CategoryFilter 
                    selectedCategories={selectedCategories}
                    onCategorySelect={handleCategorySelect}
                  />
                </div>
                
                {/* 연도 필터 */}
                <YearFilter 
                  yearRange={yearRange}
                  onYearRangeChange={handleYearRangeChange}
                />
              </div>
            </div>

            {/* 우측 검색 결과 영역 */}
            <div className="flex-1 min-w-0">

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" style={{ color: '#4FA3D1' }} />
                  <p className="text-gray-600">검색 중...</p>
                </div>
              )}

              {/* Error State */}
              {isError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>
                    {error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.'}
                  </AlertDescription>
                </Alert>
              )}

              {/* Results */}
              {!isLoading && !isError && (
                <>
                  {/* Search Info */}
                  <div className="mb-6">
                    <p className="text-gray-600">
                      <span className="text-[#215285]">"{searchQuery}"</span>에 대한 검색 결과 
                      <span className="ml-2 text-sm text-gray-500">({filteredPapers.length}개의 논문)</span>
                    </p>
                    
                    {/* 선택된 필터 표시 */}
                    {(selectedCategories.length > 0 || isYearFilterActive) && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-500">필터:</span>
                        
                        {/* 카테고리 필터 */}
                        {selectedCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleRemoveCategory(category)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors"
                            style={{ 
                              backgroundColor: '#EAF4FA', 
                              color: '#4FA3D1',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#D5E9F5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#EAF4FA';
                            }}
                          >
                            {getCategoryNameByCode(category)}
                            <X className="h-3 w-3" />
                          </button>
                        ))}
                        
                        {/* 연도 필터 */}
                        {isYearFilterActive && (
                          <button
                            onClick={() => setYearRange([2015, 2025])}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors"
                            style={{ 
                              backgroundColor: '#EAF4FA', 
                              color: '#4FA3D1',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#D5E9F5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#EAF4FA';
                            }}
                          >
                            {yearRange[0]}년 ~ {yearRange[1]}년
                            <X className="h-3 w-3" />
                          </button>
                        )}
                        
                        {(selectedCategories.length > 1 || (selectedCategories.length > 0 && isYearFilterActive)) && (
                          <button
                            onClick={() => {
                              handleClearAllFilters();
                              setYearRange([2015, 2025]);
                            }}
                            className="text-sm text-gray-500 hover:text-[#4FA3D1] underline"
                          >
                            모두 지우기
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Paper List */}
                  <div className="space-y-4 mb-12">
                    {currentPapers.length > 0 ? (
                      currentPapers.map((paper) => (
                        <UnifiedPaperCard
                          key={paper.id}
                          paperId={paper.id}
                          title={paper.title}
                          authors={Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                          year={typeof paper.year === 'string' ? paper.year : String(paper.year)}
                          publisher={paper.publisher}
                          variant="compact"
                          onPaperClick={handlePaperClick}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                          {searchQuery ? '검색 결과가 없습니다.' : '검색어를 입력해주세요.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center">
                      <Pagination>
                        <PaginationContent className="flex-wrap gap-1">
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                              {page === 'ellipsis' ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  onClick={() => setCurrentPage(page as number)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                  style={
                                    currentPage === page
                                      ? { backgroundColor: '#4FA3D1', color: 'white', borderColor: '#4FA3D1' }
                                      : {}
                                  }
                                >
                                  {page}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
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
