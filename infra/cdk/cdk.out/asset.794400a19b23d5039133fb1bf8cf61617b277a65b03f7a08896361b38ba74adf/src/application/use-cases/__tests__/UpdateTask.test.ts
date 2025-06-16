import { UpdateTaskUseCase } from '../UpdateTask';
import { ITaskRepository } from '../../repositories/ITaskRepository';
import { Task } from '../../../domain/Task';

const now = new Date();
const testTask = new Task({
  id: '1',
  title: 'Initial Title',
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

describe('UpdateTaskUseCase', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Reset the findById mock to its default behavior
    (mockTaskRepository.findById as jest.Mock).mockResolvedValue(
      new Task({ ...testTask }) // Return a fresh instance to avoid side effects
    );
  });

  it('should update a task title', async () => {
    const updateTask = new UpdateTaskUseCase(mockTaskRepository);
    const input = { id: '1', title: 'Updated Title' };
    const updatedTask = await updateTask.execute(input);

    expect(updatedTask?.title).toBe('Updated Title');
    expect(mockTaskRepository.findById).toHaveBeenCalledWith('1');
    expect(mockTaskRepository.save).toHaveBeenCalled();
  });

  it('should update a task completion status', async () => {
    const updateTask = new UpdateTaskUseCase(mockTaskRepository);
    const input = { id: '1', completed: true };
    const updatedTask = await updateTask.execute(input);

    expect(updatedTask?.completed).toBe(true);
    expect(mockTaskRepository.findById).toHaveBeenCalledWith('1');
    expect(mockTaskRepository.save).toHaveBeenCalled();
  });

  it('should return null if task is not found', async () => {
    (mockTaskRepository.findById as jest.Mock).mockResolvedValueOnce(null);
    const updateTask = new UpdateTaskUseCase(mockTaskRepository);
    const result = await updateTask.execute({ id: '2', title: 'Non-existent' });

    expect(result).toBeNull();
  });

  it('should throw an error for empty title', async () => {
    const updateTask = new UpdateTaskUseCase(mockTaskRepository);
    const input = { id: '1', title: '' };

    await expect(updateTask.execute(input)).rejects.toThrow('Title cannot be empty');
  });
});
