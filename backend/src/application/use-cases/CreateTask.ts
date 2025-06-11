import { Task } from '../../../domain/Task';
import { ITaskRepository } from '../../repositories/ITaskRepository';
import { v4 as uuidv4 } from 'uuid';

interface CreateTaskInput {
  title: string;
}

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    if (!input.title) {
      throw new Error('Title cannot be empty');
    }

    const now = new Date();
    const task = new Task({
      id: uuidv4(),
      title: input.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    await this.taskRepository.save(task);

    return task;
  }
}
