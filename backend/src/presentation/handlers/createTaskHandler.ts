import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { CreateTaskUseCase } from '../../../application/use-cases/CreateTask';

export const createTaskHandler = (createTaskUseCase: CreateTaskUseCase): APIGatewayProxyHandler => async (
  event: APIGatewayProxyEvent,
  _context: Context,
) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { title } = body;

    if (!title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Title is required' }),
      };
    }

    const task = await createTaskUseCase.execute({ title });

    return {
      statusCode: 201,
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
