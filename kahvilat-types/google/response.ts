export type Response<T> = {
  results: T[]
  next_page_token?: string
}
