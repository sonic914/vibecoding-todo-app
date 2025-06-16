# VibeCoding TODO App Infrastructure

This directory contains the AWS CDK (Cloud Development Kit) code for deploying the VibeCoding TODO App infrastructure to AWS.

## Infrastructure Components

The infrastructure consists of the following AWS resources:

### DynamoDB

- **TasksTable**: A DynamoDB table for storing task data
  - Partition Key: `id` (String)
  - Global Secondary Index: `UserIdIndex` (Partition Key: `userId`, Sort Key: `createdAt`)
  - Billing Mode: Pay-per-request (On-demand)
  - Point-in-time Recovery: Enabled
  - Stream: Enabled (NEW_AND_OLD_IMAGES)

### Lambda Functions

- **GetAllTasksFunction**: Retrieves all tasks for a user
  - Runtime: Node.js 18.x
  - Memory: 256 MB
  - Timeout: 10 seconds
  - Handler: `dist/presentation/handlers/getAllTasksHandler.handler`

- **GetTaskByIdFunction**: Retrieves a specific task by ID
  - Runtime: Node.js 18.x
  - Memory: 256 MB
  - Timeout: 10 seconds
  - Handler: `dist/presentation/handlers/getTaskByIdHandler.handler`

- **CreateTaskFunction**: Creates a new task
  - Runtime: Node.js 18.x
  - Memory: 256 MB
  - Timeout: 10 seconds
  - Handler: `dist/presentation/handlers/createTaskHandler.handler`

- **UpdateTaskFunction**: Updates an existing task
  - Runtime: Node.js 18.x
  - Memory: 256 MB
  - Timeout: 10 seconds
  - Handler: `dist/presentation/handlers/updateTaskHandler.handler`

- **DeleteTaskFunction**: Deletes a task
  - Runtime: Node.js 18.x
  - Memory: 256 MB
  - Timeout: 10 seconds
  - Handler: `dist/presentation/handlers/deleteTaskHandler.handler`

### API Gateway

- **TodoApi**: REST API for the TODO application
  - Stage: `api`
  - Logging Level: INFO
  - Data Trace: Enabled
  - CORS: Enabled (All origins, methods, and headers)

#### API Endpoints

- `GET /tasks`: Get all tasks for the authenticated user
- `POST /tasks`: Create a new task
- `GET /tasks/{id}`: Get a specific task by ID
- `PUT /tasks/{id}`: Update a specific task
- `DELETE /tasks/{id}`: Delete a specific task

### Authentication

- Uses existing **Cognito User Pool** (ID: `ap-northeast-2_10IJl15Ho`)
- **Cognito Authorizer**: Validates JWT tokens from the Cognito User Pool
- All API endpoints require authentication

## Deployment

To deploy the infrastructure:

```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Deploy to AWS
npm run deploy
```

## Configuration

The CDK stack is configured to deploy to the `ap-northeast-2` (Seoul) region. This can be modified in the `bin/cdk.ts` file if needed.

## Security

- Lambda functions have least-privilege IAM permissions
- DynamoDB table uses default encryption
- API Gateway uses Cognito for authentication
- CORS is configured to allow secure cross-origin requests

## Outputs

After deployment, the CDK stack outputs the following:

- **TasksTableName**: The name of the DynamoDB table
- **ApiUrl**: The URL of the API Gateway endpoint
