/**
 * CategoryFilter 컴포넌트
 * 
 * 논문 검색 페이지에서 사용되는 카테고리 필터링 컴포넌트입니다.
 * - 트리 구조로 카테고리를 표시하고 다중 선택을 지원합니다.
 * - Desktop: 좌측 사이드바에 고정된 카드 형태로 표시
 * - Mobile: 우측 하단 플로팅 버튼으로 Sheet 패널을 열어 표시
 */

import { useState } from 'react';
import { ChevronRight, ChevronDown, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

/**
 * 색상 상수
 */
const COLORS = {
  primary: '#4FA3D1',
  primaryDark: '#215285',
  background: '#EAF4FA',
  hover: '#f3f4f6',
  text: '#333',
  textSecondary: '#666',
  border: '#cbd5e1',
} as const;

/**
 * 하위 카테고리 타입
 */
interface SubCategory {
  name: string;  // 카테고리 이름 
  code: string;  // 카테고리 코드
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
 * CategoryFilter 컴포넌트 Props
 */
interface CategoryFilterProps {
  selectedCategories?: string[];  // 선택된 카테고리 코드 배열
  onCategorySelect: (categoryCode: string) => void;  // 카테고리 선택 시 호출되는 콜백
}

/**
 * CategoryTreeContent 컴포넌트 Props
 */
interface CategoryTreeContentProps {
  selectedCategories?: string[];
  onCategorySelect: (categoryCode: string) => void;
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
 * 카테고리 코드로 카테고리 이름을 찾는 유틸리티 함수
 * 
 * @param code - 카테고리 코드 
 * @returns 카테고리 이름, 찾지 못한 경우 코드 그대로 반환
 */
export function getCategoryNameByCode(code: string): string {
  for (const category of categories) {
    const subCategory = category.subCategories.find(sub => sub.code === code);
    if (subCategory) {
      return subCategory.name;
    }
  }
  return code;
}

/**
 * 카테고리 트리 콘텐츠 컴포넌트
 * 아코디언 형태로 상위 카테고리를 확장/축소하고 하위 카테고리를 표시합니다.
 */
function CategoryTreeContent({ selectedCategories = [], onCategorySelect }: CategoryTreeContentProps) {
  // 확장된 카테고리 ID를 저장하는 상태 (Set을 사용하여 중복 방지)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  /**
   * 카테고리 확장/축소 토글 함수
   * @param categoryId - 토글할 카테고리 ID
   */
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.has(categoryId) ? newSet.delete(categoryId) : newSet.add(categoryId);
      return newSet;
    });
  };

  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id);

        return (
          <div key={category.id}>
            {/* 상위 카테고리 버튼 - 클릭 시 하위 카테고리 확장/축소 */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-md transition-colors"
            >
              {/* 확장 상태에 따라 아이콘 변경 */}
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: COLORS.primary }} />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: COLORS.textSecondary }} />
              )}
              <span className="text-left" style={{ color: COLORS.primaryDark }}>
                {category.name}
              </span>
            </button>

            {/* 하위 카테고리 목록 - 확장된 경우에만 표시 */}
            {isExpanded && (
              <div className="ml-6 mt-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <TooltipProvider>
                  {category.subCategories.map((subCategory) => {
                    const isSelected = selectedCategories.includes(subCategory.code);
                    return (
                      <Tooltip key={subCategory.code}>
                        <TooltipTrigger asChild>
                          {/* 하위 카테고리 선택 버튼 */}
                          <button
                            onClick={() => onCategorySelect(subCategory.code)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
                              !isSelected ? 'hover:bg-gray-100' : ''
                            }`}
                            style={{
                              backgroundColor: isSelected ? COLORS.background : 'transparent',
                              color: isSelected ? COLORS.primary : COLORS.text,
                            }}
                          >
                            {/* 선택 상태를 나타내는 체크박스 */}
                            <Checkbox 
                              checked={isSelected}
                              className="pointer-events-none"
                              style={{
                                borderColor: isSelected ? COLORS.primary : COLORS.border,
                              }}
                            />
                            <span className="flex-1">{subCategory.name}</span>
                          </button>
                        </TooltipTrigger>
                        {/* 툴팁: 마우스 오버 시 카테고리 코드 표시 */}
                        <TooltipContent
                          side="right"
                          className="bg-gray-800 text-white border-none"
                        >
                          <p>{subCategory.code}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * CategoryFilter 메인 컴포넌트
 * 
 * Desktop과 Mobile 환경에 따라 다른 UI를 제공합니다.
 * - Desktop (lg 이상): 좌측 사이드바에 고정된 카드 형태
 * - Mobile (lg 미만): 우측 하단 플로팅 버튼으로 Sheet 패널 열기
 * 
 * @param selectedCategories - 현재 선택된 카테고리 코드 배열
 * @param onCategorySelect - 카테고리 선택 시 호출되는 콜백 함수
 */
export function CategoryFilter({ 
  selectedCategories, 
  onCategorySelect,
}: CategoryFilterProps) {
  // 선택된 필터 개수 계산
  const totalFiltersCount = selectedCategories?.length || 0;
  
  return (
    <>
      {/* Desktop 버전 - lg 이상 화면에서만 표시 */}
      <Card className="hidden lg:block transition-shadow hover:shadow-md">
        <CardContent className="p-4 md:p-6">
          {/* 필터 헤더 */}
          <h3 className="mb-4 flex items-center gap-2" style={{ color: COLORS.primaryDark }}>
            <Filter className="h-5 w-5" style={{ color: COLORS.primary }} />
            카테고리 필터
            {/* 선택된 필터 개수 배지 */}
            {selectedCategories && selectedCategories.length > 0 && (
              <span className="ml-auto text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.primary, color: 'white' }}>
                {selectedCategories.length}
              </span>
            )}
          </h3>
          {/* 스크롤 가능한 카테고리 트리 영역 */}
          <ScrollArea className="h-[var(--height-scroll-area)]">
            <CategoryTreeContent
              selectedCategories={selectedCategories}
              onCategorySelect={onCategorySelect}
            />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Mobile 버전 - lg 미만 화면에서만 표시 */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          {/* 필터 열기 버튼 - 우측 하단 고정 */}
          <SheetTrigger asChild>
            <Button
              className="rounded-full shadow-lg h-14 w-14 p-0 relative"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Filter className="h-6 w-6 text-white" />
              {/* 선택된 필터 개수 배지 */}
              {totalFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          {/* 좌측에서 슬라이드되는 Sheet 패널 */}
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2" style={{ color: COLORS.primaryDark }}>
                <Filter className="h-5 w-5" style={{ color: COLORS.primary }} />
                필터
                {/* 선택된 필터 개수 배지 */}
                {totalFiltersCount > 0 && (
                  <span className="ml-auto text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.primary, color: 'white' }}>
                    {totalFiltersCount}
                  </span>
                )}
              </SheetTitle>
              <SheetDescription className="sr-only">
                논문 카테고리와 연도를 선택하여 검색 결과를 필터링합니다
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* 카테고리 필터 섹션 */}
              <div>
                <h4 className="mb-3 px-2" style={{ color: COLORS.primaryDark }}>카테고리</h4>
                {/* 화면 높이에 맞춘 스크롤 영역 */}
                <ScrollArea className="h-[var(--height-scroll-area-mobile)]">
                  <CategoryTreeContent
                    selectedCategories={selectedCategories}
                    onCategorySelect={onCategorySelect}
                  />
                </ScrollArea>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

