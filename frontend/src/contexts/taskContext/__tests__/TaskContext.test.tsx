// React 17 이상에서는 JSX 사용 시 React import가 필요 없음
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskProvider, useTaskContext } from '@/contexts/taskContext/TaskContext';
import { TaskFactory } from '@/domain/task/TaskFactory';
import { TaskStatus, Task } from '@/domain/task/Task';
import { StorageKeys } from '@/utils/storage/LocalStorageUtils';

// 테스트용 컴포넌트
const TestComponent: React.FC = () => {
  const { state, addTask, updateTask, deleteTask, completeTask, setFilter, clearFilter } = useTaskContext();
  
  const handleAddTask = () => {
    const task = TaskFactory.create({ title: '테스트 할 일' });
    addTask(task);
  };
  
  const handleUpdateTask = () => {
    if (state.tasks.length > 0) {
      updateTask(state.tasks[0].id, { title: '업데이트된 할 일' });
    }
  };
  
  const handleDeleteTask = () => {
    if (state.tasks.length > 0) {
      deleteTask(state.tasks[0].id);
    }
  };
  
  const handleCompleteTask = () => {
    if (state.tasks.length > 0) {
      completeTask(state.tasks[0].id);
    }
  };
  
  const handleSetFilter = () => {
    setFilter({ status: TaskStatus.TODO });
  };
  
  const handleClearFilter = () => {
    clearFilter();
  };
  
  return (
    <div>
      <div data-testid="task-count">{state.tasks.length}</div>
      {state.tasks.map((task: Task) => (
        <div key={task.id} data-testid="task-item">
          <span data-testid="task-title">{task.title}</span>
          <span data-testid="task-status">{task.status}</span>
        </div>
      ))}
      <div data-testid="filter-status">{state.filter.status || 'none'}</div>
      <button onClick={handleAddTask} data-testid="add-task-btn">할 일 추가</button>
      <button onClick={handleUpdateTask} data-testid="update-task-btn">할 일 수정</button>
      <button onClick={handleDeleteTask} data-testid="delete-task-btn">할 일 삭제</button>
      <button onClick={handleCompleteTask} data-testid="complete-task-btn">할 일 완료</button>
      <button onClick={handleSetFilter} data-testid="set-filter-btn">필터 설정</button>
      <button onClick={handleClearFilter} data-testid="clear-filter-btn">필터 초기화</button>
    </div>
  );
};

// LocalStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string): string | null => {
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string): void => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string): void => {
      delete store[key];
    }),
    clear: jest.fn((): void => {
      store = {};
    })
  };
})();

// 테스트 전에 로컬 스토리지 모킹 설정
beforeEach(() => {
  // 실제 로컬 스토리지 대신 모킹된 버전 사용
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  // 각 테스트 전에 모킹된 함수 호출 기록 초기화
  jest.clearAllMocks();
  // 모킹 스토어 초기화
  localStorageMock.clear();
});

describe('TaskContext', () => {
  it('초기 상태가 올바르게 설정되어야 함', () => {
    // Act
    render(
      <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
        <TestComponent />
      </TaskProvider>
    );
    
    // Assert
    expect(screen.getByTestId('task-count').textContent).toBe('0');
    expect(screen.getByTestId('filter-status').textContent).toBe('none');
  });
  
  it('할 일을 추가할 수 있어야 함', () => {
    // Arrange
    render(
      <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
        <TestComponent />
      </TaskProvider>
    );
    
    // Act
    fireEvent.click(screen.getByTestId('add-task-btn'));
    
    // Assert
    expect(screen.getByTestId('task-count').textContent).toBe('1');
    expect(screen.getByTestId('task-title').textContent).toBe('테스트 할 일');
    expect(screen.getByTestId('task-status').textContent).toBe(TaskStatus.TODO);
  });
  
  it('할 일을 업데이트할 수 있어야 함', () => {
    // Arrange
    render(
      <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
        <TestComponent />
      </TaskProvider>
    );
    
    // Act
    fireEvent.click(screen.getByTestId('add-task-btn'));
    fireEvent.click(screen.getByTestId('update-task-btn'));
    
    // Assert
    const taskItems = screen.getAllByTestId('task-item');
    const firstTaskTitle = taskItems[0].querySelector('[data-testid="task-title"]');
    expect(firstTaskTitle?.textContent).toBe('업데이트된 할 일');
  });
  
  it('할 일을 삭제할 수 있어야 함', () => {
    // Arrange
    render(
      <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
        <TestComponent />
      </TaskProvider>
    );
    
    // Act
    fireEvent.click(screen.getByTestId('add-task-btn'));
    fireEvent.click(screen.getByTestId('delete-task-btn'));
    
    // Assert
    expect(screen.getByTestId('task-count').textContent).toBe('0');
  });
  
  it('할 일을 완료할 수 있어야 함', () => {
    // Arrange
    render(
      <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
        <TestComponent />
      </TaskProvider>
    );
    
    // Act
    fireEvent.click(screen.getByTestId('add-task-btn'));
    fireEvent.click(screen.getByTestId('complete-task-btn'));
    
    // Assert
    const taskItems = screen.getAllByTestId('task-item');
    const firstTaskStatus = taskItems[0].querySelector('[data-testid="task-status"]');
    expect(firstTaskStatus?.textContent).toBe(TaskStatus.DONE);
  });
  
  it('필터를 설정할 수 있어야 함', () => {
    // Arrange
    render(
      <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
        <TestComponent />
      </TaskProvider>
    );
    
    // Act
    fireEvent.click(screen.getByTestId('set-filter-btn'));
    
    // Assert
    expect(screen.getByTestId('filter-status').textContent).toBe(TaskStatus.TODO);
  });
  
  it('필터를 초기화할 수 있어야 함', () => {
    // Arrange
    render(
      <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
        <TestComponent />
      </TaskProvider>
    );
    
    // Act
    fireEvent.click(screen.getByTestId('set-filter-btn'));
    fireEvent.click(screen.getByTestId('clear-filter-btn'));
    
    // Assert
    expect(screen.getByTestId('filter-status').textContent).toBe('none');
  });

  describe('LocalStorage 연동', () => {
    it('할 일이 추가되면 로컬 스토리지에 저장되어야 함', () => {
      // Arrange
      render(
        <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
          <TestComponent />
        </TaskProvider>
      );
      
      // 시작하기 전 모킹 함수 호출 기록 초기화
      localStorageMock.setItem.mockClear();
      
      // Act
      fireEvent.click(screen.getByTestId('add-task-btn'));
      
      // Assert
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        StorageKeys.TASKS,
        expect.any(String)
      );
      
      // 저장된 데이터 검증 - 가장 최근 호출을 확인
      const lastCallIndex = localStorageMock.setItem.mock.calls.length - 1;
      const savedDataStr = localStorageMock.setItem.mock.calls[lastCallIndex][1];
      
      // 유효한 JSON인지 확인
      try {
        const savedData = JSON.parse(savedDataStr);
        expect(Array.isArray(savedData)).toBe(true);
        expect(savedData.some((task: Task) => task.title === '테스트 할 일')).toBe(true);
      } catch (e) {
        fail(`유효한 JSON이 아닙니다: ${savedDataStr}`);
      }
    });
    
    it('할 일이 수정되면 로컬 스토리지가 업데이트되어야 함', () => {
      // Arrange
      render(
        <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
          <TestComponent />
        </TaskProvider>
      );
      
      // 시작하기 전 모킹 함수 호출 기록 초기화
      localStorageMock.setItem.mockClear();
      
      // Act
      fireEvent.click(screen.getByTestId('add-task-btn'));
      fireEvent.click(screen.getByTestId('update-task-btn'));
      
      // Assert
      expect(localStorageMock.setItem).toHaveBeenCalled();
      
      // 저장된 데이터 검증 - 가장 최근 호출을 확인
      const lastCallIndex = localStorageMock.setItem.mock.calls.length - 1;
      const savedDataStr = localStorageMock.setItem.mock.calls[lastCallIndex][1];
      
      // 유효한 JSON인지 확인
      try {
        const savedData = JSON.parse(savedDataStr);
        expect(Array.isArray(savedData)).toBe(true);
        expect(savedData.some((task: Task) => task.title === '업데이트된 할 일')).toBe(true);
      } catch (e) {
        fail(`유효한 JSON이 아닙니다: ${savedDataStr}`);
      }
    });
    
    it('할 일이 삭제되면 로컬 스토리지가 업데이트되어야 함', () => {
      // Arrange
      render(
        <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
          <TestComponent />
        </TaskProvider>
      );
      
      // 시작하기 전 모킹 함수 호출 기록 초기화
      localStorageMock.setItem.mockClear();
      
      // Act
      fireEvent.click(screen.getByTestId('add-task-btn'));
      
      // 할 일이 추가되었는지 확인
      expect(screen.getByTestId('task-count').textContent).toBe('1');
      
      // 삭제 버튼 클릭
      fireEvent.click(screen.getByTestId('delete-task-btn'));
      
      // 할 일이 삭제되었는지 확인
      expect(screen.getByTestId('task-count').textContent).toBe('0');
      
      // 로컬 스토리지 호출 확인
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
  
  // 추가 테스트: 각 테스트가 독립적으로 작동하는지 확인
  it('각 테스트는 독립적인 상태로 시작해야 함', () => {
    // 처음 렌더링했을 때 할 일이 없어야 함
    render(
      <TaskProvider initialState={{ tasks: [], isLoading: false, error: null, filter: {}, undoStack: [], canUndo: false }}>
        <TestComponent />
      </TaskProvider>
    );
    
    expect(screen.getByTestId('task-count').textContent).toBe('0');
  });
});
