import { ITaskRepository } from '../../repositories/ITaskRepository';
import { Task } from '../../../domain/Task';

export class GetAllTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}
