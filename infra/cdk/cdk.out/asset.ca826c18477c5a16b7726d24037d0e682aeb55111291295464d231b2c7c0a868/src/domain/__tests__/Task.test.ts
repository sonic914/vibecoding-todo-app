import { Task } from '../Task';

describe('Task Entity', () => {
  it('should create a task with id, title, and default completed status to be false', () => {
    const now = new Date();
    const task = new Task({
      id: '1',
      title: 'Test Task',
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    expect(task.id).toBe('1');
    expect(task.title).toBe('Test Task');
    expect(task.completed).toBe(false);
  });

  it('should allow toggling the completed status', () => {
    const now = new Date();
    const task = new Task({
      id: '1',
      title: 'Test Task',
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    task.toggleComplete();
    expect(task.completed).toBe(true);

    task.toggleComplete();
    expect(task.completed).toBe(false);
  });

  it('should allow updating the title', () => {
    const now = new Date();
    const task = new Task({
      id: '1',
      title: 'Initial Title',
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
    const newTitle = 'Updated Title';
    task.updateTitle(newTitle);

    expect(task.title).toBe(newTitle);
  });
});
