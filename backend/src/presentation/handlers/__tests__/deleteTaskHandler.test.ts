import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { deleteTaskHandler } from '../deleteTaskHandler';
import { DeleteTaskUseCase } from '../../../application/use-cases/DeleteTask';

// Mock the use case
const mockDeleteTaskUseCase = {
  execute: jest.fn(),
} as unknown as DeleteTaskUseCase;

describe('deleteTaskHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a task and return 204 status code', async () => {
    (mockDeleteTaskUseCase.execute as jest.Mock).mockResolvedValue(undefined);
    const handler = deleteTaskHandler(mockDeleteTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: { id: '1' },
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(204);
    expect(mockDeleteTaskUseCase.execute).toHaveBeenCalledWith({ id: '1' });
  });

  it('should return 400 if id is missing', async () => {
    const handler = deleteTaskHandler(mockDeleteTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: null,
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(400);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Task ID is required' });
  });

  it('should return 500 on use case error', async () => {
    (mockDeleteTaskUseCase.execute as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));
    const handler = deleteTaskHandler(mockDeleteTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: { id: '1' },
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(500);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Internal Server Error' });
  });
});
