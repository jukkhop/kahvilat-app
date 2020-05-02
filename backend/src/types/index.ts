export interface Place {
  id: number
  external_id: string
  name: string
}

export interface Headers {
  'Access-Control-Allow-Origin': string
  'Access-Control-Allow-Credentials': boolean
}

export interface Response {
  statusCode: number
  headers: Headers
  body: string
}
