import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { UnifiedPaperCard } from '../papers/UnifiedPaperCard';
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
import { usePaperActions } from '../../hooks/usePaperActions';
import { useAuthStore } from '../../store/authStore';

// Mock data
const mockRecentPapers = [
  {
    id: 1,
    title: 'Attention Is All You Need',
    authors: 'Vaswani, A., Shazeer, N., Parmar, N.',
    year: '2017',
    publisher: 'NeurIPS',
  },
  {
    id: 2,
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: 'Devlin, J., Chang, M., Lee, K.',
    year: '2019',
    publisher: 'NAACL',
  },
  {
    id: 3,
    title: 'ResNet: Deep Residual Learning for Image Recognition',
    authors: 'He, K., Zhang, X., Ren, S.',
    year: '2016',
    publisher: 'CVPR',
  },
  {
    id: 4,
    title: 'GPT-3: Language Models are Few-Shot Learners',
    authors: 'Brown, T., Mann, B., Ryder, N.',
    year: '2020',
    publisher: 'NeurIPS',
  },
  {
    id: 5,
    title: 'Vision Transformer (ViT)',
    authors: 'Dosovitskiy, A., Beyer, L., Kolesnikov, A.',
    year: '2021',
    publisher: 'ICLR',
  },
];

const ITEMS_PER_PAGE = 10;

export function RecentlyViewedListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { handlePaperClick } = usePaperActions();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const totalPages = Math.ceil(mockRecentPapers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPapers = mockRecentPapers.slice(startIndex, endIndex);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">로그인이 필요한 페이지입니다.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="h-7 w-7" style={{ color: '#4FA3D1' }} />
            <h1 className="text-3xl font-bold" style={{ color: '#215285' }}>
              최근 본 논문
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            {currentPapers.length > 0 ? (
              currentPapers.map((paper) => (
                <UnifiedPaperCard
                  key={paper.id}
                  paperId={paper.id}
                  title={paper.title}
                  authors={paper.authors}
                  year={paper.year}
                  publisher={paper.publisher}
                  variant="compact"
                  onPaperClick={handlePaperClick}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">최근 본 논문이 없습니다.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
