import { authMiddleware } from '../../middleware/authMiddleware';
import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

// CognitoJwtVerifier 모킹
jest.mock('aws-jwt-verify', () => {
  return {
    CognitoJwtVerifier: {
      create: jest.fn().mockImplementation(() => ({
        verify: jest.fn()
      }))
    }
  };
});

describe('인증 미들웨어 테스트', () => {
  let mockEvent: Partial<APIGatewayProxyEvent>;
  let mockContext: Partial<Context>;
  let mockCallback: Callback;
  let mockHandler: jest.Mock;

  beforeEach(() => {
    mockEvent = {
      headers: {
        Authorization: 'Bearer valid-token'
      }
    };
    mockContext = {};
    mockCallback = jest.fn();
    mockHandler = jest.fn().mockResolvedValue({
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('유효한 토큰이 제공되면 핸들러를 호출해야 함', async () => {
    // 토큰 검증 성공 모킹
    const mockVerify = jest.fn().mockResolvedValue({
      sub: 'user123',
      email: 'test@example.com'
    });
    
    (CognitoJwtVerifier.create as jest.Mock).mockImplementation(() => ({
      verify: mockVerify
    }));

    const wrappedHandler = authMiddleware(mockHandler);
    await wrappedHandler(mockEvent as APIGatewayProxyEvent, mockContext as Context, mockCallback);

    expect(mockVerify).toHaveBeenCalledWith('valid-token');
    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer valid-token'
        }),
        requestContext: expect.objectContaining({
          authorizer: expect.objectContaining({
            claims: expect.objectContaining({
              sub: 'user123',
              email: 'test@example.com'
            })
          })
        })
      }),
      mockContext,
      mockCallback
    );
  });

  test('Authorization 헤더가 없으면 401 응답을 반환해야 함', async () => {
    mockEvent.headers = {};

    const wrappedHandler = authMiddleware(mockHandler);
    const result = await wrappedHandler(mockEvent as APIGatewayProxyEvent, mockContext as Context, mockCallback);

    expect(result).toEqual({
      statusCode: 401,
      body: JSON.stringify({ message: '인증 토큰이 필요합니다' })
    });
    expect(mockHandler).not.toHaveBeenCalled();
  });

  test('Bearer 토큰 형식이 아니면 401 응답을 반환해야 함', async () => {
    mockEvent.headers = {
      Authorization: 'invalid-format'
    };

    const wrappedHandler = authMiddleware(mockHandler);
    const result = await wrappedHandler(mockEvent as APIGatewayProxyEvent, mockContext as Context, mockCallback);

    expect(result).toEqual({
      statusCode: 401,
      body: JSON.stringify({ message: '유효하지 않은 인증 토큰 형식입니다' })
    });
    expect(mockHandler).not.toHaveBeenCalled();
  });

  test('토큰 검증에 실패하면 401 응답을 반환해야 함', async () => {
    // 토큰 검증 실패 모킹
    const mockVerify = jest.fn().mockRejectedValue(new Error('Invalid token'));
    
    (CognitoJwtVerifier.create as jest.Mock).mockImplementation(() => ({
      verify: mockVerify
    }));

    const wrappedHandler = authMiddleware(mockHandler);
    const result = await wrappedHandler(mockEvent as APIGatewayProxyEvent, mockContext as Context, mockCallback);

    expect(result).toEqual({
      statusCode: 401,
      body: JSON.stringify({ message: '유효하지 않은 인증 토큰입니다' })
    });
    expect(mockHandler).not.toHaveBeenCalled();
  });
});
