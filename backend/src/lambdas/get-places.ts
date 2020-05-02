import { Response } from '../types'
import { getPlaces } from '../models/places'
import { getCorsHeaders } from '../utils/cors'

export async function handler(): Promise<Response> {
  const places = await getPlaces()
  return {
    statusCode: 200,
    headers: getCorsHeaders(),
    body: JSON.stringify({ places }, null, 2),
  }
}
