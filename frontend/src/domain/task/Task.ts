/**
 * 할 일의 우선순위를 나타내는 열거형
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * 할 일의 상태를 나타내는 열거형
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

/**
 * 할 일 엔티티의 인터페이스
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  tags?: string[];
}

/**
 * 새로운 할 일을 생성할 때 필요한 속성
 */
export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  tags?: string[];
}

/**
 * 할 일을 업데이트할 때 필요한 속성
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  tags?: string[];
}
