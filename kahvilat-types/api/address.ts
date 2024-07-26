import { Components, Paths } from './openapi'

export type Address = Components.Schemas.Address

export type GetAddressesParamsRaw = Paths.GetAddresses.QueryParameters
export type GetAddressesByAddressParams = Pick<GetAddressesParamsRaw, 'address'>
export type GetAddressesByLocationParams = Pick<GetAddressesParamsRaw, 'latitude' | 'longitude'>
export type GetAddressesParams = GetAddressesByAddressParams | GetAddressesByLocationParams

export type GetAddressesResponse = Paths.GetAddresses.Responses.$200
