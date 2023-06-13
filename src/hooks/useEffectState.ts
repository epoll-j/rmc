import {ForwardedRef, MutableRefObject, useLayoutEffect, useState } from "react"

function call(ref: (MutableRefObject<unknown> | ForwardedRef<unknown> | ((args: unknown) => unknown)), value: unknown) {
  if (typeof ref === "function") ref(value)
  else if (ref != null) ref.current = value
}

export default function useEffectState<T>(fn: () => T, deps: unknown[], cb: (MutableRefObject<unknown> | ForwardedRef<unknown> | ((args: unknown) => unknown))) {
  const [state, set] = useState<T>()
  useLayoutEffect(() => {
    const value = fn()
    set(value)
    call(cb, value)
    return () => call(cb, value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}
