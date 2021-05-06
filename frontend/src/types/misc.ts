type Config = {
  backend: {
    baseUrl: string
  }
  google: {
    apiKey: string
  }
}

type FormValues = {
  address: string
  distance: number
}

export type { Config, FormValues }
