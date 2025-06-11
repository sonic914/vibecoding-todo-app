/**
 * 테마 관련 유틸리티 함수
 */

const THEME_KEY = 'todo-app-theme';

/**
 * 로컬 스토리지에서 테마 설정 불러오기
 */
export const loadThemeFromStorage = (): 'light' | 'dark' | null => {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme as 'light' | 'dark' | null;
  } catch (error) {
    console.error('테마 설정을 불러오는 중 오류가 발생했습니다:', error);
    return null;
  }
};

/**
 * 로컬 스토리지에 테마 설정 저장하기
 */
export const saveThemeToStorage = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('테마 설정을 저장하는 중 오류가 발생했습니다:', error);
  }
};

/**
 * 시스템 테마 감지하기
 */
export const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
