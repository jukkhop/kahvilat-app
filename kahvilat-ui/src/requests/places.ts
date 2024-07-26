import { initConfig } from '../config'
import { GetPlacesParams } from '../types/api'
import { getOptions } from '../utils/requests'

const config = initConfig()

export const getPlacesRequest = (params: GetPlacesParams): [RequestInfo, RequestInit] => {
  const keyword = 'keyword' in params ? params.keyword : undefined
  const latitude = 'latitude' in params ? params.latitude : undefined
  const longitude = 'longitude' in params ? params.longitude : undefined
  const radius = 'radius' in params ? params.radius : undefined
  const type = 'type' in params ? params.type : undefined
  const cursor = 'cursor' in params ? params.cursor : undefined

  const url = new URL('/place', config.api.baseUrl)
  const search = url.searchParams

  if (keyword) search.set('keyword', keyword)
  if (latitude) search.set('latitude', latitude)
  if (longitude) search.set('longitude', longitude)
  if (radius) search.set('radius', radius)
  if (type) search.set('type', type)
  if (cursor) search.set('cursor', cursor)

  const info = url.toString()
  const init = getOptions()

  return [info, init]
}
