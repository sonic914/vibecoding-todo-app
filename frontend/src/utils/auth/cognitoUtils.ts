/**
 * Cognito 인증 관련 유틸리티 함수
 */

/**
 * 로컬 스토리지에서 ID 토큰 가져오기
 * 실제 구현에서는 Cognito의 Auth 라이브러리를 사용하여 현재 세션에서 토큰을 가져와야 함
 */
export const getIdToken = (): string | null => {
  // 임시 구현: 로컬 스토리지에서 토큰 가져오기
  // 실제 구현에서는 Amplify Auth 또는 Amazon Cognito Identity SDK를 사용해야 함
  return localStorage.getItem('id_token');
};

/**
 * 로컬 스토리지에서 액세스 토큰 가져오기
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * 로컬 스토리지에서 리프레시 토큰 가져오기
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

/**
 * 토큰이 유효한지 확인
 * @param token JWT 토큰
 * @returns 토큰 유효 여부
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    // JWT 토큰 디코딩 (간단한 구현)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // 밀리초 단위로 변환
    
    return Date.now() < expirationTime;
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return false;
  }
};

/**
 * 현재 사용자가 인증되었는지 확인
 */
export const isAuthenticated = (): boolean => {
  const token = getIdToken();
  return isTokenValid(token);
};

/**
 * 토큰 저장
 * @param idToken ID 토큰
 * @param accessToken 액세스 토큰
 * @param refreshToken 리프레시 토큰
 */
export const saveTokens = (
  idToken: string,
  accessToken: string,
  refreshToken: string
): void => {
  localStorage.setItem('id_token', idToken);
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

/**
 * 토큰 삭제 (로그아웃)
 */
export const clearTokens = (): void => {
  localStorage.removeItem('id_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
