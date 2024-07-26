import { APIGatewayEventIdentity, APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyEvent } from 'aws-lambda'

export namespace LambdaTestData {
  export const identity: APIGatewayEventIdentity = {
    accessKey: null,
    accountId: null,
    apiKey: null,
    apiKeyId: null,
    caller: null,
    clientCert: null,
    cognitoAuthenticationProvider: null,
    cognitoAuthenticationType: null,
    cognitoIdentityId: null,
    cognitoIdentityPoolId: null,
    principalOrgId: null,
    sourceIp: 'string',
    user: null,
    userAgent: null,
    userArn: null,
  }

  export const requestContext: APIGatewayEventRequestContextWithAuthorizer<never> = {
    accountId: 'string',
    apiId: 'string',
    authorizer: null as never,
    httpMethod: 'string',
    identity,
    path: 'string',
    protocol: 'string',
    requestId: 'string',
    requestTimeEpoch: 0,
    resourceId: 'string',
    resourcePath: 'string',
    stage: 'string',
  }

  export const nullEvent: APIGatewayProxyEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'string',
    isBase64Encoded: false,
    path: 'string',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext,
    resource: 'string',
  }
}
