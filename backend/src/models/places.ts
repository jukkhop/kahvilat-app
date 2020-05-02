import { Place } from '../types'
import { select } from '../utils/db'

export async function getPlaces(): Promise<Place[]> {
  const sql = 'SELECT id, external_id, name FROM places'
  return select(sql)
}
