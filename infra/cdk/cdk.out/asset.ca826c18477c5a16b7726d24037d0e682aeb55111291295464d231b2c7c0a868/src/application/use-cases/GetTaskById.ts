import { ITaskRepository } from '../../repositories/ITaskRepository';
import { Task } from '../../../domain/Task';

interface GetTaskByIdInput {
  id: string;
}

export class GetTaskByIdUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: GetTaskByIdInput): Promise<Task | null> {
    return this.taskRepository.findById(input.id);
  }
}
