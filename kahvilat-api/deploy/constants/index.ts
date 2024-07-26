import { Constants } from '../types/constants'

export const initConstants = (stage: string): Constants => ({
  apiDomainName: stage === 'prod' ? `api.kahvilat.purelogic.xyz` : `${stage}.api.kahvilat.purelogic.xyz`,
  appDomainName: stage === 'prod' ? `app.kahvilat.purelogic.xyz` : `${stage}.app.kahvilat.purelogic.xyz`,
  distributionId: `kahvilat-distribution-${stage}`,
  gatewayId: `kahvilat-api-gw-${stage}`,
  gatewayStageId: `kahvilat-api-gw-stage-${stage}`,
  lambdaName: `kahvilat-api-lambda-${stage}`,
  lambdaRoleName: `kahvilat-api-lambda-role-${stage}`,
  lambdaSecurityGroupName: `kahvilat-app-${stage}-lambda-sg`,
  secretName: `kahvilat-rds-secret-${stage}`,
  vpcId: `kahvilat-app-${stage}-vpc`,
})
