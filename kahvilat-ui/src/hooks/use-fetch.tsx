/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect, useRef, useState } from 'react'

type InternalState = {
  _info?: RequestInfo
  _init?: RequestInit
  _status: 'idle' | 'fetch' | 'loading' | 'done'
}

type IdleState<T> = {
  data?: T
  state: 'idle'
  refetch: (info?: RequestInfo, init?: RequestInit) => void
}

type LoadingState = {
  state: 'loading'
}

type ErrorState = {
  state: 'error'
}

type SuccessState<T> = {
  state: 'success'
  data: T
  refetch: (info?: RequestInfo, init?: RequestInit) => void
  reset: () => void
}

type FetchState<T> = InternalState & (IdleState<T> | LoadingState | ErrorState | SuccessState<T>)

function useFetch<T>(info: RequestInfo, init?: RequestInit): FetchState<T> {
  const mounted = useRef(true)
  const controller = useRef(new AbortController())

  const [state, setState] = useState<FetchState<T>>({ _init: init, _status: 'fetch', state: 'loading' })

  const onReFetch = useCallback(
    (reinfo?: RequestInfo, reinit?: RequestInit) => {
      const _info = reinfo ?? state._info
      const _init = reinit ?? state._init
      setState({ _info, _init, _status: 'fetch', state: 'loading' })
    },
    [state._init],
  )

  const onReset = useCallback(() => {
    setState((s): FetchState<T> => ({ ...s, _status: 'idle', state: 'idle', refetch: onReFetch }))
  }, [onReFetch, state])

  useEffect(() => {
    const execFetch = async () => {
      setState((s): FetchState<T> => ({ ...s, _status: 'loading', state: 'loading' }))

      const { _info, _init } = state

      try {
        const resp = await fetch(_info ?? info, { ..._init })
        if (!mounted.current) return

        if (resp.ok) {
          const data = await resp.json()
          if (!mounted.current) return
          setState({ _init, _status: 'done', state: 'success', data, refetch: onReFetch, reset: onReset })
        } else {
          setState({ _init, _status: 'done', state: 'error' })
        }
      } catch {
        setState({ _init, _status: 'done', state: 'error' })
      }
    }

    if (state._status === 'fetch' && mounted.current) {
      execFetch()
    }
  }, [onReFetch, state])

  useEffect(() => {
    return () => {
      controller.current.abort()
      mounted.current = false
    }
  }, [])

  return state
}

export { useFetch }
export type { FetchState }
