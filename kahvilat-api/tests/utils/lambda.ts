type SingleParams = Record<string, string>
type MultiParams = Record<string, string[]>

export function toMultiParams(params: SingleParams): MultiParams {
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, [v]]))
}
