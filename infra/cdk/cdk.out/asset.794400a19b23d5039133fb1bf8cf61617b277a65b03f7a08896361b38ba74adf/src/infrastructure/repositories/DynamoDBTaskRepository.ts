import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ITaskRepository } from '../../application/repositories/ITaskRepository';
import { Task } from '../../domain/Task';

export class DynamoDBTaskRepository implements ITaskRepository {
  private readonly tableName = 'Tasks';

  constructor(private docClient: DynamoDBDocumentClient) {}

  async save(task: Task): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: task,
    };
    await this.docClient.send(new PutCommand(params));
  }

  async findById(id: string): Promise<Task | null> {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };
    const { Item } = await this.docClient.send(new GetCommand(params));
    if (!Item) {
      return null;
    }
    // Reconstruct the Task entity, ensuring dates are Date objects
    return new Task({
      ...Item,
      id: Item.id,
      title: Item.title,
      completed: Item.completed,
      createdAt: new Date(Item.createdAt),
      updatedAt: new Date(Item.updatedAt),
    });
  }

  async findAll(): Promise<Task[]> {
    const params = {
      TableName: this.tableName,
    };
    const { Items } = await this.docClient.send(new ScanCommand(params));
    if (!Items) {
      return [];
    }
    return Items.map(
      (Item) =>
        new Task({
          ...Item,
          id: Item.id,
          title: Item.title,
          completed: Item.completed,
          createdAt: new Date(Item.createdAt),
          updatedAt: new Date(Item.updatedAt),
        }),
    );
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };
    await this.docClient.send(new DeleteCommand(params));
  }
}
