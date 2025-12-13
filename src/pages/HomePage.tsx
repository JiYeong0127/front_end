/**
 * 홈 페이지 컴포넌트
 * 
 * 기능: 메인 페이지로 검색, 카테고리 검색, 최근 본 논문, 인기 논문을 표시
 */
import { Header } from '../components/layout/Header';
import { HeroSection } from '../components/layout/HeroSection';
import { RecentlyViewedPapers } from '../components/papers/RecentlyViewedPapers';
import { CategorySearch } from '../components/category/CategorySearch';
import { PopularPapers } from '../components/papers/PopularPapers';
import { Footer } from '../components/layout/Footer';
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton';
import { useNavigation } from '../hooks/useNavigation';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/useAppStore';
import { usePaperActions } from '../hooks/usePaperActions';

export function HomePage() {
  const { goToLogin, goToSearch, goToCategorySearch } = useNavigation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const bookmarkedPaperIds = useAppStore((state) => state.bookmarkedPaperIds);
  const { handlePaperClick, handleBookmark } = usePaperActions();

  const handleCategorySelect = (categoryCode: string) => {
    if (!isLoggedIn) {
      goToLogin();
      return;
    }
    goToCategorySearch(categoryCode);
  };

  const handleSearch = (query: string) => {
    if (!isLoggedIn) {
      goToLogin();
      return;
    }
    goToSearch(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection onSearch={handleSearch} />
        {isLoggedIn && (
          <RecentlyViewedPapers 
            onPaperClick={handlePaperClick} 
            bookmarkedPaperIds={bookmarkedPaperIds.map(id => parseInt(id))}
            onToggleBookmark={handleBookmark}
          />
        )}
        <CategorySearch onCategorySelect={handleCategorySelect} />
        {isLoggedIn && (
          <PopularPapers 
            onToggleBookmark={handleBookmark}
            onPaperClick={handlePaperClick}
          />
        )}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
