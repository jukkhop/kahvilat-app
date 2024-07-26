import { initConfig } from '../config'
import { GetAddressesParams } from '../types/api'
import { getOptions } from '../utils/requests'

const config = initConfig()

export const getAddressesRequest = (params: GetAddressesParams): [RequestInfo, RequestInit] => {
  const address = 'address' in params ? params.address : undefined
  const latitude = 'latitude' in params ? params.latitude : undefined
  const longitude = 'longitude' in params ? params.longitude : undefined

  const url = new URL('/address', config.api.baseUrl)
  const search = url.searchParams

  if (address) search.set('address', address)
  if (latitude) search.set('latitude', latitude)
  if (longitude) search.set('longitude', longitude)

  const info = url.toString()
  const init = getOptions()

  return [info, init]
}
