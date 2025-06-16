import { Task } from '../domain/task/types';

export interface ApiResponse<T> {
  statusCode: number;
  body: T;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export interface TaskApiService {
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task>;
  createTask(task: Omit<Task, 'id'>): Promise<Task>;
  updateTask(task: Task): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
