import { LambdaEvent } from '../types/lambda'

export const mergeQueryParams = (event: LambdaEvent): Record<string, string | string[]> => {
  const paramsSingle = event.queryStringParameters ?? {}
  const paramsMulti = event.multiValueQueryStringParameters ?? {}

  // prettier-ignore
  const paramsMerged = Object.keys(paramsSingle).reduce(
    (acc, key) => {
      const value = paramsSingle[key] ?? ''
      const values = paramsMulti[key] ?? []

      switch (values.length) {
        case 1:
          return { ...acc, [key]: value }
        default:
          return { ...acc, [key]: values }
      }
    },
    {} as Record<string, string | string[]>,
  )

  return paramsMerged
}
