import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DeleteTaskUseCase } from '../../application/use-cases/DeleteTask';
import { authMiddleware } from '../middleware/authMiddleware';

// 인증되지 않은 핸들러 정의
const deleteTaskHandlerUnauth = (deleteTaskUseCase: DeleteTaskUseCase): APIGatewayProxyHandler => async (
  event: APIGatewayProxyEvent,
  _context: Context,
) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Task ID is required' }),
      };
    }

    await deleteTaskUseCase.execute({ id });

    return {
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    const err = error as Error;
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message || 'Internal Server Error' }),
    };
  }
};

// 인증 미들웨어를 적용한 핸들러 내보내기
export const deleteTaskHandler = (deleteTaskUseCase: DeleteTaskUseCase): APIGatewayProxyHandler => {
  return authMiddleware(deleteTaskHandlerUnauth(deleteTaskUseCase));
};
