/* eslint-disable no-new */

import { Duration, Stack, StackProps, TagProps, Tags } from 'aws-cdk-lib'
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdajs from 'aws-cdk-lib/aws-lambda-nodejs'

import { Construct } from 'constructs'
import * as handlebars from 'handlebars'
import * as path from 'path'

import { initConfig } from './config'
import { initConstants } from './constants'
import openApiTemplate from '../src/specification/openapi.json'

export class KahvilatApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const config = initConfig()
    const constants = initConstants(config.aws.stage)

    const { accountId, region, stage } = config.aws
    const { apiDomainName, appDomainName, distributionId, gatewayId, gatewayStageId } = constants
    const { lambdaName, lambdaRoleName, lambdaSecurityGroupName, vpcId } = constants

    const tagProps: TagProps = {
      excludeResourceTypes: ['AWS::ApiGatewayV2::Api'],
    }

    Tags.of(scope).add('CreatedBy', 'Cloud Development Kit', tagProps)
    Tags.of(scope).add('Project', 'Kahvilat App', tagProps)
    Tags.of(scope).add('Stage', stage, tagProps)

    const distribution = cloudfront.Distribution.fromDistributionAttributes(this, distributionId, {
      distributionId,
      domainName: appDomainName,
    })

    const vpc = ec2.Vpc.fromLookup(this, vpcId, { vpcName: vpcId })
    const lambdaSecurityGroup = ec2.SecurityGroup.fromLookupByName(this, id, lambdaSecurityGroupName, vpc)

    const lambdaRole = new iam.Role(this, lambdaRoleName, {
      roleName: lambdaRoleName,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: `Execution role for ${lambdaName}`,
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
      ],
    })

    const lambdaFunction = new lambdajs.NodejsFunction(this, lambdaName, {
      role: lambdaRole,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [lambdaSecurityGroup],
      functionName: lambdaName,
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: path.join(__dirname, `/../src/main.ts`),
      environment: {
        CICD_STAGE: stage,
        GOOGLE_API_KEY: config.google.apiKey,
        GOOGLE_BASE_URL: config.google.baseUrl.toString(),
        GOOGLE_LANGUAGE: config.google.language,
        REDIS_HOST: config.redis.host,
        REDIS_PORT: config.redis.port.toString(),
        UI_BASE_URL: `https://${distribution.distributionDomainName}`,
      },
      timeout: Duration.seconds(15),
    })

    const openApiDocument = handlebars.compile(JSON.stringify(openApiTemplate))({
      apiBaseUrl: `https://${apiDomainName}`,
      awsStage: config.aws.stage,
      lambdaArn: lambdaFunction.functionArn,
    })

    const gateway = new apigw.CfnApi(this, gatewayId, {
      body: JSON.parse(openApiDocument),
    })

    const gatewayStage = new apigw.CfnStage(this, gatewayStageId, {
      apiId: gateway.ref,
      stageName: 'api',
      autoDeploy: true,
    })

    new apigw.CfnDomainName(this, `kahvilat-api-gw-domain-name-${stage}`, {
      domainName: apiDomainName,
      domainNameConfigurations: [
        {
          certificateArn: config.api.certificateArn,
          endpointType: 'regional',
          securityPolicy: 'TLS_1_2',
        },
      ],
    })

    new apigw.CfnApiMapping(this, `kahvilat-api-gw-mapping-${stage}`, {
      apiId: gatewayStage.apiId,
      domainName: apiDomainName,
      stage: gatewayStage.ref,
    })

    new lambda.CfnPermission(this, `kahvilat-api-lambda-permission-${stage}`, {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      sourceArn: `arn:aws:execute-api:${region}:${accountId}:${gatewayStage.apiId}/*/*`,
      functionName: lambdaName,
    })
  }
}
