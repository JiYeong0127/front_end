import { useAuthStore } from '../store/authStore';
import { useNavigation } from './useNavigation';
import { useToggleBookmarkMutation } from './api';

export function usePaperActions() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { goToPaper, goToLogin } = useNavigation();
  const toggleBookmarkMutation = useToggleBookmarkMutation();

  const handlePaperClick = (paperId: number) => {
    if (!isLoggedIn) {
      goToLogin();
      return;
    }
    goToPaper(paperId);
  };

  const handleBookmark = (paperId: number) => {
    toggleBookmarkMutation.mutate(paperId);
  };

  return {
    handlePaperClick,
    handleBookmark,
    isLoggedIn,
  };
}
