import { useNavigation } from '../../hooks/useNavigation';

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
    <footer className={`w-full py-12 ${className || ''}`} style={{ backgroundColor: '#215285' }}>
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About */}
          <div>
            <h4 className="text-white mb-4">RSRS</h4>
            <p className="text-gray-300">
              논문 검색, 자동 번역 및 요약 제공 서비스
            </p>
          </div>

          {/* Links */}
          {showLinks && (
            <div>
              <h4 className="text-white mb-4">바로가기</h4>
              <ul className="space-y-2">
                {linksToShow.map((link, index) => (
                  <li key={index}>
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

        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-gray-300">
            {copyrightText || '© 2025 RSRS. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
