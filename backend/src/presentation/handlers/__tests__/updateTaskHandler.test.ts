import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { updateTaskHandler } from '../updateTaskHandler';
import { UpdateTaskUseCase } from '../../../application/use-cases/UpdateTask';
import { Task } from '../../../domain/Task';

const now = new Date();
const testTask = new Task({
  id: '1',
  title: 'Updated Title',
  completed: true,
  createdAt: now,
  updatedAt: new Date(),
});

// Mock the use case
const mockUpdateTaskUseCase = {
  execute: jest.fn(),
} as unknown as UpdateTaskUseCase;

describe('updateTaskHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockUpdateTaskUseCase.execute as jest.Mock).mockResolvedValue(testTask);
  });

  it('should update a task and return 200 status code', async () => {
    const handler = updateTaskHandler(mockUpdateTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: { id: '1' },
      body: JSON.stringify({ title: 'Updated Title', completed: true }),
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(200);
    expect(JSON.parse(result?.body || '{}')).toEqual(testTask);
    expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledWith({ id: '1', title: 'Updated Title', completed: true });
  });

  it('should return 404 if task is not found', async () => {
    (mockUpdateTaskUseCase.execute as jest.Mock).mockResolvedValue(null);
    const handler = updateTaskHandler(mockUpdateTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: { id: '2' },
      body: JSON.stringify({ title: 'Non-existent' }),
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(404);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Task not found' });
  });

  it('should return 400 if id is missing', async () => {
    const handler = updateTaskHandler(mockUpdateTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: null,
      body: JSON.stringify({ title: 'Some title' }),
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(400);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Task ID is required' });
  });

  it('should return 500 on use case error', async () => {
    (mockUpdateTaskUseCase.execute as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));
    const handler = updateTaskHandler(mockUpdateTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: { id: '1' },
      body: JSON.stringify({ title: 'Error case' }),
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(500);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Internal Server Error' });
  });
});
