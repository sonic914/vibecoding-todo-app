import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { GetAllTasksUseCase } from '../../../application/use-cases/GetAllTasks';

export const getAllTasksHandler = (getAllTasksUseCase: GetAllTasksUseCase): APIGatewayProxyHandler => async (
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
