/**
 * 논문 관련 타입 정의
 * 
 * 기능: 논문 데이터 및 PaperCard 컴포넌트 관련 타입 정의
 */

export interface Paper {
  id: number;
  title: string;
  authors: string | string[];
  pages?: string;
  publisher: string;
  year?: number | string;
  summary?: string | { en?: string; ko?: string | null };
  translatedSummary?: string;
  conference?: string;
  keywords?: string[];
  externalUrl?: string;
  categories?: string[];
  journal_ref?: string | null;
}

export interface PaperHandlers {
  onPaperClick: (paperId: number) => void;
  onToggleBookmark: (paperId: number) => void;
  onSearch: (query: string) => void;
}

export interface BasePaperCardProps {
  paperId: number | string;
  title: string;
  authors: string | string[];
  publisher?: string;
  year?: number | string;
  pages?: string;
  summary?: string | { en?: string; ko?: string | null };
  translatedSummary?: string;
  externalUrl?: string;
  update_count?: number;
  update_date?: string;
  categories?: string[];
  journal?: string | null;
  isBookmarked?: boolean;
  onToggleBookmark?: (paperId: number | string) => void;
  onPaperClick?: (paperId: number | string, recommendationId?: string) => void;
  recommendationId?: string;
}

export interface PaperCardVariant {
  variant?: 'default' | 'list' | 'search' | 'compact' | 'recommended' | 'popular';
  showSummary?: boolean;
  showTranslatedSummary?: boolean;
  showBookmark?: boolean;
  showExternalLink?: boolean;
  showJournal?: boolean;
  showCategories?: boolean;
  className?: string;
}

export type UnifiedPaperCardProps = BasePaperCardProps & PaperCardVariant;

