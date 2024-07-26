export type ValidationError = {
  data?: unknown
  instancePath: string
  keyword: unknown
  message?: string
  params: unknown
  parentSchema?: any
  propertyName?: string
  schema?: unknown
  schemaPath: string
}
