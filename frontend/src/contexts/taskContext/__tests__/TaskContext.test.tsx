import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskProvider, useTaskContext } from '../TaskContext';
import { TaskFactory } from '../../../domain/task/TaskFactory';
import { TaskStatus } from '../../../domain/task/Task';

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
      {state.tasks.map(task => (
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

describe('TaskContext', () => {
  it('초기 상태가 올바르게 설정되어야 함', () => {
    // Act
    render(
      <TaskProvider>
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
      <TaskProvider>
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
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    // Act
    fireEvent.click(screen.getByTestId('add-task-btn'));
    fireEvent.click(screen.getByTestId('update-task-btn'));
    
    // Assert
    expect(screen.getByTestId('task-title').textContent).toBe('업데이트된 할 일');
  });
  
  it('할 일을 삭제할 수 있어야 함', () => {
    // Arrange
    render(
      <TaskProvider>
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
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    // Act
    fireEvent.click(screen.getByTestId('add-task-btn'));
    fireEvent.click(screen.getByTestId('complete-task-btn'));
    
    // Assert
    expect(screen.getByTestId('task-status').textContent).toBe(TaskStatus.DONE);
  });
  
  it('필터를 설정할 수 있어야 함', () => {
    // Arrange
    render(
      <TaskProvider>
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
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    
    // Act
    fireEvent.click(screen.getByTestId('set-filter-btn'));
    fireEvent.click(screen.getByTestId('clear-filter-btn'));
    
    // Assert
    expect(screen.getByTestId('filter-status').textContent).toBe('none');
  });
});
