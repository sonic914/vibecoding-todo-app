import { Task } from '../../domain/task/Task';

/**
 * 할 일 상태를 나타내는 인터페이스
 */
export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: TaskFilter;
}

/**
 * 할 일 필터 옵션을 나타내는 인터페이스
 */
export interface TaskFilter {
  status?: string;
  priority?: string;
  searchTerm?: string;
  tags?: string[];
}

/**
 * 할 일 상태의 초기값
 */
export const initialTaskState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: {}
};
