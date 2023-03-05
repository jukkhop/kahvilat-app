import { initConfig } from '../config'
import { FindPlacesParams } from '../types/api'
import { getOptions } from '../utils/requests'

const config = initConfig()

const findPlacesRequest = (params: FindPlacesParams): [RequestInfo, RequestInit] => {
  const url = new URL(`${config.api.baseUrl}find-places`)
  const { searchParams } = url

  if ('cursor' in params) {
    searchParams.set('cursor', params.cursor)
  } else {
    searchParams.set('keyword', params.keyword)
    searchParams.set('latitude', params.latitude.toString())
    searchParams.set('longitude', params.longitude.toString())
    searchParams.set('radius', params.radius.toString())
    searchParams.set('type', params.type)
  }

  const info: RequestInfo = url.toString()
  const init: RequestInit = getOptions()

  return [info, init]
}

export { findPlacesRequest }
