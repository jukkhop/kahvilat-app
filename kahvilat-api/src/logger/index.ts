/* eslint-disable no-console */

import { Config } from '../types/config'

export class Logger {
  private debugEnabled: boolean

  constructor(config: Config) {
    this.debugEnabled = ['local', 'dev'].includes(config.cicd.stage)
  }

  debug(message: string): void {
    if (this.debugEnabled) console.debug(message)
  }

  info(message: string): void {
    console.info(message)
  }

  warn(message: string): void {
    console.warn(message)
  }

  error(message: string): void {
    console.error(message)
  }
}
