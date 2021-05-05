type Config = {
  frontend: {
    url: string
  }
  google: {
    apiKey: string
    baseUrl: string
    language: string
  }
  redis: {
    host: string
    port: number
  }
  stage: string
}

export type { Config }
