import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, TaskPriority, CreateTaskDTO } from './Task';

/**
 * 할 일 객체를 생성하는 팩토리 클래스
 * 도메인 규칙을 캡슐화하고 유효한 할 일 객체를 생성합니다.
 */
export class TaskFactory {
  /**
   * 새로운 할 일 객체를 생성합니다.
   * @param taskDTO 할 일 생성에 필요한 데이터
   * @returns 생성된 할 일 객체
   */
  static create(taskDTO: CreateTaskDTO): Task {
    // 유효성 검사
    if (!taskDTO.title || taskDTO.title.trim() === '') {
      throw new Error('할 일 제목은 필수입니다.');
    }

    const now = new Date();
    
    return {
      id: uuidv4(),
      title: taskDTO.title,
      description: taskDTO.description,
      status: TaskStatus.TODO,
      priority: taskDTO.priority || TaskPriority.MEDIUM,
      createdAt: now,
      updatedAt: now,
      dueDate: taskDTO.dueDate,
      tags: taskDTO.tags || [],
    };
  }

  /**
   * 완료된 상태로 새로운 할 일 객체를 생성합니다.
   * @param taskDTO 할 일 생성에 필요한 데이터
   * @returns 완료 상태로 생성된 할 일 객체
   */
  static createCompleted(taskDTO: CreateTaskDTO): Task {
    const task = this.create(taskDTO);
    const now = new Date();
    
    return {
      ...task,
      status: TaskStatus.DONE,
      completedAt: now,
    };
  }
}
