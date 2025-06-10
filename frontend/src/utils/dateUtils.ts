/**
 * 날짜를 포맷팅하는 유틸리티 함수
 * 
 * @param date 포맷팅할 날짜 객체 또는 날짜 문자열
 * @param options 포맷 옵션 (기본값: 년-월-일 시:분)
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (
  date: Date | string | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('ko-KR', options).format(dateObj);
};
