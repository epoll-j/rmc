import {useLayoutEffect, useState } from "react"

// function call(ref: ((args: unknown) => unknown | RefObject<HTMLDivElement>), value: unknown) {
//   if (typeof ref === "function") ref(value)
//   else if (ref != null) ref.current = value
// }

export default function useEffectState<T>(fn: () => T, deps: unknown[],) {
  const [state, set] = useState<T>()
  useLayoutEffect(() => {
    const value = fn()
    set(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}
