interface TaskProps {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  public id: string;
  public title: string;
  public completed: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: TaskProps) {
    this.id = props.id;
    this.title = props.title;
    this.completed = props.completed;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public toggleComplete(): void {
    this.completed = !this.completed;
    this.updatedAt = new Date();
  }

  public updateTitle(newTitle: string): void {
    if (!newTitle) {
      throw new Error('Title cannot be empty');
    }
    this.title = newTitle;
    this.updatedAt = new Date();
  }
}
