import { Components, Paths } from './openapi'

export type Place = Components.Schemas.Place
export type PlaceType = Components.Schemas.PlaceType

export type GetPlacesParamsRaw = Paths.GetPlaces.QueryParameters
export type GetPlacesInitialParams = Pick<GetPlacesParamsRaw, 'keyword' | 'latitude' | 'longitude' | 'radius' | 'type'>
export type GetPlacesMoreParams = Pick<GetPlacesParamsRaw, 'cursor'>
export type GetPlacesParams = GetPlacesInitialParams | GetPlacesMoreParams

export type GetPlacesResponse = Paths.GetPlaces.Responses.$200
