import {
  Address,
  GetAddressesByAddressParams,
  GetAddressesByLocationParams,
  GetAddressesResponse,
} from '../../src/types/api/address'
import { Place, GetPlacesInitialParams, GetPlacesMoreParams, GetPlacesResponse } from '../../src/types/api/place'

export namespace ApiTestData {
  export const address1: Address = {
    address: 'Telakkakatu 6, 00150 Helsinki, Suomi',
    id: 'ChIJ8W5KFbQLkkYRSXUp2rrqSr4',
    location: { latitude: 60.1587165, longitude: 24.9317486 },
  }

  export const address2: Address = {
    address: 'Perämiehenkatu 1, 00150 Helsinki, Suomi',
    id: 'ChIJ2_hjubYLkkYRpYPfcRrfnXQ',
    location: { latitude: 60.1580323, longitude: 24.9352637 },
  }

  export const place1: Place = {
    address: 'Fredrikinkatu 19, Helsinki',
    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
    id: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
    location: { latitude: 60.1611124, longitude: 24.9417875 },
    name: 'Brooklyn Cafe',
    openNow: true,
    rating: 4.5,
    status: 'OPERATIONAL',
    types: ['cafe', 'food', 'point_of_interest', 'establishment'],
  }

  export const place2: Place = {
    address: 'Fredrikinkatu 55, Helsinki',
    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
    id: 'ChIJOa0PMcsLkkYRzE0zIaklq1Y',
    location: { latitude: 60.1672486, longitude: 24.9332438 },
    name: 'Helkatti Cat Cafe',
    openNow: true,
    rating: 4.6,
    status: 'OPERATIONAL',
    types: ['cafe', 'restaurant', 'food', 'point_of_interest', 'store', 'establishment'],
  }

  export const getAddressesParams1: GetAddressesByAddressParams = {
    address: address1.address,
  }

  export const getAddressesParams2: GetAddressesByLocationParams = {
    latitude: address1.location.latitude.toString(),
    longitude: address1.location.longitude.toString(),
  }

  export const getPlacesParams1: GetPlacesInitialParams = {
    keyword: 'coffee',
    latitude: place1.location.latitude.toString(),
    longitude: place1.location.longitude.toString(),
    radius: '500',
    type: 'cafe',
  }

  export const getPlacesParams2: GetPlacesMoreParams = {
    cursor: 'some-cursor',
  }

  export const getAddressesResponse1: GetAddressesResponse = {
    cursor: undefined,
    items: [address1, address2],
  }

  export const getPlacesResponse1: GetPlacesResponse = {
    cursor: undefined,
    items: [place1, place2],
  }
}
