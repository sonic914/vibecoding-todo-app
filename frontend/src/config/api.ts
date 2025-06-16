/**
 * API 관련 설정
 */
export const API_CONFIG = {
  // API Gateway URL
  // CDK 배포에서 얻은 실제 API Gateway URL
  baseUrl: import.meta.env.VITE_API_URL || 'https://oc76spz5xb.execute-api.ap-northeast-2.amazonaws.com/api',
  
  // 테스트를 위해 로컬 스토리지 사용 (true: 로컬 스토리지, false: API 호출)
  // 화면 표시 문제 해결을 위해 로컬 스토리지 사용 활성화
  useLocalStorage: import.meta.env.VITE_USE_LOCAL_STORAGE === 'true' || true,
  
  // Cognito 관련 설정
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'ap-northeast-2_10IJl15Ho',
    appClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || '1d8btkjuugl5hm6me1pd2m154b',
    domain: import.meta.env.VITE_COGNITO_DOMAIN || 'vibecoding-todo-app',
    region: import.meta.env.VITE_COGNITO_REGION || 'ap-northeast-2',
  }
};
