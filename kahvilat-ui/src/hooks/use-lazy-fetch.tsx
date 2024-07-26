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
  fetch: (info?: RequestInfo, init?: RequestInit) => void
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
  reset: () => void
}

export type LazyFetchState<T> = InternalState & (IdleState<T> | LoadingState | ErrorState | SuccessState<T>)

export function useLazyFetch<T>(info?: RequestInfo, init?: RequestInit): LazyFetchState<T> {
  const mounted = useRef(true)
  const controller = useRef(new AbortController())

  const onFetch = useCallback((reinfo?: RequestInfo, reinit?: RequestInit) => {
    const _info = reinfo ?? state._info
    const _init = reinit ?? state._init
    setState({ _info, _init, _status: 'fetch', state: 'loading' })
  }, [])

  const initialState: LazyFetchState<T> = { _info: info, _init: init, _status: 'idle', state: 'idle', fetch: onFetch }
  const [state, setState] = useState<LazyFetchState<T>>(initialState)

  const onReset = useCallback(() => {
    setState((s) => ({ ...s, _status: 'idle', state: 'idle', fetch: onFetch }))
  }, [onFetch, state])

  useEffect(() => {
    const execFetch = async () => {
      setState((s) => ({ ...s, _status: 'loading', state: 'loading' }))

      const { _info, _init } = state

      if (_info === undefined) {
        throw new Error(`Missing request info, cannot attempt to fetch.`)
      }

      try {
        const resp = await fetch(_info, { ..._init, signal: controller.current.signal })
        if (!mounted.current) return

        if (resp.ok) {
          const data = await resp.json()
          if (!mounted.current) return
          setState({ _info, _init, _status: 'done', state: 'success', data, reset: onReset })
        } else {
          setState({ _info, _init, _status: 'done', state: 'error' })
        }
      } catch {
        setState({ _info, _init, _status: 'done', state: 'error' })
      }
    }

    if (state._status === 'fetch' && mounted.current) {
      execFetch()
    }
  }, [onReset, state])

  useEffect(() => {
    return () => {
      controller.current.abort()
      mounted.current = false
    }
  }, [])

  return state
}
