export type Config = {
  aws: {
    accountId: string
    region: string
    stage: string
  }
  api: {
    certificateArn: string
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
}
