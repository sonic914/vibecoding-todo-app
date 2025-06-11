// React 17 이상에서는 JSX 사용 시 React import가 필요 없음
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskProvider, useTaskContext } from '../TaskContext';
import { TaskStatus } from '@/domain/task/Task';
import { TaskFactory } from '@/domain/task/TaskFactory';

// 테스트용 컴포넌트
const TestComponent = () => {
  const { state, addTask, deleteTask, updateTask, completeTask, undo } = useTaskContext();
  const { tasks, undoStack, canUndo } = state;

  const handleAddTask = () => {
    const task = TaskFactory.create({
      title: '테스트 할 일',
      description: '테스트 설명'
    });
    addTask(task);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleUpdateTask = (id: string) => {
    updateTask(id, { title: '수정된 할 일' });
  };

  const handleCompleteTask = (id: string) => {
    completeTask(id);
  };

  const handleUndo = () => {
    undo();
  };

  return (
    <div>
      <button onClick={handleAddTask} data-testid="add-task">할 일 추가</button>
      <button onClick={handleUndo} data-testid="undo" disabled={!canUndo}>실행 취소</button>
      <div data-testid="undo-stack-size">{undoStack.length}</div>
      <div data-testid="can-undo">{canUndo ? 'true' : 'false'}</div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} data-testid={`task-${task.id}`}>
            {task.title} - {task.status}
            <button onClick={() => handleDeleteTask(task.id)} data-testid={`delete-${task.id}`}>
              삭제
            </button>
            <button onClick={() => handleUpdateTask(task.id)} data-testid={`update-${task.id}`}>
              수정
            </button>
            <button onClick={() => handleCompleteTask(task.id)} data-testid={`complete-${task.id}`}>
              완료
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('Undo 기능 테스트', () => {
  test('할 일 추가 후 실행 취소', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    // 초기 상태 확인
    expect(screen.getByTestId('undo-stack-size').textContent).toBe('0');
    expect(screen.getByTestId('can-undo').textContent).toBe('false');
    
    // 할 일 추가
    fireEvent.click(screen.getByTestId('add-task'));

    // 할 일이 추가되고 undo 스택이 증가했는지 확인
    await waitFor(() => {
      expect(screen.getByTestId('undo-stack-size').textContent).toBe('1');
      expect(screen.getByTestId('can-undo').textContent).toBe('true');
    });

    // 실행 취소
    fireEvent.click(screen.getByTestId('undo'));

    // 할 일이 제거되고 undo 스택이 비었는지 확인
    await waitFor(() => {
      expect(screen.getByTestId('undo-stack-size').textContent).toBe('0');
      expect(screen.getByTestId('can-undo').textContent).toBe('false');
    });
  });

  test('할 일 삭제 후 실행 취소', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    // 할 일 추가
    fireEvent.click(screen.getByTestId('add-task'));

    // 할 일이 추가되었는지 확인
    let taskElement;
    await waitFor(() => {
      taskElement = screen.queryAllByTestId(/^task-/)[0];
      expect(taskElement).toBeInTheDocument();
    });

    // 할 일 ID 가져오기
    // non-null assertion 연산자(!)를 사용하여 taskElement가 undefined가 아님을 TypeScript에 알림
    const taskId = taskElement!.dataset.testid!.split('-')[1];

    // 할 일 삭제
    fireEvent.click(screen.getByTestId(`delete-${taskId}`));

    // 할 일이 삭제되었는지 확인
    await waitFor(() => {
      expect(screen.queryByTestId(`task-${taskId}`)).not.toBeInTheDocument();
    });

    // 실행 취소
    fireEvent.click(screen.getByTestId('undo'));

    // 할 일이 복원되었는지 확인
    await waitFor(() => {
      expect(screen.queryByTestId(`task-${taskId}`)).toBeInTheDocument();
    });
  });

  test('할 일 수정 후 실행 취소', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    // 할 일 추가
    fireEvent.click(screen.getByTestId('add-task'));

    // 할 일이 추가되었는지 확인
    let taskElement;
    await waitFor(() => {
      taskElement = screen.queryAllByTestId(/^task-/)[0];
      expect(taskElement).toBeInTheDocument();
      expect(taskElement!.textContent).toContain('테스트 할 일');
    });

    // 할 일 ID 가져오기
    // non-null assertion 연산자(!)를 사용하여 taskElement가 undefined가 아님을 TypeScript에 알림
    const taskId = taskElement!.dataset.testid!.split('-')[1];
    
    // 할 일 수정
    fireEvent.click(screen.getByTestId(`update-${taskId}`));

    // 할 일이 수정되었는지 확인
    await waitFor(() => {
      expect(screen.getByTestId(`task-${taskId}`).textContent).toContain('수정된 할 일');
    });

    // 실행 취소
    fireEvent.click(screen.getByTestId('undo'));

    // 할 일이 원래 상태로 복원되었는지 확인
    await waitFor(() => {
      expect(screen.getByTestId(`task-${taskId}`).textContent).toContain('테스트 할 일');
    });
  });

  test('할 일 완료 후 실행 취소', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    // 할 일 추가
    fireEvent.click(screen.getByTestId('add-task'));

    // 할 일이 추가되었는지 확인
    let taskElement;
    await waitFor(() => {
      taskElement = screen.queryAllByTestId(/^task-/)[0];
      expect(taskElement).toBeInTheDocument();
      expect(taskElement!.textContent).toContain(TaskStatus.TODO);
    });

    // 할 일 ID 가져오기
    // non-null assertion 연산자(!)를 사용하여 taskElement가 undefined가 아님을 TypeScript에 알림
    const taskId = taskElement!.dataset.testid!.split('-')[1];

    // 할 일 완료
    fireEvent.click(screen.getByTestId(`complete-${taskId}`));

    // 할 일이 완료되었는지 확인
    await waitFor(() => {
      expect(screen.getByTestId(`task-${taskId}`).textContent).toContain(TaskStatus.DONE);
    });

    // 실행 취소
    fireEvent.click(screen.getByTestId('undo'));

    // 할 일이 원래 상태로 복원되었는지 확인
    await waitFor(() => {
      expect(screen.getByTestId(`task-${taskId}`).textContent).toContain(TaskStatus.TODO);
    });
  });
});
