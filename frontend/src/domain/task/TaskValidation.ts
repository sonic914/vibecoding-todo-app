import { CreateTaskDTO, UpdateTaskDTO } from './Task';

/**
 * 유효성 검사 결과를 나타내는 인터페이스
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 할 일 유효성 검사를 담당하는 클래스
 * 도메인 규칙에 따라 할 일 객체의 유효성을 검증합니다.
 */
export class TaskValidation {
  private static readonly MAX_TITLE_LENGTH = 100;
  private static readonly MAX_DESCRIPTION_LENGTH = 1000;

  /**
   * 할 일 생성 DTO의 유효성을 검사합니다.
   * @param task 검사할 할 일 생성 DTO
   * @returns 유효성 검사 결과
   */
  static validateCreate(task: CreateTaskDTO): ValidationResult {
    const errors: string[] = [];

    // 제목 검사
    if (!task.title || task.title.trim() === '') {
      errors.push('할 일 제목은 필수입니다.');
    } else if (task.title.length > this.MAX_TITLE_LENGTH) {
      errors.push(`할 일 제목은 ${this.MAX_TITLE_LENGTH}자 이하여야 합니다.`);
    }

    // 설명 검사 (있는 경우)
    if (task.description && task.description.length > this.MAX_DESCRIPTION_LENGTH) {
      errors.push(`할 일 설명은 ${this.MAX_DESCRIPTION_LENGTH}자 이하여야 합니다.`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 할 일 업데이트 DTO의 유효성을 검사합니다.
   * @param task 검사할 할 일 업데이트 DTO
   * @returns 유효성 검사 결과
   */
  static validateUpdate(task: UpdateTaskDTO): ValidationResult {
    const errors: string[] = [];

    // 제목 검사 (있는 경우)
    if (task.title !== undefined) {
      if (task.title.trim() === '') {
        errors.push('할 일 제목은 비워둘 수 없습니다.');
      } else if (task.title.length > this.MAX_TITLE_LENGTH) {
        errors.push(`할 일 제목은 ${this.MAX_TITLE_LENGTH}자 이하여야 합니다.`);
      }
    }

    // 설명 검사 (있는 경우)
    if (task.description && task.description.length > this.MAX_DESCRIPTION_LENGTH) {
      errors.push(`할 일 설명은 ${this.MAX_DESCRIPTION_LENGTH}자 이하여야 합니다.`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
