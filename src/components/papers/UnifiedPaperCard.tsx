import { useState, useRef, useEffect } from 'react';
import { User, BookOpen, ArrowRight, Bookmark, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { UnifiedPaperCardProps } from '../../types/paper';

/**
 * 색상 상수
 */
const COLORS = {
  primary: '#215285',      // 메인 색상 (제목, 텍스트)
  accent: '#4FA3D1',       // 강조 색상 (아이콘, 북마크, 호버)
  link: '#2563eb',         // 링크 색상 (자세히 보기)
  bookmarkInactive: '#ccc', // 비활성 북마크 색상
  categoryBg: '#EAF4FA',   // 카테고리 배경 색상
} as const;

/**
 * 통합 PaperCard 컴포넌트
 * 
 * variant에 따라 다른 레이아웃을 렌더링합니다:
 * - 'default': 기본 카드 레이아웃 (publisher, year, pages 표시)
 * - 'list': 목록 형태 (PaperListCard 스타일)
 * - 'search': 검색 결과 형태 (update_count/update_date, categories 표시)
 * - 'compact': 컴팩트 형태 (categories만 표시)
 * - 'recommended': 추천 논문 형태 (categories, summary 표시)
 * - 'popular': 인기 논문 형태 (제목, 저자, update_date, categories만 표시)
 * 
 * @example
 * ```tsx
 * <UnifiedPaperCard
 *   paperId="123"
 *   title="논문 제목"
 *   authors={["저자1", "저자2"]}
 *   variant="search"
 *   showExternalLink={true}
 *   showJournal={true}
 *   journal="저널명"
 * />
 * ```
 */
export function UnifiedPaperCard({
  paperId,
  title,
  authors,
  publisher,
  year,
  pages,
  summary,
  translatedSummary,
  externalUrl,
  update_count,
  update_date,
  categories,
  journal,
  isBookmarked = false,
  onToggleBookmark,
  onPaperClick,
  variant = 'default',
  showSummary = false,
  showTranslatedSummary = false,
  showBookmark = true,
  showExternalLink = false,
  showJournal = false,
  showCategories = true,
  className,
  recommendationId,
}: UnifiedPaperCardProps) {
  // 저자 확장/축소 상태
  const [isAuthorsExpanded, setIsAuthorsExpanded] = useState(false);
  
  // 저자 더보기 버튼 표시 여부
  const [showExpandButton, setShowExpandButton] = useState(false);
  
  // 저자 텍스트 참조
  const authorsRef = useRef<HTMLDivElement>(null);
  
  // 저자 텍스트 정규화
  const authorsText = Array.isArray(authors) ? authors.join(', ') : authors;
  
  // 연도 텍스트 정규화
  const yearText = year ? String(year) : undefined;

  /**
   * 저자 텍스트가 2줄 이상인지 확인
   * 2줄 이상이면 "더보기" 버튼 표시
   */
  useEffect(() => {
    if (authorsRef.current) {
      const element = authorsRef.current;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 2; // 2줄 높이
      setShowExpandButton(element.scrollHeight > maxHeight);
    }
  }, [authorsText]);

  /**
   * 카드 클릭 핸들러
   * 논문 상세 페이지로 이동
   */
  const handleCardClick = () => {
    if (onPaperClick) {
      onPaperClick(paperId, recommendationId);
    }
  };

  /**
   * 북마크 클릭 핸들러
   * 이벤트 전파를 막고 북마크 토글 실행
   */
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(paperId);
    }
  };

  /**
   * 저자 확장/축소 토글 핸들러
   */
  const handleAuthorToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAuthorsExpanded(!isAuthorsExpanded);
  };

  /**
   * 북마크 버튼 렌더링
   * variant에 따라 크기와 위치가 다름
   */
  const renderBookmark = () => {
    if (!showBookmark || !onToggleBookmark) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-105 z-10 ${
                variant === 'recommended' ? 'top-3 right-3 p-1.5' : ''
              }`}
              onClick={handleBookmarkClick}
            >
              <Bookmark
                className={`transition-colors ${
                  variant === 'recommended' ? 'w-4 h-4' : 'w-5 h-5'
                }`}
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
    );
  };

  /**
   * 저자 더보기 버튼 렌더링
   */
  const renderAuthorExpandButton = () => {
    if (!showExpandButton) return null;

    return (
      <button
        type="button"
        className="mt-1 text-sm hover:underline transition-colors"
        style={{ color: COLORS.primary }}
        onClick={handleAuthorToggle}
      >
        {isAuthorsExpanded ? '간략히' : '더보기'}
      </button>
    );
  };

  /**
   * 카테고리 태그 렌더링
   */
  const renderCategories = () => {
    if (!showCategories || !categories || categories.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: COLORS.categoryBg,
              color: COLORS.accent,
            }}
          >
            {category}
          </span>
        ))}
      </div>
    );
  };

  // Popular variant: 인기 논문 형태 (제목, 저자, update_date, categories만 표시)
  if (variant === 'popular') {
    return (
      <div 
        className={`transition-shadow hover:shadow-md relative cursor-pointer bg-white rounded-lg border border-gray-200 p-4 md:p-6 ${className || ''}`}
        onClick={handleCardClick}
      >
        {renderBookmark()}

        <div className="space-y-3">
          {/* 제목 */}
          <h3 
            className="line-clamp-2 cursor-pointer transition-colors break-words"
            style={{ color: COLORS.primary }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.accent}
            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.primary}
            onClick={handleCardClick}
          >
            {title}
          </h3>

          {/* 저자 */}
          <div className="text-sm text-gray-600 break-words">
            <div 
              ref={authorsRef}
              className={`${isAuthorsExpanded ? '' : 'line-clamp-2'}`}
            >
              저자: {authorsText}
            </div>
            {renderAuthorExpandButton()}
          </div>

          {/* 업데이트 날짜 */}
          {update_date && (
            <div className="text-sm text-gray-600">
              업데이트: {update_date}
            </div>
          )}

          {/* 카테고리 */}
          {renderCategories()}
        </div>
      </div>
    );
  }

  // Search variant: 검색 결과 형태
  if (variant === 'search') {
    return (
      <div 
        className={`transition-shadow hover:shadow-md relative cursor-pointer bg-white rounded-lg border border-gray-200 p-4 md:p-6 ${className || ''}`}
        onClick={handleCardClick}
      >
        {renderBookmark()}

        <div className="space-y-3">
            <h3 
              className="line-clamp-2 cursor-pointer transition-colors break-words"
              style={{ color: COLORS.primary }}
              onMouseEnter={(e) => e.currentTarget.style.color = COLORS.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = COLORS.primary}
              onClick={handleCardClick}
            >
              {title}
            </h3>

            {/* 저자 */}
            <div className="text-sm text-gray-600 break-words">
              <div 
                ref={authorsRef}
                className={`${isAuthorsExpanded ? '' : 'line-clamp-2'}`}
              >
                저자: {authorsText}
              </div>
              {renderAuthorExpandButton()}
            </div>

            {/* Journal */}
            {showJournal && (
              <div className="text-sm text-gray-600 break-words">
                저널: {journal && typeof journal === 'string' && journal.trim() !== '' ? journal : 'Undefined'}
              </div>
            )}

            {/* Meta Info: update_count/update_date and categories */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Update Count or Update Date */}
              {update_count !== undefined && update_count !== null ? (
                <span className="text-sm text-gray-600">
                  업데이트: {update_count}회
                </span>
              ) : update_date ? (
                <span className="text-sm text-gray-600">
                  업데이트: {update_date}
                </span>
              ) : (
                <span className="text-sm text-gray-400">
                  업데이트: -
                </span>
              )}

              {/* 카테고리 */}
              {renderCategories()}
            </div>

            {/* View Original Button */}
            {showExternalLink && externalUrl && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-[#215285] hover:text-white"
                  style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  onClick={() => window.open(externalUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  원문 보기
                </Button>
              </div>
            )}
        </div>
      </div>
    );
  }

  // Compact variant: 컴팩트 형태
  if (variant === 'compact') {
    return (
      <Card 
        className={`transition-all hover:shadow-md relative ${className || ''}`}
        style={{ borderColor: 'transparent' }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accent}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
      >
        <CardContent className="p-4 md:p-5">
          {renderBookmark()}
          
          <div className="flex flex-col justify-between">
              <div>
                <h3
                  className="line-clamp-2 mb-2 cursor-pointer hover:text-[#4FA3D1] transition-colors"
                  style={{ color: COLORS.primary }}
                  onClick={handleCardClick}
                >
                  {title}
                </h3>

                {/* Authors */}
                <div className="text-sm text-gray-600 mb-2">
                  <div 
                    ref={authorsRef}
                    className={`${isAuthorsExpanded ? '' : 'line-clamp-2'}`}
                  >
                    저자: {authorsText}
                  </div>
                  {renderAuthorExpandButton()}
                </div>

                {/* Journal */}
                {showJournal && (
                  <div className="text-sm text-gray-600 mb-2">
                    저널: {journal && typeof journal === 'string' && journal.trim() !== '' ? journal : 'Undefined'}
                  </div>
                )}

                {/* Categories */}
                {showCategories && categories && categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: COLORS.categoryBg,
                          color: COLORS.accent,
                        }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 자세히 보기 링크 */}
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleCardClick}
                  className="flex items-center gap-1 text-sm transition-colors hover:underline"
                  style={{ color: COLORS.link }}
                >
                  자세히 보기
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Recommended variant: 추천 논문 형태
  if (variant === 'recommended') {
    return (
      <Card 
        className={`transition-shadow hover:shadow-md relative border border-gray-200 ${className || ''}`}
      >
        <CardContent className="p-5 flex flex-col h-full">
          {renderBookmark()}

          <h4
            onClick={handleCardClick}
            className="line-clamp-2 min-h-[3rem] mb-2 cursor-pointer hover:text-[#4FA3D1] transition-colors pr-6"
            style={{ color: '#215285' }}
          >
            {title}
          </h4>

          {/* Authors */}
          {authorsText && (
            <div className="mb-2 text-sm text-gray-600 break-words">
              <div 
                ref={authorsRef}
                className={`${isAuthorsExpanded ? '' : 'line-clamp-2'}`}
              >
                저자: {authorsText}
              </div>
              {renderAuthorExpandButton()}
            </div>
          )}

          {/* Journal */}
          {showJournal && (
            <div className="mb-2 text-sm text-gray-600 break-words">
              저널: {journal && typeof journal === 'string' && journal.trim() !== '' ? journal : 'Undefined'}
            </div>
          )}

          {/* Categories */}
          {showCategories && categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#EAF4FA',
                    color: '#4FA3D1',
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Summary */}
          {showSummary && summary && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-2">
              {typeof summary === 'string' ? summary : String(summary)}
            </p>
          )}

          {/* Translated Summary */}
          {showTranslatedSummary && translatedSummary && (
            <p className="text-sm text-gray-500 line-clamp-3 mb-4">
              {typeof translatedSummary === 'string' ? translatedSummary : String(translatedSummary)}
            </p>
          )}

          {/* 자세히 보기 링크 */}
          <div className="mt-auto flex justify-end">
            <button
              onClick={handleCardClick}
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
  }

  // Default/List variant: 목록 형태 (가장 많이 사용됨)
  return (
    <Card className={`transition-shadow hover:shadow-md relative ${className || ''}`}>
      <CardContent className="p-4 md:p-6">
        {renderBookmark()}

        <div className="flex flex-col">
            {/* 제목 - 클릭 가능한 링크 */}
            <h3
              onClick={handleCardClick}
              className="line-clamp-2 cursor-pointer hover:text-[#4FA3D1] transition-colors mb-2"
              style={{ color: '#215285' }}
            >
              {title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <User className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div 
                    ref={authorsRef}
                    className={`${isAuthorsExpanded ? '' : 'line-clamp-2'}`}
                  >
                    저자: {authorsText}
                  </div>
                  {renderAuthorExpandButton()}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span>{publisher}</span>
              </div>

              {pages && <span className="text-gray-500">{pages}</span>}
              {yearText && !pages && <span className="text-gray-500">{yearText}</span>}
            </div>

            {/* Journal */}
            {showJournal && (
              <div className="text-sm text-gray-600 mb-2">
                저널: {journal && typeof journal === 'string' && journal.trim() !== '' ? journal : 'Undefined'}
              </div>
            )}

            {/* Summary */}
            {showSummary && summary && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                {typeof summary === 'string' ? summary : String(summary)}
              </p>
            )}

            {/* Translated Summary */}
            {showTranslatedSummary && translatedSummary && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {typeof translatedSummary === 'string' ? translatedSummary : String(translatedSummary)}
              </p>
            )}

            {/* 자세히 보기 링크 */}
            <div className="mt-auto flex justify-end">
              <button
                onClick={handleCardClick}
                className="flex items-center gap-1 text-sm transition-colors hover:underline"
                style={{ color: COLORS.link }}
              >
                자세히 보기
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
