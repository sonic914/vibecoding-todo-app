import { TaskValidation } from '../TaskValidation';
import { CreateTaskDTO, TaskPriority, UpdateTaskDTO } from '../Task';

describe('TaskValidation', () => {
  describe('validateCreate', () => {
    it('유효한 CreateTaskDTO에 대해 true를 반환해야 함', () => {
      // Arrange
      const validTask: CreateTaskDTO = {
        title: '유효한 할 일',
        description: '설명',
        priority: TaskPriority.MEDIUM,
        tags: ['태그1', '태그2']
      };
      
      // Act
      const result = TaskValidation.validateCreate(validTask);
      
      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
    
    it('제목이 없는 경우 유효하지 않음을 반환해야 함', () => {
      // Arrange
      const invalidTask = {
        title: '',
        description: '설명'
      } as CreateTaskDTO;
      
      // Act
      const result = TaskValidation.validateCreate(invalidTask);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('할 일 제목은 필수입니다.');
    });
    
    it('제목이 너무 긴 경우 유효하지 않음을 반환해야 함', () => {
      // Arrange
      const longTitle = 'a'.repeat(101);
      const invalidTask: CreateTaskDTO = {
        title: longTitle
      };
      
      // Act
      const result = TaskValidation.validateCreate(invalidTask);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('할 일 제목은 100자 이하여야 합니다.');
    });
    
    it('설명이 너무 긴 경우 유효하지 않음을 반환해야 함', () => {
      // Arrange
      const longDescription = 'a'.repeat(1001);
      const invalidTask: CreateTaskDTO = {
        title: '유효한 제목',
        description: longDescription
      };
      
      // Act
      const result = TaskValidation.validateCreate(invalidTask);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('할 일 설명은 1000자 이하여야 합니다.');
    });
  });
  
  describe('validateUpdate', () => {
    it('유효한 UpdateTaskDTO에 대해 true를 반환해야 함', () => {
      // Arrange
      const validUpdate: UpdateTaskDTO = {
        title: '업데이트된 할 일',
        description: '업데이트된 설명'
      };
      
      // Act
      const result = TaskValidation.validateUpdate(validUpdate);
      
      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
    
    it('제목이 빈 문자열인 경우 유효하지 않음을 반환해야 함', () => {
      // Arrange
      const invalidUpdate: UpdateTaskDTO = {
        title: ''
      };
      
      // Act
      const result = TaskValidation.validateUpdate(invalidUpdate);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('할 일 제목은 비워둘 수 없습니다.');
    });
    
    it('제목이 너무 긴 경우 유효하지 않음을 반환해야 함', () => {
      // Arrange
      const longTitle = 'a'.repeat(101);
      const invalidUpdate: UpdateTaskDTO = {
        title: longTitle
      };
      
      // Act
      const result = TaskValidation.validateUpdate(invalidUpdate);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('할 일 제목은 100자 이하여야 합니다.');
    });
    
    it('설명이 너무 긴 경우 유효하지 않음을 반환해야 함', () => {
      // Arrange
      const longDescription = 'a'.repeat(1001);
      const invalidUpdate: UpdateTaskDTO = {
        description: longDescription
      };
      
      // Act
      const result = TaskValidation.validateUpdate(invalidUpdate);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('할 일 설명은 1000자 이하여야 합니다.');
    });
  });
});
