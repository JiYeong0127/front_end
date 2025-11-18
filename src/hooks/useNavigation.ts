import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export function useNavigation() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  return {
    navigate,
    params,
    searchParams,
    goToLogin: () => navigate('/login'),
    goToSignup: () => navigate('/signup'),
    goToHome: () => navigate('/'),
    goToService: () => navigate('/intro'),
    goToGuide: () => navigate('/guide'),
    goToMyPage: () => navigate('/mypage'),
    goToRecentPapers: () => navigate('/recent'),
    goToMyLibrary: () => navigate('/library'),
    goToPaper: (paperId: number) => navigate(`/paper/${paperId}`),
    goToSearch: (query: string) => navigate(`/search?q=${encodeURIComponent(query)}`),
    goBack: () => navigate(-1),
  };
}
