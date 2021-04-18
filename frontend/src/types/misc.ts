interface Config {
  backend: {
    baseUrl: string
  }
  google: {
    apiKey: string
  }
}

interface FormValues {
  address: string
  distance: number
}

export type { Config, FormValues }
