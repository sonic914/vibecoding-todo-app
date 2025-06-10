import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { taskReducer } from '../../reducers/taskReducer/taskReducer';
import { initialTaskState, TaskState } from '../../reducers/taskReducer/taskTypes';
import { Task, UpdateTaskDTO } from '../../domain/task/Task';
import {
  addTask as addTaskAction,
  updateTask as updateTaskAction,
  deleteTask as deleteTaskAction,
  completeTask as completeTaskAction,
  setFilter as setFilterAction,
  clearFilter as clearFilterAction,
  fetchTasksRequest as fetchTasksRequestAction,
  fetchTasksSuccess as fetchTasksSuccessAction,
  fetchTasksFailure as fetchTasksFailureAction,
  TaskFilter
} from '../../reducers/taskReducer/taskActions';

/**
 * 할 일 컨텍스트에서 제공하는 기능들의 인터페이스
 */
interface TaskContextType {
  state: TaskState;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: UpdateTaskDTO) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  fetchTasks: () => Promise<void>;
  setFilter: (filter: TaskFilter) => void;
  clearFilter: () => void;
}

/**
 * 할 일 컨텍스트 생성
 */
const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * 할 일 컨텍스트 Provider 속성 인터페이스
 */
interface TaskProviderProps {
  children: ReactNode;
  initialState?: TaskState;
}

/**
 * 할 일 컨텍스트 Provider 컴포넌트
 */
export const TaskProvider: React.FC<TaskProviderProps> = ({ 
  children,
  initialState = initialTaskState
}) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  /**
   * 할 일 추가 함수
   */
  const addTask = (task: Task) => {
    dispatch(addTaskAction(task));
  };

  /**
   * 할 일 업데이트 함수
   */
  const updateTask = (id: string, updates: UpdateTaskDTO) => {
    dispatch(updateTaskAction(id, updates));
  };

  /**
   * 할 일 삭제 함수
   */
  const deleteTask = (id: string) => {
    dispatch(deleteTaskAction(id));
  };

  /**
   * 할 일 완료 함수
   */
  const completeTask = (id: string) => {
    dispatch(completeTaskAction(id));
  };

  /**
   * 할 일 목록 가져오기 함수
   * 현재는 로컬 스토리지에서 가져오지만, 추후 백엔드 API로 대체될 예정
   */
  const fetchTasks = async () => {
    dispatch(fetchTasksRequestAction());
    
    try {
      // 로컬 스토리지에서 할 일 목록 가져오기
      const tasksJson = localStorage.getItem('tasks');
      const tasks = tasksJson ? JSON.parse(tasksJson) : [];
      
      // 날짜 객체로 변환
      const parsedTasks = tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }));
      
      dispatch(fetchTasksSuccessAction(parsedTasks));
    } catch (error) {
      dispatch(fetchTasksFailureAction(error instanceof Error ? error.message : '할 일을 불러오는 데 실패했습니다.'));
    }
  };

  /**
   * 필터 설정 함수
   */
  const setFilter = (filter: TaskFilter) => {
    dispatch(setFilterAction(filter));
  };

  /**
   * 필터 초기화 함수
   */
  const clearFilter = () => {
    dispatch(clearFilterAction());
  };

  // 상태가 변경될 때마다 로컬 스토리지에 저장
  React.useEffect(() => {
    if (state.tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    }
  }, [state.tasks]);

  const contextValue: TaskContextType = {
    state,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    fetchTasks,
    setFilter,
    clearFilter
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

/**
 * 할 일 컨텍스트를 사용하기 위한 커스텀 훅
 */
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  
  if (context === undefined) {
    throw new Error('useTaskContext는 TaskProvider 내에서 사용해야 합니다.');
  }
  
  return context;
};
