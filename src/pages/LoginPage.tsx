/**
 * 로그인 페이지 컴포넌트
 * 
 * 기능: 사용자 로그인 처리 및 로그인 상태 유지 옵션 제공
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton';
import { useNavigation } from '../hooks/useNavigation';
import { useLoginMutation } from '../hooks/api/useLogin';
import { toast } from 'sonner';
import logo from '../assets/logo.png';

const COLORS = {
  primary: '#215285',
  primaryHover: '#1A3E66',
};

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { goToSignup, goToHome } = useNavigation();
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          toast.success('로그인 성공');
          navigate('/');
        },
        onError: (error: Error) => {
          toast.error('로그인 실패', {
            description: error.message || '사용자 이름 또는 비밀번호를 확인해주세요.',
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8 h-24 md:h-28">
          <img 
            src={logo} 
            alt="RSRS Logo" 
            className="h-full w-auto object-contain cursor-pointer" 
            style={{ maxHeight: '100%' }}
            onClick={goToHome}
          />
        </div>

        <Card className="shadow-lg rounded-xl">
          <CardHeader className="text-center pb-4">
            <h2 className="text-[var(--font-size-24)]">로그인</h2>
            <p className="text-gray-600 mt-2">계정에 로그인하여 서비스를 이용하세요</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {/* 에러 메시지 표시 */}
            {loginMutation.isError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {loginMutation.error?.message || '로그인 중 오류가 발생했습니다.'}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="아이디를 입력하시오"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10"
                    required
                    disabled={loginMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loginMutation.isPending}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={loginMutation.isPending}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    로그인 상태 유지
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  disabled={loginMutation.isPending}
                >
                  비밀번호 찾기
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: COLORS.primary }}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">계정이 없으신가요? </span>
              <button
                onClick={goToSignup}
                className="text-blue-600 hover:underline font-medium"
                disabled={loginMutation.isPending}
              >
                회원가입
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
