export type Config = {
  cicd: {
    stage: string
  }
  google: {
    apiKey: string
    baseUrl: URL
    language: string
  }
  redis: {
    host: string
    port: number
  }
  ui: {
    baseUrl: URL
  }
}
