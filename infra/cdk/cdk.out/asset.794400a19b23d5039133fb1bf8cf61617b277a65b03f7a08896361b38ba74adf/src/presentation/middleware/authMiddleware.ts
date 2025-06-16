import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback, Handler } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

// Cognito 설정 정보
const USER_POOL_ID = 'ap-northeast-2_10IJl15Ho';
const CLIENT_ID = '1d8btkjuugl5hm6me1pd2m154b';

/**
 * JWT 토큰을 검증하는 인증 미들웨어
 * @param handler Lambda 핸들러 함수
 * @returns 인증 로직이 추가된 Lambda 핸들러 함수
 */
export const authMiddleware = (
  handler: Handler
): Handler => {
  return async (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback
  ): Promise<APIGatewayProxyResult> => {
    try {
      // Authorization 헤더 확인
      const authHeader = event.headers?.Authorization;
      if (!authHeader) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: '인증 토큰이 필요합니다' })
        };
      }

      // Bearer 토큰 형식 확인
      if (!authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: '유효하지 않은 인증 토큰 형식입니다' })
        };
      }

      // 토큰 추출
      const token = authHeader.substring(7);

      // Cognito JWT 검증기 생성
      const verifier = CognitoJwtVerifier.create({
        userPoolId: USER_POOL_ID,
        tokenUse: 'id',
        clientId: CLIENT_ID
      });

      try {
        // 토큰 검증
        const claims = await verifier.verify(token);

        // 검증된 사용자 정보를 이벤트에 추가
        const requestContext = event.requestContext || {} as any;
        const authorizer = requestContext.authorizer || {} as any;
        
        // 타입 안전성을 위해 이벤트 객체를 수정
        const modifiedEvent = {
          ...event,
          requestContext: {
            ...requestContext,
            authorizer: {
              ...authorizer,
              claims
            }
          }
        };
        
        // 수정된 이벤트 객체로 교체
        Object.assign(event, modifiedEvent);

        // 원래 핸들러 호출
        return await handler(event, context, callback);
      } catch (error) {
        // 토큰 검증 실패
        return {
          statusCode: 401,
          body: JSON.stringify({ message: '유효하지 않은 인증 토큰입니다' })
        };
      }
    } catch (error) {
      // 예상치 못한 오류
      console.error('인증 미들웨어 오류:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: '서버 오류가 발생했습니다' })
      };
    }
  };
};
