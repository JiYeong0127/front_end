/**
 * 이용 가이드 페이지 컴포넌트
 * 
 * 기능: 서비스 이용 방법 안내 및 FAQ 제공
 */
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Search, FileText, Bookmark, Heart, User } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton';

const COLORS = {
  primary: '#215285',
  accent: '#4FA3D1',
};

export function UserGuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: COLORS.primary }}>
              이용 가이드
            </h1>
            <p className="text-gray-600 text-lg">
              RSRS 논문 검색 서비스를 더 효과적으로 이용하는 방법을 안내해드립니다.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Search className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: COLORS.accent }} />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">논문 검색하기</h2>
                    <p className="text-gray-600">
                      검색창에 논문 제목, 저자, 키워드 등을 입력하여 원하는 논문을 찾을 수 있습니다.
                      최근 검색어는 자동으로 저장되어 빠르게 다시 검색할 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <FileText className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: COLORS.accent }} />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">논문 상세 보기</h2>
                    <p className="text-gray-600">
                      논문 제목을 클릭하면 상세 정보를 확인할 수 있습니다. 
                      자동 번역된 요약과 원문 링크를 제공합니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Bookmark className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: COLORS.accent }} />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">북마크 기능</h2>
                    <p className="text-gray-600">
                      관심 있는 논문을 북마크하여 나만의 서재를 만들 수 있습니다.
                      북마크한 논문은 '내 서재'에서 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Heart className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: COLORS.accent }} />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">관심 카테고리 설정</h2>
                    <p className="text-gray-600">
                      마이페이지에서 관심 카테고리를 설정하면 관련 논문을 추천받을 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="search">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5" style={{ color: COLORS.accent }} />
                        <span>검색 기능 사용법</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>검색창에 키워드를 입력하고 Enter 키를 누르거나 검색 버튼을 클릭하세요.</li>
                        <li>카테고리 필터와 연도 필터를 사용하여 검색 결과를 더 정확하게 찾을 수 있습니다.</li>
                        <li>최근 검색어를 클릭하면 빠르게 다시 검색할 수 있습니다.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bookmark">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Bookmark className="h-5 w-5" style={{ color: COLORS.accent }} />
                        <span>북마크 관리</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>논문 카드의 북마크 아이콘을 클릭하여 북마크를 추가하거나 제거할 수 있습니다.</li>
                        <li>북마크한 논문은 '내 서재' 페이지에서 확인할 수 있습니다.</li>
                        <li>로그인이 필요한 기능입니다.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="account">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5" style={{ color: COLORS.accent }} />
                        <span>계정 관리</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>마이페이지에서 프로필 사진, 비밀번호, 아이디를 변경할 수 있습니다.</li>
                        <li>관심 카테고리를 설정하여 맞춤형 논문 추천을 받을 수 있습니다.</li>
                        <li>최근 본 논문 기록을 확인할 수 있습니다.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
