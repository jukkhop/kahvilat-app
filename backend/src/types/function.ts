type FunctionResult<T> = FunctionSuccessResult<T> | FunctionErrorResult

type FunctionSuccessResult<T> = {
  state: 'success'
  data: T
}

type FunctionErrorResult = {
  state: 'error'
  errors: Error[]
}

export type { FunctionResult, FunctionSuccessResult, FunctionErrorResult }
