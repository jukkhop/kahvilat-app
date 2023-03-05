/* eslint-disable max-classes-per-file */

class ClientError extends Error {
  #type = 'ClientError'

  constructor(message: string, status?: number) {
    const msg = status
      ? `Third-party API call failed with HTTP status ${status} and message: ${message}`
      : `Third-party API call failed failed with message: ${message}`

    super(msg)
    this.name = 'ClientError'
  }
}

class CacheError extends Error {
  #type = 'CacheError'

  constructor(message: string) {
    super(`Cache operation failed with message: ${message}`)
    this.name = 'CacheError'
  }
}

export { ClientError, CacheError }
