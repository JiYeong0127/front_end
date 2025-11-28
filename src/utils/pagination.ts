/**
 * 페이지네이션 관련 유틸리티 함수
 */

/**
 * 페이지 번호 배열 생성
 * @param currentPage 현재 페이지 (1부터 시작)
 * @param totalPages 전체 페이지 수
 * @returns 페이지 번호 배열 (숫자 또는 'ellipsis')
 */
export function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  const maxVisible = 5;
  
  if (totalPages <= maxVisible) {
    // 전체 페이지가 5개 이하인 경우 모든 페이지 표시
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      // 앞부분: 1, 2, 3, 4, ..., 마지막
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // 뒷부분: 1, ..., 마지막-3, 마지막-2, 마지막-1, 마지막
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 중간: 1, ..., 현재-1, 현재, 현재+1, ..., 마지막
      pages.push(1);
      pages.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    }
  }
  
  return pages;
}

