import { useNavigation } from '../../hooks/useNavigation';

/**
 * 색상 상수
 */
const COLORS = {
  primaryDark: '#215285',
} as const;

/**
 * 기본 저작권 텍스트
 */
const DEFAULT_COPYRIGHT = '© 2025 RSRS. All rights reserved.';

/**
 * Footer 컴포넌트 Props
 */
interface FooterProps {
  /** 링크 표시 여부 */
  showLinks?: boolean;
  /** 커스텀 링크 배열 */
  customLinks?: Array<{ label: string; onClick: () => void }>;
  /** 저작권 텍스트 */
  copyrightText?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 푸터 컴포넌트
 * 
 * 서비스 정보와 링크를 표시합니다.
 * 
 * @example
 * ```tsx
 * <Footer
 *   showLinks={true}
 *   customLinks={[
 *     { label: '커스텀 링크', onClick: () => navigate('/custom') }
 *   ]}
 *   copyrightText="© 2025 Custom"
 * />
 * ```
 */
export function Footer({
  showLinks = true,
  customLinks,
  copyrightText,
  className
}: FooterProps = {}) {
  const { goToService, goToGuide } = useNavigation();
  
  const defaultLinks = [
    { label: '서비스 소개', onClick: goToService },
    { label: '이용 가이드', onClick: goToGuide }
  ];
  
  const linksToShow = customLinks || defaultLinks;

  return (
    <footer 
      className={`w-full py-12 ${className || ''}`} 
      style={{ backgroundColor: COLORS.primaryDark }}
    >
      <div className="max-w-[var(--container-max-width)] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 서비스 정보 섹션 */}
          <div>
            <h4 className="text-white mb-4">RSRS</h4>
            <p className="text-gray-300">
              논문 검색, 자동 번역 및 요약 제공 서비스
            </p>
          </div>

          {/* 링크 섹션 */}
          {showLinks && (
            <div>
              <h4 className="text-white mb-4">바로가기</h4>
              <ul className="space-y-2">
                {linksToShow.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.onClick}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 저작권 섹션 */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-gray-300">
            {copyrightText || DEFAULT_COPYRIGHT}
          </p>
        </div>
      </div>
    </footer>
  );
}
