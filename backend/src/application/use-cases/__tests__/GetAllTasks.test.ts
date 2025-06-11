import { GetAllTasksUseCase } from '../GetAllTasks';
import { ITaskRepository } from '../../repositories/ITaskRepository';
import { Task } from '../../../domain/Task';

const now = new Date();
const testTasks = [
  new Task({ id: '1', title: 'Task 1', completed: false, createdAt: now, updatedAt: now }),
  new Task({ id: '2', title: 'Task 2', completed: true, createdAt: now, updatedAt: now }),
];

// Mock repository
const mockTaskRepository: ITaskRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn().mockResolvedValue(testTasks),
  delete: jest.fn(),
};

describe('GetAllTasksUseCase', () => {
  it('should get all tasks', async () => {
    const getAllTasks = new GetAllTasksUseCase(mockTaskRepository);
    const tasks = await getAllTasks.execute();

    expect(tasks).toEqual(testTasks);
    expect(tasks.length).toBe(2);
    expect(mockTaskRepository.findAll).toHaveBeenCalled();
  });
});
