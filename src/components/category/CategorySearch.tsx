/**
 * CategorySearch 컴포넌트
 * 
 * 홈 페이지에서 사용되는 카테고리 검색 컴포넌트입니다.
 * - 2단계 카테고리 선택 방식 (상위 카테고리 → 하위 카테고리)
 * - 상위 카테고리를 선택하면 해당 하위 카테고리들이 표시됩니다.
 * - 하위 카테고리 클릭 시 검색 페이지로 이동합니다.
 */

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

/**
 * 색상 상수
 */
const COLORS = {
  primary: '#4FA3D1',
  primaryDark: '#215285',
  hover: '#f3f4f6',
  text: '#333',
  border: '#e5e7eb',
  white: '#fff',
} as const;

/**
 * 하위 카테고리 타입
 */
interface SubCategory {
  name: string;  // 카테고리 이름
  code: string;   // 카테고리 코드 (arXiv 코드)
}

/**
 * 상위 카테고리 타입
 */
interface Category {
  id: string;              // 카테고리 고유 ID
  name: string;            // 카테고리 이름
  subCategories: SubCategory[];  // 하위 카테고리 목록
}

/**
 * CategorySearch 컴포넌트 Props
 */
interface CategorySearchProps {
  onCategorySelect: (categoryCode: string) => void;  // 하위 카테고리 선택 시 호출되는 콜백
}

/**
 * 논문 카테고리 데이터
 * 8개의 주요 카테고리 그룹과 각 그룹의 하위 카테고리들을 정의합니다.
 * 각 하위 카테고리는 arXiv 카테고리 코드를 사용합니다.
 */
const categories: Category[] = [
  {
    id: 'ai',
    name: '인공지능',
    subCategories: [
      { name: '인공지능', code: 'cs.AI' },
      { name: '기계학습', code: 'cs.LG' },
      { name: '신경 및 진화 계산', code: 'cs.NE' },
      { name: '자연어 처리', code: 'cs.CL' },
      { name: '컴퓨터 비전', code: 'cs.CV' },
      { name: '멀티미디어', code: 'cs.MM' },
      { name: '정보 검색', code: 'cs.IR' },
    ],
  },
  {
    id: 'database',
    name: '데이터베이스',
    subCategories: [
      { name: '데이터베이스', code: 'cs.DB' },
      { name: '디지털 라이브러리', code: 'cs.DL' },
      { name: '컴퓨터와 사회', code: 'cs.CY' },
    ],
  },
  {
    id: 'systems',
    name: '시스템',
    subCategories: [
      { name: '운영체제', code: 'cs.OS' },
      { name: '분산 및 병렬 컴퓨팅', code: 'cs.DC' },
      { name: '네트워크 및 인터넷 아키텍처', code: 'cs.NI' },
      { name: '제어 시스템', code: 'cs.SY' },
      { name: '소프트웨어 공학', code: 'cs.SE' },
      { name: '프로그래밍 언어', code: 'cs.PL' },
      { name: '하드웨어 아키텍처', code: 'cs.AR' },
      { name: '컴퓨터 공학', code: 'cs.CE' },
      { name: '기타 컴퓨터 과학 일반', code: 'cs.OH' },
    ],
  },
  {
    id: 'security',
    name: '보안',
    subCategories: [
      { name: '암호학 및 보안', code: 'cs.CR' },
      { name: '정보 이론', code: 'cs.IT' },
    ],
  },
  {
    id: 'theory',
    name: '계산 이론',
    subCategories: [
      { name: '계산 복잡도', code: 'cs.CC' },
      { name: '형식 언어 및 자동자', code: 'cs.FL' },
      { name: '수리 논리', code: 'cs.LO' },
      { name: '자료구조 및 알고리즘', code: 'cs.DS' },
      { name: '이산수학', code: 'cs.DM' },
      { name: '성능 및 형식 검증', code: 'cs.PF' },
    ],
  },
  {
    id: 'graphics',
    name: '그래픽스',
    subCategories: [
      { name: '계산 기하학', code: 'cs.CG' },
      { name: '그래픽스', code: 'cs.GR' },
      { name: '기하 위상학', code: 'cs.GT' },
      { name: '수학적 소프트웨어', code: 'cs.MS' },
      { name: '일반 문헌/기하 모델링', code: 'cs.GL' },
    ],
  },
  {
    id: 'simulation',
    name: '시뮬레이션',
    subCategories: [
      { name: '수치 해석', code: 'cs.NA' },
      { name: '공학 응용', code: 'cs.ET' },
      { name: '과학적 계산', code: 'cs.SC' },
      { name: '음향 및 신호 처리', code: 'cs.SD' },
      { name: '시뮬레이션 및 모델링', code: 'cs.SI' },
      { name: '로봇공학', code: 'cs.RO' },
      { name: '계산생물학', code: 'cs.MA' },
    ],
  },
  {
    id: 'hci',
    name: '인간-컴퓨터',
    subCategories: [
      { name: '인간-컴퓨터 상호작용', code: 'cs.HC' },
    ],
  },
];

/**
 * CategorySearch 메인 컴포넌트
 * 
 * 홈 페이지에서 카테고리로 논문을 검색할 수 있는 2단계 선택 인터페이스를 제공합니다.
 * 
 * @param onCategorySelect - 하위 카테고리 선택 시 호출되는 콜백 함수
 */
export function CategorySearch({ onCategorySelect }: CategorySearchProps) {
  // 선택된 상위 카테고리 ID (초기값: 'ai' - 인공지능)
  const [selectedCategory, setSelectedCategory] = useState<string | null>('ai');

  /**
   * 상위 카테고리 클릭 핸들러
   * 같은 카테고리를 다시 클릭하면 선택 해제됩니다 (토글 기능).
   * 
   * @param categoryId - 클릭한 카테고리 ID
   */
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // 선택된 상위 카테고리의 데이터 조회
  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10">
        {/* 섹션 헤더 - 아이콘과 제목 */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-7 w-7" style={{ color: COLORS.primary }} />
          <h2 className="text-[var(--font-size-28)]">카테고리로 검색</h2>
        </div>

        {/* 메인 카드 컨테이너 */}
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4 md:p-6">
            {/* 설명 텍스트 */}
            <p className="text-gray-600 mb-6">
              관심있는 분야의 논문을 빠르게 찾아보세요
            </p>

            {/* 1차 카테고리 선택 영역 - 가로 스크롤 가능한 버튼 그룹 */}
            <div className="mb-6">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex flex-wrap gap-2 pb-2">
                  {categories.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    return (
                      <Button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        variant="outline"
                        className={`h-10 px-4 transition-all rounded-lg ${
                          !isSelected ? 'hover:bg-gray-100' : ''
                        }`}
                        style={{
                          backgroundColor: isSelected ? COLORS.primary : 'transparent',
                          color: isSelected ? COLORS.white : COLORS.text,
                          border: isSelected
                            ? `1px solid ${COLORS.primary}`
                            : `1px solid ${COLORS.border}`,
                        }}
                      >
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* 2차 카테고리 선택 영역 - 선택된 상위 카테고리의 하위 카테고리 표시 */}
            {selectedCategoryData && (
              <div
                className="border-t border-gray-200 pt-6 animate-in fade-in slide-in-from-top-2 duration-300"
                key={selectedCategory}
              >
                {/* 하위 카테고리 섹션 제목 */}
                <h3 className="mb-4" style={{ color: COLORS.primaryDark }}>
                  {selectedCategoryData.name} 세부 분야
                </h3>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategoryData.subCategories.map((subCategory) => (
                      <Tooltip key={subCategory.code}>
                        <TooltipTrigger asChild>
                          {/* 하위 카테고리 선택 버튼 - 클릭 시 검색 페이지로 이동 */}
                          <button
                            onClick={() => onCategorySelect(subCategory.code)}
                            className="h-10 px-4 transition-all rounded-lg hover:bg-gray-100 cursor-pointer border"
                            style={{
                              backgroundColor: 'transparent',
                              color: COLORS.text,
                              borderColor: COLORS.border,
                            }}
                          >
                            {subCategory.name}
                          </button>
                        </TooltipTrigger>
                        {/* 마우스 오버 시 카테고리 코드 표시 */}
                        <TooltipContent
                          side="top"
                          className="bg-gray-800 text-white border-none"
                        >
                          <p>{subCategory.code}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

