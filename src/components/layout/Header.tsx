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

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { goToLogin, goToSignup, goToHome, goToMyPage } = useNavigation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const username = useAuthStore((state) => state.username);
  const name = useAuthStore((state) => state.name);
  const { mutate: handleLogout } = useLogoutMutation();
  
  // 사용자 프로필 정보 가져오기 (로그인한 경우에만)
  const { data: profile, isLoading: isLoadingProfile } = useMyProfileQuery();
  
  // 표시할 이름 결정: API에서 가져온 이름 > authStore의 name > username
  const displayName = (profile as UserProfile | undefined)?.name ?? name ?? username ?? '';

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center h-full py-2 cursor-pointer" onClick={goToHome}>
          <img 
            src={logo} 
            alt="RSRS Logo" 
            className="h-full w-auto object-contain"
            style={{ maxHeight: '100%' }}
          />
        </div>

        {/* Desktop Navigation */}
        {!isLoggedIn ? (
          <nav className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline"
              style={{ 
                borderColor: '#215285',
                color: '#215285'
              }}
              className="hover:bg-[#215285] hover:text-white"
              onClick={goToLogin}
            >
              로그인
            </Button>
            <Button 
              style={{ backgroundColor: '#215285' }}
              className="text-white hover:opacity-90"
              onClick={goToSignup}
            >
              회원가입
            </Button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={goToMyPage}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#4FA3D1' }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {!isLoadingProfile && displayName && (
                      <span className="text-sm whitespace-nowrap" style={{ color: '#215285' }}>
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

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" style={{ color: '#215285' }}>
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
                <>
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: '#215285',
                      color: '#215285'
                    }}
                    className="hover:bg-[#215285] hover:text-white justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      goToLogin();
                    }}
                  >
                    로그인
                  </Button>
                  <Button 
                    style={{ backgroundColor: '#215285' }}
                    className="text-white hover:opacity-90 justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      goToSignup();
                    }}
                  >
                    회원가입
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#4FA3D1' }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {!isLoadingProfile && displayName ? (
                      <span style={{ color: '#215285' }} className="truncate">{displayName} 님</span>
                    ) : (
                      <span style={{ color: '#215285' }}>{username}</span>
                    )}
                  </div>
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: '#215285',
                      color: '#215285'
                    }}
                    className="hover:bg-[#215285] hover:text-white justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      goToMyPage();
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {!isLoadingProfile && displayName ? `${displayName} 님` : '마이페이지'}
                  </Button>
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: '#dc2626',
                      color: '#dc2626'
                    }}
                    className="hover:bg-[#dc2626] hover:text-white justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
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
