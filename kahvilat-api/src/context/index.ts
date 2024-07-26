import fetch from 'node-fetch'

import { GoogleClient } from '../clients'
import { GoogleCache } from '../caches'
import { Logger } from '../logger'
import { Config } from '../types/config'
import { Caches, Clients, Context, Utils } from '../types/context'
import { initResults } from '../utils'

export const initContext = (config: Config, logger: Logger): Context => {
  const utils: Utils = {
    date: () => new Date(),
    fetch,
  }

  const caches: Caches = {
    googleCache: new GoogleCache(config),
  }

  const clients: Clients = {
    googleClient: new GoogleClient(config, utils),
  }

  const results = initResults(config)

  const context: Context = {
    caches,
    clients,
    config,
    logger,
    results,
    utils,
  }

  return context
}
