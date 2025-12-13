/**
 * 로컬 검색 기록 관리 유틸리티
 * 
 * 기능: localStorage를 사용한 최근 검색어 저장 및 관리
 */
const STORAGE_KEY = 'recent_search_keywords';
const DEFAULT_LIMIT = 20;

export const loadRecentSearches = (limit: number = DEFAULT_LIMIT): string[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.slice(0, limit);
  } catch {
    return [];
  }
};

export const saveSearchKeyword = (query: string, limit: number = DEFAULT_LIMIT): string[] => {
  if (typeof window === 'undefined') return [];

  const trimmed = query.trim();
  if (!trimmed) return [];

  const current = loadRecentSearches(limit);
  const filtered = current.filter((q) => q !== trimmed);
  const updated = [trimmed, ...filtered].slice(0, limit);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const removeSearchKeyword = (query: string, limit: number = DEFAULT_LIMIT): string[] => {
  if (typeof window === 'undefined') return [];

  const current = loadRecentSearches(limit);
  const updated = current.filter((q) => q !== query);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearSearchKeywords = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
