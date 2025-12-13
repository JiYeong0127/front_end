import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '../ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useNavigation } from '../../hooks/useNavigation';
import { useAuthStore } from '../../store/authStore';
import { useLogoutMutation } from '../../hooks/api/useLogout';
import { useMyProfileQuery } from '../../hooks/api/useMyProfile';
import { UserProfile } from '../../types/auth';
import logo from '../../assets/logo.png';

/**
 * 색상 상수
 */
const COLORS = {
  primary: '#215285',      // 메인 색상 (진한 파란색)
  accent: '#4FA3D1',       // 강조 색상 (밝은 파란색, 아바타 배경)
  error: '#dc2626',        // 에러 색상 (빨간색, 로그아웃 버튼)
} as const;

/**
 * Header 컴포넌트 Props
 */
interface HeaderProps {
  /** 커스텀 로고 컴포넌트 */
  customLogo?: React.ReactNode;
  /** 로고 클릭 핸들러 */
  onLogoClick?: () => void;
  /** 우측 커스텀 컨텐츠 */
  rightContent?: React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 헤더 컴포넌트
 * 
 * 사이트 상단에 위치하는 헤더로, 로고, 네비게이션, 사용자 메뉴를 포함합니다.
 * 데스크톱과 모바일 환경에 맞춰 반응형으로 동작합니다.
 * 
 * @example
 * ```tsx
 * <Header
 *   onLogoClick={() => navigate('/')}
 *   rightContent={<CustomButton />}
 * />
 * ```
 */
export function Header({
  customLogo,
  onLogoClick,
  rightContent,
  className
}: HeaderProps = {}) {
  // 모바일 메뉴 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);
  
  // 네비게이션 훅
  const { goToLogin, goToSignup, goToHome, goToMyPage } = useNavigation();
  
  // 인증 상태 및 사용자 정보
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const username = useAuthStore((state) => state.username);
  const name = useAuthStore((state) => state.name);
  const { mutate: handleLogout } = useLogoutMutation();
  
  // 사용자 프로필 정보 가져오기 (로그인한 경우에만)
  const { data: profile, isLoading: isLoadingProfile } = useMyProfileQuery();
  
  // 표시할 이름 결정: API에서 가져온 이름 > authStore의 name > username
  const displayName = (profile as UserProfile | undefined)?.name ?? name ?? username ?? '';

  /**
   * 로고 클릭 핸들러
   * 커스텀 핸들러가 있으면 실행하고, 없으면 홈으로 이동
   */
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      goToHome();
    }
  };

  /**
   * 모바일 메뉴 닫기 및 페이지 이동 처리
   */
  const handleMenuAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <header className={`sticky top-0 z-50 w-full bg-white shadow-sm ${className || ''}`}>
      <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* 로고 영역 */}
        <div className="flex items-center h-full py-2 cursor-pointer" onClick={handleLogoClick}>
          {customLogo || (
            <img 
              src={logo} 
              alt="RSRS Logo" 
              className="h-full w-auto object-contain"
              style={{ maxHeight: '100%' }}
            />
          )}
        </div>

        {/* 데스크톱 네비게이션 영역 */}
        {rightContent ? (
          /* 커스텀 우측 컨텐츠가 있는 경우 */
          <div className="hidden md:flex items-center gap-4">
            {rightContent}
          </div>
        ) : !isLoggedIn ? (
          /* 로그인하지 않은 경우: 로그인/회원가입 버튼 */
          <nav className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline"
              style={{ 
                borderColor: COLORS.primary,
                color: COLORS.primary
              }}
              className="hover:bg-[#215285] hover:text-white"
              onClick={goToLogin}
            >
              로그인
            </Button>
            <Button 
              style={{ backgroundColor: COLORS.primary }}
              className="text-white hover:opacity-90"
              onClick={goToSignup}
            >
              회원가입
            </Button>
          </nav>
        ) : (
          /* 로그인한 경우: 사용자 프로필 버튼 */
          <div className="hidden md:flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={goToMyPage}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {/* 사용자 아바타 */}
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: COLORS.accent }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {/* 사용자 이름 표시 */}
                    {!isLoadingProfile && displayName && (
                      <span className="text-sm whitespace-nowrap" style={{ color: COLORS.primary }}>
                        {displayName} 님
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>마이페이지 이동</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* 모바일 메뉴 (햄버거 메뉴) */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" style={{ color: COLORS.primary }}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-white">
            <SheetTitle className="sr-only">메뉴</SheetTitle>
            <SheetDescription className="sr-only">
              {isLoggedIn ? '사용자 메뉴' : '로그인 및 회원가입 메뉴'}
            </SheetDescription>
            <nav className="flex flex-col gap-4 mt-8">
              {!isLoggedIn ? (
                /* 로그인하지 않은 경우: 로그인/회원가입 버튼 */
                <>
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: COLORS.primary,
                      color: COLORS.primary
                    }}
                    className="hover:bg-[#215285] hover:text-white justify-start"
                    onClick={() => handleMenuAction(goToLogin)}
                  >
                    로그인
                  </Button>
                  <Button 
                    style={{ backgroundColor: COLORS.primary }}
                    className="text-white hover:opacity-90 justify-start"
                    onClick={() => handleMenuAction(goToSignup)}
                  >
                    회원가입
                  </Button>
                </>
              ) : (
                /* 로그인한 경우: 사용자 정보 및 메뉴 */
                <>
                  {/* 사용자 정보 표시 */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: COLORS.accent }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {!isLoadingProfile && displayName ? (
                      <span style={{ color: COLORS.primary }} className="truncate">{displayName} 님</span>
                    ) : (
                      <span style={{ color: COLORS.primary }}>{username}</span>
                    )}
                  </div>
                  {/* 마이페이지 버튼 */}
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: COLORS.primary,
                      color: COLORS.primary
                    }}
                    className="hover:bg-[#215285] hover:text-white justify-start"
                    onClick={() => handleMenuAction(goToMyPage)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {!isLoadingProfile && displayName ? `${displayName} 님` : '마이페이지'}
                  </Button>
                  {/* 로그아웃 버튼 */}
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: COLORS.error,
                      color: COLORS.error
                    }}
                    className="hover:bg-[#dc2626] hover:text-white justify-start"
                    onClick={() => handleMenuAction(handleLogout)}
                  >
                    로그아웃
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
