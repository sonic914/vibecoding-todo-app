import { TaskFactory } from '../TaskFactory';
import { TaskPriority, TaskStatus, CreateTaskDTO } from '../Task';

describe('TaskFactory', () => {
  describe('create', () => {
    it('기본값으로 새로운 할 일을 생성해야 함', () => {
      // Arrange
      const taskDTO: CreateTaskDTO = {
        title: '테스트 할 일'
      };
      
      // Mock date for consistent testing
      const now = new Date('2025-06-10T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now);
      
      // Act
      const task = TaskFactory.create(taskDTO);
      
      // Assert
      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe('테스트 할 일');
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.priority).toBe(TaskPriority.MEDIUM);
      expect(task.createdAt).toEqual(now);
      expect(task.updatedAt).toEqual(now);
      expect(task.completedAt).toBeUndefined();
      expect(task.description).toBeUndefined();
      expect(task.dueDate).toBeUndefined();
      expect(task.tags).toEqual([]);
      
      // Clean up
      jest.restoreAllMocks();
    });
    
    it('모든 옵션 값으로 새로운 할 일을 생성해야 함', () => {
      // Arrange
      const dueDate = new Date('2025-07-10T00:00:00.000Z');
      const taskDTO: CreateTaskDTO = {
        title: '테스트 할 일',
        description: '테스트 설명',
        priority: TaskPriority.HIGH,
        dueDate,
        tags: ['중요', '프로젝트']
      };
      
      // Mock date for consistent testing
      const now = new Date('2025-06-10T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now);
      
      // Act
      const task = TaskFactory.create(taskDTO);
      
      // Assert
      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe('테스트 할 일');
      expect(task.description).toBe('테스트 설명');
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.priority).toBe(TaskPriority.HIGH);
      expect(task.createdAt).toEqual(now);
      expect(task.updatedAt).toEqual(now);
      expect(task.completedAt).toBeUndefined();
      expect(task.dueDate).toEqual(dueDate);
      expect(task.tags).toEqual(['중요', '프로젝트']);
      
      // Clean up
      jest.restoreAllMocks();
    });
    
    it('제목이 빈 문자열이면 에러를 발생시켜야 함', () => {
      // Arrange
      const taskDTO: CreateTaskDTO = {
        title: ''
      };
      
      // Act & Assert
      expect(() => TaskFactory.create(taskDTO)).toThrow('할 일 제목은 필수입니다.');
    });
  });
  
  describe('createCompleted', () => {
    it('완료된 상태로 새로운 할 일을 생성해야 함', () => {
      // Arrange
      const taskDTO: CreateTaskDTO = {
        title: '완료된 할 일'
      };
      
      // Mock date for consistent testing
      const now = new Date('2025-06-10T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now);
      
      // Act
      const task = TaskFactory.createCompleted(taskDTO);
      
      // Assert
      expect(task).toBeDefined();
      expect(task.status).toBe(TaskStatus.DONE);
      expect(task.completedAt).toEqual(now);
      
      // Clean up
      jest.restoreAllMocks();
    });
  });
});
