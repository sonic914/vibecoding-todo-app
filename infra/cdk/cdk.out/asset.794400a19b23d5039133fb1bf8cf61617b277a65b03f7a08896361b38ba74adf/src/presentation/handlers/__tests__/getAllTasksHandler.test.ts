import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getAllTasksHandler } from '../getAllTasksHandler';
import { GetAllTasksUseCase } from '../../../application/use-cases/GetAllTasks';
import { Task } from '../../../domain/Task';

const now = new Date();
const testTasks = [
  new Task({ id: '1', title: 'Task 1', completed: false, createdAt: now, updatedAt: now }),
  new Task({ id: '2', title: 'Task 2', completed: true, createdAt: now, updatedAt: now }),
];

// Mock the use case
const mockGetAllTasksUseCase = {
  execute: jest.fn(),
} as unknown as GetAllTasksUseCase;

describe('getAllTasksHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all tasks and 200 status code', async () => {
    (mockGetAllTasksUseCase.execute as jest.Mock).mockResolvedValue(testTasks);
    const handler = getAllTasksHandler(mockGetAllTasksUseCase);
    const event: Partial<APIGatewayProxyEvent> = {};

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(200);
    expect(JSON.parse(result?.body || '{}')).toEqual(testTasks);
    expect(mockGetAllTasksUseCase.execute).toHaveBeenCalled();
  });

  it('should return 500 on use case error', async () => {
    (mockGetAllTasksUseCase.execute as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));
    const handler = getAllTasksHandler(mockGetAllTasksUseCase);
    const event: Partial<APIGatewayProxyEvent> = {};

    const result = await handler(event as APIGatewayProxyEvent, {} as Context, () => {});

    expect(result?.statusCode).toBe(500);
    expect(JSON.parse(result?.body || '{}')).toEqual({ message: 'Internal Server Error' });
  });
});
