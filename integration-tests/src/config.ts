import { Config } from './types'

function getConfig(): Config {
  const { env } = process
  const errors = checkVariables(Object.keys(env), ['BACKEND_BASE_URL'])

  if (errors.length > 0) {
    throw new Error(errors.map(x => x.message).join('\n'))
  }

  return {
    backend: {
      baseUrl: env.BACKEND_BASE_URL as string,
    },
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
