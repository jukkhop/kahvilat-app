import { ClientError } from '../clients'
import { Result } from '../types/result'

export class CacheError extends Error {
  #type = 'CacheError'

  constructor(message: string) {
    const msg = `Cache operation failed with message: ${message}`

    super(msg)
    this.name = 'CacheError'
  }
}

export type CacheResult<T> = Result<T, CacheError | ClientError>
