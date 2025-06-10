import { TaskAction, TASK_ACTION_TYPES } from './taskActions';
import { TaskState, initialTaskState } from './taskTypes';
import { TaskStatus } from '../../domain/task/Task';

/**
 * 할 일 상태를 관리하는 리듀서 함수
 * 
 * @param state 현재 상태 (기본값: initialTaskState)
 * @param action 액션 객체
 * @returns 새로운 상태
 */
export const taskReducer = (
  state: TaskState = initialTaskState,
  action: TaskAction
): TaskState => {
  switch (action.type) {
    case TASK_ACTION_TYPES.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
      
    case TASK_ACTION_TYPES.UPDATE_TASK: {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      
      if (taskIndex === -1) {
        return state;
      }
      
      const updatedTasks = [...state.tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        ...updates,
        updatedAt: new Date()
      };
      
      return {
        ...state,
        tasks: updatedTasks
      };
    }
    
    case TASK_ACTION_TYPES.DELETE_TASK: {
      const taskId = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        return state;
      }
      
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== taskId)
      };
    }
    
    case TASK_ACTION_TYPES.COMPLETE_TASK: {
      const taskId = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        return state;
      }
      
      const now = new Date();
      const updatedTasks = [...state.tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        status: TaskStatus.DONE,
        completedAt: now,
        updatedAt: now
      };
      
      return {
        ...state,
        tasks: updatedTasks
      };
    }
    
    case TASK_ACTION_TYPES.FETCH_TASKS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case TASK_ACTION_TYPES.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
        error: null
      };
      
    case TASK_ACTION_TYPES.FETCH_TASKS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
      
    case TASK_ACTION_TYPES.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };
      
    case TASK_ACTION_TYPES.CLEAR_FILTER:
      return {
        ...state,
        filter: {}
      };
      
    default:
      return state;
  }
};
