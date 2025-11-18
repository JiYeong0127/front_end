import { useNavigation } from '../../hooks/useNavigation';

export function Footer() {
  const { goToService, goToGuide } = useNavigation();

  return (
    <footer className="w-full py-12" style={{ backgroundColor: '#215285' }}>
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
          <div>
            <h4 className="text-white mb-4">바로가기</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={goToService}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  서비스 소개
                </button>
              </li>
              <li>
                <button
                  onClick={goToGuide}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  이용 가이드
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-gray-300">
            © 2025 RSRS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
