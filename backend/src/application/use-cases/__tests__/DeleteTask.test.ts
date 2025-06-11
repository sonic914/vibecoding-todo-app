import { DeleteTaskUseCase } from '../DeleteTask';
import { ITaskRepository } from '../../repositories/ITaskRepository';

// Mock repository
const mockTaskRepository: ITaskRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteTaskUseCase', () => {
  it('should delete a task', async () => {
    const deleteTask = new DeleteTaskUseCase(mockTaskRepository);
    await deleteTask.execute({ id: '1' });

    expect(mockTaskRepository.delete).toHaveBeenCalledWith('1');
  });
});
