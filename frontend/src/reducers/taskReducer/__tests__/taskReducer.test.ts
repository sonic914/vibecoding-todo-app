import { taskReducer } from '../taskReducer';
import { initialTaskState } from '../taskTypes';
import {
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  setFilter,
  clearFilter
} from '../taskActions';
import { TaskFactory } from '../../../domain/task/TaskFactory';
import { TaskStatus, TaskPriority } from '../../../domain/task/Task';

describe('taskReducer', () => {
  it('초기 상태를 반환해야 함', () => {
    // Act
    const state = taskReducer(undefined, { type: 'UNKNOWN_ACTION' } as any);
    
    // Assert
    expect(state).toEqual(initialTaskState);
  });
  
  describe('ADD_TASK', () => {
    it('할 일을 tasks 배열에 추가해야 함', () => {
      // Arrange
      const task = TaskFactory.create({ title: '새로운 할 일' });
      const action = addTask(task);
      
      // Act
      const state = taskReducer(initialTaskState, action);
      
      // Assert
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0]).toEqual(task);
    });
  });
  
  describe('UPDATE_TASK', () => {
    it('기존 할 일을 업데이트해야 함', () => {
      // Arrange
      const task = TaskFactory.create({ title: '기존 할 일' });
      const initialState = {
        ...initialTaskState,
        tasks: [task]
      };
      const updates = { title: '업데이트된 할 일', priority: TaskPriority.HIGH };
      const action = updateTask(task.id, updates);
      
      // Act
      const state = taskReducer(initialState, action);
      
      // Assert
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('업데이트된 할 일');
      expect(state.tasks[0].priority).toBe(TaskPriority.HIGH);
      expect(state.tasks[0].id).toBe(task.id);
    });
    
    it('존재하지 않는 할 일 ID로 업데이트 시 상태를 변경하지 않아야 함', () => {
      // Arrange
      const task = TaskFactory.create({ title: '기존 할 일' });
      const initialState = {
        ...initialTaskState,
        tasks: [task]
      };
      const updates = { title: '업데이트된 할 일' };
      const action = updateTask('non-existent-id', updates);
      
      // Act
      const state = taskReducer(initialState, action);
      
      // Assert
      expect(state).toEqual(initialState);
    });
  });
  
  describe('DELETE_TASK', () => {
    it('할 일을 삭제해야 함', () => {
      // Arrange
      const task1 = TaskFactory.create({ title: '할 일 1' });
      const task2 = TaskFactory.create({ title: '할 일 2' });
      const initialState = {
        ...initialTaskState,
        tasks: [task1, task2]
      };
      const action = deleteTask(task1.id);
      
      // Act
      const state = taskReducer(initialState, action);
      
      // Assert
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].id).toBe(task2.id);
    });
    
    it('존재하지 않는 할 일 ID로 삭제 시 상태를 변경하지 않아야 함', () => {
      // Arrange
      const task = TaskFactory.create({ title: '할 일' });
      const initialState = {
        ...initialTaskState,
        tasks: [task]
      };
      const action = deleteTask('non-existent-id');
      
      // Act
      const state = taskReducer(initialState, action);
      
      // Assert
      expect(state).toEqual(initialState);
    });
  });
  
  describe('COMPLETE_TASK', () => {
    it('할 일 상태를 DONE으로 변경하고 completedAt을 설정해야 함', () => {
      // Arrange
      const task = TaskFactory.create({ title: '할 일' });
      const initialState = {
        ...initialTaskState,
        tasks: [task]
      };
      const action = completeTask(task.id);
      
      // Mock date for consistent testing
      const now = new Date('2025-06-10T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now as unknown as string);
      
      // Act
      const state = taskReducer(initialState, action);
      
      // Assert
      expect(state.tasks[0].status).toBe(TaskStatus.DONE);
      expect(state.tasks[0].completedAt).toEqual(now);
      
      // Clean up
      jest.restoreAllMocks();
    });
  });
  
  describe('FETCH_TASKS_REQUEST', () => {
    it('로딩 상태를 true로 설정해야 함', () => {
      // Arrange
      const action = fetchTasksRequest();
      
      // Act
      const state = taskReducer(initialTaskState, action);
      
      // Assert
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });
  
  describe('FETCH_TASKS_SUCCESS', () => {
    it('tasks를 설정하고 로딩 상태를 false로 설정해야 함', () => {
      // Arrange
      const tasks = [
        TaskFactory.create({ title: '할 일 1' }),
        TaskFactory.create({ title: '할 일 2' })
      ];
      const initialState = {
        ...initialTaskState,
        isLoading: true
      };
      const action = fetchTasksSuccess(tasks);
      
      // Act
      const state = taskReducer(initialState, action);
      
      // Assert
      expect(state.tasks).toEqual(tasks);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
  
  describe('FETCH_TASKS_FAILURE', () => {
    it('에러를 설정하고 로딩 상태를 false로 설정해야 함', () => {
      // Arrange
      const errorMessage = '할 일을 불러오는 데 실패했습니다.';
      const initialState = {
        ...initialTaskState,
        isLoading: true
      };
      const action = fetchTasksFailure(errorMessage);
      
      // Act
      const state = taskReducer(initialState, action);
      
      // Assert
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });
  
  describe('SET_FILTER', () => {
    it('필터를 설정해야 함', () => {
      // Arrange
      const filter = { status: TaskStatus.TODO, priority: TaskPriority.HIGH };
      const action = setFilter(filter);
      
      // Act
      const state = taskReducer(initialTaskState, action);
      
      // Assert
      expect(state.filter).toEqual(filter);
    });
  });
  
  describe('CLEAR_FILTER', () => {
    it('필터를 초기화해야 함', () => {
      // Arrange
      const initialState = {
        ...initialTaskState,
        filter: { status: TaskStatus.TODO, priority: TaskPriority.HIGH }
      };
      const action = clearFilter();
      
      // Act
      const state = taskReducer(initialState, action);
      
      // Assert
      expect(state.filter).toEqual({});
    });
  });
});
