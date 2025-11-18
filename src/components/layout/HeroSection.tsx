import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { toast } from "sonner";
import { useAuthStore } from "../../store/authStore";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchValue.trim()) {
      return;
    }

    if (!isLoggedIn) {
      toast.info('로그인 후 이용 가능한 기능입니다', {
        description: '검색 기능을 사용하려면 로그인해주세요.',
      });
      return;
    }

    const trimmedValue = searchValue.trim();
    setHasSearched(true);

    if (!recentSearches.includes(trimmedValue)) {
      const newSearches = [trimmedValue, ...recentSearches];
      // 검색창 길이를 기준으로 최대 개수 제한 (약 8개)
      if (newSearches.length > 8) {
        newSearches.pop();
      }
      setRecentSearches(newSearches);
    }
    if (onSearch) {
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

  const handleRecentSearchClick = (search: string) => {
    setSearchValue(search);

    if (!isLoggedIn) {
      toast.info('로그인 후 이용 가능한 기능입니다', {
        description: '검색 기능을 사용하려면 로그인해주세요.',
      });
      return;
    }

    if (onSearch) {
      onSearch(search);
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="px-4 text-[32px]">
            원하는 논문을 쉽게 검색하고 요약해보세요
          </h1>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-1 relative">
                <Input
                  id="hero-search"
                  name="hero-search"
                  type="text"
                  placeholder="논문 제목 또는 키워드를 입력하세요"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-24 py-8 text-base md:text-lg border-gray-300 focus:border-[#4FA3D1] focus:ring-[#4FA3D1]"
                  style={{
                    borderRadius: "var(--input-border-radius)",
                  }}
                />
                {/* Search Button - inside input */}
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-3 rounded-md transition-colors text-white flex items-center gap-2 text-base md:text-lg"
                  style={{ backgroundColor: "#4FA3D1" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3d8ab8"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4FA3D1"}
                  aria-label="검색"
                >
                  <Search className="h-6 w-6" />
                  <span className="hidden sm:inline">검색</span>
                </button>
              </div>
            </div>

            {/* Recent Searches */}
            {hasSearched && recentSearches.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 whitespace-nowrap">최근 검색:</span>
                <ScrollArea className="w-full">
                  <div className="flex gap-2 pb-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 whitespace-nowrap transition-colors"
                        onClick={() => handleRecentSearchClick(search)}
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

          <p className="text-gray-600 mt-4">
            AI 기반 자동 번역 및 요약으로 논문을 빠르게 이해하세요
          </p>
        </div>
      </div>
    </section>
  );
}