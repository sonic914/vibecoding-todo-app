import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { GetTaskByIdUseCase } from '../../application/use-cases/GetTaskById';
import { authMiddleware } from '../middleware/authMiddleware';

// 인증되지 않은 핸들러 정의
const getTaskByIdHandlerUnauth = (getTaskByIdUseCase: GetTaskByIdUseCase): APIGatewayProxyHandler => async (
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

    const task = await getTaskByIdUseCase.execute({ id });

    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Task not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(task),
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
export const getTaskByIdHandler = (getTaskByIdUseCase: GetTaskByIdUseCase): APIGatewayProxyHandler => {
  return authMiddleware(getTaskByIdHandlerUnauth(getTaskByIdUseCase));
};
