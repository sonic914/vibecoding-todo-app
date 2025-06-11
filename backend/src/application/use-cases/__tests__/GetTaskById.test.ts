import { GetTaskByIdUseCase } from '../GetTaskById';
import { ITaskRepository } from '../../repositories/ITaskRepository';
import { Task } from '../../../domain/Task';

const now = new Date();
const testTask = new Task({
  id: '1',
  title: 'Test Task',
  completed: false,
  createdAt: now,
  updatedAt: now,
});

// Mock repository
const mockTaskRepository: ITaskRepository = {
  save: jest.fn(),
  findById: jest.fn().mockResolvedValue(testTask),
  findAll: jest.fn(),
  delete: jest.fn(),
};

describe('GetTaskByIdUseCase', () => {
  it('should get a task by its id', async () => {
    const getTaskById = new GetTaskByIdUseCase(mockTaskRepository);
    const task = await getTaskById.execute({ id: '1' });

    expect(task).toEqual(testTask);
    expect(mockTaskRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should return null if task is not found', async () => {
    (mockTaskRepository.findById as jest.Mock).mockResolvedValueOnce(null);
    const getTaskById = new GetTaskByIdUseCase(mockTaskRepository);
    const task = await getTaskById.execute({ id: '2' });

    expect(task).toBeNull();
  });
});
