interface Config {
  backend: {
    url: string
  }
  google: {
    apiKey: string
  }
}

interface FormValues {
  address: string
  distance: number
  latitude: string
  longitude: string
}

export type { Config, FormValues }
