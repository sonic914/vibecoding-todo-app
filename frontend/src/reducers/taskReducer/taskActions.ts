import { Task, UpdateTaskDTO } from '../../domain/task/Task';
import { TaskFilter as TaskFilterType } from './taskTypes';

/**
 * TaskFilter 타입을 재내보내기
 */
export type TaskFilter = TaskFilterType;

/**
 * 할 일 관련 액션 타입 상수
 */
export const TASK_ACTION_TYPES = {
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  COMPLETE_TASK: 'COMPLETE_TASK',
  FETCH_TASKS_REQUEST: 'FETCH_TASKS_REQUEST',
  FETCH_TASKS_SUCCESS: 'FETCH_TASKS_SUCCESS',
  FETCH_TASKS_FAILURE: 'FETCH_TASKS_FAILURE',
  SET_FILTER: 'SET_FILTER',
  CLEAR_FILTER: 'CLEAR_FILTER',
  RECORD_ACTION: 'RECORD_ACTION',
  UNDO: 'UNDO'
} as const;

/**
 * 할 일 액션 타입 정의
 */
export type TaskAction =
  | AddTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | CompleteTaskAction
  | FetchTasksRequestAction
  | FetchTasksSuccessAction
  | FetchTasksFailureAction
  | SetFilterAction
  | ClearFilterAction
  | RecordActionAction
  | UndoAction;

/**
 * 할 일 추가 액션 인터페이스
 */
export interface AddTaskAction {
  type: typeof TASK_ACTION_TYPES.ADD_TASK;
  payload: Task;
}

/**
 * 할 일 업데이트 액션 인터페이스
 */
export interface UpdateTaskAction {
  type: typeof TASK_ACTION_TYPES.UPDATE_TASK;
  payload: {
    id: string;
    updates: UpdateTaskDTO;
  };
}

/**
 * 할 일 삭제 액션 인터페이스
 */
export interface DeleteTaskAction {
  type: typeof TASK_ACTION_TYPES.DELETE_TASK;
  payload: string; // task id
}

/**
 * 할 일 완료 액션 인터페이스
 */
export interface CompleteTaskAction {
  type: typeof TASK_ACTION_TYPES.COMPLETE_TASK;
  payload: string; // task id
}

/**
 * 할 일 목록 요청 액션 인터페이스
 */
export interface FetchTasksRequestAction {
  type: typeof TASK_ACTION_TYPES.FETCH_TASKS_REQUEST;
}

/**
 * 할 일 목록 요청 성공 액션 인터페이스
 */
export interface FetchTasksSuccessAction {
  type: typeof TASK_ACTION_TYPES.FETCH_TASKS_SUCCESS;
  payload: Task[];
}

/**
 * 할 일 목록 요청 실패 액션 인터페이스
 */
export interface FetchTasksFailureAction {
  type: typeof TASK_ACTION_TYPES.FETCH_TASKS_FAILURE;
  payload: string; // error message
}

/**
 * 필터 설정 액션 인터페이스
 */
export interface SetFilterAction {
  type: typeof TASK_ACTION_TYPES.SET_FILTER;
  payload: TaskFilter;
}

/**
 * 필터 초기화 액션 인터페이스
 */
export interface ClearFilterAction {
  type: typeof TASK_ACTION_TYPES.CLEAR_FILTER;
}

/**
 * 작업 기록 액션 인터페이스
 */
export interface RecordActionAction {
  type: typeof TASK_ACTION_TYPES.RECORD_ACTION;
  payload: {
    action: TaskAction;
    previousState: any;
  };
}

/**
 * 실행 취소 액션 인터페이스
 */
export interface UndoAction {
  type: typeof TASK_ACTION_TYPES.UNDO;
}

/**
 * 할 일 추가 액션 생성 함수
 */
export const addTask = (task: Task): AddTaskAction => ({
  type: TASK_ACTION_TYPES.ADD_TASK,
  payload: task
});

/**
 * 할 일 업데이트 액션 생성 함수
 */
export const updateTask = (id: string, updates: UpdateTaskDTO): UpdateTaskAction => ({
  type: TASK_ACTION_TYPES.UPDATE_TASK,
  payload: { id, updates }
});

/**
 * 할 일 삭제 액션 생성 함수
 */
export const deleteTask = (id: string): DeleteTaskAction => ({
  type: TASK_ACTION_TYPES.DELETE_TASK,
  payload: id
});

/**
 * 할 일 완료 액션 생성 함수
 */
export const completeTask = (id: string): CompleteTaskAction => ({
  type: TASK_ACTION_TYPES.COMPLETE_TASK,
  payload: id
});

/**
 * 할 일 목록 요청 액션 생성 함수
 */
export const fetchTasksRequest = (): FetchTasksRequestAction => ({
  type: TASK_ACTION_TYPES.FETCH_TASKS_REQUEST
});

/**
 * 할 일 목록 요청 성공 액션 생성 함수
 */
export const fetchTasksSuccess = (tasks: Task[]): FetchTasksSuccessAction => ({
  type: TASK_ACTION_TYPES.FETCH_TASKS_SUCCESS,
  payload: tasks
});

/**
 * 할 일 목록 요청 실패 액션 생성 함수
 */
export const fetchTasksFailure = (error: string): FetchTasksFailureAction => ({
  type: TASK_ACTION_TYPES.FETCH_TASKS_FAILURE,
  payload: error
});

/**
 * 필터 설정 액션 생성 함수
 */
export const setFilter = (filter: TaskFilter): SetFilterAction => ({
  type: TASK_ACTION_TYPES.SET_FILTER,
  payload: filter
});

/**
 * 필터 초기화 액션 생성자
 */
export const clearFilter = (): ClearFilterAction => ({
  type: TASK_ACTION_TYPES.CLEAR_FILTER
});

/**
 * 작업 기록 액션 생성자
 * @param action 기록할 액션
 * @param previousState 이전 상태
 */
export const recordActionAction = (action: TaskAction, previousState: any): RecordActionAction => ({
  type: TASK_ACTION_TYPES.RECORD_ACTION,
  payload: {
    action,
    previousState
  }
});

/**
 * 실행 취소 액션 생성자
 */
export const undoAction = (): UndoAction => ({
  type: TASK_ACTION_TYPES.UNDO
});
