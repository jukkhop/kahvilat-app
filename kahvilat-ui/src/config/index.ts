import { Config } from '../types/config'

function initConfig(): Config {
  const { REACT_APP_API_BASE_URL, REACT_APP_GOOGLE_API_KEY } = process.env

  if (!REACT_APP_API_BASE_URL) {
    throw new Error('Missing environment variable REACT_APP_API_BASE_URL')
  }

  if (!REACT_APP_GOOGLE_API_KEY) {
    throw new Error('Missing environment variable REACT_APP_GOOGLE_API_KEY')
  }

  return {
    api: {
      baseUrl: new URL(REACT_APP_API_BASE_URL),
    },
    google: {
      apiKey: REACT_APP_GOOGLE_API_KEY,
    },
  }
}

export { initConfig }
