import { Config } from '../types/config'
import { Utils } from '../types/context'
import { Result } from '../types/result'
import { failure, success } from '../utils/result'
import { ClientError } from './error'

export abstract class ClientBase {
  private config: Config
  private utils: Utils

  constructor(config: Config, utils: Utils) {
    this.config = config
    this.utils = utils
  }

  protected async request<T>(url: URL): Promise<Result<T, ClientError>> {
    try {
      const response = await this.utils.fetch(url.href)

      return response.ok
        ? success(await response.json())
        : failure(new ClientError(response.statusText, response.status))
    } catch (error: any) {
      return failure(new ClientError(error.message))
    }
  }
}
