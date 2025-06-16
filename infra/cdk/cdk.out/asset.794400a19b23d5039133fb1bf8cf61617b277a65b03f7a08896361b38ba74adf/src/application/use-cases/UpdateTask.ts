import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task } from '../../domain/Task';

interface UpdateTaskInput {
  id: string;
  title?: string;
  completed?: boolean;
}

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<Task | null> {
    const task = await this.taskRepository.findById(input.id);

    if (!task) {
      return null;
    }

    if (input.title !== undefined) {
      task.updateTitle(input.title);
    }

    if (input.completed !== undefined && task.completed !== input.completed) {
      task.toggleComplete();
    }

    await this.taskRepository.save(task);

    return task;
  }
}
