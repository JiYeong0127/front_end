import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface SearchHeaderProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  showRecentSearches?: boolean;
  maxRecentSearches?: number;
  className?: string;
}

export function SearchHeader({ 
  initialQuery = '', 
  onSearch,
  placeholder = '논문 제목 또는 키워드를 입력하세요',
  showRecentSearches = true,
  maxRecentSearches = 8,
  className
}: SearchHeaderProps) {
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery && !recentSearches.includes(initialQuery)) {
      const newSearches = [initialQuery, ...recentSearches];
      if (newSearches.length > 8) {
        newSearches.pop();
      }
      setRecentSearches(newSearches);
      setHasSearched(true);
    }
  }, [initialQuery]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      const trimmedValue = searchValue.trim();
      setHasSearched(true);
      
      if (!recentSearches.includes(trimmedValue)) {
        const newSearches = [trimmedValue, ...recentSearches];
        if (newSearches.length > maxRecentSearches) {
          newSearches.pop();
        }
        setRecentSearches(newSearches);
      }
      onSearch(trimmedValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const removeSearch = (searchToRemove: string) => {
    setRecentSearches(recentSearches.filter((s) => s !== searchToRemove));
  };

  return (
    <div className={`sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm ${className || ''}`}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 py-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <Input
                id="search-header"
                name="search-header"
                type="text"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pr-12 py-8 text-base md:text-lg border-gray-300 focus:border-[#4FA3D1] focus:ring-[#4FA3D1]"
                style={{
                  borderRadius: "var(--input-border-radius)",
                }}
              />
              {/* Mobile Search Icon */}
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 sm:hidden p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                style={{ color: "#4FA3D1" }}
                aria-label="검색"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            {/* Desktop Search Button */}
            <Button
              size="lg"
              onClick={handleSearch}
              className="hidden sm:flex text-white px-10 py-8 text-base md:text-lg items-center gap-2 cursor-pointer"
              style={{ backgroundColor: "#4FA3D1" }}
            >
              <Search className="h-6 w-6" />
              검색
            </Button>
          </div>

          {/* Recent Searches */}
          {showRecentSearches && hasSearched && recentSearches.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">최근 검색:</span>
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 whitespace-nowrap transition-colors"
                      onClick={() => {
                        setSearchValue(search);
                        onSearch(search);
                      }}
                    >
                      {search}
                      <X
                        className="h-3 w-3 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSearch(search);
                        }}
                      />
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
