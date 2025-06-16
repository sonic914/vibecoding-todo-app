import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { GetAllTasksUseCase } from '../../application/use-cases/GetAllTasks';
import { authMiddleware } from '../middleware/authMiddleware';

// 인증되지 않은 핸들러 정의
const getAllTasksHandlerUnauth = (getAllTasksUseCase: GetAllTasksUseCase): APIGatewayProxyHandler => async (
  _event: APIGatewayProxyEvent,
  _context: Context,
) => {
  try {
    const tasks = await getAllTasksUseCase.execute();

    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
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
export const getAllTasksHandler = (getAllTasksUseCase: GetAllTasksUseCase): APIGatewayProxyHandler => {
  return authMiddleware(getAllTasksHandlerUnauth(getAllTasksUseCase));
};
