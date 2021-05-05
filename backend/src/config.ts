import { Config } from './types'

function getConfig(): Config {
  const { env } = process

  const errors = checkVariables(Object.keys(env), [
    'FRONTEND_URL',
    'GOOGLE_API_KEY',
    'GOOGLE_BASE_URL',
    'GOOGLE_LANGUAGE',
    'REDIS_HOST',
    'REDIS_PORT',
    'STAGE',
  ])

  if (errors.length > 0) {
    throw new Error(errors.map(x => x.message).join('\n'))
  }

  return {
    frontend: {
      url: env.FRONTEND_URL as string,
    },
    google: {
      apiKey: env.GOOGLE_API_KEY as string,
      baseUrl: env.GOOGLE_BASE_URL as string,
      language: env.GOOGLE_LANGUAGE as string,
    },
    redis: {
      host: env.REDIS_HOST as string,
      port: Number(env.REDIS_PORT as string),
    },
    stage: env.STAGE as string,
  }
}

function checkVariables(actualVars: string[], expectedVars: string[]): Error[] {
  // prettier-ignore
  return (
    expectedVars
      .filter(x => !actualVars.includes(x))
      .map(x => new Error(`Missing environment variable: ${x}`))
  )
}

export { getConfig }
