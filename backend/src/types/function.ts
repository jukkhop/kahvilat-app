type FunctionResult<T> = FunctionSuccessResult<T> | FunctionErrorResult

type FunctionSuccessResult<T> = {
  type: 'success'
  data: T
}

type FunctionErrorResult = {
  type: 'error'
  errors: Error[]
}

export type { FunctionErrorResult, FunctionResult, FunctionSuccessResult }
