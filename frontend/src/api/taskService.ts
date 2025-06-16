import { Task } from '../domain/task/Task';
import { ApiClient } from './apiClient';
import { TaskApiService } from './types';

export class TaskService implements TaskApiService {
  private apiClient: ApiClient;
  private basePath = '/tasks';

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getAllTasks(): Promise<Task[]> {
    const response = await this.apiClient.get<{ tasks: Task[] }>(this.basePath);
    return response.tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await this.apiClient.get<{ task: Task }>(`${this.basePath}/${id}`);
    return response.task;
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const response = await this.apiClient.post<{ task: Task }>(this.basePath, task);
    return response.task;
  }

  async updateTask(task: Task): Promise<Task> {
    const response = await this.apiClient.put<{ task: Task }>(`${this.basePath}/${task.id}`, task);
    return response.task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.apiClient.delete<void>(`${this.basePath}/${id}`);
  }
}
