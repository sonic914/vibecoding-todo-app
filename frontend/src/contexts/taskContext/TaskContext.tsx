import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { taskReducer } from '../../reducers/taskReducer/taskReducer';
import { initialTaskState, TaskState } from '../../reducers/taskReducer/taskTypes';
import { Task, UpdateTaskDTO, TaskStatus } from '../../domain/task/Task';
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
  recordActionAction,
  undoAction,
  TaskFilter
} from '../../reducers/taskReducer/taskActions';
import { saveToStorage, getFromStorage, StorageKeys, isStorageAvailable } from '../../utils/storage/LocalStorageUtils';
import { taskService } from '../../api';
import { API_CONFIG } from '../../config/api';

/**
 * 할 일 컨텍스트에서 제공하는 기능들의 인터페이스
 */
interface TaskContextType {
  state: TaskState;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskDTO) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string, isCompleted: boolean) => Promise<void>;
  fetchTasks: () => Promise<void>;
  setFilter: (filter: TaskFilter) => void;
  clearFilter: () => void;
  undo: () => void;
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
  const addTask = async (task: Task) => {
    // 현재 상태를 저장하고 액션 실행
    const previousState = { tasks: [...state.tasks] };
    
    try {
      // API 사용 여부 확인
      if (!API_CONFIG.useLocalStorage) {
        // API로 할 일 추가
        const createdTask = await taskService.createTask(task);
        dispatch(addTaskAction(createdTask));
        // 실행한 액션과 이전 상태 기록
        dispatch(recordActionAction(addTaskAction(createdTask), previousState));
        return;
      }
      
      // 로컬 스토리지 사용 시
      dispatch(addTaskAction(task));
      // 실행한 액션과 이전 상태 기록
      dispatch(recordActionAction(addTaskAction(task), previousState));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 
                          (typeof error === 'object' && error !== null && 'message' in error) ? 
                          String(error.message) : '할 일 추가에 실패했습니다.';
      console.error('할 일 추가 오류:', errorMessage);
      
      // 오류 상태 업데이트
      dispatch(fetchTasksFailureAction(errorMessage));
      
      // 오류 처리 후 상태 다시 불러오기
      if (!API_CONFIG.useLocalStorage) {
        // API 상태에서 오류 발생 시 재시도
        setTimeout(() => {
          fetchTasks();
        }, 3000); // 3초 후 재시도
      }
    }
  };

  /**
   * 할 일 업데이트 함수
   */
  const updateTask = async (id: string, updates: UpdateTaskDTO) => {
    const previousState = { tasks: [...state.tasks] };
    
    try {
      // API 사용 여부 확인
      if (!API_CONFIG.useLocalStorage) {
        // 현재 태스크 찾기
        const currentTask = state.tasks.find(task => task.id === id);
        if (!currentTask) {
          throw new Error('업데이트할 태스크를 찾을 수 없습니다.');
        }
        
        // 업데이트된 태스크 생성
        const updatedTask: Task = {
          ...currentTask,
          ...updates,
          updatedAt: new Date()
        };
        
        // API로 태스크 업데이트
        await taskService.updateTask(updatedTask);
        
        // 로컬 상태 업데이트
        dispatch(updateTaskAction(id, updates));
        dispatch(recordActionAction(updateTaskAction(id, updates), previousState));
        return;
      }
      
      // 로컬 스토리지 사용 시
      dispatch(updateTaskAction(id, updates));
      dispatch(recordActionAction(updateTaskAction(id, updates), previousState));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 
                          (typeof error === 'object' && error !== null && 'message' in error) ? 
                          String(error.message) : '태스크 업데이트에 실패했습니다.';
      console.error('태스크 업데이트 오류:', errorMessage);
      
      // 오류 상태 업데이트
      dispatch(fetchTasksFailureAction(errorMessage));
      
      // 오류 발생 시 현재 상태로 복구
      if (!API_CONFIG.useLocalStorage) {
        fetchTasks();
      }
    }
  };

  /**
   * 할 일 삭제 함수
   */
  const deleteTask = async (id: string) => {
    const previousState = { tasks: [...state.tasks] };
    
    try {
      // API 사용 여부 확인
      if (!API_CONFIG.useLocalStorage) {
        // API로 태스크 삭제
        await taskService.deleteTask(id);
        
        // 로컬 상태 업데이트
        dispatch(deleteTaskAction(id));
        dispatch(recordActionAction(deleteTaskAction(id), previousState));
        return;
      }
      
      // 로컬 스토리지 사용 시
      dispatch(deleteTaskAction(id));
      dispatch(recordActionAction(deleteTaskAction(id), previousState));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 
                          (typeof error === 'object' && error !== null && 'message' in error) ? 
                          String(error.message) : '태스크 삭제에 실패했습니다.';
      console.error('태스크 삭제 오류:', errorMessage);
      
      // 오류 상태 업데이트
      dispatch(fetchTasksFailureAction(errorMessage));
      
      // 오류 발생 시 현재 상태로 복구
      if (!API_CONFIG.useLocalStorage) {
        fetchTasks();
      }
    }
  };

  /**
   * 할 일 완료 함수
   */
  const completeTask = async (id: string, isCompleted: boolean) => {
    const previousState = { tasks: [...state.tasks] };
    
    try {
      // API 사용 여부 확인
      if (!API_CONFIG.useLocalStorage) {
        // 현재 태스크 찾기
        const currentTask = state.tasks.find(task => task.id === id);
        if (!currentTask) {
          throw new Error('완료할 태스크를 찾을 수 없습니다.');
        }
        
        // 업데이트된 태스크 생성
        const updatedTask: Task = {
          ...currentTask,
          status: isCompleted ? TaskStatus.DONE : TaskStatus.TODO,
          completedAt: isCompleted ? new Date() : undefined,
          updatedAt: new Date()
        };
        
        // API로 태스크 업데이트
        await taskService.updateTask(updatedTask);
        
        // 로컬 상태 업데이트
        dispatch(completeTaskAction(id));
        dispatch(recordActionAction(completeTaskAction(id), previousState));
        return;
      }
      
      // 로컬 스토리지 사용 시
      dispatch(completeTaskAction(id));
      dispatch(recordActionAction(completeTaskAction(id), previousState));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 
                          (typeof error === 'object' && error !== null && 'message' in error) ? 
                          String(error.message) : '태스크 완료 상태 변경에 실패했습니다.';
      console.error('태스크 완료 상태 변경 오류:', errorMessage);
      
      // 오류 상태 업데이트
      dispatch(fetchTasksFailureAction(errorMessage));
      
      // 오류 발생 시 현재 상태로 복구
      if (!API_CONFIG.useLocalStorage) {
        fetchTasks();
      }
    }
  };
  
  /**
   * 실행 취소 함수
   */
  const undo = () => {
    if (state.canUndo) {
      dispatch(undoAction());
    }
  };

  /**
   * 할 일 목록 가져오기 함수
   * API 서비스 또는 로컬 스토리지에서 데이터 가져오기
   */
  const fetchTasks = async () => {
    dispatch(fetchTasksRequestAction());
    
    try {
      // API 사용 여부 확인
      if (!API_CONFIG.useLocalStorage) {
        // API로 할 일 목록 가져오기
        const tasks = await taskService.getAllTasks();
        
        // 날짜 객체로 변환
        const parsedTasks = tasks.map((task: Task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        
        dispatch(fetchTasksSuccessAction(parsedTasks));
        return;
      }
      
      // 로컬 스토리지 사용 가능 여부 확인
      if (!isStorageAvailable()) {
        throw new Error('로컬 스토리지를 사용할 수 없습니다.');
      }
      
      // 로컬 스토리지에서 할 일 목록 가져오기
      const tasks = getFromStorage<Task[]>(StorageKeys.TASKS, []);
      
      if (!tasks) {
        dispatch(fetchTasksSuccessAction([]));
        return;
      }
      
      // 날짜 객체로 변환
      const parsedTasks = tasks.map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }));
      
      dispatch(fetchTasksSuccessAction(parsedTasks));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 
                          (typeof error === 'object' && error !== null && 'message' in error) ? 
                          String(error.message) : '할 일을 불러오는 데 실패했습니다.';
      dispatch(fetchTasksFailureAction(errorMessage));
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

  // 상태가 변경될 때마다 로컬 스토리지에 저장 (로컬 스토리지 사용 시에만)
  useEffect(() => {
    // API 사용 시에는 로컬 스토리지에 저장하지 않음
    if (!API_CONFIG.useLocalStorage) {
      return;
    }
    
    // 로컬 스토리지 사용 가능 여부 확인
    if (!isStorageAvailable()) {
      console.error('로컬 스토리지를 사용할 수 없습니다.');
      return;
    }
    
    // 할 일 목록이 비어있지 않은 경우에만 저장
    if (state.tasks.length > 0) {
      saveToStorage(StorageKeys.TASKS, state.tasks);
    }
  }, [state.tasks, API_CONFIG.useLocalStorage]);
  
  // 필터 상태가 변경될 때마다 로컬 스토리지에 저장 (로컬 스토리지 사용 시에만)
  useEffect(() => {
    // API 사용 시에는 로컬 스토리지에 저장하지 않음
    if (!API_CONFIG.useLocalStorage) {
      return;
    }
    
    if (isStorageAvailable() && state.filter) {
      saveToStorage(StorageKeys.FILTER, state.filter);
    }
  }, [state.filter, API_CONFIG.useLocalStorage]);
  
  // 컴포넌트 마운트 시 로컬 스토리지에서 할 일 목록 불러오기
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: TaskContextType = {
    state,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    fetchTasks,
    setFilter,
    clearFilter,
    undo
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
