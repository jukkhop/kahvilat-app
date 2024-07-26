import { URL } from 'url'
import { Config } from './types/config'

export function getConfig(): Config {
  const { env } = process
  const errors = checkVariables(Object.keys(env), ['API_BASE_URL'])

  if (errors.length > 0) {
    throw new Error(errors.map(x => x.message).join('\n'))
  }

  return {
    api: {
      baseUrl: new URL(env.API_BASE_URL!),
    },
  }
}

function checkVariables(actualVars: string[], expectedVars: string[]): Error[] {
  return expectedVars
    .filter(variable => !actualVars.includes(variable))
    .map(variable => new Error(`Missing environment variable: ${variable}`))
}
