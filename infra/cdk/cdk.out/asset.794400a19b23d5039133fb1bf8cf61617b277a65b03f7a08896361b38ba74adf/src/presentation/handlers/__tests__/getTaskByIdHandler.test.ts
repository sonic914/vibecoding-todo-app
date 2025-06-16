import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getTaskByIdHandler } from '../getTaskByIdHandler';
import { GetTaskByIdUseCase } from '../../../application/use-cases/GetTaskById';
import { Task } from '../../../domain/Task';

const now = new Date();
const testTask = new Task({
  id: '1',
  title: 'Test Task',
  completed: false,
  createdAt: now,
  updatedAt: now,
});

// Mock the use case
const mockGetTaskByIdUseCase = {
  execute: jest.fn(),
} as unknown as GetTaskByIdUseCase;

describe('getTaskByIdHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a task and 200 status code', async () => {
    (mockGetTaskByIdUseCase.execute as jest.Mock).mockResolvedValue(testTask);
    const handler = getTaskByIdHandler(mockGetTaskByIdUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: { id: '1' },
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(200);
    expect(JSON.parse(result?.body || '{}')).toEqual(testTask);
    expect(mockGetTaskByIdUseCase.execute).toHaveBeenCalledWith({ id: '1' });
  });

  it('should return 404 if task is not found', async () => {
    (mockGetTaskByIdUseCase.execute as jest.Mock).mockResolvedValue(null);
    const handler = getTaskByIdHandler(mockGetTaskByIdUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: { id: '2' },
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(404);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Task not found' });
  });

  it('should return 400 if id is missing', async () => {
    const handler = getTaskByIdHandler(mockGetTaskByIdUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: null,
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(400);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Task ID is required' });
  });

  it('should return 500 on use case error', async () => {
    (mockGetTaskByIdUseCase.execute as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));
    const handler = getTaskByIdHandler(mockGetTaskByIdUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: { id: '1' },
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(500);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Internal Server Error' });
  });
});
