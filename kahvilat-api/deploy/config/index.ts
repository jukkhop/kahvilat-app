import { Config } from '../types/config'

export const initConfig = (): Config => {
  const requiredVars = [
    'API_CERTIFICATE_ARN',
    'AWS_ACCOUNT_ID',
    'AWS_DEFAULT_REGION',
    'AWS_STAGE',
    'GOOGLE_API_KEY',
    'GOOGLE_BASE_URL',
    'GOOGLE_LANGUAGE',
    'REDIS_HOST',
    'REDIS_PORT',
  ]

  const { env } = process
  const missingVarErrors = checkEnvVars(Object.keys(env), requiredVars)

  if (missingVarErrors.length > 0) {
    throw Error(missingVarErrors.map((x) => x.message).join('\n'))
  }

  return {
    api: {
      certificateArn: env.API_CERTIFICATE_ARN as string,
    },
    aws: {
      accountId: env.AWS_ACCOUNT_ID as string,
      region: env.AWS_DEFAULT_REGION as string,
      stage: env.AWS_STAGE as string,
    },
    google: {
      apiKey: env.GOOGLE_API_KEY as string,
      baseUrl: new URL(env.GOOGLE_BASE_URL as string),
      language: env.GOOGLE_LANGUAGE as string,
    },
    redis: {
      host: env.REDIS_HOST as string,
      port: Number(env.REDIS_PORT as string),
    },
  }
}

const checkEnvVars = (actualVars: string[], expectedVars: string[]): Error[] => {
  return expectedVars
    .filter((variable) => !actualVars.includes(variable))
    .map((variable) => Error(`Missing environment variable: ${variable}`))
}
