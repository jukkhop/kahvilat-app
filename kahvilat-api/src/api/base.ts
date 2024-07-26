import { Logger } from '../logger'
import { Caches, Clients, Config, Context, Results, Utils } from '../types'

export abstract class ApiBase {
  protected caches: Caches
  protected clients: Clients
  protected config: Config
  protected logger: Logger
  protected results: Results
  protected utils: Utils

  constructor(context: Context) {
    this.caches = context.caches
    this.clients = context.clients
    this.config = context.config
    this.logger = context.logger
    this.results = context.results
    this.utils = context.utils
  }
}
