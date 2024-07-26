/* eslint-disable no-promise-executor-return */

export function wait(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
