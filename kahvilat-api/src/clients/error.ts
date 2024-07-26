import { Result } from '../types/result'

export class ClientError extends Error {
  #type = 'ClientError'

  constructor(message: string, status?: number) {
    const msg = status
      ? `Client operation failed with HTTP status ${status} and message: ${message}`
      : `Client operation failed with message: ${message}`

    super(msg)
    this.name = 'ClientError'
  }
}

export type ClientResult<T> = Result<T, ClientError>
