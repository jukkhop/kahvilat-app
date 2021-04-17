import { GoogleErrorResponse, GoogleResponse } from '../types'

function handleGoogleResponse<T>(response: GoogleResponse<T>): [number, string] {
  switch (response.state) {
    case 'success':
      return [200, JSON.stringify({ results: response.results, cursor: response.cursor })]
    case 'error':
      return [502, JSON.stringify({ error: mkErrorMessage(response) })]
    default:
      return [0, '']
  }
}

function mkErrorMessage(response: GoogleErrorResponse) {
  return response.status
    ? `Third party API call failed with HTTP status ${response.status} and error: ${response.error}`
    : `Third party API call failed with error: ${response.error}`
}

export { handleGoogleResponse }
