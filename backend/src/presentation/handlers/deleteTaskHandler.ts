import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DeleteTaskUseCase } from '../../../application/use-cases/DeleteTask';

export const deleteTaskHandler = (deleteTaskUseCase: DeleteTaskUseCase): APIGatewayProxyHandler => async (
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
