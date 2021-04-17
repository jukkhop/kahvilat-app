type GoogleResponse<T> = GoogleSuccessResponse<T> | GoogleErrorResponse

type GoogleSuccessResponse<T> = {
  state: 'success'
  cursor?: string
  results: T[]
}

type GoogleErrorResponse = {
  state: 'error'
  status?: number
  error: string
}

export type { GoogleErrorResponse, GoogleResponse, GoogleSuccessResponse }
