import { Config } from '../types/config'

export function initConfig(): Config {
  const { env } = process

  const errors = checkVariables(Object.keys(env), [
    'CICD_STAGE',
    'GOOGLE_API_KEY',
    'GOOGLE_BASE_URL',
    'GOOGLE_LANGUAGE',
    'REDIS_HOST',
    'REDIS_PORT',
    'UI_BASE_URL',
  ])

  if (errors.length > 0) {
    throw Error(errors.map((x) => x.message).join('\n'))
  }

  return {
    cicd: {
      stage: env.CICD_STAGE as string,
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
    ui: {
      baseUrl: new URL(env.UI_BASE_URL as string),
    },
  }
}

function checkVariables(actualVars: string[], expectedVars: string[]): Error[] {
  return expectedVars
    .filter((variable) => !actualVars.includes(variable))
    .map((variable) => Error(`Missing environment variable: ${variable}`))
}
