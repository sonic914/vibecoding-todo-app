import { CreateTaskUseCase } from '../CreateTask';
import { ITaskRepository } from '../../repositories/ITaskRepository';
import { Task } from '../../../domain/Task';

// Mock a repository for testing purposes
const mockTaskRepository: ITaskRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
};

describe('CreateTaskUseCase', () => {
  it('should create a new task and save it', async () => {
    const createTask = new CreateTaskUseCase(mockTaskRepository);

    const input = {
      title: 'A new task',
    };

    const createdTask = await createTask.execute(input);

    expect(createdTask).toBeInstanceOf(Task);
    expect(createdTask.title).toBe(input.title);
    expect(createdTask.completed).toBe(false);
    expect(mockTaskRepository.save).toHaveBeenCalledWith(createdTask);
  });

  it('should throw an error if title is empty', async () => {
    const createTask = new CreateTaskUseCase(mockTaskRepository);

    const input = {
      title: '',
    };

    await expect(createTask.execute(input)).rejects.toThrow('Title cannot be empty');
  });
});
