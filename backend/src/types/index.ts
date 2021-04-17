/* eslint-disable camelcase */

export interface Place {
  id: number
  external_id: string
  name: string
}

export interface Headers {
  [header: string]: boolean | number | string
}
