export interface Paper {
  id: number;
  title: string;
  authors: string | string[];
  pages?: string;
  publisher: string;
  year?: number | string;
  summary?: string;
  translatedSummary?: string;
  conference?: string;
  keywords?: string[];
  externalUrl?: string;
  categories?: string[];
}

export interface PaperHandlers {
  onPaperClick: (paperId: number) => void;
  onToggleBookmark: (paperId: number) => void;
  onSearch: (query: string) => void;
}

export interface PaperListCardProps {
  paper: Paper;
  variant?: 'default' | 'compact' | 'detailed';
  showBookmark?: boolean;
}

/**
 * 통합 PaperCard 컴포넌트를 위한 기본 Props
 */
export interface BasePaperCardProps {
  paperId: number | string; // 데이터베이스는 문자열, 기존 호환성을 위해 number도 허용
  title: string;
  authors: string | string[];
  publisher?: string;
  year?: number | string;
  pages?: string;
  summary?: string;
  translatedSummary?: string;
  externalUrl?: string;
  update_count?: number; // 업데이트 횟수
  update_date?: string; // 업데이트 날짜 (데이터베이스 스키마에 맞춤)
  categories?: string[]; // 카테고리 배열
  isBookmarked?: boolean;
  onToggleBookmark?: (paperId: number | string) => void;
  onPaperClick?: (paperId: number | string) => void;
}

/**
 * PaperCard variant 옵션
 */
export interface PaperCardVariant {
  variant?: 'default' | 'list' | 'search' | 'compact' | 'recommended';
  showSummary?: boolean;
  showTranslatedSummary?: boolean;
  showBookmark?: boolean;
  showExternalLink?: boolean;
  className?: string;
}

/**
 * 통합 PaperCard Props (BasePaperCardProps + PaperCardVariant)
 */
export type UnifiedPaperCardProps = BasePaperCardProps & PaperCardVariant;

