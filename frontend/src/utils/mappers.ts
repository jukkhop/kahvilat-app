import { getDistance } from 'geolib'
import { Coords, Place, PlaceDto } from '../types/'

function mapPlace({ latitude, longitude }: Coords) {
  return (dto: PlaceDto): Place => {
    const {
      geometry: {
        location: { lat, lng },
      },
      openingHours,
      ...rest
    } = dto

    const distance = getDistance({ latitude, longitude }, { latitude: lat, longitude: lng }, 100)

    return {
      distance,
      lat,
      lng,
      openNow: (openingHours && openingHours.openNow) || false,
      ...rest,
    }
  }
}

export { mapPlace }
