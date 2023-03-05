import { initConfig } from '../config'
import { FindAddressesParams } from '../types/api'
import { getOptions } from '../utils/requests'

const config = initConfig()

const findAddressesRequest = (params: FindAddressesParams): [RequestInfo, RequestInit] => {
  const url = new URL(`${config.api.baseUrl}find-addresses`)
  const { searchParams } = url

  if ('address' in params) {
    searchParams.set('address', params.address)
  } else {
    searchParams.set('latitude', params.latitude.toString())
    searchParams.set('longitude', params.longitude.toString())
  }

  const info: RequestInfo = url.toString()
  const init: RequestInit = getOptions()

  return [info, init]
}

export { findAddressesRequest }
