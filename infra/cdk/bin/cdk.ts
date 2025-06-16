#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VibeCodingTodoAppStack } from '../lib/cdk-stack';

const app = new cdk.App();
new VibeCodingTodoAppStack(app, 'VibeCodingTodoAppStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  env: { region: 'ap-northeast-2' }, // VibeCoding TODO 앱은 서울 리전에 배포
  description: 'VibeCoding TODO App Infrastructure Stack',
});
