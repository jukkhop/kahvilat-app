type Config = {
  backend: {
    baseUrl: string
  }
  google: {
    apiKey: string
  }
}

type Coords = {
  latitude: number
  longitude: number
}

type FormValues = {
  address: string
  distance: number
}

export type { Config, Coords, FormValues }
