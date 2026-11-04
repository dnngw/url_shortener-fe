import { useCallback, useEffect, useRef } from 'react'

/*
* Debounced callback
*
* The callback only runs after it stops being called for "delay" ms
* (ex: search request is sent after the user stops typing).
*
* Return [debounced, cancel]
* */
export function useDebouncedCallback(callback, delay = 300) {
  const timerRef = useRef(null)
  const callbackRef = useRef(callback)

  // Always call the latest callback, without restarting the timer
  useEffect(() => {
    callbackRef.current = callback
  })

  // Clear pending call when the component unmounts
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const debounced = useCallback((...args) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => callbackRef.current(...args), delay)
  }, [delay])

  const cancel = useCallback(() => clearTimeout(timerRef.current), [])

  return [debounced, cancel]
}
