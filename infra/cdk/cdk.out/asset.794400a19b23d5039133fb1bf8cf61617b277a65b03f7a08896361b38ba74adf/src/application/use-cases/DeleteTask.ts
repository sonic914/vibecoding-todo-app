import { ITaskRepository } from '../repositories/ITaskRepository';

interface DeleteTaskInput {
  id: string;
}

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: DeleteTaskInput): Promise<void> {
    await this.taskRepository.delete(input.id);
  }
}
