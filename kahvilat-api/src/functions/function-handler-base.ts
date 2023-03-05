import { FunctionResult } from '../types/function'

abstract class FunctionHandlerBase<TParams, TResult> {
  abstract handle(params: TParams): Promise<FunctionResult<TResult>>
}

export default FunctionHandlerBase
