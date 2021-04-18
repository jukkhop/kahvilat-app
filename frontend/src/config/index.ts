import { Config } from '../types'

function getConfig(): Config {
  const { REACT_APP_BACKEND_BASE_URL, REACT_APP_GOOGLE_API_KEY } = process.env

  if (!REACT_APP_BACKEND_BASE_URL) {
    throw new Error('Missing environment variable REACT_APP_BACKEND_BASE_URL')
  }

  if (!REACT_APP_GOOGLE_API_KEY) {
    throw new Error('Missing environment variable REACT_APP_GOOGLE_API_KEY')
  }

  return {
    backend: {
      baseUrl: REACT_APP_BACKEND_BASE_URL,
    },
    google: {
      apiKey: REACT_APP_GOOGLE_API_KEY,
    },
  }
}

export { getConfig }
