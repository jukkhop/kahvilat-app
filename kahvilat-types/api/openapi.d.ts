import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'

declare namespace Components {
  namespace Responses {
    export interface BadGateway {
      /**
       * Additional information about the error
       */
      message: string
    }

    export interface BadRequest {
      errors: /* Type of validation error returned along with HTTP 404 */ Schemas.ValidationError[]
    }

    export interface GetAddressesResponse {
      items: /* Represents an address */ Schemas.Address[]
      /**
       * Cursor to fetch the next page of addresses with
       */
      cursor?: string
    }

    export interface GetHealthResponse {
      status: 'OK'
    }

    export interface GetPlacesResponse {
      items: /* Represents a place (eg. a cafeteria or a restaurant) */ Schemas.Place[]
      /**
       * Cursor to fetch the next page of places with
       */
      cursor?: string
    }

    export interface InternalError {
      /**
       * Additional information about the error
       */
      message: string
    }
  }

  namespace Schemas {
    /**
     * Represents an address
     */
    export interface Address {
      /**
       * example:
       * Mannerheimintie 1, Helsinki
       */
      address: string
      /**
       * example:
       * b1361968-aad1-46bb-bad4-50bc35a92e6f
       */
      id: string // ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
      location: /* Represents a geographic location */ Location
    }

    /**
     * Represents a geographic location
     */
    export interface Location {
      /**
       * example:
       * 60.1681195
       */
      latitude: number
      /**
       * example:
       * 24.9392183
       */
      longitude: number
    }

    /**
     * Represents a place (eg. a cafeteria or a restaurant)
     */
    export interface Place {
      /**
       * example:
       * Mannerheimintie 1, Helsinki
       */
      address: string
      icon: string
      /**
       * example:
       * b1361968-aad1-46bb-bad4-50bc35a92e6f
       */
      id: string // ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
      location: /* Represents a geographic location */ Location
      name: string
      openNow: boolean
      rating: number
      status: string
      types: /* Type of place (e.g. coffee shop, grocery store, etc) */ PlaceType[]
    }

    /**
     * Type of place (e.g. coffee shop, grocery store, etc)
     */
    export type PlaceType =
      | 'accounting'
      | 'airport'
      | 'amusement_park'
      | 'aquarium'
      | 'art_gallery'
      | 'atm'
      | 'bakery'
      | 'bank'
      | 'bar'
      | 'beauty_salon'
      | 'bicycle_store'
      | 'book_store'
      | 'bowling_alley'
      | 'bus_station'
      | 'cafe'
      | 'campground'
      | 'car_dealer'
      | 'car_rental'
      | 'car_repair'
      | 'car_wash'
      | 'casino'
      | 'cemetery'
      | 'church'
      | 'city_hall'
      | 'clothing_store'
      | 'convenience_store'
      | 'courthouse'
      | 'dentist'
      | 'department_store'
      | 'doctor'
      | 'drugstore'
      | 'electrician'
      | 'electronics_store'
      | 'embassy'
      | 'establishment'
      | 'fire_station'
      | 'florist'
      | 'food'
      | 'funeral_home'
      | 'furniture_store'
      | 'gas_station'
      | 'gym'
      | 'hair_care'
      | 'hardware_store'
      | 'hindu_temple'
      | 'home_goods_store'
      | 'hospital'
      | 'insurance_agency'
      | 'jewelry_store'
      | 'laundry'
      | 'lawyer'
      | 'library'
      | 'light_rail_station'
      | 'liquor_store'
      | 'local_government_office'
      | 'locksmith'
      | 'lodging'
      | 'meal_delivery'
      | 'meal_takeaway'
      | 'mosque'
      | 'movie_rental'
      | 'movie_theater'
      | 'moving_company'
      | 'museum'
      | 'night_club'
      | 'painter'
      | 'park'
      | 'parking'
      | 'pet_store'
      | 'pharmacy'
      | 'physiotherapist'
      | 'plumber'
      | 'point_of_interest'
      | 'police'
      | 'post_office'
      | 'primary_school'
      | 'real_estate_agency'
      | 'restaurant'
      | 'roofing_contractor'
      | 'rv_park'
      | 'school'
      | 'secondary_school'
      | 'shoe_store'
      | 'shopping_mall'
      | 'spa'
      | 'stadium'
      | 'storage'
      | 'store'
      | 'subway_station'
      | 'supermarket'
      | 'synagogue'
      | 'taxi_stand'
      | 'tourist_attraction'
      | 'train_station'
      | 'transit_station'
      | 'travel_agency'
      | 'university'
      | 'veterinary_care'
      | 'zoo'

    /**
     * Type of validation error returned along with HTTP 404
     */
    export interface ValidationError {
      data?: any
      instancePath: string
      keyword: any
      message?: string
      params: any
      parentSchema?: any
      propertyName?: string
      schema?: any
      schemaPath: string
    }
  }
}

declare namespace Paths {
  namespace $Proxy {
    namespace Options {
      namespace Responses {}
    }
  }

  namespace GetAddresses {
    namespace Params {
      export type Address = string
      export type Latitude = string // ^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$
      export type Longitude = string // ^(\+|-)?(?:180(?:(?:\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$
    }

    export interface QueryParameters {
      address?: Params.Address
      latitude?: Params.Latitude /* ^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$ */
      longitude?: Params.Longitude /* ^(\+|-)?(?:180(?:(?:\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$ */
    }

    namespace Responses {
      export type $200 = Components.Responses.GetAddressesResponse
      export type $400 = Components.Responses.BadRequest
      export type $500 = Components.Responses.InternalError
      export type $502 = Components.Responses.BadGateway
    }
  }

  namespace GetHealth {
    namespace Responses {
      export type $200 = Components.Responses.GetHealthResponse
    }
  }

  namespace GetPlaces {
    namespace Params {
      export type Cursor = string
      export type Keyword = string
      export type Latitude = string // ^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$
      export type Longitude = string // ^(\+|-)?(?:180(?:(?:\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$
      export type Radius = string // ^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$
      export type Type = /* Type of place (e.g. coffee shop, grocery store, etc) */ Components.Schemas.PlaceType
    }

    export interface QueryParameters {
      cursor?: Params.Cursor
      keyword?: Params.Keyword
      latitude?: Params.Latitude /* ^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$ */
      longitude?: Params.Longitude /* ^(\+|-)?(?:180(?:(?:\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$ */
      type?: Params.Type
      radius?: Params.Radius /* ^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$ */
    }

    namespace Responses {
      export type $200 = Components.Responses.GetPlacesResponse
      export type $400 = Components.Responses.BadRequest
      export type $500 = Components.Responses.InternalError
      export type $502 = Components.Responses.BadGateway
    }
  }
}

export interface OperationMethods {
  /**
   * getHealth - For checking the operational status of the API.
   */
  'getHealth'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetHealth.Responses.$200>

  /**
   * getAddresses - Get a list of addresses.
   */
  'getAddresses'(
    parameters?: Parameters<Paths.GetAddresses.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetAddresses.Responses.$200>

  /**
   * getPlaces - Get a list of places.
   */
  'getPlaces'(
    parameters?: Parameters<Paths.GetPlaces.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetPlaces.Responses.$200>
}

export interface PathsDictionary {
  ['/health']: {
    /**
     * getHealth - For checking the operational status of the API.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetHealth.Responses.$200>
  }

  ['/address']: {
    /**
     * getAddresses - Get a list of addresses.
     */
    'get'(
      parameters?: Parameters<Paths.GetAddresses.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetAddresses.Responses.$200>
  }

  ['/place']: {
    /**
     * getPlaces - Get a list of places.
     */
    'get'(
      parameters?: Parameters<Paths.GetPlaces.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetPlaces.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
