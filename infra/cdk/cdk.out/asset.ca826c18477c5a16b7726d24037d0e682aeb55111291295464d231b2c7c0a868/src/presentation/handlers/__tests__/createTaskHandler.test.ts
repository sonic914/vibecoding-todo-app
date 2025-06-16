import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { createTaskHandler } from '../createTaskHandler';
import { CreateTaskUseCase } from '../../../application/use-cases/CreateTask';
import { Task } from '../../../domain/Task';

// Mock the use case
const mockCreateTaskUseCase = {
  execute: jest.fn(),
} as unknown as CreateTaskUseCase;

describe('createTaskHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a task and return 201 status code', async () => {
    const now = new Date();
    const task = new Task({
      id: '1',
      title: 'New Task',
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
    (mockCreateTaskUseCase.execute as jest.Mock).mockResolvedValue(task);

    const handler = createTaskHandler(mockCreateTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      body: JSON.stringify({ title: 'New Task' }),
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(201);
    expect(JSON.parse(result?.body || '{}')).toEqual(task);
    expect(mockCreateTaskUseCase.execute).toHaveBeenCalledWith({ title: 'New Task' });
  });

  it('should return 400 if title is missing', async () => {
    const handler = createTaskHandler(mockCreateTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      body: JSON.stringify({}),
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(400);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Title is required' });
  });

  it('should return 500 on use case error', async () => {
    (mockCreateTaskUseCase.execute as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    const handler = createTaskHandler(mockCreateTaskUseCase);
    const event: Partial<APIGatewayProxyEvent> = {
      body: JSON.stringify({ title: 'New Task' }),
    };

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(500);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Internal Server Error' });
  });
});
