import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class VibeCodingTodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 기존 Cognito User Pool ID와 App Client ID
    const userPoolId = 'ap-northeast-2_10IJl15Ho';
    const appClientId = '1d8btkjuugl5hm6me1pd2m154b';
    
    // 기존 Cognito User Pool 참조
    const userPool = cognito.UserPool.fromUserPoolId(this, 'ImportedUserPool', userPoolId);
    
    // DynamoDB 테이블 생성
    const tasksTable = new dynamodb.Table(this, 'TasksTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 개발 환경에서만 사용, 프로덕션에서는 RETAIN 권장
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.DEFAULT,
      timeToLiveAttribute: 'ttl', // 선택적 TTL 속성
      
      // 추가 속성 정의
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES, // 스트림 활성화 (선택 사항)
    });
    
    // 보조 인덱스 추가 (사용자별 할 일 조회용)
    tasksTable.addGlobalSecondaryIndex({
      indexName: 'UserIdIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    
    // Lambda 함수 기본 환경 변수
    const lambdaEnvironment = {
      TASKS_TABLE_NAME: tasksTable.tableName,
      USER_POOL_ID: userPoolId,
      APP_CLIENT_ID: appClientId,
    };
    
    // Lambda 함수 기본 권한 정책
    const lambdaPolicy = new iam.PolicyStatement({
      actions: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
        'dynamodb:Query',
        'dynamodb:Scan'
      ],
      resources: [tasksTable.tableArn, `${tasksTable.tableArn}/index/*`],
    });
    
    // Lambda 함수 생성 헬퍼 함수
    const createLambdaFunction = (name: string, handler: string) => {
      const lambdaFunction = new lambda.Function(this, name, {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: handler,
        code: lambda.Code.fromAsset(path.join(__dirname, '../../../backend')),
        environment: lambdaEnvironment,
        timeout: cdk.Duration.seconds(10),
        memorySize: 256,
        description: `VibeCoding TODO App - ${name} Lambda Function`,
      });
      
      lambdaFunction.addToRolePolicy(lambdaPolicy);
      return lambdaFunction;
    };
    
    // Lambda 함수 생성
    const getAllTasksFunction = createLambdaFunction('GetAllTasksFunction', 'dist/presentation/handlers/getAllTasksHandler.handler');
    const getTaskByIdFunction = createLambdaFunction('GetTaskByIdFunction', 'dist/presentation/handlers/getTaskByIdHandler.handler');
    const createTaskFunction = createLambdaFunction('CreateTaskFunction', 'dist/presentation/handlers/createTaskHandler.handler');
    const updateTaskFunction = createLambdaFunction('UpdateTaskFunction', 'dist/presentation/handlers/updateTaskHandler.handler');
    const deleteTaskFunction = createLambdaFunction('DeleteTaskFunction', 'dist/presentation/handlers/deleteTaskHandler.handler');
    
    // API Gateway 생성
    const api = new apigateway.RestApi(this, 'TodoApi', {
      restApiName: 'VibeCoding TODO API',
      description: 'API for VibeCoding TODO Application',
      deployOptions: {
        stageName: 'api',
        // 로깅 비활성화 (CloudWatch Logs 역할 ARN 문제 해결)
        // loggingLevel: apigateway.MethodLoggingLevel.INFO,
        // dataTraceEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: cdk.Duration.days(1),
      },
    });
    
    // Cognito Authorizer 생성
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'TodoApiAuthorizer', {
      cognitoUserPools: [userPool],
      authorizerName: 'TodoApiCognitoAuthorizer',
      identitySource: 'method.request.header.Authorization',
    });
    
    // API Gateway 메서드 옵션 (인증 포함)
    const methodOptions: apigateway.MethodOptions = {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    };
    
    // API Gateway 리소스 및 메서드 생성
    const tasksResource = api.root.addResource('tasks');
    
    // GET /tasks - 모든 할 일 조회
    tasksResource.addMethod('GET', new apigateway.LambdaIntegration(getAllTasksFunction), methodOptions);
    
    // POST /tasks - 할 일 생성
    tasksResource.addMethod('POST', new apigateway.LambdaIntegration(createTaskFunction), methodOptions);
    
    // 개별 할 일 리소스
    const taskResource = tasksResource.addResource('{id}');
    
    // GET /tasks/{id} - 특정 할 일 조회
    taskResource.addMethod('GET', new apigateway.LambdaIntegration(getTaskByIdFunction), methodOptions);
    
    // PUT /tasks/{id} - 할 일 업데이트
    taskResource.addMethod('PUT', new apigateway.LambdaIntegration(updateTaskFunction), methodOptions);
    
    // DELETE /tasks/{id} - 할 일 삭제
    taskResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteTaskFunction), methodOptions);
    
    // 출력값 정의
    new cdk.CfnOutput(this, 'TasksTableName', {
      value: tasksTable.tableName,
      description: 'DynamoDB Tasks Table Name',
    });
    
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
}
