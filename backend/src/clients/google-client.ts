import fetch, { FetchError } from 'node-fetch'
import qs from 'qs'

const BASE_URL = 'https://maps.googleapis.com/maps/api'

class GoogleClient {
  private apiKey: string
  private language: string

  constructor(apiKey: string, language: string) {
    this.apiKey = apiKey
    this.language = language
  }

  async findAddress(latitude: string, longitude: string): Promise<[number, any, string?]> {
    const { apiKey, language } = this
    const params = {
      key: apiKey,
      language,
      latlng: `${latitude},${longitude}`,
    }
    return await request('geocode', params)
  }

  async findCoordinates(address: string): Promise<[number, any, string?]> {
    const { apiKey, language } = this
    const params = {
      address,
      key: apiKey,
      language,
    }
    return await request('geocode', params, true)
  }

  async findPlaces(
    cursor?: string,
    keyword?: string,
    latitude?: string,
    longitude?: string,
    radius?: number,
    type?: string,
  ): Promise<[number, any, string?]> {
    const { apiKey } = this
    const params = cursor
      ? {
          key: apiKey,
          pagetoken: cursor,
        }
      : {
          key: apiKey,
          keyword,
          location: `${latitude},${longitude}`,
          radius,
          types: type,
        }

    return await request('place/nearbysearch', params)
  }
}

async function request(
  endpoint: string,
  params: any,
  encodeParams = false,
): Promise<[number, any, string?]> {
  const queryString = qs.stringify(params, { encode: encodeParams })
  const url = `${BASE_URL}/${endpoint}/json?${queryString}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return [mkErrorStatus(response.status), undefined, mkErrorMessage(response.status)]
    }

    const responseData = await response.json()
    const { results, next_page_token: cursor = undefined } = responseData

    return [200, { results, cursor }, undefined]
  } catch (ex) {
    const err: FetchError = ex
    return [502, undefined, `Third party API call failed with error: ${err.message}`]
  }
}

const mkErrorStatus = (status: number): number => {
  if (status >= 500) return 502
  return 500
}

const mkErrorMessage = (status: number): string =>
  `Third party API call failed with HTTP status ${status}`

export default GoogleClient