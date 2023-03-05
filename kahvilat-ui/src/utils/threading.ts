/* eslint-disable no-promise-executor-return */

function wait(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export { wait }
