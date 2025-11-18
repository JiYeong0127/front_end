import { Sparkles } from 'lucide-react';
import { Header } from '../layout/Header';
import { SearchHeader } from '../layout/SearchHeader';
import { UnifiedPaperCard } from '../papers/UnifiedPaperCard';
import { Footer } from '../layout/Footer';
import { Separator } from '../ui/separator';
import { ScrollToTopButton } from '../layout/ScrollToTopButton';

interface SearchResultsPageProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

// Mock data - 실제로는 API에서 가져올 데이터
const mockSearchResults = [
  {
    id: 1,
    title: "Attention Is All You Need",
    authors: "Vaswani, A., Shazeer, N., Parmar, N., et al.",
    year: "2017",
    publisher: "NeurIPS",
    translatedSummary: "본 논문에서는 순환 신경망(RNN)이나 합성곱 신경망(CNN)을 사용하지 않고 오직 어텐션(Attention) 메커니즘만을 기반으로 한 새로운 신경망 아키텍처인 Transformer를 제안합니다. 이 모델은 기계 번역 작업에서 기존 모델들보다 우수한 성능을 보이면서도 훨씬 적은 학습 시간을 필요로 합니다. Transformer의 핵심은 Multi-Head Self-Attention 메커니즘으로, 입력 시퀀스의 모든 위치 간 관계를 병렬적으로 계산할 수 있습니다.",
    externalUrl: "https://arxiv.org/abs/1706.03762"
  },
  {
    id: 2,
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Devlin, J., Chang, M. W., Lee, K., Toutanova, K.",
    year: "2019",
    publisher: "NAACL",
    translatedSummary: "BERT는 양방향 Transformer를 사전 학습하여 언어 표현을 학습하는 새로운 방법을 제안합니다. 기존의 단방향 언어 모델과 달리, BERT는 Masked Language Model(MLM)과 Next Sentence Prediction(NSP) 작업을 통해 문맥의 양쪽 방향 정보를 모두 활용합니다. 이를 통해 11개의 자연어 처리 작업에서 최고 수준의 성능을 달성했으며, 특히 질의응답과 자연어 추론 작업에서 큰 성능 향상을 보였습니다.",
    externalUrl: "https://arxiv.org/abs/1810.04805"
  },
  {
    id: 3,
    title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
    authors: "Dosovitskiy, A., Beyer, L., Kolesnikov, A., et al.",
    year: "2021",
    publisher: "ICLR",
    translatedSummary: "본 연구는 순수한 Transformer 아키텍처를 이미지 분류 작업에 직접 적용한 Vision Transformer(ViT)를 제안합니다. 이미지를 16x16 크기의 패치로 나누고 각 패치를 토큰처럼 취급하여 Transformer 인코더에 입력합니다. 충분히 큰 데이터셋으로 사전 학습할 경우, ViT는 합성곱 신경망 기반 모델들과 비교하여 동등하거나 더 나은 성능을 보이면서도 학습에 필요한 계산 비용이 훨씬 적습니다.",
    externalUrl: "https://arxiv.org/abs/2010.11929"
  }
];

const mockRecommendedPapers = [
  {
    id: 101,
    title: "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer",
    summary: "다양한 NLP 작업을 통합된 텍스트-투-텍스트 형식으로 변환하여 학습하는 T5 모델 제안",
    externalUrl: "https://arxiv.org/abs/1910.10683"
  },
  {
    id: 102,
    title: "Language Models are Few-Shot Learners",
    summary: "GPT-3의 소개 및 대규모 언어 모델의 few-shot 학습 능력에 대한 연구",
    externalUrl: "https://arxiv.org/abs/2005.14165"
  },
  {
    id: 103,
    title: "XLNet: Generalized Autoregressive Pretraining for Language Understanding",
    summary: "순열 언어 모델링을 통해 BERT의 한계를 극복한 XLNet 아키텍처",
    externalUrl: "https://arxiv.org/abs/1906.08237"
  },
  {
    id: 104,
    title: "RoBERTa: A Robustly Optimized BERT Pretraining Approach",
    summary: "BERT의 학습 방법을 개선하여 성능을 향상시킨 RoBERTa 모델",
    externalUrl: "https://arxiv.org/abs/1907.11692"
  },
  {
    id: 105,
    title: "ELECTRA: Pre-training Text Encoders as Discriminators Rather Than Generators",
    summary: "생성자-판별자 구조를 활용한 효율적인 사전 학습 방법 ELECTRA",
    externalUrl: "https://arxiv.org/abs/2003.10555"
  }
];

export function SearchResultsPage({ 
  searchQuery, 
  onSearch
}: SearchResultsPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <SearchHeader initialQuery={searchQuery} onSearch={onSearch} />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 py-8">
          {/* Search Info */}
          <div className="mb-6">
            <p className="text-gray-600">
              <span className="text-[#215285]">"{searchQuery}"</span>에 대한 검색 결과 
              <span className="ml-2 text-sm text-gray-500">({mockSearchResults.length}개의 논문)</span>
            </p>
          </div>

          {/* Search Results */}
          <div className="space-y-6 mb-16">
            {mockSearchResults.map((paper) => (
              <UnifiedPaperCard
                key={paper.id}
                paperId={paper.id}
                title={paper.title}
                authors={paper.authors}
                year={paper.year}
                publisher={paper.publisher}
                translatedSummary={paper.translatedSummary}
                externalUrl={paper.externalUrl}
                variant="search"
                showTranslatedSummary={true}
                showExternalLink={true}
                showBookmark={false}
              />
            ))}
          </div>

          {/* Separator */}
          <Separator className="my-12" />

          {/* Recommended Papers Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6" style={{ color: '#4FA3D1' }} />
              <h2 className="text-[24px]">추천 논문</h2>
            </div>
            <p className="text-gray-600 mb-6">
              검색하신 키워드와 관련된 논문을 추천해드립니다
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockRecommendedPapers.map((paper) => (
                <UnifiedPaperCard
                  key={paper.id}
                  paperId={paper.id}
                  title={paper.title}
                  authors="" // 추천 논문에는 authors가 없으므로 빈 문자열
                  publisher=""
                  summary={paper.summary}
                  externalUrl={paper.externalUrl}
                  variant="recommended"
                  showSummary={true}
                  showBookmark={false}
                  onPaperClick={() => onSearch(paper.title)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
