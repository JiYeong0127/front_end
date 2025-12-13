# 논문 검색 서비스 프론트엔드

React + TypeScript 기반 논문 검색, 필터링, 북마크 기능을 제공하는 웹 애플리케이션입니다.

## 📁 프로젝트 구조 및 파일 역할

### 핵심 파일
- `src/main.tsx` - 애플리케이션 엔트리 포인트
- `src/App.tsx` - 라우팅 설정 및 전역 레이아웃
- `src/lib/api.ts` - Axios 인스턴스, API 엔드포인트 정의, 모든 API 호출 함수
- `src/lib/queryClient.ts` - React Query 클라이언트 설정

### 컴포넌트 (`src/components/`)

#### 페이지 컴포넌트 (`pages/`)
- `HomePage.tsx` - 홈 페이지 (히어로 섹션, 인기 논문, 최근 본 논문, 카테고리 검색)
- `SearchResultsListPage.tsx` - 검색 결과 페이지 (카테고리 필터, 페이지네이션)
- `PaperDetailPage.tsx` - 논문 상세 페이지 (요약/Abstract, 추천 논문, 북마크)
- `LoginPage.tsx` - 로그인 페이지
- `SignupPage.tsx` - 회원가입 페이지
- `MyPage.tsx` - 마이페이지 (사용자 정보, 관심 카테고리 설정)
- `MyLibraryPage.tsx` - 내 서재 (북마크 목록, 정렬 기능)
- `RecentlyViewedListPage.tsx` - 최근 본 논문 전체 목록
- `QuitAccountPage.tsx` - 회원 탈퇴 페이지
- `ServiceIntroPage.tsx` - 서비스 소개 페이지
- `UserGuidePage.tsx` - 이용 가이드 페이지

#### 논문 관련 컴포넌트 (`papers/`)
- `UnifiedPaperCard.tsx` - 통합 논문 카드 컴포넌트
  - Variants: `default`, `list`, `search`, `compact`, `recommended`, `popular`
  - 제목, 저자, 카테고리, 요약, 북마크 등 옵션 제어
- `PopularPapers.tsx` - 인기 논문 섹션 (인기순/최신순 탭, 최대 5개 표시)
- `RecentlyViewedPapers.tsx` - 최근 본 논문 섹션 (홈 페이지용)

#### 카테고리 컴포넌트 (`category/`)
- `CategoryFilter.tsx` - 검색 결과 페이지용 트리 구조 카테고리 필터
- `CategorySearch.tsx` - 홈 페이지 "카테고리로 검색" UI
- `UserInterestCategory.tsx` - 마이페이지 관심 카테고리 설정

#### 레이아웃 컴포넌트 (`layout/`)
- `Header.tsx` - 상단 네비게이션 헤더
- `Footer.tsx` - 하단 푸터
- `HeroSection.tsx` - 홈 페이지 히어로 섹션 (검색창)
- `SearchHeader.tsx` - 검색 페이지용 헤더
- `ScrollToTopButton.tsx` - 페이지 상단으로 스크롤 버튼

#### UI 컴포넌트 (`ui/`)
- Radix UI 기반 재사용 가능한 컴포넌트들
- `Button`, `Card`, `Dialog`, `Select`, `Input`, `Checkbox`, `Pagination` 등

### 커스텀 훅 (`src/hooks/`)

#### API 훅 (`api/`)
- `usePapers.ts` - 논문 검색, 상세 조회, 추천, 북마크 관련 훅
- `useLogin.ts` - 로그인 훅
- `useRegister.ts` - 회원가입 훅
- `useAuth.ts` - 인증 관련 훅
- `useMyProfile.ts` - 사용자 프로필 조회/수정 훅
- `useLogout.ts` - 로그아웃 훅
- `useInterestCategories.ts` - 관심 카테고리 관리 훅
- `useUsernameExists.ts` - 아이디 중복 확인 훅
- `useQuitAccount.ts` - 회원 탈퇴 훅
- `index.ts` - 모든 API 훅 export

#### 기타 훅
- `useNavigation.ts` - 라우팅/페이지 이동 헬퍼 함수
- `usePaperActions.ts` - 논문 클릭 및 북마크 공통 액션 처리

### 상태 관리 (`src/store/`)
- `authStore.ts` - 인증 상태 관리 (Zustand)
- `useAppStore.ts` - 앱 전역 상태 관리 (북마크 ID 목록 등)

### 타입 정의 (`src/types/`)
- `paper.ts` - 논문 관련 타입 (`Paper`, `UnifiedPaperCardProps` 등)
- `auth.ts` - 인증 관련 타입
- `user.ts` - 사용자 관련 타입
- `navigation.ts` - 네비게이션 관련 타입

### 유틸리티 (`src/utils/`)
- `localSearchHistory.ts` - 로컬 검색 기록 관리
- `pagination.ts` - 페이지네이션 유틸리티

## 🎨 주요 컴포넌트 기능

### UnifiedPaperCard
통합 논문 카드 컴포넌트로 다양한 variant 지원:
- `default` - 기본 카드 레이아웃 (publisher, year, pages)
- `list` - 목록 형태
- `search` - 검색 결과 형태 (update_date, categories)
- `compact` - 컴팩트 형태
- `recommended` - 추천 논문 형태 (summary 포함)
- `popular` - 인기 논문 형태 (제목, 저자, update_date, categories만)

### PopularPapers
- 인기순/최신순 탭 전환
- `sort_by` 파라미터로 API 호출 (`view_count` / `update_date`)
- 최대 5개 논문 표시
- 로딩/에러/빈 상태 처리

## 📄 라우팅

- `/` - 홈 페이지
- `/search` - 검색 결과 페이지
- `/paper/:id` - 논문 상세 페이지
- `/login` - 로그인
- `/signup` - 회원가입
- `/mypage` - 마이페이지
- `/library` - 내 서재
- `/recent` - 최근 본 논문
- `/intro` - 서비스 소개
- `/guide` - 이용 가이드

## 🔧 기술 스택

- **React** + **TypeScript**
- **Vite** - 빌드 도구
- **React Router DOM** - 라우팅
- **Zustand** - 상태 관리
- **TanStack Query** - 서버 상태 관리
- **Axios** - HTTP 클라이언트
- **Tailwind CSS** - 스타일링
- **Radix UI** - UI 컴포넌트 기반
- **Lucide React** - 아이콘

## 📡 API 사용 가이드

### API 함수 직접 사용

`src/lib/api.ts`에서 제공하는 API 함수를 직접 사용할 수 있습니다:

```typescript
import { searchPapers, getPaperDetail, login } from '@/lib/api';

// 논문 검색
const results = await searchPapers('transformer', 1, ['cs.AI'], 'view_count');

// 논문 상세 조회
const paper = await getPaperDetail('123');

// 로그인
const response = await login({ username: 'user', password: 'pass' });
```

### React Query 훅 사용 (권장)

컴포넌트에서 API를 호출할 때는 React Query 훅을 사용하는 것을 권장합니다:

```typescript
import { useSearchPapersQuery, usePaperDetailQuery } from '@/hooks/api';

function SearchComponent() {
  // 논문 검색 쿼리
  const { data, isLoading, error } = useSearchPapersQuery({
    q: 'transformer',
    page: 1,
    categories: ['cs.AI'],
    sort_by: 'view_count',
  });

  // 논문 상세 조회
  const { data: paper } = usePaperDetailQuery('123');

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  return <div>{/* 검색 결과 렌더링 */}</div>;
}
```

### 주요 API 함수 목록

#### 인증 관련
- `login(body: LoginRequest)` - 로그인
- `register(body: RegisterRequest)` - 회원가입
- `checkUsernameExists(username: string)` - 아이디 중복 확인
- `fetchMyProfile()` - 사용자 프로필 조회
- `logout()` - 로그아웃
- `quitAccount()` - 회원 탈퇴

#### 논문 관련
- `searchPapers(q?, page, categories?, sort_by?, page_size?)` - 논문 검색
- `getPaperDetail(paperId)` - 논문 상세 조회
- `getRecommendations(paperId, topK, candidateK)` - 추천 논문 조회
- `recordRecommendationClick(recommendationId)` - 추천 논문 클릭 기록
- `fetchSearchHistory(userId, limit)` - 검색 기록 조회
- `fetchViewedPapers(page, limit)` - 조회한 논문 조회

#### 북마크 관련
- `fetchBookmarks()` - 북마크 조회
- `addBookmark(paperId, notes?)` - 북마크 추가
- `deleteBookmark(bookmarkId)` - 북마크 삭제

#### 관심 카테고리 관련
- `getInterestCategories()` - 관심 카테고리 조회
- `addInterestCategories(category_codes)` - 관심 카테고리 추가
- `deleteInterestCategory(code)` - 관심 카테고리 삭제

### 에러 처리

API 함수는 자동으로 에러를 처리합니다:
- 401 에러 시 자동 로그아웃 및 로그인 페이지로 리다이렉트
- 네트워크 오류 시 적절한 에러 메시지 반환
- 모든 에러는 `Error` 객체로 throw됩니다

### 타입 안전성

모든 API 함수는 TypeScript 타입이 정의되어 있어 타입 안전성을 보장합니다:

```typescript
import { Paper, SearchPapersResponse } from '@/lib/api';

// 타입이 자동으로 추론됩니다
const paper: Paper = await getPaperDetail('123');
const results: SearchPapersResponse = await searchPapers('query');
```