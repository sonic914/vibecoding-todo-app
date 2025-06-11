import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBTaskRepository } from '../DynamoDBTaskRepository';
import { Task } from '../../../domain/Task';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('DynamoDBTaskRepository', () => {
  let repository: DynamoDBTaskRepository;

  beforeEach(() => {
    ddbMock.reset();
    const ddbClient = new DynamoDBClient({});
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    repository = new DynamoDBTaskRepository(ddbDocClient);
  });

  it('should save a task', async () => {
    const task = new Task({
      id: '1',
      title: 'Test Task',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repository.save(task);

    expect(ddbMock.commandCalls(PutCommand)[0].args[0].input).toEqual({
      TableName: 'Tasks',
      Item: task,
    });
  });

  it('should find a task by id', async () => {
    const taskData = {
      id: '1',
      title: 'Test Task',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ddbMock.on(GetCommand).resolves({ Item: taskData });

    const task = await repository.findById('1');

    expect(task).toBeInstanceOf(Task);
    expect(task?.id).toBe('1');
    expect(ddbMock.commandCalls(GetCommand)[0].args[0].input).toEqual({
      TableName: 'Tasks',
      Key: { id: '1' },
    });
  });

  it('should return null if task not found', async () => {
    ddbMock.on(GetCommand).resolves({ Item: undefined });

    const task = await repository.findById('1');

    expect(task).toBeNull();
  });

  it('should find all tasks', async () => {
    const taskData = [
      {
        id: '1',
        title: 'Test Task 1',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Test Task 2',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    ddbMock.on(ScanCommand).resolves({ Items: taskData });

    const tasks = await repository.findAll();

    expect(tasks.length).toBe(2);
    expect(tasks[0]).toBeInstanceOf(Task);
  });

  it('should delete a task', async () => {
    await repository.delete('1');

    expect(ddbMock.commandCalls(DeleteCommand)[0].args[0].input).toEqual({
      TableName: 'Tasks',
      Key: { id: '1' },
    });
  });
});
